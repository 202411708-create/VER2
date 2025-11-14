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
    <div className="h-full overflow-auto">
      <div className="w-full max-w-6xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <h2 className="text-heading-lg font-bold text-muji-charcoal mb-2">
          시간탐정 미션 완료!
        </h2>
        <p className="text-body text-muji-charcoal opacity-80">
          나의 시간 사용 습관을 잘 분석했어요
        </p>
      </motion.div>

      {/* 타임라인 요약 */}
      {timelineData && timelineData.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h3 className="text-heading font-bold mb-6 flex items-center gap-2">
            <span>⏰</span>
            <span>나의 시간 사용</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 원형 차트 */}
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={timelineData.stats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {timelineData.stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatTime(Math.floor(value), Math.round((value % 1) * 60))} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 통계 */}
            <div className="space-y-3">
              {timelineData.stats.map((stat) => (
                <div
                  key={stat.name}
                  className="flex items-center justify-between p-3 bg-muji-beige rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{stat.emoji}</span>
                    <span className="font-medium">{stat.name}</span>
                  </div>
                  <span className="font-bold">
                    {formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 시간도둑 요약 */}
      {thiefGameData && thiefGameData.results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <h3 className="text-heading font-bold mb-6 flex items-center gap-2">
            <span>🔍</span>
            <span>시간도둑 분석</span>
          </h3>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-red-600 mb-4 text-lg">
              🔴 내 시간도둑 TOP {thiefGameData.results.topThieves.length}
            </h4>
            <div className="space-y-3">
              {thiefGameData.results.topThieves.map((thief, index) => (
                <div
                  key={thief.id}
                  className="bg-white p-4 rounded-lg flex items-start gap-3"
                >
                  <div className="text-2xl font-bold text-red-500">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{thief.icon}</span>
                      <h5 className="font-bold text-muji-charcoal">
                        {thief.title}
                      </h5>
                    </div>
                    <p className="text-sm text-muji-charcoal opacity-70">
                      {thief.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-lg font-bold text-blue-600">
              💡 {thiefGameData.results.message}
            </p>
          </div>
        </motion.div>
      )}

      {/* 성찰 메시지 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card mb-8 bg-gradient-to-br from-muji-beige to-muji-lightbeige"
      >
        <h3 className="text-heading font-bold mb-4 text-muji-charcoal">
          💭 성찰 메시지
        </h3>
        <div className="space-y-4 text-muji-charcoal">
          <p className="text-body-lg leading-relaxed">
            오늘 활동을 통해 내가 하루를 어떻게 보내는지, 어떤 행동들이 시간을 빼앗아 가는지 알아봤어요.
          </p>
          <p className="text-body-lg leading-relaxed">
            시간은 누구에게나 공평하게 24시간이 주어집니다.
            중요한 것은 <strong className="text-muji-brown">그 시간을 어떻게 사용하느냐</strong>예요.
          </p>
          <p className="text-body-lg leading-relaxed">
            지금부터 작은 변화를 시작해보세요.
            시간도둑을 하나씩 줄여가다 보면,
            <strong className="text-muji-brown">내가 원하는 일에 더 많은 시간을 쓸 수 있을 거예요!</strong>
          </p>
        </div>
      </motion.div>

      {/* 액션 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <button
          onClick={handlePrint}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <span>🖨️</span>
          <span>인쇄하기</span>
        </button>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <span>💾</span>
          <span>데이터 저장</span>
        </button>
        <button
          onClick={onRestart}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>처음부터 다시</span>
        </button>
      </motion.div>

      {/* 상담자 안내 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-4 border-2 border-dashed border-muji-brown rounded-lg bg-white"
      >
        <p className="text-sm text-muji-charcoal opacity-70 text-center">
          💡 <strong>상담자 안내:</strong> 이 결과를 바탕으로 학생과 함께 구체적인 시간관리 전략을 논의해주세요.
          다음 회기에서는 목표 설정 및 실행 계획을 수립할 예정입니다.
        </p>
      </motion.div>
      </div>
    </div>
  );
};

export default Result;
