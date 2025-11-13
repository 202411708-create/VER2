import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ACTIVITY_TYPES, formatTime } from '../utils/activities';
import { saveTimelineData } from '../utils/storage';

const Timeline = ({ onComplete, initialData = [] }) => {
  const [activities, setActivities] = useState(initialData);
  const [selectedType, setSelectedType] = useState(null);
  const [showResults, setShowResults] = useState(false);

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

  const stats = calculateStats();
  const totalHours = stats.reduce((sum, s) => sum + s.value, 0);

  // 비교 메시지 생성
  const generateComparison = () => {
    if (stats.length < 2) return null;

    const sorted = [...stats].sort((a, b) => b.value - a.value);
    const top1 = sorted[0];
    const top2 = sorted[1];

    if (top1 && top2) {
      const ratio = (top1.value / top2.value).toFixed(1);
      return `${top1.emoji} ${top1.name} ${formatTime(Math.floor(top1.value), Math.round((top1.value % 1) * 60))}, ${top2.emoji} ${top2.name} ${formatTime(Math.floor(top2.value), Math.round((top2.value % 1) * 60))}... ${top1.name}이 ${top2.name}보다 ${ratio}배 많았어요!`;
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-heading-lg font-bold text-muji-charcoal mb-2">
          ⏰ 어제는 어떻게 보냈을까?
        </h2>
        <p className="text-body text-muji-charcoal opacity-80">
          어제 하루 동안 한 활동을 시간대에 맞춰 기록해보세요
        </p>
      </motion.div>

      {/* 활동 선택 버튼 */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
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
      <div className="card mb-8">
        <h3 className="text-heading font-bold mb-4">24시간 타임라인</h3>

        {/* 시간 눈금 */}
        <div className="relative overflow-x-auto pb-4">
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
          <div className="mt-6 space-y-2">
            <h4 className="font-bold text-muji-charcoal mb-3">기록된 활동</h4>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                className="flex items-center gap-3 p-3 bg-muji-beige rounded-lg"
              >
                <span className="text-2xl">{activity.emoji}</span>
                <span className="flex-1 font-medium">{activity.name}</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={activity.duration}
                  onChange={(e) => updateDuration(activity.id, parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 border rounded text-center"
                />
                <span className="text-sm">시간</span>
                <button
                  onClick={() => removeActivity(activity.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  삭제
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 결과 보기 버튼 */}
      {activities.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowResults(!showResults)}
          className="btn-primary w-full mb-6"
        >
          {showResults ? '결과 숨기기' : '결과 보기'}
        </motion.button>
      )}

      {/* 결과 화면 */}
      <AnimatePresence>
        {showResults && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <h3 className="text-heading font-bold mb-6">📊 시간 사용 분석</h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 원형 차트 */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatTime(Math.floor(value), Math.round((value % 1) * 60))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 통계 */}
              <div className="space-y-3">
                <div className="p-4 bg-muji-beige rounded-lg">
                  <h4 className="font-bold mb-2">전체 기록 시간</h4>
                  <p className="text-2xl font-bold text-muji-brown">
                    {formatTime(Math.floor(totalHours), Math.round((totalHours % 1) * 60))}
                  </p>
                </div>

                {stats.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between p-3 bg-muji-beige rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stat.emoji}</span>
                      <span className="font-medium">{stat.name}</span>
                    </div>
                    <span className="font-bold">
                      {formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}
                    </span>
                  </div>
                ))}

                {generateComparison() && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-sm text-muji-charcoal">
                      {generateComparison()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setShowResults(false);
                onComplete(activities, stats);
              }}
              className="btn-primary w-full mt-6"
            >
              다음 단계로 →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
