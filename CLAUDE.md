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

### Conventions
- Use path aliases (`@/`) instead of relative imports
- shadcn/ui components go in `components/ui/` (auto-generated)
- CSS variables for theming (defined in `app/globals.css`)
- Base color: slate
