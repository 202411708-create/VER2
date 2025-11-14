import { motion } from 'framer-motion';
import { MujiIcon } from './ui';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const steps = [
    { name: '시작', icon: 'play' },
    { name: '시간여행', icon: 'clock' },
    { name: '시간도둑', icon: 'detective' },
    { name: '결과', icon: 'check' },
  ];

  return (
    <div className="w-full">
      {/* 프로그레스 바 */}
      <div className="relative h-1 bg-muji-beige overflow-hidden mb-6">
        <motion.div
          className="absolute left-0 top-0 h-full bg-muji-mid"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* 단계 표시 */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${
              index <= currentStep ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <motion.div
              className={`w-10 h-10 border-1 flex items-center justify-center transition-colors duration-300 ${
                index <= currentStep
                  ? 'bg-muji-mid border-muji-mid text-white'
                  : 'bg-transparent border-muji-light text-muji-light'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <MujiIcon
                name={step.icon}
                size={20}
                strokeWidth={2}
                className={index <= currentStep ? 'text-white' : 'text-muji-light'}
              />
            </motion.div>
            <span className={`text-xs font-light transition-colors duration-300 ${
              index <= currentStep ? 'text-muji-dark' : 'text-muji-light'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
