import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('전체화면 전환 오류:', err);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={toggleFullscreen}
      className="flex items-center gap-2 px-4 py-2 bg-muji-brown text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
      title={isFullscreen ? '전체화면 나가기 (ESC)' : '전체화면 (F11)'}
    >
      <span className="text-lg">
        {isFullscreen ? '⊡' : '⛶'}
      </span>
      <span className="hidden md:inline">
        {isFullscreen ? '전체화면 나가기' : '전체화면'}
      </span>
    </motion.button>
  );
};

export default FullscreenToggle;
