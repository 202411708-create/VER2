import { motion } from 'framer-motion';
import { formatTime, ACTIVITY_TYPES } from '../utils/activities';

const TimeEstimationComparison = ({ estimations, stats, onNext }) => {
  // stats를 활동별로 매핑
  const statsMap = {};
  stats.forEach(stat => {
    // stat.name으로 타입 찾기
    const type = Object.values(ACTIVITY_TYPES).find(t => t.name === stat.name);
    if (type) {
      statsMap[type.id] = stat.value;
    }
  });

  // 비교 데이터 생성
  const comparisons = Object.keys(estimations).map(key => {
    const estimated = estimations[key];
    const actual = statsMap[key] || 0;
    const difference = actual - estimated;
    const percentError = estimated > 0 ? Math.abs((difference / estimated) * 100) : 0;

    const type = ACTIVITY_TYPES[key.toUpperCase()];

    return {
      id: key,
      name: type.name,
      emoji: type.emoji,
      estimated,
      actual,
      difference,
      percentError,
      color: type.color,
    };
  });

  // 정확도 계산
  const averageError = comparisons.reduce((sum, c) => sum + c.percentError, 0) / comparisons.length;
  const getAccuracyMessage = () => {
    if (averageError < 20) return { level: 'excellent', message: '와! 시간 감각이 매우 정확해요! 🎯', color: 'green' };
    if (averageError < 40) return { level: 'good', message: '좋아요! 시간 감각이 괜찮은 편이에요. 👍', color: 'blue' };
    if (averageError < 60) return { level: 'fair', message: '시간 감각을 조금 더 키워볼 필요가 있어요. 🤔', color: 'yellow' };
    return { level: 'poor', message: '시간 감각을 키우는 연습이 필요해요. 💪', color: 'red' };
  };

  const accuracy = getAccuracyMessage();

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-muji-charcoal mb-1 text-center">
            🎯 예상 vs 실제 비교
          </h2>
          <p className="text-sm text-muji-charcoal opacity-80 text-center">
            내 시간 감각은 얼마나 정확할까요?
          </p>
        </motion.div>

        <div className="card">
          {/* 정확도 메시지 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`mb-5 p-4 rounded-lg border-l-4 ${
              accuracy.color === 'green' ? 'bg-green-50 border-green-500' :
              accuracy.color === 'blue' ? 'bg-blue-50 border-blue-500' :
              accuracy.color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
              'bg-red-50 border-red-500'
            }`}
          >
            <p className={`text-lg font-bold ${
              accuracy.color === 'green' ? 'text-green-600' :
              accuracy.color === 'blue' ? 'text-blue-600' :
              accuracy.color === 'yellow' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {accuracy.message}
            </p>
            <p className="text-sm text-muji-charcoal mt-1 opacity-80">
              평균 오차: {averageError.toFixed(0)}%
            </p>
          </motion.div>

          {/* 비교 테이블 */}
          <div className="space-y-2 mb-5">
            {comparisons.map((comp, index) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-muji-beige rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{comp.emoji}</span>
                    <span className="font-bold text-muji-charcoal">{comp.name}</span>
                  </div>
                  <div className={`text-sm font-medium ${
                    Math.abs(comp.difference) < 0.5 ? 'text-green-600' :
                    Math.abs(comp.difference) < 2 ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {comp.difference > 0 ? '+' : ''}{formatTime(Math.floor(Math.abs(comp.difference)), Math.round((Math.abs(comp.difference) % 1) * 60))}
                    {comp.difference > 0 ? ' 더 많음' : comp.difference < 0 ? ' 더 적음' : ' 정확!'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between px-3 py-2 bg-white rounded">
                    <span className="text-muji-charcoal opacity-70">예상</span>
                    <span className="font-bold">{formatTime(Math.floor(comp.estimated), Math.round((comp.estimated % 1) * 60))}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-white rounded">
                    <span className="text-muji-charcoal opacity-70">실제</span>
                    <span className="font-bold">{formatTime(Math.floor(comp.actual), Math.round((comp.actual % 1) * 60))}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 인사이트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4"
          >
            <p className="text-sm font-bold text-blue-600 mb-2">
              💡 시간 감각을 키우려면?
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 타이머를 사용해서 실제 시간 체감 연습하기</li>
              <li>• 활동 전후로 시간 예측하고 확인하기</li>
              <li>• 매일 시간 기록 습관 만들기</li>
            </ul>
          </motion.div>

          <button onClick={onNext} className="btn-primary w-full">
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeEstimationComparison;
