import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatTime } from '../utils/activities';

const TimelineResult = ({ activities, stats, onNext }) => {
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

  const totalHours = stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-heading-lg font-bold text-muji-charcoal mb-2">
          📊 시간 사용 분석
        </h2>
        <p className="text-body text-muji-charcoal opacity-80">
          어제 하루를 어떻게 보냈는지 확인해보세요
        </p>
      </motion.div>

      <div className="card flex-1 overflow-hidden flex flex-col">
        <div className="grid md:grid-cols-2 gap-8 flex-1 overflow-auto">
          {/* 원형 차트 */}
          <div className="flex items-center justify-center">
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
          <div className="space-y-3 overflow-auto">
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
          onClick={onNext}
          className="btn-primary w-full mt-6"
        >
          다음 단계로 →
        </button>
      </div>
    </div>
  );
};

export default TimelineResult;
