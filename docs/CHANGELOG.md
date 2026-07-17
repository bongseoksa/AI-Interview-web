# 문서 변경 이력 (CHANGELOG)

모든 문서 변경사항을 시간순으로 기록한다.

---

## [2026-07-17]

### 문서 관리 체계 수립
- **변경 유형**: 생성
- **변경 내용**: 서기관리 에이전트 도입 및 문서 관리 체계 초기 구축
  - `docs/README.md` - 문서 허브 생성
  - `docs/CHANGELOG.md` - 변경 이력 관리 파일 생성
  - `docs/agents/secretary.md` - 서기관리 에이전트 정의
  - `docs/sync/document-registry.md` - 문서 레지스트리 생성
  - `docs/sync/notion-sync-log.md` - Notion 동기화 로그 생성
- **변경 사유**: 프로젝트 문서의 체계적 관리 및 히스토리 추적 필요
- **관련 에이전트**: 서기관리 에이전트 (신규)
- **영향 범위**: 사업계획서 (에이전트 목록 업데이트, 협업 원칙 수정)

### 사업계획서 (Notion) 업데이트
- **변경 유형**: 수정
- **변경 내용**:
  - 서기관리 에이전트 (1.10) 추가 (9개 -> 10개 에이전트)
  - 협업 원칙 2.1 수정: "별도 담당자를 두지 않으며" -> 서기관리 에이전트 문서 관리 역할 명시
  - 협업 매트릭스 2.3에 서기관리 에이전트 관계 추가
  - 의사결정 기록에 서기관리 에이전트 추가 항목 기록
- **변경 사유**: 문서 관리 전담 에이전트 필요성 확인
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: 에이전트 조직 구조 전체, 문서 관리 워크플로우

### Notion 전체 문서 최신화 (전수 정합성 검증)
- **변경 유형**: 수정
- **변경 내용**:
  - **메인 페이지 (AI Interview)**:
    - "핵심 기능"에 Phase 0 개념 학습(메타인지) 추가 (기획서와 정합성 확보)
    - "문서 구조" 테이블을 실제 Notion 하위 페이지와 일치시킴 (디자인/아키텍처/마일스톤/회의록 -> 기획서/사업계획서/진행가이드)
    - "에이전트 조직" 섹션 신규 추가 (10개 에이전트 목록)
    - "현재 진행 단계" 섹션 신규 추가 (Step 1 Discovery 진행 중)
    - "레포지토리" 테이블에 상태 컬럼 추가 (초기화 완료/미착수)
    - "기술 스택" 버전을 package.json 실제 설치 버전으로 갱신 (Next.js 16.2.10, TS 5.9.3 등)
    - "개발 환경 설정"에 전체 명령어 및 프로젝트 구조(디렉토리 맵) 추가
    - "참고 사항" 최신화 (에이전트 10개, 서기관리 에이전트 문서 관리 등)
  - **사업계획서**:
    - "기존 8개 에이전트" 문구 -> "현재 10개 에이전트"로 수정
    - 레포지토리 3.1 AI-Interview-web: 상태, 설치 버전, 프로젝트 구조, Path Alias, 개발 명령어 상세 추가
    - 레포지토리 3.2/3.3: 상태(미착수) 명시
  - **프로젝트 진행 가이드**:
    - "완료된 것"에 에이전트 10개 명시, 구체 버전 기록, 서기관리 에이전트/문서 체계 수립/Notion 최신화 추가
- **변경 사유**: 문서 간 정보 불일치 전수 해소 (레포지토리 정의, 버전, 에이전트 수, 기능 목록, 문서 구조)
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: 메인/사업계획서/진행가이드 3개 문서 전체

### 사업체 현황 정리
- **변경 유형**: 생성
- **변경 내용**: 사업체 현황을 사업계획서 및 메인 페이지에 추가
  - 운영 형태: 무자본 1인 개인 (사업자 미등록)
  - 비용 정책: 수입 발생 전까지 무료 서비스만 활용
  - 공용 계정: qhdtjd4517@gmail.com
  - 무료 서비스 활용 예시 (Vercel, Supabase, GitHub Actions 등)
- **변경 사유**: 프로젝트 운영 제약조건 명시 — 모든 기술/인프라 결정에 비용 제약 반영 필요
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: 사업계획서 (섹션 0 신규), 메인 페이지 (프로젝트 개요 테이블)

### Step 0 신설 (서기 에이전트 구축)
- **변경 유형**: 수정
- **변경 내용**: 진행 가이드에 Step 0 추가 — 문서 관리 인프라를 모든 기획 단계보다 선행
  - 기존 Step 1~8 앞에 Step 0 삽입
  - Step 0 산출물: docs/ 구조, 문서 레지스트리, 산출물 템플릿, CHANGELOG, 서기 에이전트 프롬프트
  - 서기 에이전트는 orchestrator 전체가 아닌 독립 도구로 먼저 동작
- **변경 사유**: Step 1부터 산출물이 쏟아지므로, 문서 관리 체계가 선행되어야 함
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: 진행가이드 (Step 0 추가), 메인 페이지 (현재 단계 갱신), 사업계획서 (의사결정 기록)

### 산출물 템플릿 생성
- **변경 유형**: 생성
- **변경 내용**: docs/templates/ 에 4개 템플릿 생성
  - `competitor-analysis.md` — Step 1 경쟁사 분석 보고서 템플릿
  - `prd.md` — Step 2 PRD (제품 요구사항 문서) 템플릿
  - `user-story.md` — Step 4 유저 스토리 템플릿
  - `adr.md` — 아키텍처 의사결정 기록(ADR) 템플릿
- **변경 사유**: 각 Step의 산출물이 일관된 구조로 작성될 수 있도록 선행 준비
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: 이후 모든 Step의 산출물 품질 및 일관성

### 에이전트 시스템 구축 (방안 C 하이브리드)
- **변경 유형**: 생성
- **변경 내용**: orchestrator에 에이전트 정의 원본 + 3개 레포에 서브에이전트 배포
  - `orchestrator/agents/` — 10개 에이전트 YAML 정의 원본
  - `orchestrator/.claude/agents/` — 6개 서브에이전트 (전략관리자, PM, PjM, 풀스택아키텍트, 인프라, 서기)
  - `web/.claude/agents/` — 3개 서브에이전트 (FE시니어, QA, 서기)
  - `server/.claude/agents/` — 3개 서브에이전트 (BE시니어, 데이터엔지니어, QA)
  - `orchestrator/scripts/sync-agents.sh` — 배포 현황 확인 스크립트
  - `orchestrator/CLAUDE.md` — 오케스트레이터 프로젝트 설명
  - `server/CLAUDE.md` — 서버 프로젝트 설명
- **변경 사유**: Step 1부터 에이전트 페르소나 기반 작업 가능하도록 선행 구축
- **비용 제약**: orchestrator에 Claude API 토큰 사용 불가, 향후 자율 실행 시 Ollama + CrewAI
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: 3개 레포 전체, Notion 사업계획서/메인 페이지

### 온보딩 가이드 생성 및 서기 에이전트 스펙 확장
- **변경 유형**: 생성/수정
- **변경 내용**:
  - `ONBOARDING.md` 3개 레포 생성 (web, server, orchestrator)
    - web: Next.js 16 개발환경, pnpm 명령어, 프로젝트 구조, 기술 스택
    - server: 미착수 상태 반영, 예상 설치/실행 흐름 안내
    - orchestrator: CrewAI/Ollama/MoE 개념, 모델 요약표, 실행/종료 절차
  - 서기 에이전트 스펙에 온보딩 관리 책임 추가
    - `orchestrator/agents/doc-secretary.yaml` — constraints 2개, outputs 1개 추가
    - `web/docs/agents/secretary.md` — 섹션 4 (온보딩 문서 관리) 추가
    - `web/.claude/agents/doc-secretary.md` — 온보딩 관리 역할 추가
    - `orchestrator/.claude/agents/doc-secretary.md` — 온보딩 관리 역할 추가
  - `docs/README.md` — 레포별 문서 배치표, 역할 구분 섹션 보강
  - `docs/sync/document-registry.md` — ONBOARDING.md 3건 등록, 완료 항목 갱신
- **변경 사유**: 새로운 에이전트/사람이 레포에 투입될 때 ONBOARDING.md만으로 독립 시작 가능해야 함
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: 3개 레포 전체, 서기 에이전트 스펙, 문서 관리 체계

### 외부인사 에이전트 (External Advisor) 신규 추가
- **변경 유형**: 생성
- **변경 내용**: 제3자 관점의 객관적/비판적 리뷰 담당 에이전트 추가 (10개 → 11개 에이전트)
  - `orchestrator/agents/external-advisor.yaml` — 에이전트 YAML 원본 생성
  - `orchestrator/.claude/agents/external-advisor.md` — Claude Code 서브에이전트 배포
  - `orchestrator/src/config/agents.yaml` — CrewAI 에이전트 정의에 external_advisor 추가
  - Notion 메인 페이지: 에이전트 수 10 → 11, 에이전트 목록에 외부인사 추가
  - Notion 사업계획서: 1.11 외부인사 섹션 추가, 협업 매트릭스 2.3 추가, 의사결정 기록 추가
  - Notion 진행가이드: 에이전트 수 10 → 11
- **변경 사유**: 내부 에이전트들의 확증 편향 방지를 위한 Devil's Advocate 역할 필요
- **에이전트 특성**:
  - 15년차 스타트업 자문위원 겸 엔젤 투자자 페르소나
  - 우호적이지 않은 비판적 시각 유지
  - 의사결정 과정에 참여하지 않음 (자문만, 결정권 없음)
  - 사용자/시장/기술 세 축으로 피드백 구조화
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: Notion 3개 문서, orchestrator 레포, web CHANGELOG

### 자율 에이전트 프레임워크 선정 및 구축
- **변경 유형**: 생성
- **변경 내용**: orchestrator에 CrewAI + Ollama 기반 자율 에이전트 실행 환경 구축
  - 프레임워크 5종 비교: CrewAI vs LangGraph vs smolagents vs AutoGen vs Swarm
  - **CrewAI v1.15.3** 채택 (MIT, self-hosted 무료, role 기반 구조 1:1 매핑)
  - 모델 6종 비교: Gemma 4, Qwen3, Qwen3.5, Llama 3.3, DeepSeek R1, Phi-4
  - 검토 기준: 라이선스(Apache 2.0), 하드웨어(M4 Pro 48GB, 273 GB/s), tool-call 신뢰도, 응답 속도, RAM
  - **Gemma 4 12B** 기본 모델 채택 (tool-call ~90%, ~80-90 tok/s, ~6.6GB, Apache 2.0)
  - 고성능: Gemma 4 26B MoE / 빠른 반복: Qwen3 8B / 코딩: Qwen3.5 35B-A3B
  - 모든 모델 Apache 2.0 (상업적 사용 무제한, 로열티 없음)
  - 참고: HuggingFace Open LLM Leaderboard, HuggingFace 2026 LLM 비교, Apple Silicon 벤치마크
  - `orchestrator/src/config/llm.py` — 모델 비교표 및 선정 근거 포함
  - `orchestrator/src/config/agents.yaml` — 10개 에이전트 CrewAI 형식 정의
  - `orchestrator/src/config/tasks.yaml` — Step별 태스크 정의
  - `orchestrator/src/crews/` — ResearchCrew (Step 1), PlanningCrew (Step 2-4)
  - `orchestrator/main.py` — 실행 엔트리포인트
  - `orchestrator/CLAUDE.md` — 모델 선정 근거 상세 기록
- **변경 사유**: orchestrator에 AI 모델이 정의되지 않아 자율 에이전트 실행 불가능했음
- **관련 에이전트**: 서기관리 에이전트
- **영향 범위**: orchestrator 레포, Notion 사업계획서/메인 페이지
