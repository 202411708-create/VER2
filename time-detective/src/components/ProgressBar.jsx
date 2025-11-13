import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const steps = [
    { name: '시작', icon: '🎯' },
    { name: '시간여행', icon: '⏰' },
    { name: '시간도둑', icon: '🔍' },
    { name: '결과', icon: '✨' },
  ];

  return (
    <div className="w-full mb-8">
      {/* 프로그레스 바 */}
      <div className="relative h-2 bg-white rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute left-0 top-0 h-full bg-muji-brown"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* 단계 표시 */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-1 ${
              index <= currentStep ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                index <= currentStep
                  ? 'bg-muji-brown text-white'
                  : 'bg-white text-muji-charcoal'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {step.icon}
            </motion.div>
            <span className="text-xs font-medium text-muji-charcoal">
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
