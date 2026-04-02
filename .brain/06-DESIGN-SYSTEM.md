# 🧠 프로젝트 브레인: 디자인 시스템 & 공통 스타일 가이드

> **최종 업데이트**: 2026-04-02

---

## ⚡ QUICK REF
> 빌드 시 핵심 토큰. 상세 패턴은 아래 참조.

```
레이아웃: 사이드바 240px / 상단바 60px / 카드 radius 12~16px
배경: --bg-base #F4F5F7 / --bg-surface #FFFFFF
사이드바: 통합관리자 #1A1D2E / 운영관리·기관교사 #0C2D48
액센트: 통합관리자 #4361EE / 운영관리 #0EA5E9
텍스트: primary #1A1D2E / secondary #6B7280 / border #E5E7EB
상태색: 성공/활성 #10B981(bg #D1FAE5) / 정보 #3B82F6(bg #DBEAFE)
        경고 #F59E0B(bg #FEF3C7) / 위험 #EF4444(bg #FEE2E2) / 특수 #8B5CF6(bg #EDE9FE)
```
```html
<!-- 상태 뱃지 -->  <span class="sbadge"><span class="sdot"></span>상태명</span>
<!-- 필터 셀렉트 --> <div class="fsel-wrap"><select class="fsel">...</select></div>
<!-- 검색 -->        <div class="search-wrap"><input class="search-inp"><button class="search-btn">🔍</button></div>
```

---

## 1. 색상 시스템 (CSS Variables)

### 1.1 기본 색상
| 변수명 | 값 | 용도 |
|--------|------|------|
| `--bg-base` | #F4F5F7 | 페이지 배경 |
| `--bg-surface` | #FFFFFF | 카드/패널 배경 |
| `--bg-sidebar` | #1A1D2E | 사이드바 배경 |
| `--bg-sidebar-hover` | #252840 | 사이드바 호버 |
| `--bg-sidebar-active` | #2E3250 | 사이드바 활성 |

### 1.2 액센트 색상
| 변수명 | 값 | 용도 |
|--------|------|------|
| `--accent-primary` / `--accent` | #4361EE | 주요 액센트 (버튼, 링크) |
| `--accent-primary-light` / `--accent-light` | #EEF1FD | 액센트 라이트 배경 |
| `--accent-secondary` | #3A0CA3 | 보조 액센트 |

### 1.3 텍스트 색상
| 변수명 | 값 | 용도 |
|--------|------|------|
| `--text-primary` | #1A1D2E | 주요 텍스트 |
| `--text-secondary` | #6B7280 | 보조 텍스트 |
| `--text-muted` | #9CA3AF | 비활성 텍스트 |
| `--text-sidebar` | #C5C9D6 | 사이드바 텍스트 |

### 1.4 보더 색상
| 변수명 | 값 | 용도 |
|--------|------|------|
| `--border-light` | #E5E7EB | 기본 보더 |
| `--border-medium` | #D1D5DB | 강조 보더 |

### 1.5 시멘틱 색상
| 색상 | 변수 | 배경 | 텍스트 | 용도 |
|------|------|------|--------|------|
| 초록 | `--green` #10B981 | `--green-bg` #D1FAE5 | `--green-text` #065F46 | 성공, 활성, 승인 |
| 파랑 | `--blue` #3B82F6 | `--blue-bg` #DBEAFE | `--blue-text` #1E40AF | 정보, 재원중 |
| 황색 | `--amber` #F59E0B | `--amber-bg` #FEF3C7 | `--amber-text` #92400E | 경고, 대기 |
| 빨강 | `--red` #EF4444 | `--red-bg` #FEE2E2 | `--red-text` #991B1B | 위험, 거절, 탈퇴 |
| 보라 | `--purple` #8B5CF6 | `--purple-bg` #EDE9FE | `--purple-text` #5B21B6 | 특수, 졸업 |
| 시안 | `--cyan` #06B6D4 | `--cyan-bg` #CFFAFE | `--cyan-text` #164E63 | 보조 정보 |

---

## 2. 그림자 시스템
| 변수명 | 값 | 용도 |
|--------|------|------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | 미세한 그림자 |
| `--shadow-md` | 0 4px 12px rgba(0,0,0,0.08) | 중간 그림자 |
| `--shadow-lg` | 0 8px 28~32px rgba(0,0,0,0.10~12) | 큰 그림자 |
| `--shadow-modal` | 0 20px 60px rgba(0,0,0,0.18) | 모달 그림자 |

---

## 3. 테두리 라운딩
| 변수명 | 값 | 용도 |
|--------|------|------|
| `--radius-sm` | 6px | 작은 요소 (태그, 뱃지) |
| `--radius-md` | 8~10px | 버튼, 입력필드 |
| `--radius-lg` | 12~14px | 카드 |
| `--radius-xl` | 16~18px | 큰 카드, 모달 |

---

## 4. 레이아웃 상수
| 변수명 | 값 |
|--------|------|
| `--sidebar-width` | 240px |
| `--header-height` | 60px |

---

## 5. 폰트
| 폰트 | 용도 |
|------|------|
| Pretendard (300~800) | 메인 UI 폰트 |
| JetBrains Mono (400, 500) | 코드, 날짜, 숫자 |

### 5.1 Typography Scale (1920×1080 기준)

| 토큰명 | 크기 | 용도 | 예시 클래스 |
|--------|------|------|-------------|
| `--fs-xs`  | 11px | 배지·태그 (공간 제약 시 최소) | `.notice-tag`, `.non-assigned-mark` |
| `--fs-sm`  | 12px | 보조 텍스트·날짜·타임스탬프 | `.act-time`, `.notice-date`, `.todo-cnt` |
| `--fs-md`  | 13px | 일반 본문·라벨·설명 | `.kpi-label`, `.card-action`, `.todo-text` |
| `--fs-base`| 14px | 주요 본문·카드 제목·입력값 | `.card-title`, `.breadcrumb`, `.cls-name` |
| `--fs-lg`  | 16px | 섹션 헤더·모달 제목 | `.att-modal-title`, `.act-modal-title` |
| `--fs-xl`  | 18–21px | 페이지 제목 | `.page-title` |

### 5.2 접근성 규칙 (Accessibility Rules)

> **레퍼런스:** GitHub Primer 14/12/11px · Stripe Dashboard 14/12px · WCAG 2.2 최소 12px(9pt)

- **절대 금지:** 10px 이하 — 어떤 경우에도 사용 불가
- **최소값:** 11px — 공간 제약이 극심한 배지·태그 텍스트에만 허용
- **본문 최소:** 12px — 날짜, 타임스탬프, 보조 설명 등 사용자가 읽어야 하는 텍스트 전체
- **권장 기본:** 13–14px — 사용자가 주로 읽는 모든 콘텐츠
- **예외 허용:** `::after` · `::before` pseudo-element 장식 아이콘은 적용 제외

#### 적용 매핑 테이블

| 기존 | 변경 후 | 조건 |
|------|---------|------|
| ≤ 9px | **11px** | 배지·태그 (공간 제약) |
| 10px | **12px** | 모든 가독 텍스트 |
| 11px | **12px** | 보조 텍스트 (pseudo-element 제외) |
| 12px | **13px** | 라벨·액션·탭 버튼 등 |
| 12.5px | **13px** | 카드 내 본문 텍스트 |
| 13px | **14px** | 주요 본문·카드 제목 |
| 13.5px | **14px** | 카드 제목 |
| 14px 이상 | **유지** | 변경 없음 |

---

## 6. 공통 UI 컴포넌트 패턴

### 6.1 상태 뱃지 (Status Badge)
```html
<span class="sbadge" style="background:var(--bg);color:var(--text)">
  <span class="sdot" style="background:var(--dot)"></span>
  상태명
</span>
```

### 6.2 필터 셀렉트
```html
<div class="fsel-wrap">
  <select class="fsel">...</select>
</div>
```

### 6.3 검색 입력
```html
<div class="search-wrap">
  <input class="search-inp" placeholder="검색...">
  <button class="search-btn">🔍</button>
</div>
```

### 6.4 토스트 알림
```javascript
function showToast(msg) { /* 하단 우측, 2.6초 자동 소멸 */ }
```

### 6.5 확인 모달
```html
<div class="cm-overlay" id="cmOverlay">
  <div class="cm-box">
    <div class="cm-title">제목</div>
    <div class="cm-msg">메시지</div>
    <div class="cm-btns">
      <button class="cm-btn cm-cancel">취소</button>
      <button class="cm-btn" id="cmOk">확인</button>
    </div>
  </div>
</div>
```

### 6.6 사이드 디테일 패널
- 우측에서 슬라이드인
- overlay(반투명 배경) + panel 조합
- 닫기 버튼 + ESC 키 닫기
