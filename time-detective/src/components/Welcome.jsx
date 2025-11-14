import { motion } from 'framer-motion';
import { Button, Card, MujiIcon } from './ui';

const Welcome = ({ onStart, onContinue, hasSavedProgress, savedStep }) => {
  return (
    <div className="h-full flex items-center justify-center px-6 bg-muji-bg">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          {/* 타이틀 */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MujiIcon name="detective" size={48} strokeWidth={1.5} className="text-muji-mid" />
              <h1 className="text-5xl font-light text-muji-dark tracking-tight">
                시간탐정
              </h1>
            </div>
            <p className="text-xl font-light text-muji-light">
              나의 시간을 찾아라
            </p>
          </motion.div>

          {/* 설명 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <Card variant="beige" padding="lg">
              <h2 className="text-xl font-normal mb-4 text-muji-dark">
                안녕하세요
              </h2>
              <p className="text-body mb-4 text-muji-mid font-light">
                이 프로그램은 나의 시간 사용 습관을 알아보는 시간입니다.
              </p>
              <p className="text-body text-muji-mid font-light">
                게임처럼 재미있게 참여하면서, 내가 하루를 어떻게 보내는지, 어떤 행동들이 시간을 빼앗아 가는지 발견할 수 있습니다.
              </p>
            </Card>
          </motion.div>

          {/* 미션 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <Card variant="default" padding="lg">
              <h3 className="text-xl font-normal mb-6 text-muji-dark">
                오늘의 미션
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-muji-bg border-1 border-muji-beige">
                  <div className="mb-3">
                    <MujiIcon name="clock" size={32} strokeWidth={1.5} className="text-muji-mid" />
                  </div>
                  <h4 className="font-normal text-body mb-2 text-muji-dark">
                    미션 1: 시간여행 타임라인
                  </h4>
                  <p className="text-body-sm font-light text-muji-light">
                    어제 하루를 돌아보며 시간대별로 활동을 기록합니다
                  </p>
                </div>

                <div className="p-6 bg-muji-bg border-1 border-muji-beige">
                  <div className="mb-3">
                    <MujiIcon name="detective" size={32} strokeWidth={1.5} className="text-muji-mid" />
                  </div>
                  <h4 className="font-normal text-body mb-2 text-muji-dark">
                    미션 2: 시간도둑 잡기
                  </h4>
                  <p className="text-body-sm font-light text-muji-light">
                    나의 시간을 훔쳐가는 행동들을 찾아 분류합니다
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 안내 사항 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <Card variant="outline" padding="lg">
              <h4 className="font-normal text-muji-dark mb-4 flex items-center gap-2 text-body">
                <span className="text-muji-mid">참여 방법</span>
              </h4>
              <ul className="text-left space-y-3 text-body-sm font-light text-muji-mid grid md:grid-cols-2 gap-x-6 gap-y-3">
                <li className="flex items-start gap-3">
                  <MujiIcon name="check" size={16} strokeWidth={2} className="flex-shrink-0 mt-1 text-muji-mid" />
                  <span>정답이 없습니다. 솔직하게 나의 하루를 기록해주세요</span>
                </li>
                <li className="flex items-start gap-3">
                  <MujiIcon name="check" size={16} strokeWidth={2} className="flex-shrink-0 mt-1 text-muji-mid" />
                  <span>드래그하고 클릭하면서 재미있게 참여하세요</span>
                </li>
                <li className="flex items-start gap-3">
                  <MujiIcon name="check" size={16} strokeWidth={2} className="flex-shrink-0 mt-1 text-muji-mid" />
                  <span>실수해도 괜찮습니다. 언제든지 수정할 수 있습니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <MujiIcon name="check" size={16} strokeWidth={2} className="flex-shrink-0 mt-1 text-muji-mid" />
                  <span>자동으로 저장되니 걱정하지 않아도 됩니다</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* 시작/이어하기 버튼 */}
          {hasSavedProgress ? (
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  onClick={onContinue}
                  variant="filled"
                  size="lg"
                  className="min-w-[200px]"
                >
                  <span className="flex items-center gap-2">
                    <span>이어하기</span>
                    <MujiIcon name="arrow" size={18} strokeWidth={2} />
                  </span>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  onClick={onStart}
                  variant="secondary"
                  size="lg"
                  className="min-w-[200px]"
                >
                  <span className="flex items-center gap-2">
                    <span>처음부터 시작</span>
                    <MujiIcon name="restart" size={18} strokeWidth={2} />
                  </span>
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex justify-center"
            >
              <Button
                onClick={onStart}
                variant="filled"
                size="lg"
                className="min-w-[240px]"
              >
                <span className="flex items-center gap-2">
                  <span>시작하기</span>
                  <MujiIcon name="play" size={18} strokeWidth={2} />
                </span>
              </Button>
            </motion.div>
          )}

          {/* 소요 시간 안내 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 text-body-sm font-light text-muji-light"
          >
            {hasSavedProgress ? `이전에 진행한 내용이 있습니다` : '예상 소요 시간: 약 40-50분'}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
