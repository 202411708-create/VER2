import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_THIEF_CARDS } from '../utils/activities';
import { saveThiefGameData } from '../utils/storage';
import { Button, MujiIcon } from './ui';

const ThiefGame = ({ onComplete, initialData = null }) => {
  const [categories, setCategories] = useState(
    initialData || { red: [], yellow: [], green: [] }
  );
  const [availableCards, setAvailableCards] = useState([...TIME_THIEF_CARDS]);
  const [draggedCard, setDraggedCard] = useState(null);

  // 자동 저장
  useEffect(() => {
    if (categories.red.length > 0 || categories.yellow.length > 0 || categories.green.length > 0) {
      saveThiefGameData(categories);
    }
  }, [categories]);

  // 카드 드래그 시작
  const handleDragStart = (card) => {
    setDraggedCard(card);
  };

  // 카드 드롭
  const handleDrop = (category) => {
    if (!draggedCard) return;

    // 카드를 사용 가능 목록에서 제거
    setAvailableCards(availableCards.filter(c => c.id !== draggedCard.id));

    // 해당 카테고리에 추가
    setCategories({
      ...categories,
      [category]: [...categories[category], draggedCard],
    });

    setDraggedCard(null);
  };

  // 카드 제거 (다시 사용 가능 목록으로)
  const removeCard = (card, category) => {
    setCategories({
      ...categories,
      [category]: categories[category].filter(c => c.id !== card.id),
    });
    setAvailableCards([...availableCards, card]);
  };

  // 드래그 오버 방지
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 진행률 계산
  const totalCards = TIME_THIEF_CARDS.length;
  const placedCards = categories.red.length + categories.yellow.length + categories.green.length;
  const progress = (placedCards / totalCards) * 100;

  // 결과 분석
  const analyzeResults = () => {
    const redThieves = categories.red;
    const estimatedTimeWasted = redThieves.length * 30;

    return {
      topThieves: redThieves.slice(0, 3),
      estimatedTimeWasted,
      message: redThieves.length > 0
        ? `이 ${redThieves.length}가지만 줄여도 하루 ${Math.floor(estimatedTimeWasted / 60)}시간 ${estimatedTimeWasted % 60}분을 되찾을 수 있습니다.`
        : '시간도둑을 찾아보세요.',
    };
  };

  const handleNext = () => {
    const results = analyzeResults();
    onComplete(categories, results);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 h-full flex flex-col bg-muji-bg">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-heading-lg font-normal text-muji-dark mb-2">
          시간도둑을 잡아라
        </h2>
        <p className="text-body font-light text-muji-light">
          나의 시간을 훔쳐가는 행동들을 분류해보세요
        </p>
      </motion.div>

      {/* 진행률 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-body-sm font-light text-muji-mid">
            진행률: {placedCards}/{totalCards}
          </span>
          <span className="text-body-sm font-light text-muji-mid">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 bg-muji-beige overflow-hidden">
          <motion.div
            className="h-full bg-muji-mid"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* 사용 가능한 카드 */}
        <div className="overflow-hidden flex flex-col">
          <h3 className="text-body font-normal text-muji-dark mb-4">시간도둑 카드</h3>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            <AnimatePresence>
              {availableCards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  draggable
                  onDragStart={() => handleDragStart(card)}
                  className="bg-white border-1 border-muji-beige p-4 cursor-move hover:border-muji-light transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-normal text-muji-dark mb-1 text-body-sm">
                        {card.title}
                      </h4>
                      <p className="text-xs font-light text-muji-mid">
                        {card.description}
                      </p>
                    </div>
                    <div className="text-muji-light opacity-40 font-light">⋮⋮</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {availableCards.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muji-light"
              >
                <MujiIcon name="check" size={32} strokeWidth={1.5} className="mx-auto mb-3" />
                <p className="text-body-sm font-light">모든 카드를 분류했습니다</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* 분류 영역 */}
        <div className="space-y-4 overflow-y-auto">
          {/* 많이 빼앗는 도둑 */}
          <div
            onDrop={() => handleDrop('red')}
            onDragOver={handleDragOver}
            className={`border-1 bg-muji-bg p-4 min-h-[150px] transition-colors ${
              draggedCard ? 'border-muji-mid' : 'border-muji-beige'
            }`}
          >
            <div className="text-center mb-3">
              <h3 className="text-body font-normal text-muji-dark mb-1">
                많이 빼앗는 도둑
              </h3>
              <p className="text-xs font-light text-muji-light">
                내 시간을 가장 많이 훔쳐가는 행동
              </p>
            </div>

            <div className="space-y-2 w-full">
              {categories.red.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-1 border-muji-beige p-3 flex items-center gap-2"
                >
                  <span className="flex-1 text-xs font-light text-muji-dark">
                    {card.title}
                  </span>
                  <button
                    onClick={() => removeCard(card, 'red')}
                    className="text-muji-mid hover:text-muji-dark transition-colors"
                  >
                    <MujiIcon name="close" size={14} strokeWidth={2} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 가끔 빼앗는 도둑 */}
          <div
            onDrop={() => handleDrop('yellow')}
            onDragOver={handleDragOver}
            className={`border-1 bg-muji-bg p-4 min-h-[150px] transition-colors ${
              draggedCard ? 'border-muji-mid' : 'border-muji-beige'
            }`}
          >
            <div className="text-center mb-3">
              <h3 className="text-body font-normal text-muji-dark mb-1">
                가끔 빼앗는 도둑
              </h3>
              <p className="text-xs font-light text-muji-light">
                때때로 시간을 낭비하게 만드는 행동
              </p>
            </div>

            <div className="space-y-2 w-full">
              {categories.yellow.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-1 border-muji-beige p-3 flex items-center gap-2"
                >
                  <span className="flex-1 text-xs font-light text-muji-dark">
                    {card.title}
                  </span>
                  <button
                    onClick={() => removeCard(card, 'yellow')}
                    className="text-muji-mid hover:text-muji-dark transition-colors"
                  >
                    <MujiIcon name="close" size={14} strokeWidth={2} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 별로 안 빼앗는 도둑 */}
          <div
            onDrop={() => handleDrop('green')}
            onDragOver={handleDragOver}
            className={`border-1 bg-muji-bg p-4 min-h-[150px] transition-colors ${
              draggedCard ? 'border-muji-mid' : 'border-muji-beige'
            }`}
          >
            <div className="text-center mb-3">
              <h3 className="text-body font-normal text-muji-dark mb-1">
                별로 안 빼앗는 도둑
              </h3>
              <p className="text-xs font-light text-muji-light">
                시간 낭비가 거의 없는 행동
              </p>
            </div>

            <div className="space-y-2 w-full">
              {categories.green.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-1 border-muji-beige p-3 flex items-center gap-2"
                >
                  <span className="flex-1 text-xs font-light text-muji-dark">
                    {card.title}
                  </span>
                  <button
                    onClick={() => removeCard(card, 'green')}
                    className="text-muji-mid hover:text-muji-dark transition-colors"
                  >
                    <MujiIcon name="close" size={14} strokeWidth={2} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
      {placedCards === totalCards && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Button onClick={handleNext} variant="filled" size="lg" fullWidth>
            <span className="flex items-center justify-center gap-2">
              <span>다음</span>
              <MujiIcon name="arrow" size={18} strokeWidth={2} />
            </span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ThiefGame;
