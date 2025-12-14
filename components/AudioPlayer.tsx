import React, { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset state when url changes
    setIsPlaying(false);
    setProgress(0);
    if(audioRef.current) {
        audioRef.current.load();
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `devocional_el_sello.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
     if (navigator.share) {
        try {
            // Sharing a blob directly is tricky on some browsers, so we share the text context or just a message
            await navigator.share({
                title: 'El Portador del Sello',
                text: 'Escucha este devocional generado por el Atalaya Digital.',
                // file sharing not supported universally for blobs without file system API
            });
        } catch (err) {
            console.log("Share failed or canceled");
        }
     } else {
         alert("Tu navegador no soporta compartir nativamente.");
     }
  };

  return (
    <div className="mt-8 p-6 border-t border-seal-gold/20 flex flex-col items-center animate-fade-in">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className="w-full bg-seal-accent/30 h-1 mb-6 rounded-full overflow-hidden">
        <div 
            className="bg-seal-gold h-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-8">
        <button 
            onClick={handleDownload}
            className="text-seal-gold/70 hover:text-seal-gold transition-colors p-2"
            title="Descargar Audio"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-seal-gold text-seal-gold hover:bg-seal-gold hover:text-seal-dark transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 ml-1">
                 <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button 
            onClick={handleShare}
            className="text-seal-gold/70 hover:text-seal-gold transition-colors p-2"
            title="Compartir"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.287.696.345 1.084m-.345-1.084a2.25 2.25 0 0 1 5.297-2.662m-5.297 2.662-.266-.968c-.145.474-.298.92-.475 1.342m5.748-1.574a2.25 2.25 0 0 1 2.91 2.87M12.67 8.326c-.34.02-.676.084-1 .184m0-4.043a2.25 2.25 0 0 1 4.71 1.76m-4.71-1.76c-.035.254-.055.513-.055.776" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
