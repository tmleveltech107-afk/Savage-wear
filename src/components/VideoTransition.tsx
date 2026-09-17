import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface VideoTransitionProps {
  visitorName: string;
  onComplete: () => void;
}

export const VideoTransition: React.FC<VideoTransitionProps> = ({ visitorName, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showGreeting, setShowGreeting] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);

  useEffect(() => {
    // Subtle greeting stays for 2.6 seconds, then gently fades out
    const greetingTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 2600);

    return () => clearTimeout(greetingTimer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setHasStarted(true);
    };

    const handleEnded = () => {
      // Transition smoothly into ecommerce website
      onComplete();
    };

    const handleError = () => {
      console.warn('Video failed to play directly, fallback sequence active');
      setPlaybackFailed(true);
      // Auto fallback transition after 8 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 7000);
      return () => clearTimeout(timer);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setHasStarted(true))
        .catch(() => {
          // In some browsers autoplay requires muted state
          video.muted = true;
          video.play().catch(() => setPlaybackFailed(true));
        });
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onComplete]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div
      id="store-video-experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#171717] overflow-hidden flex items-center justify-center"
    >
      {/* Cinematic Full-Screen Video Player */}
      <video
        ref={videoRef}
        src="./assets/savage_store_tour.mp4"
        playsInline
        autoPlay
        muted={isMuted}
        className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000"
      />

      {/* Fallback architectural visualizer if video decoding is delayed */}
      {playbackFailed && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('./assets/savage_store_tour.mp4')`,
            backgroundColor: '#171717',
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </div>
      )}

      {/* Subtle Cinematic Vignette / Letterbox atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Extremely Subtle Greeting Overlay (as requested: "WELCOME, [NAME]") */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6"
          >
            <div className="text-center">
              <span className="text-[11px] sm:text-xs font-light tracking-[0.4em] uppercase text-[#F7F5F0]/90">
                WELCOME, {visitorName.toUpperCase()}
              </span>
              <div className="w-8 h-[1px] bg-[#F7F5F0]/30 mx-auto mt-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Understated Controls: Sound Toggle & Enter Store Skip */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-4 sm:inset-x-12 flex items-center justify-between z-30 pointer-events-auto">
        {/* Subtle Sound Toggle */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="flex items-center gap-2 text-[10px] tracking-[0.24em] uppercase text-[#F7F5F0]/70 hover:text-[#F7F5F0] transition-colors py-2 px-1"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">SOUND OFF</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">SOUND ON</span>
            </>
          )}
        </button>

        {/* Enter Store / Skip Button */}
        <button
          onClick={onComplete}
          type="button"
          className="group flex items-center gap-2.5 text-[11px] tracking-[0.28em] uppercase text-[#F7F5F0]/80 hover:text-[#F7F5F0] transition-all duration-300 py-2 px-3 border border-white/20 hover:border-white/60 bg-black/20 backdrop-blur-sm"
        >
          <span>ENTER STORE</span>
          <ArrowRight className="w-3 h-3 stroke-[1.5] group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
};
