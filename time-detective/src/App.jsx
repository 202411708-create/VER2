import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Welcome from './components/Welcome';
import Timeline from './components/Timeline';
import TimelineResult from './components/TimelineResult';
import ThiefGame from './components/ThiefGame';
import ThiefGameResult from './components/ThiefGameResult';
import Result from './components/Result';
import ProgressBar from './components/ProgressBar';
import {
  loadSessionData,
  saveSessionData,
  loadTimelineData,
  loadThiefGameData,
  clearAllData
} from './utils/storage';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [timelineData, setTimelineData] = useState(null);
  const [thiefGameData, setThiefGameData] = useState(null);

  // 세션 데이터 로드
  useEffect(() => {
    const sessionData = loadSessionData();
    if (sessionData && sessionData.currentStep) {
      setCurrentStep(sessionData.currentStep);
      // 저장된 데이터 로드
      if (sessionData.currentStep > 1) {
        const timeline = loadTimelineData();
        if (timeline.length > 0) {
          setTimelineData({ activities: timeline });
        }
      }
      if (sessionData.currentStep > 3) {
        const thiefGame = loadThiefGameData();
        setThiefGameData({ categories: thiefGame });
      }
    }
  }, []);

  // 세션 저장
  useEffect(() => {
    saveSessionData({ currentStep });
  }, [currentStep]);

  // Welcome -> Timeline
  const handleStart = () => {
    setCurrentStep(1);
  };

  // Timeline -> TimelineResult
  const handleTimelineComplete = (activities, stats) => {
    setTimelineData({ activities, stats });
    setCurrentStep(2);
  };

  // TimelineResult -> ThiefGame
  const handleTimelineResultNext = () => {
    setCurrentStep(3);
  };

  // ThiefGame -> ThiefGameResult
  const handleThiefGameComplete = (categories, results) => {
    setThiefGameData({ categories, results });
    setCurrentStep(4);
  };

  // ThiefGameResult -> Result
  const handleThiefGameResultNext = () => {
    setCurrentStep(5);
  };

  // 처음부터 다시 시작
  const handleRestart = () => {
    if (window.confirm('모든 데이터가 삭제됩니다. 정말 처음부터 다시 시작하시겠어요?')) {
      clearAllData();
      setCurrentStep(0);
      setTimelineData(null);
      setThiefGameData(null);
    }
  };

  // 페이지 전환 애니메이션
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  // 프로그레스 바 단계 매핑
  const getProgressStep = () => {
    if (currentStep === 0) return 0;
    if (currentStep <= 2) return 1;
    if (currentStep <= 4) return 2;
    return 3;
  };

  return (
    <div className="min-h-screen bg-muji-beige">
      {/* 헤더 */}
      <header className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-muji-charcoal flex items-center gap-2"
          >
            <span>🕵️</span>
            <span>시간탐정</span>
          </motion.h1>

          {currentStep > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleRestart}
              className="text-sm text-muji-charcoal opacity-60 hover:opacity-100 transition"
            >
              처음부터 다시
            </motion.button>
          )}
        </div>
      </header>

      {/* 프로그레스 바 (Welcome 제외) */}
      {currentStep > 0 && currentStep < 5 && (
        <div className="max-w-6xl mx-auto px-4">
          <ProgressBar currentStep={getProgressStep()} totalSteps={4} />
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main>
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Welcome onStart={handleStart} />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="timeline"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Timeline
                onComplete={handleTimelineComplete}
                initialData={timelineData?.activities || []}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="timeline-result"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TimelineResult
                activities={timelineData?.activities}
                stats={timelineData?.stats}
                onNext={handleTimelineResultNext}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="thiefgame"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ThiefGame
                onComplete={handleThiefGameComplete}
                initialData={thiefGameData?.categories}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="thiefgame-result"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ThiefGameResult
                categories={thiefGameData?.categories}
                results={thiefGameData?.results}
                onNext={handleThiefGameResultNext}
              />
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="result"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Result
                timelineData={timelineData}
                thiefGameData={thiefGameData}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 푸터 */}
      <footer className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-sm text-muji-charcoal opacity-40">
          ADHD 시간관리 프로그램 1회기 - 시간탐정
        </p>
      </footer>
    </div>
  );
}

export default App;
