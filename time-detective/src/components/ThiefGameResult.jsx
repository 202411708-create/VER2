import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button, Card, MujiIcon } from './ui';

const ThiefGameResult = ({ categories, results, onNext }) => {
  const [rankedThieves, setRankedThieves] = useState([]);
  const [isRankingComplete, setIsRankingComplete] = useState(false);

  // "시간을 많이 빼앗겨요"에 분류한 항목들을 초기화
  useEffect(() => {
    if (categories.high && categories.high.length > 0) {
      setRankedThieves(categories.high);
      // 3개 이하면 순위 정하기 불필요
      if (categories.high.length <= 3) {
        setIsRankingComplete(true);
      }
    }
  }, [categories.high]);

  // 순위 확정
  const handleConfirmRanking = () => {
    setIsRankingComplete(true);
  };

  // 추정 시간 낭비 계산
  const estimatedTimeWasted = rankedThieves.slice(0, 3).length * 30;

  return (
    <div className="h-full flex items-center justify-center px-6 bg-muji-bg overflow-auto py-8">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-normal text-muji-dark mb-2">
            시간도둑 우선순위 정하기
          </h2>
          <p className="text-body-sm font-light text-muji-light">
            {isRankingComplete
              ? '우선순위가 정해졌습니다. 이 시간도둑들을 줄여나가봅시다.'
              : '가장 줄이고 싶은 순서대로 드래그하여 정렬해주세요'}
          </p>
        </motion.div>

        <Card variant="default" padding="lg">
          {rankedThieves.length === 0 ? (
            <div className="text-center py-12">
              <MujiIcon name="check" size={32} strokeWidth={1.5} className="mx-auto mb-3 text-muji-mid" />
              <p className="text-body-sm font-light text-muji-mid">
                "시간을 많이 빼앗겨요"에 분류한 항목이 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div className="border-l-2 border-muji-mid bg-muji-bg p-6 mb-6">
                <h4 className="font-normal text-muji-dark mb-2 text-body flex items-center gap-2">
                  <MujiIcon name="detective" size={20} strokeWidth={2} />
                  <span>시간을 많이 빼앗기는 행동 ({rankedThieves.length}개)</span>
                </h4>
                {!isRankingComplete && rankedThieves.length > 3 && (
                  <p className="text-body-sm font-light text-muji-mid mb-4">
                    드래그하여 순서를 바꿀 수 있습니다
                  </p>
                )}

                {isRankingComplete ? (
                  // 순위 확정 후 - 일반 목록
                  <div className="space-y-3 mt-4">
                    {rankedThieves.map((thief, index) => (
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
                ) : (
                  // 순위 정하기 전 - 드래그 가능한 목록
                  <Reorder.Group
                    axis="y"
                    values={rankedThieves}
                    onReorder={setRankedThieves}
                    className="space-y-3 mt-4"
                  >
                    {rankedThieves.map((thief, index) => (
                      <Reorder.Item
                        key={thief.id}
                        value={thief}
                        className="bg-white border-1 border-muji-beige p-4 flex items-start gap-4 cursor-move hover:border-muji-mid transition-colors"
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
                        <MujiIcon name="arrow" size={20} strokeWidth={1.5} className="text-muji-light rotate-90" />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}
              </div>

              {isRankingComplete && rankedThieves.length > 0 && (
                <div className="border-1 border-muji-light bg-muji-bg p-6 mb-6">
                  <p className="text-body-sm font-light text-muji-mid">
                    {rankedThieves.length >= 3
                      ? `상위 ${Math.min(3, rankedThieves.length)}가지만 줄여도 하루 ${Math.floor(estimatedTimeWasted / 60)}시간 ${estimatedTimeWasted % 60}분을 되찾을 수 있습니다.`
                      : rankedThieves.length > 0
                      ? `이 ${rankedThieves.length}가지 시간도둑을 줄여나가봅시다.`
                      : '시간도둑을 찾아보세요.'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
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

              {!isRankingComplete && rankedThieves.length > 3 ? (
                <Button
                  onClick={handleConfirmRanking}
                  variant="filled"
                  size="lg"
                  fullWidth
                >
                  <span className="flex items-center justify-center gap-2">
                    <MujiIcon name="check" size={18} strokeWidth={2} />
                    <span>순위 확정하기</span>
                  </span>
                </Button>
              ) : (
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
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ThiefGameResult;
