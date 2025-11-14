import { motion } from 'framer-motion';

const ThiefGameResult = ({ categories, results, onNext }) => {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-muji-charcoal mb-1">
            🎯 시간도둑 분석 결과
          </h2>
          <p className="text-sm text-muji-charcoal opacity-80">
            나의 시간을 빼앗는 행동들을 확인해보세요
          </p>
        </motion.div>

        <div className="card">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-4">
            <h4 className="font-bold text-red-600 mb-3 text-base">
              🔴 내 시간도둑 TOP {results.topThieves.length}
            </h4>
            <div className="space-y-2">
              {results.topThieves.map((thief, index) => (
                <div
                  key={thief.id}
                  className="bg-white p-3 rounded-lg flex items-start gap-2"
                >
                  <div className="text-xl font-bold text-red-500">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xl">{thief.icon}</span>
                      <h5 className="font-bold text-muji-charcoal text-sm">
                        {thief.title}
                      </h5>
                    </div>
                    <p className="text-xs text-muji-charcoal opacity-70">
                      {thief.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg mb-4">
            <p className="text-sm font-bold text-blue-600">
              💡 {results.message}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {categories.red.length}
              </div>
              <div className="text-xs text-red-600">많이 빼앗는 도둑</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {categories.yellow.length}
              </div>
              <div className="text-xs text-yellow-600">가끔 빼앗는 도둑</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {categories.green.length}
              </div>
              <div className="text-xs text-green-600">별로 안 빼앗는 도둑</div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="btn-primary w-full"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThiefGameResult;
