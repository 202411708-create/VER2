# 🚀 Vercel 배포 가이드

## 방법 1: GitHub 연동 (권장, 가장 쉬움)

### 1단계: Vercel 계정 생성
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. **"Continue with GitHub"** 선택 (GitHub 계정으로 가입)

### 2단계: 프로젝트 임포트
1. Vercel 대시보드에서 **"Add New Project"** 클릭
2. **"Import Git Repository"** 선택
3. GitHub 레포지토리 연결 허용
4. `VER2` 레포지토리 검색 및 선택
5. **"Import"** 클릭

### 3단계: 프로젝트 설정
- **Framework Preset**: `Vite` (자동 감지됨)
- **Root Directory**: `time-detective` ⚠️ **중요!**
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `dist` (자동 설정됨)
- **Install Command**: `npm install` (자동 설정됨)

### 4단계: 배포
1. **"Deploy"** 버튼 클릭
2. 2-3분 대기 (빌드 및 배포)
3. 완료되면 배포 URL 확인 (예: `https://adhd-time-detective.vercel.app`)

### 5단계: 자동 배포 설정 (완료!)
- 이제 GitHub에 푸시할 때마다 자동으로 배포됩니다
- `claude/adhd-time-detective-session1-0153ESGoGX3DNQdpaNr6LnhL` 브랜치 푸시 → 자동 배포

---

## 방법 2: Vercel CLI (터미널)

### 사전 준비
```bash
# Vercel CLI 설치 (이미 완료)
npm install -g vercel

# 프로젝트 디렉토리로 이동
cd /home/user/VER2/time-detective
```

### 로그인
```bash
vercel login
```
- 이메일 입력
- 이메일로 받은 확인 링크 클릭

### 첫 배포
```bash
vercel
```
- 프로젝트 설정 질문에 답변:
  - Set up and deploy? → **Y**
  - Which scope? → 본인 계정 선택
  - Link to existing project? → **N**
  - Project name? → `adhd-time-detective` (또는 원하는 이름)
  - In which directory? → `.` (현재 디렉토리)
  - Override settings? → **N**

### 프로덕션 배포
```bash
vercel --prod
```

---

## 배포 확인

배포가 완료되면 다음과 같은 URL을 받습니다:

**Preview URL** (브랜치별):
```
https://adhd-time-detective-xxx.vercel.app
```

**Production URL** (메인):
```
https://adhd-time-detective.vercel.app
```

---

## 환경 변수 설정 (필요시)

Vercel 대시보드에서:
1. 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 변수 추가 (예: `VITE_API_KEY`)

---

## 커스텀 도메인 설정 (선택)

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Domains**
3. 도메인 추가 (예: `time-detective.example.com`)
4. DNS 설정 안내 따라하기

---

## 자동 배포 흐름

```
GitHub 푸시 → Vercel 자동 감지 → 빌드 → 배포 → 배포 완료
```

**브랜치별 배포**:
- `main` 브랜치 → Production
- 다른 브랜치 → Preview (고유 URL)

---

## 트러블슈팅

### Root Directory 오류
- Vercel 설정에서 **Root Directory**를 `time-detective`로 설정

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build

# 빌드 성공하면 Vercel에서도 성공
```

### 환경 변수 오류
- Vercel 대시보드에서 환경 변수 확인
- 변수명은 `VITE_`로 시작해야 함 (Vite 프로젝트)

---

## 배포 후 확인 사항

✅ 페이지가 제대로 로드되는가?
✅ 모든 기능이 작동하는가?
✅ 모바일에서도 잘 보이는가?
✅ 타임라인 드래그&드롭이 작동하는가?
✅ LocalStorage 저장이 되는가?

---

## 유용한 명령어

```bash
# 배포 목록 확인
vercel ls

# 최신 배포 URL 확인
vercel inspect

# 로그 확인
vercel logs

# 배포 롤백
vercel rollback
```

---

## 📊 배포 분석

Vercel은 자동으로 다음을 제공합니다:
- 🚀 **Analytics**: 방문자 통계
- ⚡ **Performance**: 로딩 속도 분석
- 🐛 **Error Tracking**: 에러 모니터링
- 📈 **Web Vitals**: 성능 지표

---

## 💡 팁

1. **브랜치별 배포**: 각 브랜치마다 고유 URL 생성
2. **미리보기**: PR 생성 시 자동 미리보기 링크 생성
3. **빠른 롤백**: 문제 발생 시 이전 버전으로 즉시 롤백
4. **무료 플랜**: 개인 프로젝트는 무료로 충분

---

**GitHub + Vercel = 최고의 조합! 🚀**
