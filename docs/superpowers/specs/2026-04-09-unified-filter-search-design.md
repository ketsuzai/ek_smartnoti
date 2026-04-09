# Unified Filter & Search Design

**Date:** 2026-04-09  
**Scope:** `src/pages/oper/` 전체 페이지 필터/검색 컴포넌트 통일

---

## 1. 표준 필터바 (Standard Filter Bar)

### HTML 구조
```html
<div class="filter-bar">
  <div class="filter-group">
    <!-- 드롭다운 필터 (onchange 즉시 반영) -->
    <div class="fsel-wrap">
      <select class="fsel" id="classFilter" onchange="applyFilter()">
        <option value="">전체 반</option>
      </select>
    </div>

    <!-- 일반 텍스트 검색 (버튼/Enter만 트리거) -->
    <div class="search-wrap">
      <input class="search-inp" id="searchInput" placeholder="검색어 입력"
             onkeydown="if(event.key==='Enter') applyFilter()">
      <button class="search-btn" onclick="applyFilter()">검색</button>
    </div>

    <!-- 초기화 -->
    <button class="btn-reset" onclick="resetFilter()">초기화</button>
  </div>
</div>
```

### 원칙
- 드롭다운 `onchange` → 즉시 `applyFilter()` 호출 허용
- 텍스트 검색 → 반드시 버튼 클릭 or Enter 트리거 (`oninput` 사용 금지)
- 함수명: `applyFilter()` / `resetFilter()` 고정
- 초기화 버튼: 항상 `.btn-reset` 클래스

### CSS 클래스 매핑
| 클래스 | 용도 |
|--------|------|
| `.filter-bar` | 필터바 컨테이너 (bg surface, padding, rounded, shadow) |
| `.filter-group` | 내부 flex 래퍼 (gap, flex-wrap) |
| `.fsel-wrap` | select 래퍼 (::after pseudo로 화살표) |
| `.fsel` | select 요소 (34px height) |
| `.search-wrap` | 검색 input 컨테이너 |
| `.search-inp` | 텍스트 입력창 |
| `.search-btn` | 검색 버튼 |
| `.btn-reset` | 초기화 버튼 (outline style) |

---

## 2. Selectable Search 컴포넌트

드롭다운으로 검색 대상 필드를 선택하고 단일 input으로 검색하는 패턴.

### HTML 구조
```html
<div class="search-wrap search-selectable">
  <div class="fsel-wrap search-field-sel">
    <select class="fsel" id="searchField">
      <option value="childName">원아명</option>
      <option value="parentName">학부모명</option>
      <!-- 페이지별 옵션 조정 -->
    </select>
  </div>
  <input class="search-inp" id="searchInput" placeholder="검색어 입력"
         onkeydown="if(event.key==='Enter') applyFilter()">
  <button class="search-btn" onclick="applyFilter()">검색</button>
</div>
```

### JS 패턴
```js
function applyFilter() {
  const field = document.getElementById('searchField').value;
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  // 기타 드롭다운 필터값도 여기서 수집

  filteredData = allData.filter(item => {
    // 1) 기타 드롭다운 필터
    if (classFilter && item.className !== classFilter) return false;

    // 2) selectable search (빈 쿼리면 통과)
    if (query) {
      switch(field) {
        case 'childName':
          if (!item.childName.toLowerCase().includes(query)) return false;
          break;
        case 'parentName':
          if (!item.parentName.toLowerCase().includes(query)) return false;
          break;
        case 'phone':
          if (!item.phone.includes(query)) return false;
          break;
      }
    }

    return true;
  });

  renderList();
}

function resetFilter() {
  // 모든 select를 첫 번째 option으로, input을 빈 값으로
  document.getElementById('classFilter').value = '';
  document.getElementById('searchField').value = 'childName'; // 기본값
  document.getElementById('searchInput').value = '';
  applyFilter();
}
```

### 동작 규칙
- 드롭다운 선택 필드 **1개만** 검색 (OR 조건 아님)
- 검색어 비어있으면 해당 필드 조건 무시 (전체 표시)
- 드롭다운 필터와 selectable search는 AND 조건으로 조합

### 적용 페이지
| 페이지 | 검색 필드 옵션 |
|--------|--------------|
| `operation-notice-board.html` | 원아명 / 학부모명 |
| `operation-member.html` (신규) | 교사명 / 원아명 / 전화번호 |

---

## 3. 칩 필터 (Chip Filter)

리스트 내부의 반 선택 등에 사용. **동적** — 클릭 즉시 필터링.

```html
<div class="chip-filter-row" id="classChipRow"></div>
<!-- JS로 렌더링: -->
<!-- <button class="filter-chip [active]" onclick="selectClassChip(name)">햇님반</button> -->
```

현행 유지. `operation-announcement.html` 참조.

---

## 4. 페이지별 적용 현황

| 페이지 | Selectable | 비고 |
|--------|------------|------|
| `operation-notice-board.html` | ✅ 원아명/학부모명 | received 탭 static query 전환 |
| `operation-class.html` | ❌ | btn-reset 클래스 통일 |
| `operation-invitation.html` | ❌ | filter-select → fsel 통일 |
| `operation-medicine.html` | ❌ | btn-reset 버튼 추가 |
| `operation-album.html` | ❌ | oninput → 버튼 트리거 |
| `operation-announcement.html` | ❌ | 칩 필터 dynamic 유지 |
| `operation-attendance.html` | ❌ | 날짜+반 네비게이션 — 별도 패턴 |
| `operation-meal.html` | ❌ | 캘린더 UI — 변경 없음 |
| `operation-child.html` | ❌ | member.html로 통합 예정 (제외) |
| `operation-member.html` | ✅ 교사명/원아명/전화번호 | 신규 구축 시 포함 |
