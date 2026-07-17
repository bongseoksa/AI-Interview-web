# AI Interview - 문서 관리 체계

서기관리 에이전트가 관리하는 프로젝트 문서 허브.

## 문서 구조

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
│   ├── competitor-analysis.md   # Step 1: 경쟁사 분석 보고서 템플릿
│   ├── prd.md                   # Step 2: PRD 템플릿
│   ├── user-story.md            # Step 4: 유저 스토리 템플릿
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

## Notion 문서 맵

| 페이지 | Notion ID | 설명 |
|--------|-----------|------|
| AI Interview (메인) | `3a0141f8-c327-80eb-ba18-d9637ff76f63` | 프로젝트 개요 |
| 기획서 | `3a0141f8-c327-81fe-bfbf-e35fd03e8c19` | 상세 기능 요구사항 및 유저 플로우 |
| 사업계획서 | `3a0141f8-c327-8186-9810-c8c025aa943b` | 에이전트 조직, 레포지토리, 실행 계획 |
| 프로젝트 진행 가이드 | `3a0141f8-c327-81ba-9d0e-e7444b9d2df8` | 단계별 진행 순서 및 현재 상태 |
