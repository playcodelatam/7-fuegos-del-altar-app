import React from 'react';
import { BIBLE_BOOKS } from '../constants';

interface SelectorProps {
  book: string;
  chapter: number;
  verse: number;
  onBookChange: (val: string) => void;
  onChapterChange: (val: number) => void;
  onVerseChange: (val: number) => void;
  disabled: boolean;
}

const Selector: React.FC<SelectorProps> = ({
  book,
  chapter,
  verse,
  onBookChange,
  onChapterChange,
  onVerseChange,
  disabled
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Book Selector */}
      <div className="flex flex-col">
        <label className="text-seal-gold text-xs uppercase tracking-widest mb-2 font-semibold">Libro</label>
        <div className="relative">
          <select
            value={book}
            onChange={(e) => onBookChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-seal-accent/30 border border-seal-gold-dim/30 text-seal-text p-3 rounded-none focus:border-seal-gold focus:outline-none appearance-none font-serif cursor-pointer hover:bg-seal-accent/50 transition-colors"
          >
            {BIBLE_BOOKS.map((b) => (
              <option key={b} value={b} className="bg-slate-800">
                {b}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-seal-gold">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chapter Selector */}
      <div className="flex flex-col">
        <label className="text-seal-gold text-xs uppercase tracking-widest mb-2 font-semibold">Capítulo</label>
        <input
          type="number"
          min={1}
          max={150}
          value={chapter}
          onChange={(e) => onChapterChange(parseInt(e.target.value) || 1)}
          disabled={disabled}
          className="w-full bg-seal-accent/30 border border-seal-gold-dim/30 text-seal-text p-3 rounded-none focus:border-seal-gold focus:outline-none font-serif"
        />
      </div>

      {/* Verse Selector */}
      <div className="flex flex-col">
        <label className="text-seal-gold text-xs uppercase tracking-widest mb-2 font-semibold">Versículo</label>
        <input
          type="number"
          min={1}
          max={176}
          value={verse}
          onChange={(e) => onVerseChange(parseInt(e.target.value) || 1)}
          disabled={disabled}
          className="w-full bg-seal-accent/30 border border-seal-gold-dim/30 text-seal-text p-3 rounded-none focus:border-seal-gold focus:outline-none font-serif"
        />
      </div>
    </div>
  );
};

export default Selector;
