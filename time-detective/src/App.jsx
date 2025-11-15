import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Welcome from './components/Welcome';
import Timeline from './components/Timeline';
import TimelineResult from './components/TimelineResult';
import ThiefGame from './components/ThiefGame';
import ThiefGameResult from './components/ThiefGameResult';
import WastedTimeSelection from './components/WastedTimeSelection';
import TimeAwareness from './components/TimeAwareness';
import Result from './components/Result';
import ProgressBar from './components/ProgressBar';
import FullscreenToggle from './components/FullscreenToggle';
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
  const [suspiciousData, setSuspiciousData] = useState([]);
  const [thiefGameData, setThiefGameData] = useState(null);
  const [wastedTimes, setWastedTimes] = useState(null);
  const [wastedDaily, setWastedDaily] = useState(0);
  const [savedStep, setSavedStep] = useState(0);

  // 세션 데이터 로드
  useEffect(() => {
    const sessionData = loadSessionData();
    if (sessionData && sessionData.currentStep) {
      setSavedStep(sessionData.currentStep);
      // Don't auto-load to step, let user choose to continue
      if (sessionData.currentStep > 1) {
        const timeline = loadTimelineData();
        if (timeline.length > 0) {
          setTimelineData({ activities: timeline });
        }
      }
      if (sessionData.currentStep > 2) {
        const thiefGame = loadThiefGameData();
        setThiefGameData({ categories: thiefGame });
      }
    }
  }, []);

  // 세션 저장
  useEffect(() => {
    saveSessionData({ currentStep });
  }, [currentStep]);

  const handleStart = () => {
    clearAllData();
    setTimelineData(null);
    setSuspiciousData([]);
    setThiefGameData(null);
    setWastedTimes(null);
    setWastedDaily(0);
    setCurrentStep(1);
  };

  const handleContinue = () => {
    if (savedStep > 0) {
      setCurrentStep(savedStep);
    } else {
      setCurrentStep(1);
    }
  };

  const handleTimelineComplete = (activities, stats, suspicious) => {
    setTimelineData({ activities, stats });
    setSuspiciousData(suspicious || []);
    setCurrentStep(2); // ThiefGame으로 바로 이동
  };

  const handleThiefGameComplete = (categories, results) => {
    setThiefGameData({ categories, results });
    setCurrentStep(3); // ThiefGameResult로 이동
  };

  const handleThiefGameResultNext = () => setCurrentStep(4); // TimelineResult로 이동

  const handleTimelineResultNext = () => setCurrentStep(5); // WastedTimeSelection으로 이동

  const handleWastedTimeComplete = (wastedTimesData, totalWasted) => {
    setWastedTimes(wastedTimesData);
    setWastedDaily(totalWasted);
    setCurrentStep(6);
  };

  const handleTimeAwarenessNext = () => setCurrentStep(7);

  const handleRestart = () => {
    if (window.confirm('모든 데이터가 삭제됩니다. 정말 처음부터 다시 시작하시겠어요?')) {
      clearAllData();
      setCurrentStep(0);
      setTimelineData(null);
      setThiefGameData(null);
      setWastedTimes(null);
      setWastedDaily(0);
    }
  };

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

  const getProgressStep = () => {
    if (currentStep === 0) return 0;
    if (currentStep === 1) return 1; // Timeline
    if (currentStep <= 3) return 2; // ThiefGame + 결과
    if (currentStep <= 5) return 3; // TimelineResult + 낭비 선택
    if (currentStep <= 7) return 4; // TimeAwareness + Result
    return 4;
  };

  return (
    <div className="min-h-screen bg-muji-bg flex flex-col">
      {/* 컴팩트 헤더 */}
      <header className="flex-shrink-0 bg-muji-bg border-b border-muji-beige">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-light text-muji-dark flex items-center gap-2"
            >
              <span>시간탐정</span>
            </motion.h1>

            <div className="flex items-center gap-3">
              <FullscreenToggle />
              {currentStep > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleRestart}
                  className="text-sm text-muji-mid font-light opacity-60 hover:opacity-100 transition px-3 py-2"
                >
                  처음부터 다시
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 컴팩트 프로그레스 바 */}
      {currentStep > 0 && currentStep < 7 && (
        <div className="flex-shrink-0 bg-muji-bg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <ProgressBar currentStep={getProgressStep()} totalSteps={5} />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 - 남은 공간 모두 사용 */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <Welcome
                onStart={handleStart}
                onContinue={handleContinue}
                hasSavedProgress={savedStep > 0}
                savedStep={savedStep}
              />
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
              className="h-full"
            >
              <Timeline
                onComplete={handleTimelineComplete}
                initialData={timelineData?.activities || []}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="thiefgame"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <ThiefGame
                onComplete={handleThiefGameComplete}
                initialData={thiefGameData?.categories}
                suspiciousActivities={suspiciousData}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="thiefgame-result"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <ThiefGameResult
                categories={thiefGameData?.categories}
                results={thiefGameData?.results}
                onNext={handleThiefGameResultNext}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="timeline-result"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <TimelineResult
                activities={timelineData?.activities}
                stats={timelineData?.stats}
                onNext={handleTimelineResultNext}
              />
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="wasted-time-selection"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <WastedTimeSelection
                stats={timelineData?.stats}
                onComplete={handleWastedTimeComplete}
              />
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div
              key="timeawareness"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <TimeAwareness
                wastedDaily={wastedDaily}
                onNext={handleTimeAwarenessNext}
              />
            </motion.div>
          )}

          {currentStep === 7 && (
            <motion.div
              key="result"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
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

      {/* 컴팩트 푸터 */}
      <footer className="flex-shrink-0 bg-muji-bg border-t border-muji-beige">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-xs font-light text-muji-light text-center">
            ADHD 시간관리 프로그램 1회기
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
