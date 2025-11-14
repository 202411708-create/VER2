import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../utils/activities';

const WastedTimeSelection = ({ stats, onComplete }) => {
  // 각 활동의 낭비 시간 초기화 (기본값 0)
  const [wastedTimes, setWastedTimes] = useState(
    stats.reduce((acc, stat) => {
      acc[stat.name] = 0;
      return acc;
    }, {})
  );

  const handleWastedTimeChange = (name, value) => {
    const stat = stats.find(s => s.name === name);
    if (stat) {
      // 실제 시간을 초과하지 않도록 제한
      const wastedValue = Math.max(0, Math.min(stat.value, parseFloat(value) || 0));
      setWastedTimes(prev => ({
        ...prev,
        [name]: wastedValue
      }));
    }
  };

  const handleNext = () => {
    const totalWasted = Object.values(wastedTimes).reduce((sum, val) => sum + val, 0);
    onComplete(wastedTimes, totalWasted);
  };

  const totalWasted = Object.values(wastedTimes).reduce((sum, val) => sum + val, 0);

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-muji-charcoal mb-1 text-center">
            🤔 불필요했던 시간은?
          </h2>
          <p className="text-sm text-muji-charcoal opacity-80 text-center">
            각 활동 중에서 불필요했다고 생각하는 시간을 선택해주세요
          </p>
        </motion.div>

        <div className="card">
          {/* 안내 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg mb-5"
          >
            <p className="text-sm text-blue-600">
              💡 <strong>예시:</strong> SNS를 3시간 했는데, 그 중 2시간은 불필요했다고 느낀다면 2시간으로 설정하세요.
              정답은 없어요. 솔직하게 답해주세요!
            </p>
          </motion.div>

          {/* 활동별 선택 */}
          <div className="space-y-3 mb-5">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-muji-beige rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{stat.emoji}</span>
                    <div>
                      <span className="font-bold text-muji-charcoal">{stat.name}</span>
                      <span className="text-sm text-muji-charcoal opacity-70 ml-2">
                        (전체: {formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={stat.value}
                      step="0.5"
                      value={wastedTimes[stat.name]}
                      onChange={(e) => handleWastedTimeChange(stat.name, e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-muji-lightbeige rounded-lg focus:border-muji-brown focus:outline-none text-center"
                    />
                    <span className="text-sm text-muji-charcoal">시간</span>
                  </div>
                </div>

                {/* 진행 바 */}
                <div className="relative h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${(wastedTimes[stat.name] / stat.value) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muji-charcoal opacity-60 mt-1">
                  <span>0시간</span>
                  <span className="font-medium text-red-600">
                    {wastedTimes[stat.name] > 0 && `${((wastedTimes[stat.name] / stat.value) * 100).toFixed(0)}% 낭비`}
                  </span>
                  <span>{formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 총 낭비 시간 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`p-4 rounded-lg mb-4 text-center ${
              totalWasted > 0
                ? 'bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-red-300'
                : 'bg-gray-50 border-2 border-gray-300'
            }`}
          >
            <p className="text-sm text-muji-charcoal opacity-70 mb-1">총 낭비된 시간</p>
            <p className={`text-3xl font-bold ${
              totalWasted > 0 ? 'text-red-600' : 'text-gray-400'
            }`}>
              {formatTime(Math.floor(totalWasted), Math.round((totalWasted % 1) * 60))}
            </p>
            {totalWasted > 0 && (
              <p className="text-xs text-red-600 mt-1">
                하루 기준 ≈ {((totalWasted / 24) * 100).toFixed(1)}%
              </p>
            )}
          </motion.div>

          <button
            onClick={handleNext}
            className="btn-primary w-full"
            disabled={totalWasted === 0}
          >
            {totalWasted > 0 ? '다음 →' : '낭비된 시간을 선택해주세요'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WastedTimeSelection;
