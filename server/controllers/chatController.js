import Chat from '../models/Chat.js';

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 }).select('title updatedAt');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('messages.imageId');
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

export const createChat = async (req, res) => {
  try {
    const { title, messages } = req.body;
    const newChat = new Chat({ title, messages });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { messages } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { messages, updatedAt: Date.now() },
      { new: true }
    ).populate('messages.imageId');
    
    if (!updatedChat) return res.status(404).json({ error: "Chat not found" });
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to update chat" });
  }
};
