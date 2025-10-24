# 🎬 AI 영화 추천 플랫폼

OpenAI API를 활용한 영화 추천 및 AI 리뷰 시스템을 제공하는 영화 추천 플랫폼입니다.

---

## 📌 실행 방법

### 개발 환경 요구사항

- **Node.js**: v20.5.0 (최소 v18.12 이상)
- **pnpm**: v9.12.1 (최소 v9.0 이상)

### 환경 변수 설정

```bash
# .env 파일 생성 후 API 키 입력
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 설치 및 실행

```bash
pnpm install
pnpm dev
```

## 🛠 기술 스택

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

### 상태 관리 & 데이터

- **Tanstack Query**
- **Zustand**
- **Axios**

### AI & 외부 API

- **OpenAI GPT-4o-mini** - AI 추천 및 리뷰 생성
- **TMDB API** - 영화 정보 및 이미지 제공

## 📱 페이지 구성

- **홈** (`/`) - 인기 영화 무한 스크롤 목록
- **검색** (`/search`) - 실시간 영화 검색
- **영화 상세** (`/movie/:id`) - 영화 정보 및 AI 추천
- **AI 리뷰** (`/movie/:movieId/ai-review`) - AI 전문가 리뷰

