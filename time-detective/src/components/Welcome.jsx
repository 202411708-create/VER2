import { motion } from 'framer-motion';

const Welcome = ({ onStart }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* 타이틀 */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-muji-charcoal mb-4">
            🕵️ 시간탐정 게임
          </h1>
          <p className="text-xl text-muji-charcoal opacity-80">
            나의 시간을 찾아라!
          </p>
        </motion.div>

        {/* 설명 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8 text-left"
        >
          <h2 className="text-heading font-bold mb-4 text-muji-charcoal">
            👋 안녕하세요!
          </h2>
          <p className="text-body-lg mb-4 leading-relaxed text-muji-charcoal">
            이 프로그램은 <strong className="text-muji-brown">나의 시간 사용 습관</strong>을 알아보는 시간이에요.
          </p>
          <p className="text-body-lg mb-4 leading-relaxed text-muji-charcoal">
            게임처럼 재미있게 참여하면서, 내가 하루를 어떻게 보내는지,
            어떤 행동들이 시간을 빼앗아 가는지 발견할 수 있어요.
          </p>
        </motion.div>

        {/* 미션 소개 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card mb-8"
        >
          <h3 className="text-heading font-bold mb-6 text-muji-charcoal">
            🎯 오늘의 미션
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 미션 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-muji-beige rounded-lg"
            >
              <div className="text-4xl mb-3">⏰</div>
              <h4 className="font-bold text-lg mb-2 text-muji-charcoal">
                미션 1: 시간여행 타임라인
              </h4>
              <p className="text-sm text-muji-charcoal opacity-80">
                어제 하루를 돌아보며 시간대별로 활동을 기록해요
              </p>
            </motion.div>

            {/* 미션 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-muji-beige rounded-lg"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="font-bold text-lg mb-2 text-muji-charcoal">
                미션 2: 시간도둑 잡기
              </h4>
              <p className="text-sm text-muji-charcoal opacity-80">
                나의 시간을 훔쳐가는 행동들을 찾아 분류해요
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* 안내 사항 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8"
        >
          <h4 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>참여 방법</span>
          </h4>
          <ul className="text-left space-y-2 text-sm text-blue-600">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">✓</span>
              <span>정답이 없어요. 솔직하게 나의 하루를 기록해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">✓</span>
              <span>드래그하고 클릭하면서 재미있게 참여해요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">✓</span>
              <span>실수해도 괜찮아요. 언제든지 수정할 수 있어요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">✓</span>
              <span>자동으로 저장되니 걱정하지 않아도 돼요</span>
            </li>
          </ul>
        </motion.div>

        {/* 시작 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="btn-primary w-full md:w-auto px-12 py-4 text-lg"
        >
          시작하기 🚀
        </motion.button>

        {/* 소요 시간 안내 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 text-sm text-muji-charcoal opacity-60"
        >
          예상 소요 시간: 약 40-50분
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Welcome;
