# 🧠 프로젝트 브레인: 운영관리 기능정의

> **최종 업데이트**: 2026-03-26
> **작업 범위**: 통합관리자 전용 — 운영관리 메뉴
> **연관 브레인**: `07-ROLE-PERMISSION.md`

---

## ⚡ QUICK REF
> 운영관리 공통 패턴. 각 서브메뉴 상세는 개별 브레인 참조.

- **진입**: 통합관리자 → 기관 선택 팝업 → 역할 선택(기관관리자/교사관리자) → operationContext 세션 저장 → 서브메뉴
- **컨텍스트 세션**: `sessionStorage.setItem('operationContext', JSON.stringify({orgId, orgName, orgType, contextRole, allClassAccess}))`
- **상단바**: `🏫 OO어린이집 · 운영관리 모드  [기관 변경]  [컨텍스트 종료]`
- **사이드바 테마**: `#0C2D48` (딥네이비), 액센트 `#0EA5E9`
- **서브메뉴 완료**: 알림장 ✅ / 초대관리 ✅ / 기관정보 ✅ / 반관리 ✅ / 원아관리 ✅
- **서브메뉴 미완**: 일정관리 / 상담관리
- **기관선택팝업**: ✅ 개선 완료 (페이지네이션, 검색 버튼, 기관관리자/교사관리자 이중 진입)
- **대시보드**: 교사 뷰 원아 출석현황 모달 구현 완료 (2026-03-24) → `14-OPERATION-DASHBOARD.md` 참조

---

## 1. 운영관리 개요

운영관리는 **통합관리자 전용** 메뉴로, 모든 기관의 정보·반·원아 및 콘텐츠를 직접 확인하고 조작할 수 있는 슈퍼 운영 도구다.

### 핵심 개념

- 통합관리자는 **기관 선택 팝업**을 통해 원하는 기관을 선택한다.
- 선택 후 **해당 기관의 기관관리자와 동일한 권한 컨텍스트**로 접속된다.
- 세션은 통합관리자(super) 그대로 유지 — **권한 컨텍스트만 전환**되는 방식이다.
- 이는 정적 HTML 환경에서 `sessionStorage` 또는 `localStorage`에 현재 선택된 기관 정보를 저장하는 방식으로 구현 가능하다.

```
[통합관리자] → [운영관리 클릭] → [기관 선택 팝업]
  → [기관 선택 + 확인] → [해당 기관 컨텍스트로 운영관리 진입]
  → 상단바에 "🏫 OO어린이집 권한으로 접속 중" 표시
  → 기관 재선택 / 컨텍스트 종료 버튼 제공
```

---

## 2. 기관 선택 팝업 (`org-selector-popup`)

### 2.1 진입 조건
- 통합관리자가 사이드바의 **운영관리** 메뉴 클릭 시 노출
- 현재 선택된 기관이 없거나, 재선택 버튼 클릭 시에도 노출

### 2.2 UI 형태
- **모달 팝업** 형태 (새 탭 아님, 오버레이 레이어)
- 배경 dim 처리
- 상단: 제목 + 검색 입력창
- 중단: 기관 카드 그리드 (2~3열)
- 하단: 선택된 기관 표시 + 확인/취소 버튼

### 2.3 기관 카드 표시 항목
| 항목 | 필드 | 비고 |
|------|------|------|
| 기관명 | `name` | 크게 표시 |
| 기관 유형 | `type` | 어린이집 / 유치원 뱃지 |
| 원장 이름 | `director` | |
| 주소 | `address` | 신규 필드 추가 필요 |
| 전화번호 | `phone` | |
| 이용 상태 | `status` | 이용중 / 이용종료 표시 |

### 2.4 검색 기능
- **정적 검색**: 검색 버튼 클릭 또는 Enter 키로 실행 (실시간 필터링 아님)
- 검색 대상: **기관명**, **원장이름**, **주소**
- 필터 칩: 전체 / 어린이집 / 유치원 / 이용중 / 이용종료
- 검색 결과 없을 시 "검색 결과가 없습니다" 표시

### 2.5 페이지네이션
- **6개/페이지** (2행 × 3열) 기관 카드 표시
- 하단에 ◀ 이전 | 1 2 3 ... | 다음 ▶ 페이지 네비게이션
- 검색/필터 변경 시 1페이지로 자동 리셋

### 2.6 선택 및 확인 (이중 진입)
- 카드 클릭 → 선택 상태 강조 (border, 체크 아이콘)
- **🏫 기관관리자로 접속**: `contextRole: 'org_admin'` 설정, 기관관리자 뷰로 진입
- **📚 교사관리자로 접속**: `contextRole: 'teacher'` + `allClassAccess: true` 설정, 교사 뷰로 진입 (모든 반 접근 가능)
- **취소 버튼**: 팝업 닫기 (이전 화면 유지)

### 2.7 저장 데이터 구조 (sessionStorage)
```javascript
// 기관관리자로 접속 예시
sessionStorage.setItem('operationContext', JSON.stringify({
  orgId:          'ORG001',
  orgName:        '해맑은 어린이집',
  orgType:        '어린이집',
  director:       '김원장',
  phone:          '02-1234-5678',      // 기관 전화번호
  address:        '서울 마포구 신수동 123', // 기관 주소
  enteredAt:      '2026-03-26T10:00:00',
  contextRole:    'org_admin',          // 'org_admin' | 'teacher'
  allClassAccess: false                 // teacher 진입 시 true (전체 반 접근)
}));

// 교사관리자로 접속 시 추가 세팅:
// contextRole: 'teacher', allClassAccess: true
sessionStorage.setItem('assignedClasses', JSON.stringify([
  { id: 'CLS001', name: '햇님반', age: '만0세', studentCount: 18 },
  { id: 'CLS002', name: '달님반', age: '만1세', studentCount: 16 }
]));
```

### 2.8 다운스트림 역할 해석 (effectiveRole 패턴)
모든 운영관리 페이지에서 `operationContext.contextRole`을 우선 참조하여 역할 판별:
```javascript
const opCtx = JSON.parse(sessionStorage.getItem('operationContext') || 'null');
const effectiveRole = (opCtx && opCtx.contextRole) ? opCtx.contextRole : userRole;
const isTeacher = effectiveRole === 'teacher';
```
`userRole`은 항상 `'super'` 유지, `contextRole`로 뷰 결정.

---

## 3. 운영관리 컨텍스트 상태 표시

### 3.1 상단바 표시
- 운영관리 컨텍스트 진입 시 상단바에 표시:
  ```
  🏫 해맑은 어린이집 · 운영관리 모드  [기관 변경]  [컨텍스트 종료]
  ```
- **기관 변경** 버튼: 기관 선택 팝업 재호출
- **컨텍스트 종료** 버튼: sessionStorage 초기화 → 일반 대시보드로 이동

### 3.2 사이드바 표시
- 운영관리 컨텍스트 진입 시 사이드바 구조 변경 (운영관리 서브메뉴로 전환)
- **구현**: `src/pages/oper/operation-sidebar.js` 공통 컴포넌트가 담당
  - 각 `operation-*.html` 페이지에서 `<script src="operation-sidebar.js" defer></script>` + `<aside id="appSidebar"></aside>` 선언만으로 사이드바 자동 렌더링
  - `effectiveRole` (= `operationContext.contextRole` 우선, fallback `userRole`) 기반으로 배지·포털 라벨·컨텍스트 배너 자동 전환
  - 통합관리자 + `operationContext` 존재 시: `superContextBanner` 표시 (기관 변경 / 컨텍스트 종료 버튼)
  - 활성 메뉴는 현재 파일명 자동 감지 — per-page 코드 불필요

---

## 4. 운영관리 서브메뉴 구성

통합관리자가 기관 선택 후 접근 가능한 메뉴 (기관관리자·교사관리자와 동일한 페이지 재사용):

### 4.1 기관관리 그룹

| # | 메뉴명 | 파일명 (신규 생성 예정) | 기능 요약 |
|---|--------|----------------------|----------|
| 1 | 기관정보 관리 | `operation-org-info.html` ✅ | 해당 기관 기본정보 조회·수정 (완료 2026-03-23) |
| 2 | 반 관리 | `operation-class.html` | 반 목록 조회·생성·수정·삭제 |

> 📌 반 관리는 기관 운영 구조(기관관리 그룹)에 해당하여 콘텐츠 관리와 분리됨 (2026-03-18 결정)

### 4.2 원아 및 콘텐츠 관리 그룹

| # | 메뉴명 | 파일명 (신규 생성 예정) | 기능 요약 |
|---|--------|----------------------|----------|
| 1 | 원아 관리 | `operation-child.html` | 원아 목록 조회·등록·상태관리 |
| 2 | 알림장 | `operation-notice-board.html` | 알림장 목록 조회·상세 |
| 3 | 공지사항 | `operation-announcement.html` | 공지사항 조회·작성·수정·삭제 |
| 4 | 앨범 | `operation-album.html` | 사진첩 조회 |
| 5 | 일정 관리 | `operation-schedule.html` | 기관 일정 조회·관리 |
| 6 | 상담 관리 | `operation-consulting.html` | 상담 이력 조회·관리 |
| 7 | 투약의뢰서 관리 | `operation-medicine.html` | 투약의뢰서 조회·관리 |
| 8 | 초대 관리 | `operation-invitation.html` | 학부모/교직원 초대 링크 관리, 이력 조회 |

> 📌 **통합관리자(운영관리 컨텍스트), 기관관리자, 교사관리자 모두 동일한 페이지 사용**
> 권한 차이는 `effectiveRole` (= `operationContext.contextRole` || `userRole`) + `sessionStorage.operationContext`로 분기

---

## 5. 세션/권한 컨텍스트 구현 방식

### 5.1 정적 HTML 환경에서의 구현 방안

```
✅ 가능한 방식: sessionStorage 기반 컨텍스트 전환
- 로그인 정보: sessionStorage.userRole = 'super'
- 운영관리 기관: sessionStorage.operationContext = { orgId, orgName, ... }
- 각 페이지 진입 시 sessionStorage 체크 → 컨텍스트 적용
```

### 5.2 페이지 진입 시 권한 체크 로직
```javascript
// 공통 진입 체크 (각 페이지 상단에 포함)
const userRole = sessionStorage.getItem('userRole'); // 'super' | 'org_admin' | 'teacher'
const opContext = JSON.parse(sessionStorage.getItem('operationContext') || 'null');

if (userRole === 'super' && opContext) {
  // 통합관리자 + 기관 컨텍스트 선택됨 → 운영관리 모드
  applyOperationContext(opContext);
} else if (userRole === 'org_admin') {
  // 기관관리자 → 자신의 기관 컨텍스트 자동 적용
} else if (userRole === 'teacher') {
  // 교사관리자 → 담당 반 컨텍스트 적용
}
```

### 5.3 세션 유지 정책
- 통합관리자 세션은 그대로 유지
- 기관 컨텍스트는 브라우저 탭 세션 동안 유지 (`sessionStorage`)
- 탭 닫기 또는 로그아웃 시 컨텍스트 초기화

---

## 6. 데이터 모델 추가 필요 항목

### 6.1 기관 주소 필드 추가 (organizations 테이블)
현재 `05-DATABASE-SCHEMA.md`의 organizations 테이블에 주소 필드 없음 → 추가 필요

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `address` | text | 기관 주소 (기관 선택 팝업 카드에 표시) |
| `address_detail` | text | 상세 주소 |

### 6.2 원아 테이블 신규 정의 필요
현재 브레인에 원아(children) 테이블 스키마 없음 → 추후 기획 시 정의

---

## 7. 기획 진행 순서 (우선순위)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 1 | 로그인 페이지 3계정 테스트 버튼 추가 | `index.html` | ✅ 수정 허용 확인 완료 |
| 2 | 기관 선택 팝업 구현 | `src/pages/oper/operation-org-selector.html` | ✅ 완료 + 개선 (2026-03-26, 페이지네이션·검색버튼·이중진입) |
| 3 | 운영관리 레이아웃 공통 구성 | `src/pages/operation-layout.html` | 🔲 미시작 |
| 4 | 각 운영관리 서브 페이지 구현 | 위 4번 항목 참조 | 🔄 진행 중 |
| — | ↳ 알림장 | `operation-notice-board.html` | ✅ 완료 (2026-03-23) |
| — | ↳ 초대 관리 | `operation-invitation.html` | ✅ 완료 (2026-03-23) |
| — | ↳ 기관정보 관리 | `operation-org-info.html` | ✅ 완료 (2026-03-23) |
| — | ↳ 반 관리 | `operation-class.html` | ✅ 완료 (2026-03-23) |
| — | ↳ 원아 관리 | `operation-child.html` | ✅ 완료 (2026-03-24) |
| — | ↳ 공지사항 | `operation-announcement.html` | ✅ 완료 (2026-03-24) |
| — | ↳ 앨범 | `operation-album.html` | ✅ 완료 (2026-03-24) |
| — | ↳ 대시보드 | `operation-dashboard.html` | 🔄 교사 뷰 구현 완료 (2026-03-24) |
| — | ↳ 일정 관리 | `operation-schedule.html` | 🔲 미시작 |
| — | ↳ 상담 관리 | `operation-consulting.html` | 🔲 미시작 |
| — | ↳ 투약의뢰서 관리 | `operation-medicine.html` | ✅ 완료 (2026-03-24) |
| 5 | 통계 메뉴 → 대시보드 연동 | 기존 `dashboard.html` 활용 | 🔲 미시작 |

> ⚠️ `index.html` 수정이 필요한 경우 → 기획자 확인 후 진행

---

## 8. 미결 사항 (Pending)

| 항목 | 내용 | 확인 필요 |
|------|------|----------|
| 기관관리자·교사관리자 로그인 리다이렉트 대상 페이지 | 메인 대시보드 (역할별 다름) | ✅ 확인 완료 |
| 하늘색 테마 정확한 색상 값 | AI가 적절히 결정 후 구현 | ✅ 확인 완료 |
| 원아 테이블 스키마 | 필드 정의 필요 | 🔲 추후 논의 |
| 운영관리 진입 시 기본 랜딩 페이지 | 기관관리자 대시보드 (`org-dashboard.html`) | ✅ 확인 완료 |
