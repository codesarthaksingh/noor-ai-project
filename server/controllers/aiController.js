import axios from 'axios';
import Image from '../models/Image.js';

export const generateImage = async (req, res) => {
  const { prompt, style, size } = req.body;
  const userId = req.headers['x-user-id'];

  if (!prompt) {
    return res.status(400).json({ error: "Please provide a prompt." });
  }
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();

  if (!accountId || !apiToken) {
    return res.status(500).json({ error: "Server configuration missing (Cloudflare API keys)." });
  }

  try {
    // 1. THE GUARDRAIL: Llama 3 8B Instruct
    const guardrailPrompt = `
You are a classification assistant. The user wants to use an AI image generator. 
Determine if the following user input is asking for an image/art to be generated.
If they are asking a conversational question, coding help, or general knowledge, respond with exactly "INVALID".
If they are describing a scene, an image, artwork, or anything visual to be generated, respond with exactly "VALID".

User Input: "${prompt}"
Classification:`;

    const guardrailResponse = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
      { messages: [{ role: "user", content: guardrailPrompt }] },
      { headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' } }
    );

    const classification = guardrailResponse.data.result.response.trim();

    if (classification.includes("INVALID") || !classification.includes("VALID")) {
      return res.status(400).json({ 
        error: "I am Noor AI, a cinematic visual studio. That is not my niche. Please ask me to generate an image." 
      });
    }

    // 2. THE IMAGE GENERATOR: Stable Diffusion XL Lightning
    // Map size selections to proper dimensions
    const sizeMap = {
      'Square': { width: 768, height: 768 },
      'Landscape': { width: 1024, height: 576 },
      'Portrait': { width: 576, height: 1024 }
    };
    const dimensions = sizeMap[size] || { width: 768, height: 768 };
    
    const enhancedPrompt = `${style ? style + ' style, ' : ''}highly detailed, 8k resolution, cinematic lighting, ${prompt}`;

    const imageResponse = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
      { prompt: enhancedPrompt, num_steps: 4, width: dimensions.width, height: dimensions.height },
      {
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        responseType: 'arraybuffer' // Get binary data
      }
    );

    // Convert binary data to base64
    const base64Image = Buffer.from(imageResponse.data).toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64Image}`;

    // Save to MongoDB
    const newImage = new Image({
      userId,
      prompt,
      style,
      size,
      imageBase64: dataURI
    });
    const savedImage = await newImage.save();

    res.json(savedImage);

  } catch (error) {
    console.error("AI Generation Error:", error.response?.data || error.message);
    res.status(500).json({ error: "An error occurred while generating your image. Please try again later." });
  }
};
