import express from 'express';
import { generateImage } from '../controllers/aiController.js';
import { getChats, getChatById, createChat, updateChat } from '../controllers/chatController.js';
import { getGallery, deleteGalleryImage } from '../controllers/galleryController.js';

const router = express.Router();

// AI routes
router.post('/generate', generateImage);

// Chat routes
router.get('/chats', getChats);
router.get('/chats/:id', getChatById);
router.post('/chats', createChat);
router.put('/chats/:id', updateChat);

// Gallery routes
router.get('/gallery', getGallery);
router.delete('/gallery/:id', deleteGalleryImage);

export default router;
