import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_TYPES, formatTime } from '../utils/activities';
import { saveTimelineData } from '../utils/storage';

const Timeline = ({ onComplete, initialData = [] }) => {
  const [showEstimation, setShowEstimation] = useState(initialData.length === 0);
  const [estimations, setEstimations] = useState({
    sleep: 8,
    study: 3,
    sns: 2,
    game: 1,
  });
  const [activities, setActivities] = useState(initialData);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (activities.length > 0) {
      saveTimelineData(activities);
    }
  }, [activities]);

  const handleEstimationSubmit = () => {
    setShowEstimation(false);
  };

  const handleEstimationChange = (type, value) => {
    setEstimations(prev => ({
      ...prev,
      [type]: Math.max(0, Math.min(24, parseFloat(value) || 0))
    }));
  };

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

  // 시간 추정 화면
  if (showEstimation) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-muji-charcoal mb-2">
              🤔 어제 얼마나 했을까요?
            </h2>
            <p className="text-sm text-muji-charcoal opacity-80">
              어제 각 활동을 얼마나 했는지 예상해보세요. 나중에 실제와 비교해볼 거예요!
            </p>
          </motion.div>

          <div className="card">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* 수면 */}
                <div className="p-4 bg-muji-beige rounded-lg">
                  <label className="block mb-2">
                    <span className="text-2xl mr-2">😴</span>
                    <span className="font-bold text-muji-charcoal">수면</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={estimations.sleep}
                      onChange={(e) => handleEstimationChange('sleep', e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-muji-lightbeige rounded-lg focus:border-muji-brown focus:outline-none"
                    />
                    <span className="text-sm text-muji-charcoal">시간</span>
                  </div>
                </div>

                {/* 공부 */}
                <div className="p-4 bg-muji-beige rounded-lg">
                  <label className="block mb-2">
                    <span className="text-2xl mr-2">📚</span>
                    <span className="font-bold text-muji-charcoal">공부</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={estimations.study}
                      onChange={(e) => handleEstimationChange('study', e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-muji-lightbeige rounded-lg focus:border-muji-brown focus:outline-none"
                    />
                    <span className="text-sm text-muji-charcoal">시간</span>
                  </div>
                </div>

                {/* SNS */}
                <div className="p-4 bg-muji-beige rounded-lg">
                  <label className="block mb-2">
                    <span className="text-2xl mr-2">📱</span>
                    <span className="font-bold text-muji-charcoal">SNS</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={estimations.sns}
                      onChange={(e) => handleEstimationChange('sns', e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-muji-lightbeige rounded-lg focus:border-muji-brown focus:outline-none"
                    />
                    <span className="text-sm text-muji-charcoal">시간</span>
                  </div>
                </div>

                {/* 게임 */}
                <div className="p-4 bg-muji-beige rounded-lg">
                  <label className="block mb-2">
                    <span className="text-2xl mr-2">🎮</span>
                    <span className="font-bold text-muji-charcoal">게임</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={estimations.game}
                      onChange={(e) => handleEstimationChange('game', e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-muji-lightbeige rounded-lg focus:border-muji-brown focus:outline-none"
                    />
                    <span className="text-sm text-muji-charcoal">시간</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
                <p className="text-sm text-blue-600">
                  💡 정확하지 않아도 괜찮아요! 나중에 실제 기록과 비교하면서 시간 감각을 키워봐요.
                </p>
              </div>

              <button
                onClick={handleEstimationSubmit}
                className="btn-primary w-full"
              >
                다음: 타임라인 기록하기 →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto px-4 py-4">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-2xl font-bold text-muji-charcoal mb-1">
          ⏰ 어제는 어떻게 보냈을까?
        </h2>
        <p className="text-sm text-muji-charcoal opacity-80">
          어제 하루 동안 한 활동을 시간대에 맞춰 기록해보세요
        </p>
      </motion.div>

      {/* 활동 선택 버튼 - 컴팩트 */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {Object.values(ACTIVITY_TYPES).map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType(type.id)}
            className={`p-3 rounded-lg font-medium transition-all ${
              selectedType === type.id
                ? 'ring-3 ring-muji-brown shadow-lg'
                : 'bg-white shadow'
            }`}
            style={{
              backgroundColor: selectedType === type.id ? type.color : 'white',
              color: selectedType === type.id ? 'white' : '#4A4A4A',
            }}
          >
            <div className="text-2xl mb-1">{type.emoji}</div>
            <div className="text-xs">{type.name}</div>
          </motion.button>
        ))}
      </div>

      {/* 타임라인 카드 */}
      <div className="card flex-1 overflow-hidden flex flex-col min-h-0">
        <h3 className="text-lg font-bold mb-3">24시간 타임라인</h3>

        <div className="flex-1 flex flex-col min-h-0">
          {/* 타임라인 */}
          <div className="relative overflow-x-auto pb-3 mb-3">
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
              <div className="relative h-20 bg-muji-beige rounded-lg overflow-hidden">
                {Array.from({ length: 25 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-gray-300"
                    style={{ left: `${(i / 24) * 100}%` }}
                  />
                ))}

                <AnimatePresence>
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-1 h-[72px] rounded-lg flex flex-col items-center justify-center cursor-pointer group"
                      style={{
                        left: `${(activity.startHour / 24) * 100}%`,
                        width: `${(activity.duration / 24) * 100}%`,
                        backgroundColor: activity.color,
                      }}
                      onClick={() => removeActivity(activity.id)}
                    >
                      <span className="text-xl">{activity.emoji}</span>
                      <span className="text-xs text-white font-medium mt-1">
                        {activity.name}
                      </span>
                      <span className="text-xs text-white opacity-80">
                        {formatTime(Math.floor(activity.duration), Math.round((activity.duration % 1) * 60))}
                      </span>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ✕
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

              <p className="text-xs text-muji-charcoal opacity-60 mt-2">
                {selectedType ? "타임라인을 클릭하여 활동을 추가하세요" : "활동을 선택한 후 타임라인을 클릭하세요"}
              </p>
            </div>
          </div>

          {/* 활동 목록 - 남은 공간 사용 */}
          {activities.length > 0 && (
            <div className="flex-1 min-h-0 overflow-auto space-y-2">
              <h4 className="font-bold text-sm text-muji-charcoal mb-2 sticky top-0 bg-white z-10 py-1">
                기록된 활동
              </h4>
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  layout
                  className="flex items-center gap-2 p-2 bg-muji-beige rounded-lg"
                >
                  <span className="text-lg">{activity.emoji}</span>
                  <span className="flex-1 font-medium text-sm">{activity.name}</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={activity.duration}
                    onChange={(e) => updateDuration(activity.id, parseFloat(e.target.value))}
                    className="w-14 px-2 py-1 border rounded text-center text-xs"
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
        </div>

        {/* 다음 버튼 */}
        {activities.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className="btn-primary w-full mt-3"
          >
            다음 →
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Timeline;
