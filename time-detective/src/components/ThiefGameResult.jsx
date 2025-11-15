import { motion } from 'framer-motion';
import { Button, Card, MujiIcon } from './ui';

const ThiefGameResult = ({ categories, results, onNext }) => {
  return (
    <div className="h-full flex items-center justify-center px-6 bg-muji-bg overflow-auto py-8">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-normal text-muji-dark mb-2">
            시간도둑 분석 결과
          </h2>
          <p className="text-body-sm font-light text-muji-light">
            나의 시간을 빼앗는 행동들을 확인해보세요
          </p>
        </motion.div>

        <Card variant="default" padding="lg">
          <div className="border-l-2 border-muji-mid bg-muji-bg p-6 mb-6">
            <h4 className="font-normal text-muji-dark mb-4 text-body flex items-center gap-2">
              <MujiIcon name="detective" size={20} strokeWidth={2} />
              <span>내 시간도둑 TOP {results.topThieves.length}</span>
            </h4>
            <div className="space-y-3">
              {results.topThieves.map((thief, index) => (
                <div
                  key={thief.id}
                  className="bg-white border-1 border-muji-beige p-4 flex items-start gap-4"
                >
                  <div className="text-lg font-normal text-muji-mid min-w-[24px]">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-normal text-muji-dark text-body mb-1">
                      {thief.title}
                    </h5>
                    <p className="text-body-sm font-light text-muji-light">
                      {thief.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-1 border-muji-light bg-muji-bg p-6 mb-6">
            <p className="text-body-sm font-light text-muji-mid">
              {results.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-6 bg-muji-bg border-1 border-muji-beige">
              <div className="text-2xl font-normal text-muji-dark mb-2">
                {categories.high.length}
              </div>
              <div className="text-xs font-light text-muji-mid">시간을 많이 빼앗겨요</div>
            </div>
            <div className="text-center p-6 bg-muji-bg border-1 border-muji-beige">
              <div className="text-2xl font-normal text-muji-dark mb-2">
                {categories.low.length}
              </div>
              <div className="text-xs font-light text-muji-mid">별로 빼앗기지 않아요</div>
            </div>
          </div>

          <Button
            onClick={onNext}
            variant="filled"
            size="lg"
            fullWidth
          >
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

export default ThiefGameResult;
