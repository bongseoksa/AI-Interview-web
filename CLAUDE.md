# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

This project uses **pnpm** (v10.17.1) as the package manager. Always use `pnpm` commands instead of npm or yarn.

## Development Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server with Turbopack (http://localhost:3000)
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint

# Add shadcn/ui components
pnpm dlx shadcn@latest add [component-name]
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9.x
- **Runtime**: React 19.x
- **Styling**: Tailwind CSS 3.4.x
- **UI Components**: shadcn/ui
- **State (Client)**: Zustand 5.x
- **State (Server)**: TanStack Query 5.x
- **Forms**: React Hook Form 7.x + Zod 4.x

### Path Aliases

All imports use `@/*` alias mapped to the project root:
- `@/app` - Next.js App Router pages and layouts
- `@/components` - React components (including `@/components/ui` for shadcn)
- `@/lib` - Utility functions (cn, etc.)
- `@/hooks` - Custom React hooks
- `@/store` - Zustand stores
- `@/types` - TypeScript type definitions
- `@/schemas` - Zod validation schemas
- `@/services` - API service functions
- `@/constants` - Application constants
- `@/providers` - React context providers

### AI 모델 전략

- **Orchestrator 2-Tier**: 자료 수집·개발은 Gemma 4 26B (고성능), 유저 대면 콘텐츠는 Gemma 4 12B (경량) — orchestrator에서 Ollama 로컬 실행
- **서비스 LLM**: TBD (Step 6 아키텍처 설계 시 결정). 유저 대면이므로 경량 모델 예정
- LLM 호출은 반드시 Server Components / Route Handlers를 통해 수행 (API 키 클라이언트 노출 방지)

### i18n (다국어)

- **라이브러리**: next-intl 4.x (App Router native)
- **지원 언어**: `ko` (기본), `en`
- **URL 전략**: `[locale]` prefix 라우팅 (`/ko/dashboard`, `/en/dashboard`)
- **설정 파일**:
  - `i18n/routing.ts` — 로케일 정의
  - `i18n/request.ts` — 런타임 메시지 로딩
  - `i18n/navigation.ts` — locale-aware Link, useRouter
- **번역 JSON**: `messages/ko.json`, `messages/en.json` (7개 네임스페이스)
- **Server Component**: `setRequestLocale(locale)` + `getTranslations()` (from `next-intl/server`)
- **Client Component**: `useTranslations()` (from `next-intl`)
- **DB 콘텐츠 번역**: `node_translations` / `question_translations` 테이블 (locale별 fallback)
- **번역 파이프라인**: orchestrator의 `scripts/translate_content.py` (gemma4:12b via Ollama)
- **Middleware**: `next-intl/middleware` (locale 감지 + 리다이렉트)

### Conventions
- Use path aliases (`@/`) instead of relative imports
- shadcn/ui components go in `components/ui/` (auto-generated)
- CSS variables for theming (defined in `app/globals.css`)
- Base color: slate
- **i18n**: 새 페이지/컴포넌트 추가 시 `messages/ko.json`과 `messages/en.json` 모두 번역 키 추가 필수
- **Navigation**: `next/link` 대신 `@/i18n/navigation`의 `Link` 사용 (locale 자동 처리)

## 개발 역할 분담 (필수 원칙)

**Orchestrator 레포(`AI-Interview-orchestrator`)의 에이전트가 설계를 주도하고, Claude Code는 서포트 역할로 구현한다.**

### 워크플로우

1. **에이전트 설계 먼저** — 새 마일스톤 착수 시, Orchestrator에서 관련 Crew(FrontendCrew, QACrew 등)를 실행하여 컴포넌트 설계·페이지 구조·테스트 전략 산출물을 먼저 생성한다.
2. **산출물 기반 구현** — Claude Code는 에이전트 산출물(`AI-Interview-orchestrator/output/`)을 입력으로 받아 코드를 구현한다.
3. **에이전트 검증** — 구현 완료 후 QACrew 테스트 케이스 및 DocumentationCrew 문서 감사로 검증한다.

### Orchestrator 코드 생성

Orchestrator 레포의 CodegenCrew가 이 레포에 직접 코드 파일을 생성할 수 있다:
```bash
# orchestrator 레포에서 실행
python main.py codegen web "학습 페이지 컴포넌트 생성"
```
- 에이전트가 이 레포의 구조를 분석한 후 설계 문서 기반으로 코드 생성
- 생성된 파일은 리뷰 후 커밋

### 금지 사항

- 에이전트 산출물 없이 새로운 마일스톤의 구현을 시작하지 않는다
- 에이전트 설계와 다른 방향의 구현은 반드시 사유를 기록한다
