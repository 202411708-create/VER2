import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_TYPES, formatTime } from '../utils/activities';
import { saveTimelineData } from '../utils/storage';
import { Button, MujiIcon } from './ui';

const Timeline = ({ onComplete, initialData = [] }) => {
  const [activities, setActivities] = useState(initialData);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (activities.length > 0) {
      saveTimelineData(activities);
    }
  }, [activities]);

  const addActivity = (type, startHour, duration = 1) => {
    const newActivity = {
      id: Date.now(),
      type,
      startHour,
      duration,
      ...ACTIVITY_TYPES[type.toUpperCase()],
    };
    setActivities([...activities, newActivity]);
  };

  const removeActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const updateDuration = (id, newDuration) => {
    setActivities(activities.map(a =>
      a.id === id ? { ...a, duration: Math.max(0.5, newDuration) } : a
    ));
  };

  const calculateStats = () => {
    const stats = {};
    activities.forEach(activity => {
      const type = activity.type;
      if (!stats[type]) {
        stats[type] = {
          name: activity.name,
          value: 0,
          color: activity.color,
          emoji: activity.emoji,
        };
      }
      stats[type].value += activity.duration;
    });
    return Object.values(stats);
  };

  const handleNext = () => {
    const stats = calculateStats();
    onComplete(activities, stats);
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto px-6 py-6 bg-muji-bg">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-normal text-muji-dark mb-2">
          어제는 어떻게 보냈을까?
        </h2>
        <p className="text-body-sm font-light text-muji-light">
          어제 하루 동안 한 활동을 시간대에 맞춰 기록해보세요
        </p>
      </motion.div>

      {/* 활동 선택 버튼 */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {Object.values(ACTIVITY_TYPES).map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType(type.id)}
            className={`p-3 font-light transition-all border-1 ${
              selectedType === type.id
                ? 'border-muji-mid'
                : 'border-muji-beige'
            }`}
            style={{
              backgroundColor: selectedType === type.id ? type.color : 'white',
              color: selectedType === type.id ? 'white' : '#4A4A4A',
            }}
          >
            <div className="text-xs">{type.name}</div>
          </motion.button>
        ))}
      </div>

      {/* 타임라인 카드 */}
      <div className="bg-white border-1 border-muji-beige p-6 flex-1 overflow-hidden flex flex-col min-h-0">
        <h3 className="text-body font-normal text-muji-dark mb-4">24시간 타임라인</h3>

        <div className="flex-1 flex flex-col min-h-0">
          {/* 타임라인 */}
          <div className="relative overflow-x-auto pb-3 mb-4">
            <div className="min-w-[800px]">
              {/* 시간 라벨 */}
              <div className="flex mb-3">
                {Array.from({ length: 25 }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-xs font-light text-muji-light">
                    {i}시
                  </div>
                ))}
              </div>

              {/* 타임라인 바 */}
              <div className="relative h-20 bg-muji-beige overflow-hidden">
                {Array.from({ length: 25 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-muji-light opacity-30"
                    style={{ left: `${(i / 24) * 100}%` }}
                  />
                ))}

                <AnimatePresence>
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-1 h-[72px] flex flex-col items-center justify-center cursor-pointer group"
                      style={{
                        left: `${(activity.startHour / 24) * 100}%`,
                        width: `${(activity.duration / 24) * 100}%`,
                        backgroundColor: activity.color,
                      }}
                      onClick={() => removeActivity(activity.id)}
                    >
                      <span className="text-xs text-white font-light">
                        {activity.name}
                      </span>
                      <span className="text-xs text-white opacity-80 font-light">
                        {formatTime(Math.floor(activity.duration), Math.round((activity.duration % 1) * 60))}
                      </span>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                        <MujiIcon name="close" size={16} strokeWidth={2} className="text-white" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {selectedType && (
                  <div className="absolute inset-0 cursor-crosshair" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const hour = Math.floor((x / rect.width) * 24);
                    addActivity(selectedType, hour);
                  }} />
                )}
              </div>

              <p className="text-xs font-light text-muji-light mt-3">
                {selectedType ? "타임라인을 클릭하여 활동을 추가하세요" : "활동을 선택한 후 타임라인을 클릭하세요"}
              </p>
            </div>
          </div>

          {/* 활동 목록 */}
          {activities.length > 0 && (
            <div className="flex-1 min-h-0 overflow-auto space-y-2">
              <h4 className="font-normal text-body-sm text-muji-dark mb-3 sticky top-0 bg-white z-10 py-1">
                기록된 활동
              </h4>
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  layout
                  className="flex items-center gap-3 p-3 bg-muji-bg border-1 border-muji-beige"
                >
                  <span className="flex-1 font-light text-body-sm text-muji-dark">{activity.name}</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={activity.duration}
                    onChange={(e) => updateDuration(activity.id, parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 border-1 border-muji-light bg-white font-light text-muji-dark text-center text-xs focus:border-muji-mid focus:outline-none transition-colors"
                  />
                  <span className="text-xs font-light text-muji-mid">시간</span>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="px-3 py-1 bg-transparent border-1 border-muji-light text-muji-mid hover:bg-muji-bg transition-colors text-xs font-light"
                  >
                    삭제
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 다음 버튼 */}
        {activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <Button onClick={handleNext} variant="filled" size="lg" fullWidth>
              <span className="flex items-center justify-center gap-2">
                <span>다음</span>
                <MujiIcon name="arrow" size={18} strokeWidth={2} />
              </span>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
