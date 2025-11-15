import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_THIEF_CARDS, formatTime } from '../utils/activities';
import { saveThiefGameData } from '../utils/storage';
import { Button, MujiIcon, SectionBox, TimeThiefCard } from './ui';

const ThiefGame = ({ onComplete, initialData = null, suspiciousActivities = [] }) => {
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
    <div className="w-full min-h-screen bg-[#F7F5F0] py-8">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-normal text-[#111111] mb-2">
            시간도둑을 잡아라
          </h2>
          <p className="text-sm font-light text-[#6B6B6B]">
            나의 시간을 훔쳐가는 행동들을 분류해보세요
          </p>
        </motion.div>

        {/* 선택된 의심 활동 표시 */}
        {suspiciousActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <SectionBox
              title="선택한 시간은 어떤 시간도둑과 관련될까?"
              subtitle={`${suspiciousActivities.length}개의 활동을 체크하셨습니다`}
              variant="default"
              padding="default"
            >
              <div className="space-y-2">
                {suspiciousActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 bg-white border border-[#E6E3DD] rounded-[4px]"
                  >
                    <div
                      className="w-3 h-3 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: activity.color }}
                    />
                    <span className="flex-1 font-light text-sm text-[#111111]">
                      {activity.name}
                    </span>
                    <span className="text-xs font-light text-[#6B6B6B]">
                      {formatTime(Math.floor(activity.duration), Math.round((activity.duration % 1) * 60))}
                    </span>
                  </div>
                ))}
              </div>
            </SectionBox>
          </motion.div>
        )}

        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-light text-[#333333]">
              진행률: {placedCards}/{totalCards}
            </span>
            <span className="text-sm font-light text-[#333333]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1 bg-[#E6E3DD] overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-[#333333]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 사용 가능한 카드 */}
          <SectionBox
            title="시간도둑 카드"
            subtitle="카드를 드래그하여 분류해보세요"
            variant="white"
            padding="large"
          >
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              <AnimatePresence>
                {availableCards.map((card) => (
                  <TimeThiefCard
                    key={card.id}
                    card={card}
                    draggable={true}
                    onDragStart={() => handleDragStart(card)}
                    variant="default"
                    showDescription={true}
                  />
                ))}
              </AnimatePresence>

              {availableCards.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-[#6B6B6B]"
                >
                  <MujiIcon name="check" size={32} strokeWidth={1.5} className="mx-auto mb-3" />
                  <p className="text-sm font-light">모든 카드를 분류했습니다</p>
                </motion.div>
              )}
            </div>
          </SectionBox>

          {/* 분류 영역 */}
          <div className="space-y-6">
            {/* 많이 빼앗는 도둑 */}
            <SectionBox
              title="많이 빼앗는 도둑"
              subtitle="내 시간을 가장 많이 훔쳐가는 행동"
              variant="default"
              padding="large"
            >
              <div
                onDrop={() => handleDrop('red')}
                onDragOver={handleDragOver}
                className={`
                  min-h-[120px]
                  p-4
                  border-2 border-dashed
                  rounded-[4px]
                  transition-colors
                  ${draggedCard ? 'border-[#333333] bg-[#FAF9F5]' : 'border-[#E6E3DD] bg-transparent'}
                `}
              >
                <div className="space-y-2">
                  {categories.red.map((card) => (
                    <TimeThiefCard
                      key={card.id}
                      card={card}
                      variant="placed"
                      showDescription={false}
                      onRemove={() => removeCard(card, 'red')}
                    />
                  ))}
                  {categories.red.length === 0 && (
                    <p className="text-center text-xs font-light text-[#6B6B6B] py-8">
                      카드를 여기에 드래그하세요
                    </p>
                  )}
                </div>
              </div>
            </SectionBox>

            {/* 가끔 빼앗는 도둑 */}
            <SectionBox
              title="가끔 빼앗는 도둑"
              subtitle="때때로 시간을 낭비하게 만드는 행동"
              variant="default"
              padding="large"
            >
              <div
                onDrop={() => handleDrop('yellow')}
                onDragOver={handleDragOver}
                className={`
                  min-h-[120px]
                  p-4
                  border-2 border-dashed
                  rounded-[4px]
                  transition-colors
                  ${draggedCard ? 'border-[#333333] bg-[#FAF9F5]' : 'border-[#E6E3DD] bg-transparent'}
                `}
              >
                <div className="space-y-2">
                  {categories.yellow.map((card) => (
                    <TimeThiefCard
                      key={card.id}
                      card={card}
                      variant="placed"
                      showDescription={false}
                      onRemove={() => removeCard(card, 'yellow')}
                    />
                  ))}
                  {categories.yellow.length === 0 && (
                    <p className="text-center text-xs font-light text-[#6B6B6B] py-8">
                      카드를 여기에 드래그하세요
                    </p>
                  )}
                </div>
              </div>
            </SectionBox>

            {/* 별로 안 빼앗는 도둑 */}
            <SectionBox
              title="별로 안 빼앗는 도둑"
              subtitle="시간 낭비가 거의 없는 행동"
              variant="default"
              padding="large"
            >
              <div
                onDrop={() => handleDrop('green')}
                onDragOver={handleDragOver}
                className={`
                  min-h-[120px]
                  p-4
                  border-2 border-dashed
                  rounded-[4px]
                  transition-colors
                  ${draggedCard ? 'border-[#333333] bg-[#FAF9F5]' : 'border-[#E6E3DD] bg-transparent'}
                `}
              >
                <div className="space-y-2">
                  {categories.green.map((card) => (
                    <TimeThiefCard
                      key={card.id}
                      card={card}
                      variant="placed"
                      showDescription={false}
                      onRemove={() => removeCard(card, 'green')}
                    />
                  ))}
                  {categories.green.length === 0 && (
                    <p className="text-center text-xs font-light text-[#6B6B6B] py-8">
                      카드를 여기에 드래그하세요
                    </p>
                  )}
                </div>
              </div>
            </SectionBox>
          </div>
        </div>

        {/* 다음 버튼 */}
        {placedCards === totalCards && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
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
    </div>
  );
};

export default ThiefGame;
