import { motion } from 'framer-motion';
import { formatTime } from '../utils/activities';

const TimeAwareness = ({ timelineData, onNext }) => {
  // 낭비 가능성이 있는 시간 계산 (SNS + 게임)
  const calculateWastedTime = () => {
    if (!timelineData || !timelineData.stats) return 0;

    const sns = timelineData.stats.find(s => s.name === 'SNS');
    const game = timelineData.stats.find(s => s.name === '게임');

    const wastedHours = (sns ? sns.value : 0) + (game ? game.value : 0);
    return wastedHours;
  };

  const wastedDaily = calculateWastedTime();
  const wastedWeekly = wastedDaily * 7;
  const wastedMonthly = wastedDaily * 30;

  // 할 수 있는 활동들
  const possibleActivities = [
    { icon: '📚', activity: '책 읽기', amount: Math.floor(wastedMonthly / 3), unit: '권' },
    { icon: '🏃', activity: '운동하기', amount: Math.floor(wastedMonthly), unit: '시간' },
    { icon: '🎨', activity: '새로운 취미 배우기', amount: Math.floor(wastedMonthly / 2), unit: '시간' },
    { icon: '👨‍👩‍👧', activity: '가족과 대화', amount: Math.floor(wastedMonthly), unit: '시간' },
  ];

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-muji-charcoal mb-1 text-center">
            ⏰ 낭비한 시간을 모으면?
          </h2>
          <p className="text-sm text-muji-charcoal opacity-80 text-center">
            작은 시간도 모이면 큰 시간이 됩니다
          </p>
        </motion.div>

        <div className="card">
          {/* 시간 누적 계산 */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5 text-center"
            >
              <div className="text-sm font-medium text-yellow-700 mb-2">하루</div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {formatTime(Math.floor(wastedDaily), Math.round((wastedDaily % 1) * 60))}
              </div>
              <div className="text-xs text-yellow-600">SNS + 게임</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-orange-50 border-2 border-orange-300 rounded-lg p-5 text-center"
            >
              <div className="text-sm font-medium text-orange-700 mb-2">일주일이면</div>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {formatTime(Math.floor(wastedWeekly), Math.round((wastedWeekly % 1) * 60))}
              </div>
              <div className="text-xs text-orange-600">7일 × {formatTime(Math.floor(wastedDaily), Math.round((wastedDaily % 1) * 60))}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-red-50 border-2 border-red-300 rounded-lg p-5 text-center"
            >
              <div className="text-sm font-medium text-red-700 mb-2">한 달이면</div>
              <div className="text-3xl font-bold text-red-600 mb-1">
                {formatTime(Math.floor(wastedMonthly), Math.round((wastedMonthly % 1) * 60))}
              </div>
              <div className="text-xs text-red-600">30일 × {formatTime(Math.floor(wastedDaily), Math.round((wastedDaily % 1) * 60))}</div>
            </motion.div>
          </div>

          {/* 충격적인 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg mb-6"
          >
            <p className="text-lg font-bold text-red-600 text-center">
              💥 한 달에 <span className="text-2xl">{Math.floor(wastedMonthly)}시간</span>을 낭비하고 있어요!
            </p>
            <p className="text-sm text-red-600 text-center mt-2">
              이 시간만 줄여도 하루에 <strong>{Math.floor(wastedDaily)}시간</strong>을 되찾을 수 있어요.
            </p>
          </motion.div>

          {/* 할 수 있는 것들 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-muji-charcoal mb-3 text-center">
              🌟 이 시간이면 한 달 동안...
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {possibleActivities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-green-50 rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-xl font-bold text-green-600 mb-1">
                    {item.amount}{item.unit}
                  </div>
                  <div className="text-xs text-green-700">{item.activity}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 성찰 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-5"
          >
            <p className="text-sm font-bold text-blue-600 mb-2">
              💡 시간관리가 중요한 이유
            </p>
            <p className="text-sm text-blue-700 leading-relaxed">
              지금은 작게 느껴지는 {Math.floor(wastedDaily)}시간이지만,
              <strong> 한 달이면 {Math.floor(wastedMonthly)}시간, 1년이면 {Math.floor(wastedMonthly * 12)}시간</strong>이 됩니다.
              이 시간을 내가 정말 하고 싶은 일에 사용한다면,
              <strong> 나의 미래가 완전히 달라질 수 있어요!</strong>
            </p>
          </motion.div>

          <button onClick={onNext} className="btn-primary w-full">
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeAwareness;
