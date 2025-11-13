# 🕵️ 시간탐정 - ADHD 시간관리 프로그램 1회기

**ADHD 학생을 위한 인터랙티브 시간관리 프로그램**

## 📖 프로그램 개요

시간탐정은 ADHD 학생이 자신의 시간 사용 습관을 점검하고, 낭비되는 시간을 인식하여 시간관리의 필요성을 깨닫도록 돕는 게이미피케이션 기반 웹 애플리케이션입니다.

### 🎯 목표
- 자신의 하루 시간 사용 패턴 파악
- 시간을 낭비하게 만드는 행동 인식
- 시간관리의 필요성 자각

### 👥 대상
- 시간관리에 어려움을 겪는 ADHD 학생
- 중재 프로그램 1회기 참여자

### ⏱️ 소요 시간
- 약 40-50분

---

## 🎮 프로그램 구성

### Module 1: ⏰ 시간여행 타임라인 (20분)
- 어제 하루를 24시간 타임라인에 기록
- 드래그&드롭으로 활동 블록 배치
- 실시간 시각화 및 통계 분석
- 원형 차트로 시간 사용 비율 확인

### Module 2: 🔍 시간도둑 잡기 게임 (20분)
- 10가지 시간도둑 카드 분류
- 3개 카테고리로 드래그&드롭 (빨강/노랑/초록)
- 나만의 시간도둑 TOP 3 발견
- 되찾을 수 있는 시간 분석

### ✨ 종합 결과 화면
- 시간 사용 패턴 요약
- 시간도둑 분석 결과
- 성찰 메시지
- 데이터 저장/인쇄 기능

---

## 📚 이론적 근거

### 1. 실행기능 이론 (Barkley, 1997)
- ADHD의 시간지각 결손 보완
- 시각적 타임라인으로 추상적 시간 구체화
- 즉각적 피드백으로 작업기억 부담 감소

### 2. 자기조절 이론 (Zimmerman, 2000)
- 예견 → 수행 → 자기성찰 순환 구조
- 자기 모니터링 능력 향상

### 3. 게이미피케이션 이론 (Deterding et al., 2011)
- 즉각적 보상으로 동기부여
- 명확한 목표로 인지부하 감소

### 4. 인지부하 이론 (Sweller, 1988)
- 단순한 UI로 외재적 부하 최소화
- 자동 저장, Undo 기능으로 불안 해소

### 5. 시각적 학습 이론 (Paivio, 1986)
- 이중 부호화 (언어 + 시각)
- 색상 코딩 시스템으로 기억 증진

---

## 🎨 디자인 특징

### 무인양품 스타일
- 미니멀하고 깔끔한 디자인
- 차분한 베이지 톤 색상
- 불필요한 시각적 자극 최소화

### ADHD 친화적 설계
- ✅ 넓은 클릭/터치 영역 (최소 44x44px)
- ✅ 명확한 시각적 피드백
- ✅ 실수 용인 (Undo, 삭제 기능)
- ✅ 자동 저장 (중간 이탈 시에도 데이터 유지)
- ✅ 부드러운 애니메이션 (0.2-0.3초)

---

## 🛠️ 기술 스택

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Storage**: LocalStorage API
- **Deployment**: Vercel / GitHub Pages

---

## 🚀 설치 및 실행

### 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치
```bash
cd time-detective
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

### 빌드
```bash
npm run build
```

### 프리뷰
```bash
npm run preview
```

---

## 📁 프로젝트 구조

```
time-detective/
├── src/
│   ├── components/
│   │   ├── Welcome.jsx          # 시작 화면
│   │   ├── ProgressBar.jsx      # 진행 상황 표시
│   │   ├── Timeline.jsx         # Module 1: 타임라인
│   │   ├── ThiefGame.jsx        # Module 2: 시간도둑 게임
│   │   └── Result.jsx           # 결과 화면
│   ├── utils/
│   │   ├── activities.js        # 활동 데이터 및 유틸리티
│   │   └── storage.js           # LocalStorage 관리
│   ├── App.jsx                  # 메인 앱
│   ├── index.css                # 글로벌 스타일
│   └── main.jsx                 # 엔트리 포인트
├── DESIGN.md                    # 설계 문서
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🎯 사용 방법

### 학생용 가이드

1. **시작하기**
   - '시작하기' 버튼 클릭
   - 안내를 읽고 준비

2. **Module 1: 시간여행 타임라인**
   - 활동 버튼 선택 (수면, 공부, SNS 등)
   - 타임라인을 클릭하여 활동 추가
   - 시간 조정 및 결과 확인

3. **Module 2: 시간도둑 잡기**
   - 카드를 읽고 공감되는 정도에 따라 분류
   - 빨강(많이), 노랑(가끔), 초록(별로) 상자에 드래그
   - 결과 확인

4. **결과 확인**
   - 나의 시간 사용 패턴 분석
   - 시간도둑 TOP 3 확인
   - 데이터 저장 또는 인쇄

### 상담자용 가이드

1. **사전 준비**
   - 프로그램 실행 및 테스트
   - 학생 기기 환경 확인 (PC, 태블릿, 스마트폰)

2. **진행 시**
   - 학생이 직접 조작하도록 격려
   - 막히는 부분이 있으면 안내
   - 정답이 없음을 강조 (솔직하게 기록)

3. **결과 활용**
   - 시간 사용 패턴 함께 분석
   - 시간도둑 행동 구체화
   - 다음 회기 목표 설정에 활용
   - 데이터 저장 권장

---

## 💾 데이터 관리

### 자동 저장
- 모든 활동은 LocalStorage에 자동 저장
- 브라우저를 닫아도 데이터 유지
- 같은 브라우저에서 다시 접속 시 이어하기 가능

### 데이터 내보내기
- JSON 형식으로 저장 가능
- 파일명: `시간탐정_결과_YYYY-MM-DD.json`

### 개인정보 보호
- 모든 데이터는 로컬에만 저장
- 서버 전송 없음
- 학생 개인정보 수집 없음

---

## 🔄 다음 회기 연계

### 2회기 예정
- 1회기 결과 바탕으로 목표 설정
- 시간도둑 대처 전략 수립
- 우선순위 매트릭스 활용

### 3회기 예정
- 실천 계획 수립
- 시간표 작성
- 모니터링 도구 사용법

---

## 📝 참고문헌

- Barkley, R. A. (1997). Behavioral inhibition, sustained attention, and executive functions. *Psychological Bulletin*, 121(1), 65-94.
- Deterding, S., et al. (2011). Gamification: Toward a definition. *CHI 2011 Workshop*.
- Paivio, A. (1986). *Mental representations: A dual coding approach*. Oxford University Press.
- Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science*, 12(2), 257-285.
- Zimmerman, B. J. (2000). Attaining self-regulation. *Handbook of self-regulation*, 13-39.

---

## 📧 문의

프로그램 사용 중 문제가 발생하거나 피드백이 있으시면 이슈를 등록해주세요.

---

## 📄 라이선스

This project is created for educational and therapeutic purposes.

---

**Made with ❤️ for ADHD students**
