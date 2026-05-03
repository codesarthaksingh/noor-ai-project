import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center group shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-transparent text-textMain/80 group-hover:text-accent text-sm font-semibold outline-none cursor-pointer py-2 px-2 hover:text-accent transition-colors"
      >
        {value}
        <ChevronDown 
          size={14} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="fixed bg-surface border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50 backdrop-blur-sm w-48" style={{
          top: dropdownRef.current?.getBoundingClientRect().bottom + 8,
          left: dropdownRef.current?.getBoundingClientRect().left,
        }}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all ${
                value === option
                  ? 'bg-accent text-black'
                  : 'text-textMain hover:bg-white/10 hover:text-accent'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
