import { motion } from 'framer-motion';
import { formatTime } from '../utils/activities';
import { exportData } from '../utils/storage';
import { Button, Card, MujiIcon } from './ui';

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
    <div className="h-full flex items-center justify-center px-6 bg-muji-bg overflow-auto py-8">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <MujiIcon name="check" size={48} strokeWidth={1.5} className="text-muji-mid" />
          </div>
          <h2 className="text-3xl font-normal text-muji-dark mb-2">
            내 하루의 흐름을 돌아보며
          </h2>
          <p className="text-body-sm font-light text-muji-light">
            시간탐정 1회기를 완료했습니다
          </p>
        </motion.div>

        <Card variant="default" padding="lg">
          {/* 핵심 요약 */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* 시간 사용 요약 */}
            {timelineData && timelineData.stats && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-muji-beige border-1 border-muji-lightbeige p-6"
              >
                <h3 className="font-normal text-muji-dark mb-4 flex items-center gap-2 text-body">
                  <MujiIcon name="clock" size={20} strokeWidth={2} />
                  <span>시간 사용</span>
                </h3>
                <div className="space-y-3">
                  {timelineData.stats.slice(0, 3).map((stat) => (
                    <div key={stat.name} className="flex items-center justify-between text-body-sm">
                      <span className="font-light text-muji-dark">{stat.name}</span>
                      <span className="font-normal text-muji-dark">
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
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="bg-muji-beige border-1 border-muji-lightbeige p-6"
              >
                <h3 className="font-normal text-muji-dark mb-4 flex items-center gap-2 text-body">
                  <MujiIcon name="detective" size={20} strokeWidth={2} />
                  <span>내 시간도둑 TOP {Math.min(3, thiefGameData.results.topThieves.length)}</span>
                </h3>
                <div className="space-y-3">
                  {thiefGameData.results.topThieves.slice(0, 3).map((thief, index) => (
                    <div key={thief.id} className="flex items-start gap-2 text-body-sm">
                      <span className="font-normal text-muji-mid min-w-[20px]">{index + 1}.</span>
                      <span className="font-light text-muji-dark line-clamp-1">{thief.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* 마무리 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-muji-bg border-1 border-muji-light p-6 mb-8"
          >
            <h3 className="font-normal text-muji-dark mb-4 text-center text-body">
              축하합니다
            </h3>
            <div className="space-y-3 text-body-sm font-light text-muji-mid leading-relaxed text-center">
              <p>
                오늘 시간탐정 활동을 통해 <span className="font-normal text-muji-dark">나의 시간 사용 습관</span>을 발견했습니다.
              </p>
              <p className="text-body font-normal text-muji-dark">
                이제 변화를 시작할 준비가 되었습니다.
              </p>
              <p className="text-xs font-light text-muji-light">
                작은 실천부터 시작해보세요. 다음 회기에서 구체적인 계획을 세울 것입니다.
              </p>
            </div>
          </motion.div>

          {/* 액션 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <Button
              onClick={handlePrint}
              variant="secondary"
              size="md"
              className="flex flex-col items-center justify-center gap-2 py-4"
            >
              <MujiIcon name="arrow" size={18} strokeWidth={2} className="rotate-90" />
              <span className="text-xs font-light">인쇄하기</span>
            </Button>
            <Button
              onClick={handleExport}
              variant="secondary"
              size="md"
              className="flex flex-col items-center justify-center gap-2 py-4"
            >
              <MujiIcon name="arrow" size={18} strokeWidth={2} className="rotate-180" />
              <span className="text-xs font-light">데이터 저장</span>
            </Button>
            <Button
              onClick={onRestart}
              variant="filled"
              size="md"
              className="flex flex-col items-center justify-center gap-2 py-4"
            >
              <MujiIcon name="restart" size={18} strokeWidth={2} />
              <span className="text-xs font-light">처음부터 다시</span>
            </Button>
          </motion.div>

          {/* 상담자 안내 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="p-4 border-1 border-dashed border-muji-light bg-muji-bg"
          >
            <p className="text-xs font-light text-muji-mid text-center">
              <span className="font-normal">상담자 안내:</span> 이 결과를 바탕으로 학생과 함께 구체적인 시간관리 전략을 논의해주세요.
            </p>
          </motion.div>
        </Card>
      </div>
    </div>
  );
};

export default Result;
