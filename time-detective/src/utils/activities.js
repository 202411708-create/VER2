// 활동 타입 정의
export const ACTIVITY_TYPES = {
  SLEEP: { id: 'sleep', name: '수면', color: '#4A5568', emoji: '😴' },
  STUDY: { id: 'study', name: '공부', color: '#4299E1', emoji: '📚' },
  MEAL: { id: 'meal', name: '식사', color: '#F6AD55', emoji: '🍽️' },
  SNS: { id: 'sns', name: 'SNS', color: '#ED64A6', emoji: '📱' },
  GAME: { id: 'game', name: '게임', color: '#9F7AEA', emoji: '🎮' },
  EXERCISE: { id: 'exercise', name: '운동', color: '#48BB78', emoji: '⚽' },
  OTHER: { id: 'other', name: '기타', color: '#A0AEC0', emoji: '⭐' },
};

// 시간도둑 카드 데이터
export const TIME_THIEF_CARDS = [
  {
    id: 1,
    title: "알람 끈 후 '딱 5분만 더'",
    description: "이불 속에서 뒹굴기",
    category: 'sleep',
    icon: '😴'
  },
  {
    id: 2,
    title: "잠깐만 확인하려고 했는데...",
    description: "30분이 훌쩍 (SNS/유튜브)",
    category: 'sns',
    icon: '📱'
  },
  {
    id: 3,
    title: "숙제 시작 전",
    description: "책상 정리나 필기구 배치에 몰두하기",
    category: 'study',
    icon: '✏️'
  },
  {
    id: 4,
    title: "그만하기엔 너무 재밌어...",
    description: "게임 한판만 더!",
    category: 'game',
    icon: '🎮'
  },
  {
    id: 5,
    title: "저 배우 이름이 뭐였지?",
    description: "검색하다가 딴길로...",
    category: 'other',
    icon: '🔍'
  },
  {
    id: 6,
    title: "배고프지 않은데도",
    description: "입이 심심해서 간식 찾기",
    category: 'meal',
    icon: '🍪'
  },
  {
    id: 7,
    title: "숙제가 너무 어려워서",
    description: "핸드폰으로 도피",
    category: 'study',
    icon: '😫'
  },
  {
    id: 8,
    title: "친구 문자 온 거 확인하다가",
    description: "대화에 빠지기",
    category: 'sns',
    icon: '💬'
  },
  {
    id: 9,
    title: "TV 틀었더니 재밌는 프로그램이...",
    description: "끝까지 시청",
    category: 'other',
    icon: '📺'
  },
  {
    id: 10,
    title: "잠자기 전",
    description: "'오늘 뭐 했더라?' 멍하니 생각하기",
    category: 'sleep',
    icon: '💭'
  }
];

// 시간 포맷 유틸리티
export const formatTime = (hours, minutes = 0) => {
  let result = '';
  if (hours > 0) {
    result += `${hours}시간`;
  }
  if (minutes > 0) {
    result += ` ${minutes}분`;
  }
  return result || '0분';
};

// 시간 계산 유틸리티
export const calculateDuration = (startHour, endHour) => {
  if (endHour < startHour) {
    return 24 - startHour + endHour;
  }
  return endHour - startHour;
};

// 활동 데이터 검증
export const validateActivityBlock = (block) => {
  return (
    block &&
    block.type &&
    ACTIVITY_TYPES[block.type.toUpperCase()] &&
    typeof block.startHour === 'number' &&
    typeof block.duration === 'number' &&
    block.startHour >= 0 &&
    block.startHour < 24 &&
    block.duration > 0
  );
};
