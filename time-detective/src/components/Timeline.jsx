import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_TYPES, formatTime } from '../utils/activities';
import { saveTimelineData } from '../utils/storage';
import { Button, MujiIcon } from './ui';

const Timeline = ({ onComplete, initialData = [] }) => {
  const [activities, setActivities] = useState(initialData);
  const [selectedType, setSelectedType] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (activities.length > 0) {
      saveTimelineData(activities);
    }
  }, [activities]);

  // 시간을 24시간 범위로 정규화 (wrap-around)
  const normalizeHour = (hour) => {
    while (hour < 0) hour += 24;
    while (hour >= 24) hour -= 24;
    return hour;
  };

  // 두 시간 사이의 duration 계산 (wrap-around 고려)
  const calculateDuration = (start, end) => {
    start = normalizeHour(start);
    end = normalizeHour(end);

    if (end >= start) {
      return end - start;
    } else {
      // wrap-around case: 예) 22시 → 2시 = 4시간
      return (24 - start) + end;
    }
  };

  // 픽셀 위치를 시간으로 변환
  const pixelToHour = (clientX, rect) => {
    const x = clientX - rect.left;
    const hourFloat = (x / rect.width) * 24;
    return Math.max(0, Math.min(24, hourFloat));
  };

  // 시간을 0.5시간 단위로 스냅
  const snapToHalfHour = (hour) => {
    return Math.round(hour * 2) / 2;
  };

  const addActivity = (type, startHour, duration = 1) => {
    const newActivity = {
      id: Date.now(),
      type,
      startHour: normalizeHour(startHour),
      duration: Math.max(0.5, duration),
      ...ACTIVITY_TYPES[type.toUpperCase()],
    };
    setActivities([...activities, newActivity]);
  };

  const removeActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const updateDuration = (id, newDuration) => {
    setActivities(activities.map(a =>
      a.id === id ? { ...a, duration: Math.max(0.5, Math.min(24, newDuration)) } : a
    ));
  };

  const updateStartHour = (id, newStartHour) => {
    setActivities(activities.map(a =>
      a.id === id ? { ...a, startHour: normalizeHour(newStartHour) } : a
    ));
  };

  const updateStartEndTime = (id, newStartHour, newEndHour) => {
    const start = normalizeHour(newStartHour);
    const end = normalizeHour(newEndHour);
    const duration = calculateDuration(start, end);

    if (duration > 0) {
      setActivities(activities.map(a =>
        a.id === id ? { ...a, startHour: start, duration } : a
      ));
    }
  };

  // 드래그 시작
  const handleDragStart = (e) => {
    if (!selectedType || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const startHour = snapToHalfHour(pixelToHour(e.clientX, rect));

    setIsDragging(true);
    setDraggedActivity({
      startHour,
      currentHour: startHour,
      type: selectedType,
    });
  };

  // 드래그 중
  const handleDragMove = (e) => {
    if (!isDragging || !draggedActivity || !timelineRef.current) return;

    e.preventDefault();
    const rect = timelineRef.current.getBoundingClientRect();
    const currentHour = snapToHalfHour(pixelToHour(e.clientX, rect));

    setDraggedActivity({
      ...draggedActivity,
      currentHour,
    });
  };

  // 드래그 종료
  const handleDragEnd = (e) => {
    if (!isDragging || !draggedActivity) return;

    const start = draggedActivity.startHour;
    const end = draggedActivity.currentHour;
    const duration = calculateDuration(start, end);

    if (duration >= 0.5) {
      addActivity(draggedActivity.type, start, duration);
    }

    setIsDragging(false);
    setDraggedActivity(null);
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    if (!selectedType || !timelineRef.current) return;

    const touch = e.touches[0];
    const rect = timelineRef.current.getBoundingClientRect();
    const startHour = snapToHalfHour(pixelToHour(touch.clientX, rect));

    setIsDragging(true);
    setDraggedActivity({
      startHour,
      currentHour: startHour,
      type: selectedType,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !draggedActivity || !timelineRef.current) return;

    e.preventDefault();
    const touch = e.touches[0];
    const rect = timelineRef.current.getBoundingClientRect();
    const currentHour = snapToHalfHour(pixelToHour(touch.clientX, rect));

    setDraggedActivity({
      ...draggedActivity,
      currentHour,
    });
  };

  const handleTouchEnd = (e) => {
    handleDragEnd(e);
  };

  // 드래그 중인 활동의 시각적 표현 계산
  const getDragVisual = () => {
    if (!draggedActivity) return null;

    const start = draggedActivity.startHour;
    const end = draggedActivity.currentHour;
    const duration = calculateDuration(start, end);

    // wrap-around 케이스: 두 개의 바로 분할
    if (end < start) {
      return [
        {
          startHour: start,
          duration: 24 - start,
          isFirst: true,
        },
        {
          startHour: 0,
          duration: end,
          isFirst: false,
        }
      ];
    } else {
      return [
        {
          startHour: start,
          duration,
          isFirst: true,
        }
      ];
    }
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

  const toggleSuspicious = (activityId) => {
    setSuspiciousActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleNext = () => {
    const stats = calculateStats();
    const suspiciousData = activities.filter(a => suspiciousActivities.includes(a.id));
    onComplete(activities, stats, suspiciousData);
  };

  // 활동의 종료 시간 계산
  const getEndHour = (activity) => {
    return normalizeHour(activity.startHour + activity.duration);
  };

  // 활동이 wrap-around 하는지 확인
  const isWrappedActivity = (activity) => {
    return (activity.startHour + activity.duration) > 24;
  };

  // wrap-around 활동을 두 부분으로 분할
  const getActivitySegments = (activity) => {
    if (!isWrappedActivity(activity)) {
      return [
        {
          startHour: activity.startHour,
          duration: activity.duration,
          isFirst: true,
        }
      ];
    }

    const firstPart = 24 - activity.startHour;
    const secondPart = activity.duration - firstPart;

    return [
      {
        startHour: activity.startHour,
        duration: firstPart,
        isFirst: true,
      },
      {
        startHour: 0,
        duration: secondPart,
        isFirst: false,
      }
    ];
  };

  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto px-6 py-6 bg-muji-bg">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-white rounded-sm"
      >
        <h2 className="text-2xl font-normal text-muji-dark mb-2">
          어제는 어떻게 보냈을까?
        </h2>
        <p className="text-body-sm font-light text-muji-light">
          어제 하루 동안 한 활동을 시간대에 맞춰 기록해보세요
        </p>
      </motion.div>

      {/* 활동 선택 버튼 */}
      <div className="grid grid-cols-7 gap-2 mb-6 p-4 bg-[#FAFAF8] rounded-sm">
        {Object.values(ACTIVITY_TYPES).map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType(type.id)}
            className={`p-3 font-light transition-all border-1 rounded-sm ${
              selectedType === type.id
                ? 'border-muji-mid shadow-muji'
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
      <div className="bg-white border-1 border-muji-beige p-6 flex-1 overflow-hidden flex flex-col min-h-0 rounded-sm shadow-muji">
        <h3 className="text-body font-normal text-muji-dark mb-4">24시간 타임라인</h3>

        <div className="flex-1 flex flex-col min-h-0">
          {/* 타임라인 */}
          <div className="overflow-y-hidden pb-3 mb-4">
            <div>
              {/* 시간 라벨 */}
              <div className="flex mb-3">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-xs font-light text-muji-light">
                    {i}시
                  </div>
                ))}
              </div>

              {/* 타임라인 바 */}
              <div
                ref={timelineRef}
                className="relative h-20 bg-[#E8E6E1] overflow-hidden rounded-sm"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  cursor: selectedType ? (isDragging ? 'grabbing' : 'crosshair') : 'default',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              >
                {/* 시간 구분선 */}
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-muji-light opacity-30"
                    style={{ left: `${(i / 24) * 100}%` }}
                  />
                ))}

                {/* 기록된 활동들 */}
                <AnimatePresence>
                  {activities.map((activity) => {
                    const segments = getActivitySegments(activity);
                    return segments.map((segment, idx) => (
                      <motion.div
                        key={`${activity.id}-${idx}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-1 h-[72px] flex flex-col items-center justify-center cursor-pointer group"
                        style={{
                          left: `${(segment.startHour / 24) * 100}%`,
                          width: `${(segment.duration / 24) * 100}%`,
                          backgroundColor: activity.color,
                        }}
                        onClick={() => removeActivity(activity.id)}
                      >
                        {segment.isFirst && (
                          <>
                            <span className="text-xs text-white font-light">
                              {activity.name}
                            </span>
                            <span className="text-xs text-white opacity-80 font-light">
                              {formatTime(Math.floor(activity.duration), Math.round((activity.duration % 1) * 60))}
                            </span>
                          </>
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                        {segment.isFirst && (
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                            <MujiIcon name="close" size={16} strokeWidth={2} className="text-white" />
                          </div>
                        )}
                      </motion.div>
                    ));
                  })}
                </AnimatePresence>

                {/* 드래그 중인 활동 미리보기 */}
                {isDragging && draggedActivity && (
                  <>
                    {getDragVisual()?.map((segment, idx) => (
                      <div
                        key={`drag-${idx}`}
                        className="absolute top-1 h-[72px] flex items-center justify-center opacity-60"
                        style={{
                          left: `${(segment.startHour / 24) * 100}%`,
                          width: `${(segment.duration / 24) * 100}%`,
                          backgroundColor: ACTIVITY_TYPES[draggedActivity.type.toUpperCase()].color,
                          border: '2px dashed white',
                        }}
                      >
                        {segment.isFirst && (
                          <span className="text-xs text-white font-light">
                            {ACTIVITY_TYPES[draggedActivity.type.toUpperCase()].name}
                          </span>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <p className="text-xs font-light text-muji-light mt-3">
                {selectedType
                  ? "타임라인을 드래그하여 활동을 추가하세요"
                  : "활동을 선택한 후 타임라인을 드래그하세요"}
              </p>
            </div>
          </div>

          {/* 활동 목록 */}
          {activities.length > 0 && (
            <div className="flex-1 min-h-0 overflow-auto space-y-2 bg-[#FAFAF8] p-3 rounded-sm">
              <div className="sticky top-0 bg-[#FAFAF8] z-10 py-2 border-b border-muji-beige mb-3">
                <h4 className="font-normal text-body-sm text-muji-dark mb-1">
                  기록된 활동
                </h4>
                <p className="text-xs font-light text-muji-light">
                  낭비했다고 느끼는 시간은 체크해주세요
                </p>
              </div>
              {activities.map((activity) => {
                const endHour = getEndHour(activity);
                const isSuspicious = suspiciousActivities.includes(activity.id);
                return (
                  <motion.div
                    key={activity.id}
                    layout
                    className={`flex items-center gap-3 p-3 border-1 transition-colors rounded-sm ${
                      isSuspicious
                        ? 'bg-[#FFF5F5] border-[#FFD6D6]'
                        : 'bg-white border-muji-beige'
                    }`}
                  >
                    {/* 의심 체크박스 */}
                    <button
                      onClick={() => toggleSuspicious(activity.id)}
                      className={`w-5 h-5 flex-shrink-0 border-1 rounded-[2px] flex items-center justify-center transition-all ${
                        isSuspicious
                          ? 'bg-muji-mid border-muji-mid'
                          : 'bg-white border-muji-light hover:border-muji-mid'
                      }`}
                    >
                      {isSuspicious && (
                        <MujiIcon name="check" size={14} strokeWidth={2} className="text-white" />
                      )}
                    </button>

                    <div
                      className="w-3 h-3 flex-shrink-0"
                      style={{ backgroundColor: activity.color }}
                    />
                    <span className="flex-1 font-light text-body-sm text-muji-dark">
                      {activity.name}
                    </span>

                    {/* 시작 시간 */}
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="23.5"
                        value={activity.startHour}
                        onChange={(e) => {
                          const newStart = parseFloat(e.target.value) || 0;
                          updateStartEndTime(activity.id, newStart, endHour);
                        }}
                        className="w-20 h-8 px-3 py-1.5 border border-muji-light bg-white font-normal text-muji-dark text-sm text-center placeholder-gray-400 focus:border-muji-mid focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                        inputMode="decimal"
                        style={{
                          color: '#111111',
                          lineHeight: '1.5'
                        }}
                      />
                      <span className="text-xs font-light text-muji-light">시</span>
                    </div>

                    <span className="text-xs font-light text-muji-light">~</span>

                    {/* 종료 시간 */}
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="23.5"
                        value={endHour}
                        onChange={(e) => {
                          const newEnd = parseFloat(e.target.value) || 0;
                          updateStartEndTime(activity.id, activity.startHour, newEnd);
                        }}
                        className="w-20 h-8 px-3 py-1.5 border border-muji-light bg-white font-normal text-muji-dark text-sm text-center placeholder-gray-400 focus:border-muji-mid focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                        inputMode="decimal"
                        style={{
                          color: '#111111',
                          lineHeight: '1.5'
                        }}
                      />
                      <span className="text-xs font-light text-muji-light">시</span>
                    </div>

                    {/* 기간 (읽기 전용) */}
                    <div className="flex items-center gap-1 text-muji-mid">
                      <span className="text-xs font-light">
                        ({formatTime(Math.floor(activity.duration), Math.round((activity.duration % 1) * 60))})
                      </span>
                    </div>

                    <button
                      onClick={() => removeActivity(activity.id)}
                      className="px-3 py-1 bg-transparent border-1 border-muji-light text-muji-mid hover:bg-muji-bg transition-colors text-xs font-light"
                    >
                      삭제
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* 다음 버튼 - 항상 표시 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <Button
            onClick={handleNext}
            variant="filled"
            size="lg"
            fullWidth
            disabled={activities.length === 0}
          >
            <span className="flex items-center justify-center gap-2">
              <span>다음</span>
              <MujiIcon name="arrow" size={18} strokeWidth={2} />
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline;
