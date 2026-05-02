import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  style: { type: String, default: '' },
  size: { type: String, default: '' },
  imageBase64: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);
