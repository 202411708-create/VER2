import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatTime } from '../utils/activities';
import { Button, Card, MujiIcon, SectionBox } from './ui';

const TimelineResult = ({ activities, stats, onNext }) => {
  const [showUntrackedModal, setShowUntrackedModal] = useState(false);
  const [untrackedCategory, setUntrackedCategory] = useState(null);

  // 전체 기록 시간 계산
  const totalHours = stats.reduce((sum, s) => sum + s.value, 0);
  const totalMinutes = totalHours * 60;
  const missingMinutes = 24 * 60 - totalMinutes;
  const missingHours = missingMinutes / 60;

  // 24시간 초과 여부
  const isOverLimit = totalHours > 24;

  // 파이차트용 데이터 (미지의 시간 포함)
  const chartData = [...stats];
  if (missingHours > 0 && !isOverLimit) {
    chartData.push({
      name: '미지의 시간',
      value: missingHours,
      color: '#D6D3CD',
    });
  }

  const generateComparison = () => {
    if (stats.length < 2) return null;
    const sorted = [...stats].sort((a, b) => b.value - a.value);
    const top1 = sorted[0];
    const top2 = sorted[1];
    if (top1 && top2) {
      const ratio = (top1.value / top2.value).toFixed(1);
      return `${top1.name} ${formatTime(Math.floor(top1.value), Math.round((top1.value % 1) * 60))}, ${top2.name} ${formatTime(Math.floor(top2.value), Math.round((top2.value % 1) * 60))}... ${top1.name}이 ${top2.name}보다 ${ratio}배 많았습니다.`;
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
        message: `수면이 ${formatTime(Math.floor(sleep.value), Math.round((sleep.value % 1) * 60))}로 부족합니다. 청소년 권장 수면시간은 8-10시간입니다.`
      });
    } else if (sleep && sleep.value >= 8 && sleep.value <= 10) {
      insights.push({
        type: 'success',
        message: `수면 시간이 ${formatTime(Math.floor(sleep.value), Math.round((sleep.value % 1) * 60))}로 적절합니다.`
      });
    }

    // 공부와 SNS/게임 비교
    if (study && (sns || game)) {
      const leisure = (sns ? sns.value : 0) + (game ? game.value : 0);
      if (leisure > study.value * 1.5) {
        const gap = leisure - study.value;
        insights.push({
          type: 'info',
          message: `여가 활동이 공부보다 ${formatTime(Math.floor(gap), Math.round((gap % 1) * 60))} 더 많습니다. 여가 시간을 조금만 줄이면 공부 시간을 늘릴 수 있습니다.`
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
        message: `SNS와 게임이 전체의 ${leisurePercent.toFixed(0)}%를 차지하고 있습니다.`
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const handleUntrackedSelect = (category) => {
    setUntrackedCategory(category);
    setShowUntrackedModal(false);
    // TODO: 선택된 카테고리를 localStorage 또는 상태에 저장
    console.log('Selected untracked category:', category);
  };

  return (
    <div className="h-full flex items-center justify-center px-6 bg-muji-bg overflow-auto py-8">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-normal text-muji-dark mb-2">
            시간 사용 분석
          </h2>
          <p className="text-body-sm font-light text-muji-light">
            어제 하루를 어떻게 보냈는지 확인해보세요
          </p>
        </motion.div>

        {/* 24시간 초과 경고 */}
        {isOverLimit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <SectionBox variant="default" padding="default">
              <div className="flex items-start gap-3">
                <MujiIcon name="close" size={20} strokeWidth={2} className="text-muji-mid mt-0.5" />
                <div>
                  <h4 className="font-normal text-body text-muji-dark mb-1">
                    기록 시간 초과
                  </h4>
                  <p className="text-body-sm font-light text-muji-mid">
                    총 기록 시간이 하루 24시간을 초과했습니다. ({formatTime(Math.floor(totalHours), Math.round((totalHours % 1) * 60))})
                  </p>
                </div>
              </div>
            </SectionBox>
          </motion.div>
        )}

        <Card variant="default" padding="lg">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatTime(Math.floor(value), Math.round((value % 1) * 60))} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-muji-beige border-1 border-muji-lightbeige">
                <h4 className="font-normal text-body-sm mb-2 text-muji-mid">전체 기록 시간</h4>
                <p className="text-xl font-normal text-muji-dark">
                  {formatTime(Math.floor(totalHours), Math.round((totalHours % 1) * 60))}
                </p>
              </div>

              <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between p-3 bg-muji-bg border-1 border-muji-beige">
                    <span className="font-light text-body-sm text-muji-dark">{stat.name}</span>
                    <span className="font-normal text-body-sm text-muji-dark">
                      {formatTime(Math.floor(stat.value), Math.round((stat.value % 1) * 60))}
                    </span>
                  </div>
                ))}
              </div>

              {generateComparison() && (
                <div className="p-4 bg-muji-bg border-1 border-muji-light">
                  <p className="text-body-sm font-light text-muji-mid">
                    {generateComparison()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 미지의 시간 섹션 */}
          {missingHours > 0 && !isOverLimit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <SectionBox
                title="기록되지 않은 시간"
                subtitle={`하루 중 ${formatTime(Math.floor(missingHours), Math.round((missingHours % 1) * 60))}은 기록되지 않았습니다.`}
                variant="default"
                padding="default"
              >
                <p className="text-body-sm font-light text-muji-mid mb-4">
                  이 시간은 휴식, 멍 때림, 이동시간, 또는 기억나지 않는 활동일 수 있습니다.
                </p>
                <Button
                  onClick={() => setShowUntrackedModal(true)}
                  variant="secondary"
                  size="md"
                >
                  <span className="flex items-center gap-2">
                    <MujiIcon name="plus" size={16} strokeWidth={2} />
                    <span>추가 기록하기</span>
                  </span>
                </Button>
              </SectionBox>
            </motion.div>
          )}

          {/* 맞춤형 인사이트 */}
          {insights.length > 0 && (
            <div className="space-y-3 mb-6">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 bg-muji-bg border-l-2 border-muji-mid"
                >
                  <p className="text-body-sm font-light text-muji-mid">
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Button onClick={onNext} variant="filled" size="lg" fullWidth>
            <span className="flex items-center justify-center gap-2">
              <span>다음</span>
              <MujiIcon name="arrow" size={18} strokeWidth={2} />
            </span>
          </Button>
        </Card>

        {/* 미지의 시간 카테고리 선택 모달 */}
        <AnimatePresence>
          {showUntrackedModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-6"
              onClick={() => setShowUntrackedModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[4px] p-6 max-w-md w-full shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-normal text-muji-dark">
                    미지의 시간 분류
                  </h3>
                  <button
                    onClick={() => setShowUntrackedModal(false)}
                    className="text-muji-mid hover:text-muji-dark transition-colors"
                  >
                    <MujiIcon name="close" size={20} strokeWidth={2} />
                  </button>
                </div>

                <p className="text-body-sm font-light text-muji-light mb-6">
                  기록되지 않은 시간이 무엇이었을지 선택해주세요
                </p>

                <div className="space-y-2">
                  {[
                    { id: 'commute', label: '이동 시간', icon: 'arrow' },
                    { id: 'idle', label: '멍 때림', icon: 'minus' },
                    { id: 'rest', label: '휴식', icon: 'check' },
                    { id: 'unknown', label: '정확히 기억나지 않음', icon: 'close' },
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleUntrackedSelect(category.id)}
                      className="w-full flex items-center gap-3 p-4 border border-[#E6E3DD] rounded-[4px] hover:border-muji-mid hover:bg-muji-bg transition-all text-left"
                    >
                      <MujiIcon name={category.icon} size={20} strokeWidth={1.5} className="text-muji-mid" />
                      <span className="font-light text-body-sm text-muji-dark">
                        {category.label}
                      </span>
                    </button>
                  ))}
                </div>

                {untrackedCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-muji-beige border border-muji-lightbeige rounded-[4px]"
                  >
                    <p className="text-xs font-light text-muji-mid">
                      선택이 저장되었습니다
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimelineResult;
