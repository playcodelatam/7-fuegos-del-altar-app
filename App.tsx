import React, { useState } from 'react';
import { BIBLE_BOOKS } from './constants';
import Selector from './components/Selector';
import AudioPlayer from './components/AudioPlayer';
import { generateDevotionalText, generateDevotionalAudio } from './services/geminiService';
import { LoadingStage } from './types';

const App = () => {
  const [book, setBook] = useState(BIBLE_BOOKS[0]);
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);
  
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(LoadingStage.IDLE);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setGeneratedText(null);
    setAudioUrl(null);
    
    // Revoke old URL if exists to free memory
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    try {
      setLoadingStage(LoadingStage.GENERATING_TEXT);
      const text = await generateDevotionalText(book, chapter, verse);
      setGeneratedText(text);

      setLoadingStage(LoadingStage.GENERATING_AUDIO);
      const wavBlob = await generateDevotionalAudio(text);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

      setLoadingStage(LoadingStage.COMPLETED);
    } catch (err: any) {
      setError(err.message || "Un error desconocido ha ocurrido.");
      setLoadingStage(LoadingStage.IDLE);
    }
  };

  const isLoading = loadingStage === LoadingStage.GENERATING_TEXT || loadingStage === LoadingStage.GENERATING_AUDIO;

  return (
    <div className="min-h-screen bg-seal-dark text-seal-text flex flex-col items-center py-12 px-4 md:px-0">
      
      {/* Header */}
      <header className="mb-12 text-center space-y-4">
        <div className="inline-block border-b-2 border-seal-gold pb-2 mb-2">
            <span className="text-seal-gold tracking-[0.3em] text-xs uppercase font-bold">Protocolo de 7 Fuegos</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">
          El Portador del <span className="text-seal-gold">Sello</span>
        </h1>
        <p className="text-seal-text/60 italic font-serif max-w-md mx-auto">
          "Escribe la visión, y declárala en tablas, para que corra el que leyere en ella."
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl">
        
        {/* Selection Card */}
        <div className="bg-[#151f32] p-8 border border-seal-gold/10 shadow-2xl relative overflow-hidden group">
          
          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-seal-gold opacity-20 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-seal-gold opacity-20 group-hover:opacity-100 transition-opacity duration-700"></div>

          <Selector 
            book={book}
            chapter={chapter}
            verse={verse}
            onBookChange={setBook}
            onChapterChange={setChapter}
            onVerseChange={setVerse}
            disabled={isLoading}
          />

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`
                relative px-10 py-4 uppercase tracking-widest text-sm font-bold transition-all duration-500
                ${isLoading 
                  ? 'bg-seal-accent/50 text-seal-text/50 cursor-not-allowed' 
                  : 'bg-seal-gold text-seal-dark hover:bg-white hover:text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]'
                }
              `}
            >
              {loadingStage === LoadingStage.IDLE && "Quebrar el Sello"}
              {loadingStage === LoadingStage.GENERATING_TEXT && "Interpretando Escritura..."}
              {loadingStage === LoadingStage.GENERATING_AUDIO && "Uniendo Voz y Espíritu..."}
              {loadingStage === LoadingStage.COMPLETED && "Revelación Completa"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 text-red-200 text-center font-serif italic animate-fade-in">
                {error}
            </div>
        )}

        {/* Result Area */}
        {(generatedText || loadingStage === LoadingStage.GENERATING_AUDIO) && (
            <div className="mt-12 mb-24 animate-fade-in">
                
                {/* Text Card */}
                <div className="relative p-10 bg-[#151f32]/80 backdrop-blur-sm border-x border-seal-gold/20">
                     {/* Top Ornament */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-seal-gold text-2xl">
                        ❖
                    </div>

                    <div className="font-serif text-lg md:text-xl leading-relaxed text-justify text-seal-text/90 drop-shadow-md">
                        {generatedText}
                    </div>

                    <div className="mt-6 text-center text-seal-gold/40 text-xs tracking-widest uppercase">
                        {book} {chapter}:{verse}
                    </div>
                </div>

                {/* Audio Player */}
                {loadingStage === LoadingStage.COMPLETED && audioUrl && (
                    <AudioPlayer audioUrl={audioUrl} />
                )}
                
                {loadingStage === LoadingStage.GENERATING_AUDIO && (
                     <div className="mt-8 flex justify-center text-seal-gold animate-pulse">
                        <span className="text-sm uppercase tracking-widest">Preparando voz...</span>
                     </div>
                )}
            </div>
        )}

      </main>

       <footer className="fixed bottom-0 w-full text-center py-4 text-seal-text/20 text-xs uppercase tracking-wider pointer-events-none">
            Soli Deo Gloria
       </footer>
    </div>
  );
};

export default App;
