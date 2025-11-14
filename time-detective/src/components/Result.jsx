import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatTime } from '../utils/activities';
import { exportData } from '../utils/storage';

const Result = ({ timelineData, thiefGameData, onRestart }) => {
  // 데이터 내보내기
  const handleExport = () => {
    const data = exportData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `시간탐정_결과_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // 인쇄하기
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-5xl mb-3"
          >
            ✨
          </motion.div>
          <h2 className="text-3xl font-bold text-muji-charcoal mb-2">
            시간탐정 미션 완료!
          </h2>
          <p className="text-muji-charcoal opacity-80">
            나의 시간 사용 습관을 잘 분석했어요
          </p>
        </motion.div>

        <div className="card">
          {/* 핵심 요약 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* 시간 사용 요약 */}
            {timelineData && timelineData.stats && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
              >
                <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <span>⏰</span>
                  <span>시간 사용</span>
                </h3>
                <div className="space-y-2">
                  {timelineData.stats.slice(0, 3).map((stat) => (
                    <div key={stat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{stat.emoji}</span>
                        <span className="font-medium">{stat.name}</span>
                      </div>
                      <span className="font-bold">
                        {formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 시간도둑 요약 */}
            {thiefGameData && thiefGameData.results && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg p-4"
              >
                <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                  <span>🔴</span>
                  <span>내 시간도둑 TOP {Math.min(3, thiefGameData.results.topThieves.length)}</span>
                </h3>
                <div className="space-y-2">
                  {thiefGameData.results.topThieves.slice(0, 3).map((thief, index) => (
                    <div key={thief.id} className="flex items-start gap-2 text-sm">
                      <span className="font-bold text-red-600">{index + 1}.</span>
                      <div className="flex items-center gap-1 flex-1">
                        <span>{thief.icon}</span>
                        <span className="font-medium line-clamp-1">{thief.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* 마무리 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-5 mb-5"
          >
            <h3 className="font-bold text-muji-charcoal mb-3 text-center text-lg">
              🎉 축하합니다!
            </h3>
            <div className="space-y-2 text-muji-charcoal text-sm leading-relaxed text-center">
              <p>
                오늘 시간탐정 활동을 통해 <strong className="text-muji-brown">나의 시간 사용 습관</strong>을 발견했어요.
              </p>
              <p className="text-base font-bold text-green-600">
                💪 이제 변화를 시작할 준비가 되었어요!
              </p>
              <p className="text-xs opacity-80">
                작은 실천부터 시작해보세요. 다음 회기에서 구체적인 계획을 세울 거예요.
              </p>
            </div>
          </motion.div>

          {/* 액션 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-4"
          >
            <button
              onClick={handlePrint}
              className="btn-secondary flex flex-col items-center justify-center gap-1 py-3"
            >
              <span className="text-xl">🖨️</span>
              <span className="text-xs">인쇄하기</span>
            </button>
            <button
              onClick={handleExport}
              className="btn-secondary flex flex-col items-center justify-center gap-1 py-3"
            >
              <span className="text-xl">💾</span>
              <span className="text-xs">데이터 저장</span>
            </button>
            <button
              onClick={onRestart}
              className="btn-primary flex flex-col items-center justify-center gap-1 py-3"
            >
              <span className="text-xl">🔄</span>
              <span className="text-xs">처음부터 다시</span>
            </button>
          </motion.div>

          {/* 상담자 안내 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-3 border-2 border-dashed border-muji-brown rounded-lg bg-white"
          >
            <p className="text-xs text-muji-charcoal opacity-70 text-center">
              💡 <strong>상담자 안내:</strong> 이 결과를 바탕으로 학생과 함께 구체적인 시간관리 전략을 논의해주세요.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Result;
