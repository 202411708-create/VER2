# 🔧 하얀 화면 문제 해결 가이드

## 증상
Vercel 배포 후 https://ver-2-beige.vercel.app/ 접속 시 하얀 화면만 나타남

---

## 해결 방법

### 1️⃣ 브라우저 콘솔 확인 (가장 중요!)

1. **개발자 도구 열기**:
   - Windows/Linux: `F12` 또는 `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

2. **Console 탭 선택**

3. **에러 메시지 확인**:
   - 빨간색 에러가 있나요?
   - 404 에러가 있나요?
   - 어떤 파일을 찾을 수 없다고 나오나요?

**흔한 에러들**:
```
❌ Failed to load module script
❌ 404 /assets/index-xxx.js
❌ Uncaught ReferenceError
❌ Failed to fetch dynamically imported module
```

---

### 2️⃣ Vercel 배포 상태 확인

1. https://vercel.com/dashboard 접속
2. `ver-2` 프로젝트 클릭
3. **Deployments** 탭
4. 최신 배포 상태 확인:
   - 🟢 **Ready** → 배포 완료
   - 🔴 **Error** → 배포 실패
   - 🟡 **Building** → 아직 진행 중

**배포가 완료될 때까지 2-3분 대기**

---

### 3️⃣ 하드 리프레시 (캐시 무시)

브라우저 캐시가 문제일 수 있습니다:

- **Windows/Linux**: `Ctrl + Shift + R` 또는 `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

---

### 4️⃣ 시크릿 모드로 테스트

1. **시크릿/비공개 모드 열기**:
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`
   - Safari: `Cmd + Shift + N`

2. https://ver-2-beige.vercel.app/ 접속

3. 정상 작동하면 → 브라우저 캐시 문제
4. 여전히 하얀 화면 → 다른 문제

---

### 5️⃣ Vercel 프로젝트 설정 확인

#### Root Directory 설정 확인:

1. Vercel 대시보드 → `ver-2` 프로젝트
2. **Settings** → **General**
3. **Root Directory** 섹션:
   ```
   time-detective  ← 반드시 이렇게!
   ```
4. 잘못되어 있다면 **Edit** → 수정 → **Save**
5. **Deployments** → 최신 배포 → **Redeploy**

---

### 6️⃣ Vercel 로그 확인

1. Vercel 대시보드 → **Deployments**
2. 최신 배포 클릭
3. **Building** 탭 → 빌드 로그 확인
4. **Function Logs** 탭 → 런타임 에러 확인

**에러가 있다면 메시지 복사**

---

## 🔍 흔한 원인과 해결

### 원인 1: Root Directory 설정 누락
**증상**: 404 에러, 파일을 찾을 수 없음
**해결**: Vercel Settings에서 Root Directory를 `time-detective`로 설정

### 원인 2: 빌드 실패
**증상**: Vercel 배포 상태가 Error
**해결**: Vercel 로그 확인 후 에러 수정

### 원인 3: 브라우저 캐시
**증상**: 이전 버전이 계속 보임
**해결**: Hard Refresh (`Ctrl + Shift + R`)

### 원인 4: JavaScript 에러
**증상**: 콘솔에 빨간색 에러
**해결**: 에러 메시지에 따라 코드 수정

### 원인 5: 환경 변수 문제
**증상**: API 호출 실패, undefined 에러
**해결**: Vercel Settings → Environment Variables 확인

---

## ✅ 로컬에서 프로덕션 빌드 테스트

배포 전에 로컬에서 테스트:

```bash
cd /home/user/VER2/time-detective

# 빌드
npm run build

# 프리뷰 (프로덕션 모드)
npm run preview
```

http://localhost:4173/ 접속하여 확인

정상 작동하면 → Vercel 설정 문제
에러 발생하면 → 코드 문제

---

## 🆘 여전히 해결 안 되면

다음 정보를 공유해주세요:

1. **브라우저 콘솔 에러 메시지** (스크린샷 또는 텍스트)
2. **Vercel 배포 로그** (에러 부분)
3. **Vercel Settings → General** 스크린샷
4. **로컬 preview 결과** (http://localhost:4173/)

---

## 📞 빠른 체크리스트

- [ ] Vercel 배포 상태가 "Ready" (초록색)
- [ ] Root Directory = `time-detective`
- [ ] 브라우저 Hard Refresh 시도
- [ ] 시크릿 모드에서 테스트
- [ ] 브라우저 콘솔에 에러 없음
- [ ] 로컬 `npm run preview` 정상 작동

---

**대부분의 경우 Root Directory 설정이나 브라우저 캐시 문제입니다!**
