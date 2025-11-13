# 🕵️ 시간탐정 - ADHD 시간관리 프로그램

> ADHD 학생을 위한 게이미피케이션 기반 시간관리 웹 애플리케이션

## 🚀 빠른 시작

### 로컬 개발
```bash
npm install
npm run dev
# http://localhost:5173
```

### 프로덕션 빌드
```bash
npm run build
npm run preview
# http://localhost:4173
```

---

## 📦 Vercel 배포 (중요!)

### ⚠️ Root Directory 설정 필수

Vercel에 배포할 때 **반드시** Root Directory를 설정해야 합니다:

1. Vercel 대시보드에서 프로젝트 Import
2. **Configure Project** 화면에서:
   ```
   Root Directory: time-detective
   ```
3. Framework Preset은 **Vite** 자동 감지됨

### 설정 안 하면?

❌ **CSS가 로드되지 않음** (하얀 화면 또는 스타일 없는 텍스트만 보임)
❌ 404 에러 발생

### 올바른 설정:

```
Framework: Vite
Root Directory: time-detective ⚠️ 필수!
Build Command: npm run build
Output Directory: dist
```

---

## 🎯 프로그램 소개

### 1회기: 나의 시간 사용 알아보기

- **Module 1**: ⏰ 시간여행 타임라인 (24시간 활동 기록)
- **Module 2**: 🔍 시간도둑 잡기 게임 (시간 낭비 행동 분류)
- **결과**: ✨ 종합 분석 및 성찰 메시지

### 특징

- ✅ ADHD 친화적 디자인
- ✅ 드래그&드롭 인터랙션
- ✅ 즉각적 시각적 피드백
- ✅ LocalStorage 자동 저장
- ✅ 반응형 (모바일/태블릿/PC)

---

## 📚 기술 스택

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- LocalStorage API

---

## 📖 문서

- [상세 사용 가이드](./USAGE.md)
- [설계 문서](../DESIGN.md)
- [Vercel 배포 가이드](../VERCEL_DEPLOY.md)
- [문제 해결](../TROUBLESHOOTING.md)

---

## 🐛 트러블슈팅

### 하얀 화면 또는 스타일 없는 텍스트만 보임

**원인**: Vercel Root Directory 설정 누락

**해결**:
1. Vercel Settings → General
2. Root Directory를 `time-detective`로 설정
3. Redeploy

자세한 내용: [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

---

## 📄 라이선스

Educational and therapeutic purposes

---

**Made with ❤️ for ADHD students**
