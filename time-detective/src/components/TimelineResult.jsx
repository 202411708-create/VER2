import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatTime } from '../utils/activities';

const TimelineResult = ({ activities, stats, onNext }) => {
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

  const generateInsights = () => {
    const insights = [];
    const sleep = stats.find(s => s.name === '수면');
    const study = stats.find(s => s.name === '공부');
    const sns = stats.find(s => s.name === 'SNS');
    const game = stats.find(s => s.name === '게임');

    // 수면 시간 체크
    if (sleep && sleep.value < 7) {
      insights.push({
        type: 'warning',
        message: `수면이 ${formatTime(Math.floor(sleep.value), Math.round((sleep.value % 1) * 60))}로 부족해요. 청소년 권장 수면시간은 8-10시간이에요. 💤`
      });
    } else if (sleep && sleep.value >= 8 && sleep.value <= 10) {
      insights.push({
        type: 'success',
        message: `수면 시간이 ${formatTime(Math.floor(sleep.value), Math.round((sleep.value % 1) * 60))}로 적절해요! 👍`
      });
    }

    // 공부와 SNS/게임 비교
    if (study && (sns || game)) {
      const leisure = (sns ? sns.value : 0) + (game ? game.value : 0);
      if (leisure > study.value * 1.5) {
        const gap = leisure - study.value;
        insights.push({
          type: 'info',
          message: `여가 활동이 공부보다 ${formatTime(Math.floor(gap), Math.round((gap % 1) * 60))} 더 많아요. 여가 시간을 조금만 줄이면 공부 시간을 늘릴 수 있어요! 📚`
        });
      }
    }

    // SNS + 게임 합계 비율
    const totalTime = stats.reduce((sum, s) => sum + s.value, 0);
    const leisureTime = (sns ? sns.value : 0) + (game ? game.value : 0);
    const leisurePercent = (leisureTime / totalTime) * 100;
    if (leisurePercent > 30) {
      insights.push({
        type: 'warning',
        message: `SNS와 게임이 전체의 ${leisurePercent.toFixed(0)}%를 차지하고 있어요. 🎮📱`
      });
    }

    return insights;
  };

  const totalHours = stats.reduce((sum, s) => sum + s.value, 0);
  const insights = generateInsights();

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-muji-charcoal mb-1">
            📊 시간 사용 분석
          </h2>
          <p className="text-sm text-muji-charcoal opacity-80">
            어제 하루를 어떻게 보냈는지 확인해보세요
          </p>
        </motion.div>

        <div className="card">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
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

            <div className="space-y-2">
              <div className="p-3 bg-muji-beige rounded-lg">
                <h4 className="font-bold text-sm mb-1">전체 기록 시간</h4>
                <p className="text-xl font-bold text-muji-brown">
                  {formatTime(Math.floor(totalHours), Math.round((totalHours % 1) * 60))}
                </p>
              </div>

              <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between p-2 bg-muji-beige rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stat.emoji}</span>
                      <span className="font-medium text-sm">{stat.name}</span>
                    </div>
                    <span className="font-bold text-sm">
                      {formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}
                    </span>
                  </div>
                ))}
              </div>

              {generateComparison() && (
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                  <p className="text-sm text-muji-charcoal">
                    {generateComparison()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 맞춤형 인사이트 */}
          {insights.length > 0 && (
            <div className="mt-4 space-y-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : insight.type === 'success'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <p className="text-sm font-medium text-muji-charcoal">
                    💡 {insight.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button onClick={onNext} className="btn-primary w-full mt-4">
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineResult;
