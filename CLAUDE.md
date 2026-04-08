# CLAUDE.md — 키드키즈 스마트알림장 운영관리 시스템

> Claude가 이 프로젝트에서 작업할 때 반드시 읽어야 하는 지침서.
> 상세 기획/스키마는 `.brain/` 폴더를 참조한다.

---

## ⚠️ 협업 규칙 (최우선 기준)

### 수정 금지 파일 (특별 지시 없이 절대 수정 불가)

| 파일명 | 설명 |
|--------|------|
| `src/pages/member-approval.html` | 가입/승인 관리 |
| `src/pages/invitation-admin.html` | 초대장 관리 |
| `src/pages/member-status-admin.html` | 회원 상태 관리 |
| `src/pages/member-list-admin.html` | 통합회원 조회 |
| `src/pages/org-admin.html` | 기관관리 |
| `src/pages/dashboard.html` | 대시보드 |

> 수정이 필요한 상황이면 **작업 전 반드시 사용자에게 확인 요청**.

### 작업 범위
- **운영관리 섹션** 신규 화면 제작이 주 작업 범위.
- 신규 파일은 `src/pages/oper/operation-*.html` 패턴으로 생성.
- 매 작업 완료 후 `.brain/` 해당 파일과 `README.md`를 업데이트한다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 키드키즈 스마트알림장 운영관리 시스템 |
| **버전** | v2.4 |
| **도메인** | 유아교육기관(어린이집/유치원) 알림장 서비스 운영관리 백오피스 |
| **기술 스택** | Vanilla HTML5 / CSS3 / JS (MPA), Chart.js 4.4.1 |
| **폰트** | Pretendard, JetBrains Mono |
| **데이터** | 프론트엔드 모킹 (프로토타입) |

---

## 관리자 계층 구조

| 역할 코드 | 역할명 | 사이드바 테마 | 테스트 계정 |
|-----------|--------|-------------|-----------|
| `super` | 통합관리자 | 다크 `#1A1D2E` | admin / 1234 |
| `org_admin` | 기관관리자 | 딥네이비 `#0C2D48` | org_admin / 1234 |
| `teacher` | 교사관리자 | 딥네이비 `#0C2D48` | teacher / 1234 |

---

## 현재 파일 목록

### 통합관리자 전용 (`src/pages/`)

| 파일 | 설명 | 상태 |
|------|------|------|
| `index.html` | 로그인 (진입점) | ✅ 완료 |
| `src/pages/dashboard.html` | 대시보드 | ✅ 완료 (수정 금지) |
| `src/pages/member-list-admin.html` | 통합회원 조회 | ✅ 완료 (수정 금지) |
| `src/pages/member-approval.html` | 가입/승인 관리 | ✅ 완료 (수정 금지) |
| `src/pages/invitation-admin.html` | 초대장 관리 | ✅ 완료 (수정 금지) |
| `src/pages/member-status-admin.html` | 회원 상태 관리 | ✅ 완료 (수정 금지) |
| `src/pages/org-admin.html` | 기관관리 | ✅ 완료 (수정 금지) |

### 운영관리 섹션 (`src/pages/oper/`)

| 파일 | 설명 | 상태 |
|------|------|------|
| `src/pages/oper/operation-dashboard.html` | 운영관리 대시보드 (기관·교사 공용) | ✅ 완료 |
| `src/pages/oper/operation-org-selector.html` | 기관 선택 팝업 | ✅ 완료 |
| `src/pages/oper/operation-notice-board.html` | 알림장 | ✅ 완료 |
| `src/pages/oper/operation-invitation.html` | 초대 관리 | ✅ 완료 |
| `src/pages/oper/operation-org-info.html` | 기관정보 관리 | ✅ 완료 |
| `src/pages/oper/operation-child.html` | 원아관리 | ✅ 완료 |
| `src/pages/oper/operation-class.html` | 반 관리 | ✅ 완료 |
| `src/pages/oper/operation-announcement.html` | 공지사항 | ✅ 완료 |
| `src/pages/oper/operation-album.html` | 앨범 | ✅ 완료 |
| `src/pages/oper/operation-schedule.html` | 스케쥴 | 🔲 미시작 |
| `src/pages/oper/operation-consulting.html` | 상담 관리 | 🔲 미시작 |
| `src/pages/oper/operation-medicine.html` | 투약의뢰서 관리 | ✅ 완료 |
| `src/pages/oper/operation-attendance.html` | 출석부 | 🔲 미시작 |
| `src/pages/oper/operation-meal.html` | 식단표 | ✅ 완료 |
| `src/pages/oper/operation-member.html` | 멤버/승인 (교사+원아 통합) | 🔲 미시작 |
| `src/pages/oper/operation-graduation.html` | 진급/졸업 | 🔲 미시작 |

---

> 상세 설계원칙·디자인시스템·권한 로직은 `.brain/07-ROLE-PERMISSION.md`, `.brain/06-DESIGN-SYSTEM.md` 참조.

---

## .brain/ 파일 인덱스

| 파일 | 내용 |
|------|------|
| `00-PROJECT-OVERVIEW.md` | 전체 개요, 수정 금지 목록, 화면 목록, 사이드바 구조 |
| `01-MEMBER-MANAGEMENT.md` | 회원 관리 기능정의 |
| `02-ORG-MANAGEMENT.md` | 기관 관리 기능정의 |
| `03-INVITATION-MANAGEMENT.md` | 초대장 관리 기능정의 |
| `04-DASHBOARD.md` | 대시보드 KPI·차트 |
| `05-DATABASE-SCHEMA.md` | 전체 DB 스키마 |
| `06-DESIGN-SYSTEM.md` | 색상·그림자·라운딩·컴포넌트 패턴 상세 |
| `07-ROLE-PERMISSION.md` | 역할별 권한 매트릭스, 세션 분기 로직 |
| `08-OPERATION-MANAGEMENT.md` | 운영관리 기능정의, 기관 선택 팝업 스펙 |
| `09-ROADMAP.md` | Phase별 작업 로드맵, 미결 사항 |
| `10-CHILD-MANAGEMENT.md` | 원아관리 스키마, 화면 스펙, 모킹 데이터 |
| `11-NOTICE-BOARD.md` | 알림장 스키마, 체크필드, AI 기능, 화면 스펙 |
| `12-ORG-INFO.md` | 기관정보 관리 화면 스펙 |
| `13-CLASS-MANAGEMENT.md` | 반 관리 화면 스펙, 권한 매트릭스 |
| `14-OPERATION-DASHBOARD.md` | 운영관리 대시보드 — 교사 뷰, 출석현황 모달, pre-fill 연동 |
| `15-ATTENDANCE.md` | 출석부 스펙 (준비중) |
| `16-MEAL-PLAN.md` | 식단표 스펙 (준비중) |
| `17-MEMBER-APPROVAL.md` | 멤버/승인 — 교사+원아 통합 멤버 관리 (준비중) |
| `18-GRADUATION.md` | 진급/졸업 스펙 (준비중) |
| `19-ANNOUNCEMENT.md` | 공지사항 v2 전면 개선 스펙 — 칩 필터, 인디케이터, 드로어 재설계, 읽음현황, 임시보관함, 쓰기 모달 확장 |
