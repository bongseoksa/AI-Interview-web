# AI Interview - Web

프론트엔드 엔지니어를 위한 AI 기반 모의 인터뷰 연습 서비스의 프론트엔드 레포지토리.

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16 |
| Language | TypeScript | 5.9 |
| Runtime | React | 19 |
| Styling | Tailwind CSS + shadcn/ui | 3.4 |
| State (Client) | Zustand | 5.x |
| State (Server) | TanStack Query | 5.x |
| Form | React Hook Form + Zod | 7.x / 4.x |
| Package Manager | pnpm | 10.17 |
| Database | Supabase (PostgreSQL) | - |

## Getting Started

```bash
# 의존성 설치 (pre-commit 훅 자동 활성화)
pnpm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 시작 (http://localhost:3000)
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | 개발 서버 시작 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 시작 |
| `pnpm lint` | ESLint 실행 |

## Project Structure

```
app/                # Next.js App Router (pages, layouts)
components/         # React components (components/ui: shadcn)
lib/                # Utilities (cn, supabase client, etc.)
hooks/              # Custom React hooks
store/              # Zustand stores
types/              # TypeScript type definitions
schemas/            # Zod validation schemas
services/           # API service functions
constants/          # Application constants
providers/          # React context providers
docs/               # Documentation (managed by doc-secretary agent)
```

## Security

Pre-commit 훅이 자동으로 동작하여 민감 파일 커밋을 차단합니다.

- **Layer 1** `.gitignore` - 알려진 위험 파일 패턴 무시
- **Layer 2** `husky` pre-commit - 금지 파일 패턴 (.env, .pem, credentials.json 등) 차단
- **Layer 3** `secretlint` - 파일 내용에서 credential/DB URL 자동 스캔

## Related Repositories

- [AI-Interview-server](https://github.com/bongseoksa/AI-Interview-server) - Backend (Python)
- [AI-Interview-orchestrator](https://github.com/bongseoksa/AI-Interview-orchestrator) - Agent orchestration (CrewAI + Ollama)
