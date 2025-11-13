import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_TYPES, formatTime } from '../utils/activities';
import { saveTimelineData } from '../utils/storage';

const Timeline = ({ onComplete, initialData = [] }) => {
  const [activities, setActivities] = useState(initialData);
  const [selectedType, setSelectedType] = useState(null);

  // 자동 저장
  useEffect(() => {
    if (activities.length > 0) {
      saveTimelineData(activities);
    }
  }, [activities]);

  // 활동 추가
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

  // 활동 삭제
  const removeActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  // 활동 시간 수정
  const updateDuration = (id, newDuration) => {
    setActivities(activities.map(a =>
      a.id === id ? { ...a, duration: Math.max(0.5, newDuration) } : a
    ));
  };

  // 통계 계산
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
    <div className="w-full max-w-6xl mx-auto p-6 h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-heading-lg font-bold text-muji-charcoal mb-2">
          ⏰ 어제는 어떻게 보냈을까?
        </h2>
        <p className="text-body text-muji-charcoal opacity-80">
          어제 하루 동안 한 활동을 시간대에 맞춰 기록해보세요
        </p>
      </motion.div>

      {/* 활동 선택 버튼 */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {Object.values(ACTIVITY_TYPES).map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType(type.id)}
            className={`p-4 rounded-lg font-medium transition-all ${
              selectedType === type.id
                ? 'ring-4 ring-muji-brown shadow-lg'
                : 'bg-white shadow-md'
            }`}
            style={{
              backgroundColor: selectedType === type.id ? type.color : 'white',
              color: selectedType === type.id ? 'white' : '#4A4A4A',
            }}
          >
            <div className="text-2xl mb-1">{type.emoji}</div>
            <div className="text-sm">{type.name}</div>
          </motion.button>
        ))}
      </div>

      {/* 타임라인 */}
      <div className="card flex-1 overflow-hidden flex flex-col">
        <h3 className="text-heading font-bold mb-4">24시간 타임라인</h3>

        {/* 시간 눈금 */}
        <div className="relative overflow-x-auto pb-4 flex-1">
          <div className="min-w-[800px]">
            {/* 시간 라벨 */}
            <div className="flex mb-2">
              {Array.from({ length: 25 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-xs text-muji-charcoal">
                  {i}시
                </div>
              ))}
            </div>

            {/* 타임라인 바 */}
            <div className="relative h-24 bg-muji-beige rounded-lg overflow-hidden">
              {/* 시간 구분선 */}
              {Array.from({ length: 25 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-gray-300"
                  style={{ left: `${(i / 24) * 100}%` }}
                />
              ))}

              {/* 활동 블록 */}
              <AnimatePresence>
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-2 h-20 rounded-lg flex flex-col items-center justify-center cursor-pointer group"
                    style={{
                      left: `${(activity.startHour / 24) * 100}%`,
                      width: `${(activity.duration / 24) * 100}%`,
                      backgroundColor: activity.color,
                    }}
                    onClick={() => removeActivity(activity.id)}
                  >
                    <span className="text-2xl">{activity.emoji}</span>
                    <span className="text-xs text-white font-medium mt-1">
                      {activity.name}
                    </span>
                    <span className="text-xs text-white opacity-80">
                      {formatTime(Math.floor(activity.duration), Math.round((activity.duration % 1) * 60))}
                    </span>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ✕
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 클릭 영역 */}
              {selectedType && (
                <div className="absolute inset-0 cursor-crosshair" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const hour = Math.floor((x / rect.width) * 24);
                  addActivity(selectedType, hour);
                }} />
              )}
            </div>

            <p className="text-sm text-muji-charcoal opacity-60 mt-2">
              {selectedType
                ? "타임라인을 클릭하여 활동을 추가하세요"
                : "활동을 선택한 후 타임라인을 클릭하세요"}
            </p>
          </div>
        </div>

        {/* 활동 목록 */}
        {activities.length > 0 && (
          <div className="mt-4 space-y-2 max-h-32 overflow-auto">
            <h4 className="font-bold text-muji-charcoal mb-2">기록된 활동</h4>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                className="flex items-center gap-3 p-2 bg-muji-beige rounded-lg"
              >
                <span className="text-xl">{activity.emoji}</span>
                <span className="flex-1 font-medium text-sm">{activity.name}</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={activity.duration}
                  onChange={(e) => updateDuration(activity.id, parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center text-sm"
                />
                <span className="text-xs">시간</span>
                <button
                  onClick={() => removeActivity(activity.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                >
                  삭제
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* 다음 버튼 */}
        {activities.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className="btn-primary w-full mt-4"
          >
            다음 →
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Timeline;
