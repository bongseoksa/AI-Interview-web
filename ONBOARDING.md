# AI-Interview-web 온보딩 가이드

이 문서는 AI-Interview-web 레포에 처음 참여하는 사람(또는 에이전트)이
환경 설정부터 실행, 종료까지 빠르게 시작할 수 있도록 안내한다.

---

## 1. 필수 개념

- **Next.js 16 App Router**: 파일 기반 라우팅, `app/` 디렉토리 사용, React Server Components 기본
- **Turbopack**: Next.js 16 기본 번들러 (Webpack 대체), 개발 서버 빠른 HMR
- **shadcn/ui**: Radix UI 기반 컴포넌트 라이브러리 — `components/ui/`에 복사 설치됨 (의존성이 아닌 소스 코드)
- **Path Alias**: 모든 import는 `@/*` (프로젝트 루트 기준) — 상대 경로 사용 금지
- **상태 관리 분리**: 서버 상태(TanStack Query) vs 클라이언트 상태(Zustand) 명확히 구분
- **Zod 4**: 스키마 기반 유효성 검증 — React Hook Form과 연동하여 폼 검증

## 2. 사전 요구사항

| 항목 | 최소 버전 | 확인 명령어 |
|------|----------|-----------|
| Node.js | 22.x | `node -v` |
| pnpm | 10.17.x | `pnpm -v` |
| Git | 2.x | `git --version` |

pnpm 미설치 시:
```bash
npm install -g pnpm
```

## 3. 설치

```bash
cd AI-Interview-web
pnpm install
```

## 4. 실행

```bash
# 개발 서버 시작 (Turbopack, http://localhost:3000)
pnpm dev

# 프로덕션 빌드 + 실행
pnpm build && pnpm start
```

## 5. 종료

```bash
# 개발 서버: 터미널에서 Ctrl+C
# 프로덕션 서버: 터미널에서 Ctrl+C
```

## 6. 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 시작 (http://localhost:3000) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 시작 |
| `pnpm lint` | ESLint 실행 |
| `pnpm dlx shadcn@latest add [component]` | shadcn/ui 컴포넌트 추가 |

## 7. 프로젝트 구조

```
app/                # Next.js App Router (페이지, 레이아웃)
components/         # React 컴포넌트
  ui/               # shadcn/ui 자동생성 컴포넌트
lib/                # 유틸리티 함수 (cn 등)
hooks/              # 커스텀 React 훅
store/              # Zustand 스토어
types/              # TypeScript 타입 정의
schemas/            # Zod 검증 스키마
services/           # API 서비스 함수
constants/          # 애플리케이션 상수
providers/          # React 컨텍스트 프로바이더
docs/               # 문서 관리 (서기관리 에이전트)
```

## 8. 기술 스택 요약

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| Framework | Next.js (App Router) | 16.2.10 |
| Language | TypeScript | 5.9.3 |
| Runtime | React | 19.2.3 |
| Styling | Tailwind CSS | 3.4.19 |
| UI | shadcn/ui | latest |
| State (Client) | Zustand | 5.0.10 |
| State (Server) | TanStack Query | 5.90.19 |
| Form | React Hook Form + Zod | 7.71.1 / 4.3.5 |
| Package Manager | pnpm | 10.17.1 |

## 9. 컨벤션

- `@/*` path alias 필수 사용 (상대 경로 금지)
- shadcn/ui 컴포넌트는 `components/ui/`에 위치
- CSS 변수로 테마 관리 (`app/globals.css`)
- Base color: slate
- 서버 상태와 클라이언트 상태 혼용 금지

## 10. 관련 문서

- `CLAUDE.md` — 에이전트 컨텍스트 (Claude Code용)
- `docs/README.md` — 문서 관리 허브
- `docs/CHANGELOG.md` — 변경 이력
- Notion 메인: AI Interview 프로젝트 전체 개요
