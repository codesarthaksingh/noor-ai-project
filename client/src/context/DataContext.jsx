import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetchChats();
    fetchGallery();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/chats');
      setChats(res.data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/gallery');
      setGallery(res.data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const removeImageFromGallery = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/gallery/${id}`);
      setGallery(gallery.filter(img => img._id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const createNewChat = async (title) => {
    try {
      const res = await axios.post('http://localhost:3000/api/chats', { title, messages: [] });
      setChats([res.data, ...chats]);
      return res.data;
    } catch (err) {
      console.error('Error creating chat:', err);
      return null;
    }
  };

  return (
    <DataContext.Provider value={{ 
      chats, setChats, fetchChats, createNewChat,
      gallery, fetchGallery, setGallery, removeImageFromGallery 
    }}>
      {children}
    </DataContext.Provider>
  );
};
