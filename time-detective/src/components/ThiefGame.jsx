import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_THIEF_CARDS } from '../utils/activities';
import { saveThiefGameData } from '../utils/storage';

const ThiefGame = ({ onComplete, initialData = null }) => {
  const [categories, setCategories] = useState(
    initialData || { red: [], yellow: [], green: [] }
  );
  const [availableCards, setAvailableCards] = useState([...TIME_THIEF_CARDS]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [showResults, setShowResults] = useState(false);

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
    const estimatedTimeWasted = redThieves.length * 30; // 각 시간도둑당 평균 30분 추정

    return {
      topThieves: redThieves.slice(0, 3),
      estimatedTimeWasted,
      message: redThieves.length > 0
        ? `이 ${redThieves.length}가지만 줄여도 하루 ${Math.floor(estimatedTimeWasted / 60)}시간 ${estimatedTimeWasted % 60}분을 되찾을 수 있어요!`
        : '시간도둑을 찾아보세요!',
    };
  };

  const results = analyzeResults();

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-heading-lg font-bold text-muji-charcoal mb-2">
          🔍 시간도둑을 잡아라!
        </h2>
        <p className="text-body text-muji-charcoal opacity-80">
          나의 시간을 훔쳐가는 행동들을 분류해보세요
        </p>
      </motion.div>

      {/* 진행률 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muji-charcoal">
            진행률: {placedCards}/{totalCards}
          </span>
          <span className="text-sm font-medium text-muji-charcoal">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-muji-brown"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 사용 가능한 카드 */}
        <div>
          <h3 className="text-heading font-bold mb-4">시간도둑 카드</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence>
              {availableCards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  draggable
                  onDragStart={() => handleDragStart(card)}
                  className="drag-card"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{card.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-muji-charcoal mb-1">
                        {card.title}
                      </h4>
                      <p className="text-sm text-muji-charcoal opacity-70">
                        {card.description}
                      </p>
                    </div>
                    <div className="text-2xl opacity-30">⋮⋮</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {availableCards.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muji-charcoal opacity-50"
              >
                <p className="text-2xl mb-2">✨</p>
                <p>모든 카드를 분류했어요!</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* 분류 영역 */}
        <div className="space-y-4">
          {/* 빨간 상자 */}
          <div
            onDrop={() => handleDrop('red')}
            onDragOver={handleDragOver}
            className={`drop-zone border-red-300 bg-red-50 ${
              draggedCard ? 'active border-red-500' : ''
            }`}
          >
            <div className="text-center mb-3">
              <h3 className="text-heading font-bold text-red-600 mb-1">
                🔴 많이 빼앗는 도둑
              </h3>
              <p className="text-sm text-red-500 opacity-80">
                내 시간을 가장 많이 훔쳐가는 행동
              </p>
            </div>

            <div className="space-y-2 w-full">
              {categories.red.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm"
                >
                  <span className="text-xl">{card.icon}</span>
                  <span className="flex-1 text-sm font-medium text-muji-charcoal">
                    {card.title}
                  </span>
                  <button
                    onClick={() => removeCard(card, 'red')}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 노란 상자 */}
          <div
            onDrop={() => handleDrop('yellow')}
            onDragOver={handleDragOver}
            className={`drop-zone border-yellow-300 bg-yellow-50 ${
              draggedCard ? 'active border-yellow-500' : ''
            }`}
          >
            <div className="text-center mb-3">
              <h3 className="text-heading font-bold text-yellow-600 mb-1">
                🟡 가끔 빼앗는 도둑
              </h3>
              <p className="text-sm text-yellow-600 opacity-80">
                때때로 시간을 낭비하게 만드는 행동
              </p>
            </div>

            <div className="space-y-2 w-full">
              {categories.yellow.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm"
                >
                  <span className="text-xl">{card.icon}</span>
                  <span className="flex-1 text-sm font-medium text-muji-charcoal">
                    {card.title}
                  </span>
                  <button
                    onClick={() => removeCard(card, 'yellow')}
                    className="text-yellow-600 hover:text-yellow-700 text-xl"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 초록 상자 */}
          <div
            onDrop={() => handleDrop('green')}
            onDragOver={handleDragOver}
            className={`drop-zone border-green-300 bg-green-50 ${
              draggedCard ? 'active border-green-500' : ''
            }`}
          >
            <div className="text-center mb-3">
              <h3 className="text-heading font-bold text-green-600 mb-1">
                🟢 별로 안 빼앗는 도둑
              </h3>
              <p className="text-sm text-green-600 opacity-80">
                시간 낭비가 거의 없는 행동
              </p>
            </div>

            <div className="space-y-2 w-full">
              {categories.green.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm"
                >
                  <span className="text-xl">{card.icon}</span>
                  <span className="flex-1 text-sm font-medium text-muji-charcoal">
                    {card.title}
                  </span>
                  <button
                    onClick={() => removeCard(card, 'green')}
                    className="text-green-600 hover:text-green-700 text-xl"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 결과 보기 버튼 */}
      {placedCards === totalCards && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowResults(!showResults)}
          className="btn-primary w-full mt-8"
        >
          {showResults ? '결과 숨기기' : '결과 보기'}
        </motion.button>
      )}

      {/* 결과 화면 */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mt-8"
          >
            <h3 className="text-heading font-bold mb-6">🎯 분석 결과</h3>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-red-600 mb-4 text-lg">
                🔴 내 시간도둑 TOP {results.topThieves.length}
              </h4>
              <div className="space-y-3">
                {results.topThieves.map((thief, index) => (
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

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
              <p className="text-lg font-bold text-blue-600">
                💡 {results.message}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {categories.red.length}
                </div>
                <div className="text-sm text-red-600">많이 빼앗는 도둑</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {categories.yellow.length}
                </div>
                <div className="text-sm text-yellow-600">가끔 빼앗는 도둑</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {categories.green.length}
                </div>
                <div className="text-sm text-green-600">별로 안 빼앗는 도둑</div>
              </div>
            </div>

            <button
              onClick={() => onComplete(categories, results)}
              className="btn-primary w-full"
            >
              다음 단계로 →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThiefGame;
