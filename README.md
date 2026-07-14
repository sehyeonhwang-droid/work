# 업무 로그 — 설치 가이드 (아무것도 몰라도 따라할 수 있어요)

이 프로젝트는 파일이 4개예요.

- `index.html` — 화면 (대시보드, 업무 로그, 주간 뷰 등)
- `api/data.js` — 데이터를 안전하게 저장/불러오는 심부름꾼 (서버에서만 실행됨)
- `data.json` — 실제 업무 데이터가 저장되는 파일
- `package.json` — Vercel이 프로젝트를 알아보게 해주는 설정 파일

## 1단계. GitHub에 저장소 만들기

1. https://github.com 가입 (이미 있으면 패스)
2. 오른쪽 위 `+` → `New repository` 클릭
3. 이름 예: `my-worklog` (Private 추천 — 업무 내용이니까요)
4. `Create repository` 클릭

## 2단계. 이 4개 파일을 저장소에 올리기

1. 방금 만든 저장소 페이지에서 `Add file` → `Upload files` 클릭
2. `index.html`, `data.json`, `package.json` 파일을 통째로 끌어다 놓기
3. `api` 폴더는 통째로 끌어다 놓으면 안에 있는 `data.js`까지 자동으로 올라가요
   (안 되면 `Add file` → `Create new file` → 파일 이름에 `api/data.js`라고 입력하면 폴더가 자동 생성돼요)
4. 아래 `Commit changes` 버튼 클릭

## 3단계. GitHub 열쇠(토큰) 만들기

이건 "이 저장소의 data.json 파일만 수정할 수 있는" 열쇠예요.

1. GitHub 오른쪽 위 내 프로필 사진 클릭 → `Settings`
2. 왼쪽 맨 아래 `Developer settings` 클릭
3. `Personal access tokens` → `Fine-grained tokens` → `Generate new token`
4. 이름: 아무거나 (예: worklog-token)
5. `Repository access` → `Only select repositories` → 아까 만든 `my-worklog` 선택
6. `Permissions` → `Repository permissions` → `Contents` → `Read and write`로 변경
7. `Generate token` 클릭
8. **화면에 뜨는 토큰(ghp_로 시작하는 긴 문자열)을 지금 바로 복사해서 메모장에 붙여넣어두세요.**
   (이 화면을 나가면 다시 볼 수 없어요!)

## 4단계. Vercel에 배포하기

1. https://vercel.com 접속 → GitHub 계정으로 가입/로그인
2. `Add New` → `Project` 클릭
3. 아까 만든 `my-worklog` 저장소 선택 → `Import`
4. **아직 `Deploy` 누르지 마세요!** 그 전에 `Environment Variables` 항목을 펼쳐서 아래 4개를 입력하세요:

   | 이름 (Key) | 값 (Value) |
   |---|---|
   | `GITHUB_OWNER` | 내 GitHub 아이디 (예: hongildong) |
   | `GITHUB_REPO` | `my-worklog` |
   | `GITHUB_TOKEN` | 3단계에서 복사해둔 토큰 |
   | `GITHUB_PATH` | `data.json` |

5. 이제 `Deploy` 클릭
6. 1~2분 기다리면 완료! `내프로젝트이름.vercel.app` 같은 주소가 생겨요

## 5단계. 확인하기

1. 생성된 주소를 열어보세요
2. 오른쪽 위에 `☁️ 저장됨`이 뜨면 성공이에요
3. 업무를 하나 추가해보고, 다른 컴퓨터나 휴대폰에서 같은 주소를 열어서 똑같이 보이는지 확인해보세요

## 문제가 생기면

- `☁️ 미설정` 또는 `☁️ 저장 실패`가 뜬다 → Vercel 프로젝트 → `Settings` → `Environment Variables`에서 4개 값이 정확한지 확인 (특히 토큰에 공백이 안 들어갔는지) → 값 수정 후 `Deployments` 탭에서 `Redeploy`
- 데이터가 안 보인다 → GitHub 저장소에서 `data.json` 파일을 열어 실제로 내용이 저장되고 있는지 확인
- 토큰을 잃어버렸다/새로 만들고 싶다 → 3단계를 다시 하고, Vercel 환경변수의 `GITHUB_TOKEN` 값만 새 토큰으로 교체 후 Redeploy

## 왜 안전한가요?

`GITHUB_TOKEN`은 Vercel 서버 안에만 저장되고, `index.html`(브라우저가 보는 화면)에는 전혀 나오지 않아요.
웹페이지는 오직 우리 집 서버(`api/data.js`)에게만 "불러와줘 / 저장해줘"라고 부탁하고,
진짜 GitHub와 대화하는 건 서버뿐이라 토큰이 새어나갈 걱정이 없어요.
