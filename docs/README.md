# AI Interview - 문서 관리 체계

서기관리 에이전트가 관리하는 프로젝트 문서 허브.

## 전체 문서 구조

### 레포별 문서 배치

| 문서 | web | server | orchestrator | 설명 |
|------|-----|--------|-------------|------|
| `CLAUDE.md` | O | O | O | 에이전트 컨텍스트 (Claude Code용) |
| `ONBOARDING.md` | O | O | O | 온보딩 가이드 (설치/실행/종료/필수개념) |
| `.claude/agents/` | 3개 | 3개 | 6개 | Claude Code 서브에이전트 |
| `docs/` | O | - | - | 문서 관리 허브 (프로젝트 레벨) |
| `agents/` | - | - | O | 에이전트 YAML 원본 (SSOT) |

### 문서 역할 구분

- **CLAUDE.md**: 해당 레포에서 Claude Code가 참조하는 프로젝트 컨텍스트
- **ONBOARDING.md**: 사람/에이전트가 레포에 처음 투입될 때 독립적으로 시작 가능한 가이드
- **docs/**: 프로젝트 레벨 문서 관리 (CHANGELOG, 레지스트리, 동기화 로그, 템플릿)
- **Notion 4개 페이지**: 공식 문서 원본 (SSOT)

### docs/ 디렉토리 구조 (web 레포)

```
docs/
├── README.md                    # 문서 허브 (현재 파일)
├── CHANGELOG.md                 # 전체 문서 변경 히스토리
├── agents/
│   └── secretary.md             # 서기관리 에이전트 정의 및 운영 가이드
├── sync/
│   ├── notion-sync-log.md       # Notion <-> 로컬 문서 동기화 이력
│   └── document-registry.md     # 전체 문서 목록 및 최신화 상태 레지스트리
├── templates/
│   ├── competitor-analysis.md   # Phase 1: 경쟁사 분석 보고서 템플릿
│   ├── prd.md                   # Phase 2: PRD 템플릿
│   ├── user-story.md            # Phase 4: 유저 스토리 템플릿
│   └── adr.md                   # ADR (아키텍처 결정 기록) 템플릿
└── snapshots/
    └── (YYYY-MM-DD_제목.md)     # 주요 문서 스냅샷 (마일스톤 단위)
```

## 문서 관리 원칙

1. **Single Source of Truth**: Notion이 공식 문서의 원본이며, 로컬 docs/는 동기화 이력과 메타 관리용
2. **변경 추적**: 모든 문서 변경은 `CHANGELOG.md`에 기록
3. **동기화**: Notion 문서 업데이트 시 `sync/notion-sync-log.md`에 동기화 이력 기록
4. **스냅샷**: 마일스톤 완료 시점에 주요 문서 스냅샷을 `snapshots/`에 보관
5. **레지스트리**: `sync/document-registry.md`에서 전체 문서의 최신화 상태를 한눈에 파악
6. **온보딩**: 기술 스택/설정 변경 시 해당 레포의 `ONBOARDING.md`를 즉시 최신화

## Notion 문서 맵

| 섹션 | 페이지 | Notion ID | 설명 |
|------|--------|-----------|------|
| 허브 | AI Interview (메인) | `3a0141f8-c327-80eb-ba18-d9637ff76f63` | 프로젝트 개요 + Phase별 현황 |
| 기획 & 제품 | 기획서 | `3a0141f8-c327-81fe-bfbf-e35fd03e8c19` | 상세 기능 요구사항 및 유저 플로우 |
| 기획 & 제품 | PRD | `3a0141f8-c327-8111-a9bd-f62a1d4a92b9` | 제품 요구사항 문서 |
| 기획 & 제품 | 시장 조사 보고서 | `3a0141f8-c327-8189-8d69-dbc5531fff9a` | 경쟁사 분석 및 시장 조사 |
| 설계 & 아키텍처 | 기술 스택 & AI 모델 전략 | `3a1141f8-c327-8104-9018-eb7fe3279b56` | 기술 스택 SSOT |
| 설계 & 아키텍처 | 에이전트 조직 구조 | `3a0141f8-c327-81e1-8d29-d4698f6e6161` | 11개 에이전트 페르소나 |
| 설계 & 아키텍처 | 시드 데이터 뱅크 | `3a0141f8-c327-81a8-9d4e-e9aaeb3665a3` | Q&A 시드 데이터 |
| 레포지토리 | AI-Interview-web | `3a1141f8-c327-817d-b249-ca148bd8788b` | 프론트엔드 레포 |
| 레포지토리 | AI-Interview-server | `3a1141f8-c327-8199-a393-c07870317450` | 백엔드 레포 |
| 레포지토리 | AI-Interview-orchestrator | `3a1141f8-c327-813b-aa0e-eedb0cfb83ce` | 에이전트 오케스트레이터 |
| 프로젝트 진행 | Phase별 마일스톤 & 체크리스트 | `3a1141f8-c327-8115-a75b-dec8e4336274` | Phase별 진행 상태 |
| 프로젝트 진행 | 산출물 레지스트리 | `3a1141f8-c327-8166-8e33-dcdabdeb5dd1` | 산출물 목록 및 상태 |
| 프로젝트 진행 | 의사결정 기록 | `3a0141f8-c327-81fd-8884-e1a9447b1fc0` | ADR 기록 |
| 회의록 | 에이전트 회의록 | `3a1141f8-c327-8192-b8a9-f79376f12139` | Crew 실행 회의록 |
