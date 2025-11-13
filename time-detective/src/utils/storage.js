// LocalStorage 키 상수
const STORAGE_KEYS = {
  TIMELINE_DATA: 'timeDetective_timeline',
  THIEF_GAME_DATA: 'timeDetective_thiefGame',
  SESSION_DATA: 'timeDetective_session',
};

// 타임라인 데이터 저장
export const saveTimelineData = (activities) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMELINE_DATA, JSON.stringify(activities));
    return true;
  } catch (error) {
    console.error('타임라인 데이터 저장 실패:', error);
    return false;
  }
};

// 타임라인 데이터 불러오기
export const loadTimelineData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TIMELINE_DATA);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('타임라인 데이터 불러오기 실패:', error);
    return [];
  }
};

// 시간도둑 게임 데이터 저장
export const saveThiefGameData = (gameData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THIEF_GAME_DATA, JSON.stringify(gameData));
    return true;
  } catch (error) {
    console.error('시간도둑 게임 데이터 저장 실패:', error);
    return false;
  }
};

// 시간도둑 게임 데이터 불러오기
export const loadThiefGameData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.THIEF_GAME_DATA);
    return data ? JSON.parse(data) : { red: [], yellow: [], green: [] };
  } catch (error) {
    console.error('시간도둑 게임 데이터 불러오기 실패:', error);
    return { red: [], yellow: [], green: [] };
  }
};

// 세션 데이터 저장 (현재 진행 단계 등)
export const saveSessionData = (sessionData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify({
      ...sessionData,
      lastUpdated: new Date().toISOString(),
    }));
    return true;
  } catch (error) {
    console.error('세션 데이터 저장 실패:', error);
    return false;
  }
};

// 세션 데이터 불러오기
export const loadSessionData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
    return data ? JSON.parse(data) : { currentStep: 0 };
  } catch (error) {
    console.error('세션 데이터 불러오기 실패:', error);
    return { currentStep: 0 };
  }
};

// 모든 데이터 초기화
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('데이터 초기화 실패:', error);
    return false;
  }
};

// 데이터 내보내기 (JSON)
export const exportData = () => {
  try {
    const allData = {
      timeline: loadTimelineData(),
      thiefGame: loadThiefGameData(),
      session: loadSessionData(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(allData, null, 2);
  } catch (error) {
    console.error('데이터 내보내기 실패:', error);
    return null;
  }
};
