import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../utils/activities';
import { Button, Card } from './ui';

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
    <div className="h-full flex items-center justify-center px-6 bg-muji-bg overflow-auto py-8">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-normal text-muji-dark mb-2 text-center">
            불필요했던 시간은?
          </h2>
          <p className="text-body-sm font-light text-muji-light text-center">
            각 활동 중에서 불필요했다고 생각하는 시간을 선택해주세요
          </p>
        </motion.div>

        <Card variant="default" padding="lg">
          {/* 안내 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-muji-bg border-1 border-muji-light p-5 mb-6"
          >
            <p className="text-body-sm font-light text-muji-mid">
              <span className="font-normal">예시:</span> SNS를 3시간 했는데, 그 중 2시간은 불필요했다고 느낀다면 2시간으로 설정하세요.
              정답은 없습니다. 솔직하게 답해주세요.
            </p>
          </motion.div>

          {/* 활동별 선택 */}
          <div className="space-y-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.04, duration: 0.4 }}
                className="bg-muji-beige border-1 border-muji-lightbeige p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-normal text-muji-dark text-body">{stat.name}</span>
                    <span className="text-body-sm font-light text-muji-mid ml-3">
                      전체: {formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={stat.value}
                      step="0.5"
                      value={wastedTimes[stat.name]}
                      onChange={(e) => handleWastedTimeChange(stat.name, e.target.value)}
                      className="w-20 px-3 py-2 border-1 border-muji-light bg-white font-light text-muji-dark focus:border-muji-mid focus:outline-none text-center transition-colors"
                    />
                    <span className="text-body-sm font-light text-muji-mid">시간</span>
                  </div>
                </div>

                {/* 진행 바 */}
                <div className="relative h-1 bg-white overflow-hidden">
                  <div
                    className="absolute h-full bg-muji-mid transition-all duration-300"
                    style={{ width: `${(wastedTimes[stat.name] / stat.value) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-light text-muji-light mt-2">
                  <span>0시간</span>
                  <span className="font-normal text-muji-mid">
                    {wastedTimes[stat.name] > 0 && `${((wastedTimes[stat.name] / stat.value) * 100).toFixed(0)}%`}
                  </span>
                  <span>{formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 총 낭비 시간 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={`p-6 mb-6 text-center border-1 transition-colors ${
              totalWasted > 0
                ? 'bg-muji-beige border-muji-mid'
                : 'bg-muji-bg border-muji-light'
            }`}
          >
            <p className="text-body-sm font-light text-muji-light mb-2">총 낭비된 시간</p>
            <p className={`text-3xl font-normal ${
              totalWasted > 0 ? 'text-muji-dark' : 'text-muji-light'
            }`}>
              {formatTime(Math.floor(totalWasted), Math.round((totalWasted % 1) * 60))}
            </p>
            {totalWasted > 0 && (
              <p className="text-xs font-light text-muji-mid mt-2">
                하루 기준 ≈ {((totalWasted / 24) * 100).toFixed(1)}%
              </p>
            )}
          </motion.div>

          <Button
            onClick={handleNext}
            variant="filled"
            size="lg"
            fullWidth
            disabled={totalWasted === 0}
          >
            {totalWasted > 0 ? '다음' : '낭비된 시간을 선택해주세요'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default WastedTimeSelection;
