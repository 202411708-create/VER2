import { motion } from 'framer-motion';
import { formatTime } from '../utils/activities';
import { Button, Card, MujiIcon } from './ui';

const TimeAwareness = ({ wastedDaily, onNext }) => {
  const wastedWeekly = wastedDaily * 7;
  const wastedMonthly = wastedDaily * 30;

  // 할 수 있는 활동들
  const possibleActivities = [
    { activity: '책 읽기', amount: Math.floor(wastedMonthly / 3), unit: '권' },
    { activity: '운동하기', amount: Math.floor(wastedMonthly), unit: '시간' },
    { activity: '새로운 취미 배우기', amount: Math.floor(wastedMonthly / 2), unit: '시간' },
    { activity: '가족과 대화', amount: Math.floor(wastedMonthly), unit: '시간' },
  ];

  return (
    <div className="h-full flex items-center justify-center px-6 bg-muji-bg overflow-auto py-8">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <MujiIcon name="clock" size={32} strokeWidth={1.5} className="text-muji-mid" />
            <h2 className="text-2xl font-normal text-muji-dark text-center">
              낭비한 시간을 모으면?
            </h2>
          </div>
          <p className="text-body-sm font-light text-muji-light text-center">
            작은 시간도 모이면 큰 시간이 됩니다
          </p>
        </motion.div>

        <Card variant="default" padding="lg">
          {/* 시간 누적 계산 */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-muji-bg border-1 border-muji-beige p-6 text-center"
            >
              <div className="text-body-sm font-light text-muji-light mb-3">하루</div>
              <div className="text-3xl font-normal text-muji-dark mb-2">
                {formatTime(Math.floor(wastedDaily), Math.round((wastedDaily % 1) * 60))}
              </div>
              <div className="text-xs font-light text-muji-mid">불필요했던 시간</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-muji-bg border-1 border-muji-beige p-6 text-center"
            >
              <div className="text-body-sm font-light text-muji-light mb-3">일주일이면</div>
              <div className="text-3xl font-normal text-muji-dark mb-2">
                {formatTime(Math.floor(wastedWeekly), Math.round((wastedWeekly % 1) * 60))}
              </div>
              <div className="text-xs font-light text-muji-mid">7일 × {formatTime(Math.floor(wastedDaily), Math.round((wastedDaily % 1) * 60))}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-muji-bg border-1 border-muji-beige p-6 text-center"
            >
              <div className="text-body-sm font-light text-muji-light mb-3">한 달이면</div>
              <div className="text-3xl font-normal text-muji-dark mb-2">
                {formatTime(Math.floor(wastedMonthly), Math.round((wastedMonthly % 1) * 60))}
              </div>
              <div className="text-xs font-light text-muji-mid">30일 × {formatTime(Math.floor(wastedDaily), Math.round((wastedDaily % 1) * 60))}</div>
            </motion.div>
          </div>

          {/* 핵심 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="bg-muji-beige border-l-2 border-muji-mid p-6 mb-8"
          >
            <p className="text-body font-normal text-muji-dark text-center mb-2">
              한 달에 <span className="text-heading font-normal">{Math.floor(wastedMonthly)}시간</span>을 낭비하고 있습니다
            </p>
            <p className="text-body-sm font-light text-muji-mid text-center">
              이 시간만 줄여도 하루에 <span className="font-normal">{Math.floor(wastedDaily)}시간</span>을 되찾을 수 있습니다
            </p>
          </motion.div>

          {/* 할 수 있는 것들 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3 className="font-normal text-muji-dark mb-6 text-center text-body">
              이 시간이면 한 달 동안...
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {possibleActivities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.05, duration: 0.4 }}
                  className="bg-muji-bg border-1 border-muji-beige p-5 text-center"
                >
                  <div className="text-xl font-normal text-muji-dark mb-2">
                    {item.amount}{item.unit}
                  </div>
                  <div className="text-xs font-light text-muji-mid">{item.activity}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 성찰 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-muji-bg border-1 border-muji-light p-6 mb-8"
          >
            <p className="text-body-sm font-normal text-muji-dark mb-3">
              시간관리가 중요한 이유
            </p>
            <p className="text-body-sm font-light text-muji-mid leading-relaxed">
              지금은 작게 느껴지는 {Math.floor(wastedDaily)}시간이지만,
              <span className="font-normal"> 한 달이면 {Math.floor(wastedMonthly)}시간, 1년이면 {Math.floor(wastedMonthly * 12)}시간</span>이 됩니다.
              이 시간을 내가 정말 하고 싶은 일에 사용한다면,
              <span className="font-normal"> 나의 미래가 완전히 달라질 수 있습니다.</span>
            </p>
          </motion.div>

          <Button onClick={onNext} variant="filled" size="lg" fullWidth>
            <span className="flex items-center justify-center gap-2">
              <span>다음</span>
              <MujiIcon name="arrow" size={18} strokeWidth={2} />
            </span>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default TimeAwareness;
