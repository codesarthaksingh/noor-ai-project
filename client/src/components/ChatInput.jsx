import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import CustomSelect from './CustomSelect';

const SIZES = ['Square', 'Landscape', 'Portrait'];
const STYLES = ['Cinematic', 'Realistic', 'Anime', 'Cartoon', '3D Render', 'Oil Painting'];

export default function ChatInput({ onSubmit, isGenerating }) {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('Square');
  const [style, setStyle] = useState('Realistic');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt, style, size);
      setPrompt('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-3">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center bg-surface border border-white/10 rounded-2xl shadow-xl pl-6 pr-2 py-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all gap-2"
      >
        {/* Style Dropdown */}
        <CustomSelect 
          options={STYLES}
          value={style}
          onChange={setStyle}
        />

        <div className="w-px h-5 bg-white/10 shrink-0"></div>

        {/* Size Dropdown */}
        <CustomSelect 
          options={SIZES}
          value={size}
          onChange={setSize}
        />

        <div className="hidden sm:block w-px h-5 bg-white/10 mx-4 shrink-0"></div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          placeholder="Describe the image you want to generate..."
          className="flex-1 bg-transparent py-3 px-2 outline-none text-textMain placeholder:text-textMain/30 min-w-0 ml-2 sm:ml-0"
        />

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="ml-2 p-3 bg-accent text-black rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {isGenerating ? (
            <Sparkles size={20} className="animate-pulse" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
