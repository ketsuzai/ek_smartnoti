# 🏫 키드키즈 스마트알림장 — 운영관리 시스템

> 유아교육기관(어린이집/유치원) 알림장 서비스의 운영관리 백오피스 프로토타입

---

## 📋 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트** | 키드키즈 스마트알림장 운영관리 |
| **버전** | v2.4 |
| **기술 스택** | Vanilla HTML5 + CSS3 + JavaScript (MPA 구조) |
| **외부 라이브러리** | Chart.js 4.4.1, Pretendard Font, JetBrains Mono |
| **데이터** | 프론트엔드 모킹 데이터 (프로토타입) |

---

## 📂 프로젝트 구조

```
📦 프로젝트 루트
├── 📄 index.html                               ← 로그인 페이지 (진입점)
├── 📄 README.md                                ← 이 파일
├── 📄 CLAUDE.md                                ← AI 작업 지침 (Claude용)
├── 📁 src/
│   └── 📁 pages/
│       ├── 📄 dashboard.html                   ← 대시보드 [🔒 수정 금지]
│       ├── 📄 member-list-admin.html           ← 통합회원 조회 [🔒 수정 금지]
│       ├── 📄 member-approval.html             ← 가입/승인 관리 [🔒 수정 금지]
│       ├── 📄 member-status-admin.html         ← 회원 상태 관리 [🔒 수정 금지]
│       ├── 📄 invitation-admin.html            ← 초대장 관리 [🔒 수정 금지]
│       ├── 📄 org-admin.html                   ← 기관관리 [🔒 수정 금지]
│       └── 📁 oper/                            ← 운영관리 섹션
│           ├── 📄 operation-notice-board.html  ← 알림장 [✅ 완료]
│           ├── 📄 operation-invitation.html    ← 초대 관리 [✅ 완료]
│           ├── 📄 operation-org-info.html      ← 기관정보 관리 [✅ 완료]
│           ├── 📄 operation-class.html         ← 반 관리 [✅ 완료]
│           ├── 📄 operation-child.html         ← 원아관리 [✅ 완료]
│           ├── 📄 operation-dashboard.html     ← 운영관리 대시보드 [✅ 완료]
│           ├── 📄 operation-org-selector.html  ← 기관 선택 팝업 [✅ 완료]
│           ├── 📄 operation-announcement.html  ← 공지사항 [✅ 완료]
│           ├── 📄 operation-album.html         ← 앨범 [✅ 완료]
│           ├── 📄 operation-medicine.html      ← 투약의뢰서 관리 [✅ 완료]
│           ├── 📄 operation-meal.html          ← 식단표 [✅ 완료]
│           ├── 📄 operation-member.html        ← 멤버/승인 (교사+원아 통합) [✅ 완료]
│           ├── 📄 operation-graduation.html    ← 진급/졸업 [✅ 완료]
│           ├── 📄 operation-schedule.html      ← 스케쥴 [🔲 미시작]
│           ├── 📄 operation-consulting.html    ← 상담 관리 [🔲 미시작]
│           └── 📄 operation-attendance.html    ← 출석부 [🔲 미시작]
└── 📁 .brain/                                  ← 프로젝트 브레인 (지식베이스)
    ├── 📄 00-PROJECT-OVERVIEW.md               ← 프로젝트 개요
    ├── 📄 01-MEMBER-MANAGEMENT.md              ← 회원 관리 기능정의
    ├── 📄 02-ORG-MANAGEMENT.md                 ← 기관 관리 기능정의
    ├── 📄 03-INVITATION-MANAGEMENT.md          ← 초대장 관리 기능정의
    ├── 📄 04-DASHBOARD.md                      ← 대시보드 기능정의
    ├── 📄 05-DATABASE-SCHEMA.md                ← DB 스키마 정의
    ├── 📄 06-DESIGN-SYSTEM.md                  ← 디자인 시스템 가이드
    ├── 📄 07-ROLE-PERMISSION.md                ← 역할별 권한 매트릭스
    ├── 📄 08-OPERATION-MANAGEMENT.md           ← 운영관리 기능정의
    ├── 📄 09-ROADMAP.md                        ← 작업 로드맵
    ├── 📄 10-CHILD-MANAGEMENT.md               ← 원아관리 기능정의
    ├── 📄 11-NOTICE-BOARD.md                   ← 알림장 기능정의
    ├── 📄 12-ORG-INFO.md                       ← 기관정보 관리 기능정의
    ├── 📄 13-CLASS-MANAGEMENT.md               ← 반 관리 기능정의
    ├── 📄 14-OPERATION-DASHBOARD.md            ← 운영관리 대시보드 교사 뷰, 출석현황 모달
    ├── 📄 15-ATTENDANCE.md                     ← 출석부 스펙 (준비중)
    ├── 📄 16-MEAL-PLAN.md                      ← 식단표 스펙 (준비중)
    ├── 📄 17-MEMBER-APPROVAL.md                ← 멤버/승인 스펙 (준비중)
    └── 📄 18-GRADUATION.md                     ← 진급/졸업 스펙 (준비중)
```

---

## 🔗 페이지 URI 맵

### 통합관리자 전용

| 경로 | 설명 | 비고 |
|------|------|------|
| `/index.html` | 관리자 로그인 | 테스트: admin / 1234 |
| `/src/pages/dashboard.html` | 대시보드 | 로그인 후 진입 |
| `/src/pages/member-list-admin.html` | 통합회원 조회 | |
| `/src/pages/member-approval.html` | 가입/승인 관리 | |
| `/src/pages/member-status-admin.html` | 회원 상태 관리 | |
| `/src/pages/invitation-admin.html` | 초대장 관리 | |
| `/src/pages/org-admin.html` | 기관 조회 | |
| `/src/pages/org-admin.html#approval` | 기관 승인 관리 | URL 해시 탭 |
| `/src/pages/org-admin.html#status` | 기관 상태 관리 | URL 해시 탭 |

### 운영관리 (`src/pages/oper/`)

| 경로 | 설명 | 상태 |
|------|------|------|
| `/src/pages/oper/operation-dashboard.html` | 운영관리 대시보드 (기관·교사 공용) | ✅ 완료 |
| `/src/pages/oper/operation-org-selector.html` | 기관 선택 팝업 | ✅ 완료 |
| `/src/pages/oper/operation-notice-board.html` | 알림장 | ✅ 완료 |
| `/src/pages/oper/operation-invitation.html` | 초대 관리 | ✅ 완료 |
| `/src/pages/oper/operation-org-info.html` | 기관정보 관리 | ✅ 완료 |
| `/src/pages/oper/operation-class.html` | 반 관리 | ✅ 완료 |
| `/src/pages/oper/operation-child.html` | 원아관리 | ✅ 완료 |
| `/src/pages/oper/operation-announcement.html` | 공지사항 | ✅ 완료 |
| `/src/pages/oper/operation-album.html` | 앨범 | ✅ 완료 |
| `/src/pages/oper/operation-medicine.html` | 투약의뢰서 관리 | ✅ 완료 |
| `/src/pages/oper/operation-meal.html` | 식단표 | ✅ 완료 |
| `/src/pages/oper/operation-member.html` | 멤버/승인 (교사+원아 통합) | ✅ 완료 |
| `/src/pages/oper/operation-graduation.html` | 진급/졸업 | ✅ 완료 |
| `/src/pages/oper/operation-schedule.html` | 스케쥴 | 🔲 미시작 |
| `/src/pages/oper/operation-consulting.html` | 상담 관리 | 🔲 미시작 |
| `/src/pages/oper/operation-attendance.html` | 출석부 | 🔲 미시작 |

---

## ✅ 구현 완료 기능

### 1. 로그인 (`index.html`)
- 프리미엄 다크 테마 로그인 UI
- 테스트 계정 인증 (admin/1234, org_admin/1234, teacher/1234)
- 에러 토스트 알림

### 2. 대시보드 (`dashboard.html`)
- 5개 KPI 카드 (활성 기관, 교사, 학부모, 접속자, 게시글)
- DAU/MAU 라인 차트 / 메뉴별 사용량 바 차트
- 운영 To-do 카드, 공지사항, 기관·교사 활동 랭킹
- 디바이스 분포 도넛 차트 / 기간 필터

### 3. 통합회원 조회 (`member-list-admin.html`)
- 전체 회원 테이블 (교사/학부모/기관장)
- 다중 필터 (유형, 상태, 가입경로, 보호자, 검색) + 필터 칩 UI

### 4. 가입/승인 관리 (`member-approval.html`)
- 가입 승인 KPI / 승인·거절·취소 액션
- 일괄 처리 (체크박스) / 상세 패널 (우측 슬라이드)

### 5. 초대장 관리 (`invitation-admin.html`)
- 학부모/교직원 서브탭 / 기관 선택 → 반별 초대장 관리
- 초대 링크 생성·복사·중지·재개·삭제 / KPI 카드

### 6. 회원 상태 관리 (`member-status-admin.html`)
- 상태별 탭 / 상태 변경 모달 / 일괄 상태 변경

### 7. 기관관리 (`org-admin.html`)
- 3탭: 기관 조회 / 기관 승인 / 기관 상태
- 기관 상세 패널 / 멤버십 등급 시스템

### 8. 알림장 (`operation-notice-board.html`)
- 보낸 알림장 / 받은 알림장 2탭 구조
- **작성 패널**: 단일(1:1 + 종합평가 6카테고리) / 다중(1:N + 태그 시스템) 모드 분리
- AI 예문 생성 / 문장 교정 기능
- 발행 상태: `draft` 임시저장 → `published` 발행됨 → `deleted` 삭제됨 / `scheduled` 예약발행
- **리스트 UI**: 4열 카드 그리드 (height 360px), 다중 2장 스택 효과, 썸네일 1:1 정사각형 2열
- 임시저장 FAB (우측하단 플로팅 버튼, draft 건수 표시, 필터 토글)
- 발행 상태 배지 카드 우상단 고정, 정적 검색 (버튼 클릭 시 적용)

### 9. 초대 관리 (`operation-invitation.html`)
- 학부모/교직원 서브탭
- 초대 링크 생성·복사·만료 관리 / 초대 현황 KPI

### 10. 기관정보 관리 (`operation-org-info.html`)
- 6개 섹션: 프로필·기본정보·운영정보·위치·서비스설정·담당자
- 뷰↔편집 인라인 전환 / 역할별 편집 권한 분기

### 11. 반 관리 (`operation-class.html`)
- KPI 4개 / 3열 카드 그리드 (컬러 상단바, 정원 프로그레스바)
- 우측 드로어 상세 / 반 추가·수정·삭제 모달
- 원아관리 페이지 연동 (`sessionStorage.currentClass`)

### 12. 원아관리 (`operation-child.html`)
- 반별 탭 필터 + 상태/검색 필터바
- 원아 목록 테이블 → 우측 드로어 (상세·보호자·수정)
- 원아 등록·상태변경 모달 / 보호자 연결 관리

### 13. 운영관리 대시보드 (`operation-dashboard.html`)
- 기관관리자·교사 공용 대시보드 (역할별 뷰 분기)
- KPI 카드 / 출석현황 / 알림장 발송 현황
- 교사 뷰: 담당반 출석현황, 빠른 작성 pre-fill 연동

### 14. 기관 선택 팝업 (`operation-org-selector.html`)
- 통합관리자 운영관리 진입 시 기관 선택 팝업
- 6개/페이지 페이지네이션 + 정적 검색 (검색 버튼/Enter)
- 필터 칩 (전체/어린이집/유치원/이용중/이용종료)
- **이중 진입**: 🏫 기관관리자로 접속 / 📚 교사관리자로 접속
- `operationContext.contextRole`로 다운스트림 뷰 결정 (effectiveRole 패턴)

### 15. 공지사항 (`operation-announcement.html`) — v2 전면 개선 (2026-04-06)
- **반 칩 필터**: `<select>` → pill 버튼 형태 (역할별: org_admin=전체 반, teacher=담당 반만)
- **제목 인디케이터**: 📷(사진) · 📎(첨부) · 💬N(댓글 수) 뱃지 인라인 표시
- **리스트 컬럼 정리**: 게시기간 제거 → 작성일 컬럼, 상태 `게시중`/`예약발행` 2종만
- **상세 드로어 재설계** (520px): 작성자 아바타·읽음현황 헤더, 사진 그리드, 댓글(+답변) 섹션
- **읽음현황 서브패널**: 드로어 내 View A/B 스왑, 수신자 읽음 테이블, 재전송 CTA
- **임시보관함**: `drafts[]` 별도 배열, 액션바 버튼(카운트 뱃지)→모달, 이어쓰기 흐름
- **쓰기 모달 확장** (640px): 카테고리 6종 칩 · 예약발행 토글 · 댓글허용 토글 · 사진/첨부 dropzone
- **예문 패널** / **맞춤법 검사** 버튼 / **예전 글 불러오기** (중앙 미리보기 모달 포함)

### 16. 앨범 (`operation-album.html`)
- KPI 4개 / 반·기간 필터바 + 검색
- 그리드·리스트 뷰 토글 / 앨범 카드 (커버, 사진 수, 통계)
- 앨범 만들기·편집·삭제 모달

### 17. 투약의뢰서 관리 (`operation-medicine.html`)
- KPI 4개 / 날짜·반·상태 필터바 + 검색
- 투약의뢰서 목록 테이블 (약명, 투약 시간, 상태)
- 상세 드로어 (처리·거절·보호자 정보) / 엑셀 내보내기

### 18. 식단표 (`operation-meal.html`)
- 주간 식단 캘린더 뷰 / 반별·날짜 필터
- 인라인 패널 편집 (클릭→편집 전환) / 식단 등록·수정·삭제
- 영양 정보 표시 / 알레르기 태그 관리

### 19. 멤버/승인 (`operation-member.html`)
- 교사 + 원아 통합 멤버 관리 탭 구조
- 가입 승인 대기 목록 / 승인·거절 액션
- 역할별 권한 분기 (org_admin / teacher 뷰 차이)
- `localStorage` 동기화 패턴 / `.child-avatar` `.class-badge` 등 공통 CSS

### 20. 진급/졸업 (`operation-graduation.html`)
- 진급(반 배정) / 졸업(수료 처리) 탭 분리
- 7열 테이블 구조 (이름·기관·현재반·대상반·입소일·상태·액션)
- 일괄 진급 처리 / 졸업 확정 모달
- `localStorage` 원아 데이터 동기화 / 권한 제어 (org_admin만)

---

## 🚧 미구현 / 준비중 기능

| 기능 | 상태 | 설명 |
|------|------|------|
| 스케쥴 | 🔲 미시작 | `operation-schedule.html` |
| 상담 관리 | 🔲 미시작 | `operation-consulting.html` |
| 출석부 | 🔲 미시작 | `operation-attendance.html` |
| 서버 연동 | ❌ 미구현 | 현재 모든 데이터는 프론트엔드 하드코딩 |
| 실제 인증 | ❌ 미구현 | 클라이언트 사이드 테스트 계정만 |
| 반응형 모바일 | ⚠️ 부분 | 데스크탑 우선 설계 |

---

## 👥 관리자 계층 구조

```
통합관리자 (super)          — 다크 사이드바 #1A1D2E, 액센트 #4361EE
기관관리자 (org_admin)      — 딥네이비 사이드바 #0C2D48, 액센트 #0EA5E9
교사관리자 (teacher)        — 딥네이비 사이드바 #0C2D48, 액센트 #0EA5E9
```

---

## 🧠 프로젝트 브레인

`.brain/` 디렉토리에 프로젝트 지식 문서가 관리됩니다:

- **00-PROJECT-OVERVIEW**: 전체 개요, 수정 금지 목록, 사이드바 구조
- **01–04**: 회원/기관/초대/대시보드 기능정의
- **05-DATABASE-SCHEMA**: 전체 DB 테이블 스키마
- **06-DESIGN-SYSTEM**: 색상, 그림자, 라운딩, 컴포넌트 패턴
- **07-ROLE-PERMISSION**: 역할별 권한 매트릭스, 반 필터 정책, 세션 구조
- **08-OPERATION-MANAGEMENT**: 운영관리 기능정의, 기관 선택 팝업 스펙
- **09-ROADMAP**: Phase별 작업 로드맵, 미결 사항
- **10-CHILD-MANAGEMENT**: 원아관리 스키마, 화면 스펙, 모킹 데이터
- **11-NOTICE-BOARD**: 알림장 스키마, 체크필드, AI 기능, 화면 스펙
- **12-ORG-INFO**: 기관정보 관리 화면 스펙
- **13-CLASS-MANAGEMENT**: 반 관리 화면 스펙, 권한 매트릭스
- **14-OPERATION-DASHBOARD**: 운영관리 대시보드 교사 뷰, 출석현황 모달
- **15-ATTENDANCE**: 출석부 스펙 (준비중)
- **16-MEAL-PLAN**: 식단표 스펙 (준비중)
- **17-MEMBER-APPROVAL**: 멤버/승인 스펙 — 교사+원아 통합 멤버 관리
- **18-GRADUATION**: 진급/졸업 스펙 — 진급/졸업 처리 화면
- **19-ANNOUNCEMENT**: 공지사항 v2 전면 개선 — 칩 필터, 인디케이터, 드로어 재설계, 읽음현황, 임시보관함, 쓰기 모달 확장

> AI 협업 시 `CLAUDE.md`를 기준으로 작업하며, `.brain/`에서 상세 기획을 참조합니다.

---

© 2026 키드키즈 알림장 Admin Panel. All Rights Reserved.
