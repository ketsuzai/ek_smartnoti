# 통합관리자 → 교사관리자 프록시 접속 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 통합관리자가 기관 선택 팝업에서 교사를 선택하고, 해당 교사의 담당 반 권한으로 운영관리 대시보드에 진입할 수 있도록 한다.

**Architecture:** 기관 선택 팝업(operation-org-selector.html)에 Step 2 패널을 추가하여 교사 목록을 보여주고, 선택한 교사의 정보를 `operationContext.proxyTeacherName/Role/Class`와 `assignedClasses`에 저장한다. 대시보드(operation-dashboard.html)에서는 `isOrgMode && opCtx.proxyTeacherName` 조건으로 배너를 렌더링한다.

**Tech Stack:** Vanilla HTML5 / CSS3 / JS (MPA), sessionStorage

---

## 파일 변경 목록

| 파일 | 변경 내용 |
|------|---------|
| `src/pages/oper/operation-org-selector.html` | Step 2 HTML/CSS/JS 추가, 푸터 구조 변경, `getTeachersForOrg()` 추가 |
| `src/pages/oper/operation-dashboard.html` | `.proxy-banner` CSS + HTML + 렌더 로직 추가 |

---

## Task 1: operation-org-selector.html — Step 2 교사 선택 패널

**Files:**
- Modify: `src/pages/oper/operation-org-selector.html`

### Step 1-1: `result-bar`에 id 추가 (JS에서 토글하기 위함)

`<div class="result-bar">` → `<div class="result-bar" id="resultBar">`

- [ ] `operation-org-selector.html` 307번째 줄의 `<div class="result-bar">` 태그에 `id="resultBar"` 추가

```html
<div class="result-bar" id="resultBar">
```

### Step 1-2: `teacher-area` HTML 블록 추가

`.cards-area` 닫는 태그 바로 뒤, `.popup-footer` 바로 앞에 삽입한다.

- [ ] `</div><!-- /cards-area -->` 다음 줄(320번째 줄 직후)에 아래 HTML을 삽입한다:

```html
  <!-- Step 2: 교사 선택 패널 -->
  <div class="teacher-area" id="teacherArea">
    <div class="teacher-step-header">
      <button class="btn-back" onclick="showOrgStep()">← 기관 선택으로</button>
      <span class="teacher-step-org" id="teacherStepOrg"></span>
    </div>
    <div class="teacher-grid" id="teacherGrid"></div>
  </div>
```

### Step 1-3: 푸터 구조 변경 — step1/step2 분리

기존 `.popup-footer` 내부를 step1/step2로 분리한다.

- [ ] 기존 `.popup-footer` 내부 전체를 아래로 교체한다:

```html
  <div class="popup-footer">
    <!-- Step 1 푸터 -->
    <div class="footer-step1" id="footerStep1">
      <div class="selected-preview" id="selectedPreview">
        <span class="selected-preview-empty">선택된 기관이 없습니다.</span>
      </div>
      <div class="footer-btns">
        <button class="btn btn-cancel" onclick="closePopup()">취소</button>
        <button class="btn btn-confirm btn-org" id="confirmOrgBtn" disabled onclick="confirmAsRole('org_admin')">
          🏫 기관관리자로 접속
        </button>
        <button class="btn btn-confirm btn-teacher" id="confirmTeacherBtn" disabled onclick="showTeacherStep()">
          📚 교사 선택 후 접속
        </button>
      </div>
    </div>
    <!-- Step 2 푸터 -->
    <div class="footer-step2" id="footerStep2">
      <div class="selected-preview" id="teacherPreview">
        <span class="selected-preview-empty">교사를 선택하세요.</span>
      </div>
      <div class="footer-btns">
        <button class="btn btn-cancel" onclick="showOrgStep()">← 뒤로</button>
        <button class="btn btn-confirm btn-teacher" id="confirmTeacherFinalBtn" disabled onclick="confirmTeacher()">
          교사를 선택하세요
        </button>
      </div>
    </div>
  </div>
```

### Step 1-4: CSS 추가 — Step 2 스타일

`</style>` 닫는 태그 바로 앞에 아래 CSS를 추가한다.

- [ ] CSS 블록 끝부분(`/* ... */` 마지막 스타일 다음, `</style>` 전)에 삽입:

```css
/* ━━━━━━━━━━ Step 2 교사 선택 ━━━━━━━━━━ */
.teacher-area {
  flex: 1; overflow-y: auto; padding: 0 28px 8px; display: none;
}
.teacher-step-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 0 12px; border-bottom: 1px solid var(--border-light); margin-bottom: 16px;
}
.btn-back {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm); padding: 6px 12px;
  font-size: 13px; color: var(--text-secondary); cursor: pointer; transition: 0.18s;
  font-family: 'Pretendard', sans-serif;
}
.btn-back:hover { background: var(--bg-base); color: var(--text-primary); }
.teacher-step-org { font-size: 13px; color: var(--text-muted); }
.teacher-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.teacher-card {
  border: 2px solid var(--border-light); border-radius: var(--radius-md);
  padding: 16px; cursor: pointer; transition: 0.18s; background: var(--bg-surface);
}
.teacher-card:hover { border-color: var(--accent); }
.teacher-card.selected {
  border-color: var(--accent); background: var(--accent-light);
  box-shadow: 0 0 0 3px rgba(67,97,238,0.15);
}
.teacher-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 10px;
}
.teacher-name { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.teacher-role-badge {
  display: inline-block; font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: 20px; margin-bottom: 6px;
}
.badge-main { background: #DBEAFE; color: #1E40AF; }
.badge-sub  { background: #D1FAE5; color: #065F46; }
.badge-etc  { background: #F3F4F6; color: #6B7280; }
.teacher-class { font-size: 12px; color: var(--text-secondary); }

/* Step 2 푸터 */
.footer-step1 { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.footer-step2 { display: none; align-items: center; justify-content: space-between; width: 100%; }
.teacher-preview-wrap { display: flex; align-items: center; gap: 10px; }
.teacher-preview-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0;
}
.teacher-preview-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.teacher-preview-role { font-size: 12px; color: var(--text-muted); }
```

### Step 1-5: JS 추가 — `getTeachersForOrg()` 함수

`getAllClassesForOrg()` 함수 바로 다음에 삽입한다.

- [ ] `getAllClassesForOrg()` 함수 닫는 `}` 다음 줄에 아래 함수를 추가한다:

```javascript
// ── 기관 소속 교사 목록 생성 (모킹) ──
function getTeachersForOrg(org) {
  const classes = getAllClassesForOrg(org);
  const names  = ['이하늘','박민지','최서연','강지수','정다온','김보라','오민준','서지아','한채린','임하늘','조현아','배성준','정소연','최현우','이민준','윤성호'];
  const colors = ['#4361EE','#10B981','#F59E0B','#EF4444','#8B5CF6','#0EA5E9','#14B8A6','#EC4899','#6366F1','#84CC16','#F97316','#06B6D4'];
  const count  = Math.min(org.teacher, names.length);
  const result = [];
  for (let i = 0; i < count; i++) {
    const isMain = i < org.cls;
    const isSub  = !isMain && i < org.cls * 2;
    result.push({
      id:             `T${String(i + 1).padStart(3, '0')}`,
      name:           names[i],
      role:           isMain ? '담임' : isSub ? '보조' : '기타',
      color:          colors[i % colors.length],
      assignedClasses: isMain ? [classes[i]] : []
    });
  }
  return result;
}
```

### Step 1-6: JS 추가 — Step 2 상태 변수 및 전환 함수

`let selectedOrg = null;` 라인 바로 다음에 `let selectedTeacher = null;`을 추가하고, `confirmAsRole()` 함수 다음에 아래 함수들을 삽입한다.

- [ ] `let selectedOrg = null;` 다음 줄에 추가:

```javascript
let selectedTeacher = null;
```

- [ ] `confirmAsRole()` 함수 닫는 `}` 다음 줄에 아래 함수들을 추가한다:

```javascript
// ── Step 2: 교사 선택 화면으로 전환 ──
function showTeacherStep() {
  if (!selectedOrg) return;
  // 헤더 업데이트
  document.querySelector('.popup-icon').textContent    = '👩‍🏫';
  document.querySelector('.popup-title').textContent   = '교사 선택';
  document.querySelector('.popup-subtitle').textContent = `${selectedOrg.name} 소속 교사를 선택하세요.`;
  // Step 1 요소 숨김
  document.querySelector('.search-bar').style.display = 'none';
  document.querySelector('.filter-row').style.display = 'none';
  document.getElementById('resultBar').style.display  = 'none';
  document.querySelector('.cards-area').style.display = 'none';
  // Step 2 요소 표시
  const teacherArea = document.getElementById('teacherArea');
  teacherArea.style.display = 'block';
  document.getElementById('teacherStepOrg').textContent = `— ${selectedOrg.name}`;
  // 푸터 전환
  document.getElementById('footerStep1').style.display = 'none';
  document.getElementById('footerStep2').style.display = 'flex';
  // 교사 그리드 렌더링
  selectedTeacher = null;
  renderTeacherGrid();
  updateTeacherFooter();
}

// ── Step 1: 기관 선택 화면으로 복귀 ──
function showOrgStep() {
  // 헤더 복원
  document.querySelector('.popup-icon').textContent    = '🏫';
  document.querySelector('.popup-title').textContent   = '운영관리 — 기관 선택';
  document.querySelector('.popup-subtitle').textContent = '접속할 기관을 선택한 후 확인 버튼을 눌러주세요.';
  // Step 2 숨김
  document.getElementById('teacherArea').style.display  = 'none';
  // Step 1 복원
  document.querySelector('.search-bar').style.display = '';
  document.querySelector('.filter-row').style.display = '';
  document.getElementById('resultBar').style.display  = '';
  document.querySelector('.cards-area').style.display = '';
  // 푸터 복원
  document.getElementById('footerStep1').style.display = 'flex';
  document.getElementById('footerStep2').style.display = 'none';
  selectedTeacher = null;
}

// ── 교사 카드 그리드 렌더링 ──
function renderTeacherGrid() {
  window._currentOrgTeachers = getTeachersForOrg(selectedOrg);
  const grid = document.getElementById('teacherGrid');
  grid.innerHTML = window._currentOrgTeachers.map(t => {
    const badgeClass  = t.role === '담임' ? 'badge-main' : t.role === '보조' ? 'badge-sub' : 'badge-etc';
    const classLabel  = t.assignedClasses.length > 0 ? t.assignedClasses.map(c => c.name).join(', ') : '담당 반 없음';
    const isSelected  = selectedTeacher && selectedTeacher.id === t.id;
    return `
      <div class="teacher-card ${isSelected ? 'selected' : ''}" onclick="selectTeacher('${t.id}')">
        <div class="teacher-avatar" style="background:${t.color}">${t.name.charAt(0)}</div>
        <div class="teacher-name">${t.name}</div>
        <span class="teacher-role-badge ${badgeClass}">${t.role}</span>
        <div class="teacher-class">📚 ${classLabel}</div>
      </div>`;
  }).join('');
}

// ── 교사 카드 선택 ──
function selectTeacher(id) {
  selectedTeacher = (window._currentOrgTeachers || []).find(t => t.id === id) || null;
  renderTeacherGrid();
  updateTeacherFooter();
}

// ── 교사 선택 후 푸터 프리뷰 업데이트 ──
function updateTeacherFooter() {
  const preview = document.getElementById('teacherPreview');
  const btn     = document.getElementById('confirmTeacherFinalBtn');
  if (selectedTeacher) {
    const classLabel = selectedTeacher.assignedClasses.length > 0
      ? selectedTeacher.assignedClasses.map(c => c.name).join(', ')
      : '담당 반 없음';
    preview.innerHTML = `
      <div class="teacher-preview-wrap">
        <div class="teacher-preview-avatar" style="background:${selectedTeacher.color}">${selectedTeacher.name.charAt(0)}</div>
        <div>
          <div class="teacher-preview-name">${selectedTeacher.name}</div>
          <div class="teacher-preview-role">${selectedTeacher.role} · ${classLabel}</div>
        </div>
      </div>`;
    btn.disabled    = false;
    btn.textContent = `${selectedTeacher.name} 교사 권한으로 접속`;
  } else {
    preview.innerHTML = '<span class="selected-preview-empty">교사를 선택하세요.</span>';
    btn.disabled    = true;
    btn.textContent = '교사를 선택하세요';
  }
}

// ── 교사 선택 확인 ──
function confirmTeacher() {
  if (!selectedOrg || !selectedTeacher) return;
  const classLabel = selectedTeacher.assignedClasses.map(c => c.name).join(', ');
  const context = {
    orgId:             selectedOrg.id,
    orgName:           selectedOrg.name,
    orgType:           selectedOrg.type,
    director:          selectedOrg.director,
    phone:             selectedOrg.phone,
    address:           selectedOrg.address,
    enteredAt:         new Date().toISOString(),
    contextRole:       'teacher',
    allClassAccess:    false,
    proxyTeacherName:  selectedTeacher.name,
    proxyTeacherRole:  selectedTeacher.role,
    proxyTeacherClass: classLabel
  };
  sessionStorage.setItem('operationContext', JSON.stringify(context));
  sessionStorage.setItem('assignedClasses', JSON.stringify(selectedTeacher.assignedClasses));
  window.location.href = './operation-dashboard.html';
}
```

### Step 1-7: 수동 확인

- [ ] 브라우저에서 `operation-org-selector.html`을 통합관리자로 열기
- [ ] 기관 카드 선택 → `📚 교사 선택 후 접속` 버튼 활성화 확인
- [ ] 클릭 → Step 2 전환 (교사 카드 그리드, 헤더 변경, 검색/필터 숨김) 확인
- [ ] `← 기관 선택으로` 클릭 → Step 1 복귀 확인
- [ ] 교사 카드 선택 → 하단 프리뷰 + 버튼 활성화 확인
- [ ] `[이름] 교사 권한으로 접속` 클릭 → `operation-dashboard.html`로 이동 확인
- [ ] sessionStorage에 `operationContext.proxyTeacherName`, `assignedClasses` 저장 확인

### Step 1-8: Commit

- [ ] 커밋:

```bash
git add src/pages/oper/operation-org-selector.html
git commit -m "feat: 기관 선택 팝업에 교사 선택 Step 2 추가

통합관리자가 기관 선택 후 교사를 지정하여
해당 교사의 담당 반 권한으로 진입할 수 있도록 함"
```

---

## Task 2: operation-dashboard.html — 프록시 교사 접속 배너

**Files:**
- Modify: `src/pages/oper/operation-dashboard.html`

### Step 2-1: CSS 추가 — `.proxy-banner`

`</style>` 닫는 태그 바로 앞에 추가한다.

- [ ] CSS 마지막 스타일 다음, `</style>` 전에 삽입:

```css
/* ━━━ 통합관리자 프록시 배너 ━━━ */
.proxy-banner {
  display: none; align-items: center; gap: 10px; flex-wrap: wrap;
  background: linear-gradient(135deg, #1E3A5F, #0C2D48);
  color: #B8D9F0; border-radius: var(--radius-md);
  padding: 10px 16px; margin-bottom: 16px; font-size: 13px;
}
.proxy-banner strong { color: #fff; }
.proxy-banner-sep { opacity: 0.35; margin: 0 4px; }
.proxy-banner-teacher { display: flex; align-items: center; gap: 6px; }
```

### Step 2-2: HTML 추가 — 배너 엘리먼트

`.page-header` 닫는 `</div>` 다음, `.class-filter-bar` 시작 `<div>` 바로 전에 삽입한다.

현재 구조 (line ~422 ~ 431):
```html
    </div><!-- /page-header -->

    <!-- 반 선택바 -->
    <div class="class-filter-bar">
```

- [ ] `</div><!-- /page-header -->` 다음 줄에 아래 HTML 삽입:

```html
    <!-- 통합관리자 프록시 접속 배너 -->
    <div class="proxy-banner" id="proxyBanner">
      <span>🏫</span>
      <span id="proxyOrgLabel"></span>
      <span class="proxy-banner-sep" id="proxyTeacherSep">|</span>
      <span class="proxy-banner-teacher" id="proxyTeacherLabel"></span>
    </div>
```

### Step 2-3: JS 추가 — 배너 렌더 로직

`init()` 함수 내부, `renderNotices();` 호출 다음 줄에 추가한다.

- [ ] `renderNotices();` 줄 바로 다음에 삽입:

```javascript
  // 통합관리자 프록시 배너 렌더링
  if (isOrgMode) {
    const banner = document.getElementById('proxyBanner');
    banner.style.display = 'flex';
    document.getElementById('proxyOrgLabel').innerHTML =
      `<strong>${opCtx.orgName}</strong> 권한으로 접속 중`;
    if (opCtx.proxyTeacherName) {
      const meta = opCtx.proxyTeacherClass
        ? `(${opCtx.proxyTeacherRole} · ${opCtx.proxyTeacherClass})`
        : `(${opCtx.proxyTeacherRole})`;
      document.getElementById('proxyTeacherLabel').innerHTML =
        `👩‍🏫 교사: <strong>${opCtx.proxyTeacherName}</strong>&nbsp;<span style="opacity:0.65">${meta}</span>`;
    } else {
      document.getElementById('proxyTeacherSep').style.display = 'none';
      document.getElementById('proxyTeacherLabel').style.display = 'none';
    }
  }
```

### Step 2-4: 수동 확인

- [ ] 교사 선택 후 대시보드 진입 시 배너 표시 확인:
  - `🏫 해맑은 어린이집 권한으로 접속 중 | 👩‍🏫 교사: 이하늘 (담임 · 햇님반)` 형태
- [ ] 기관관리자 컨텍스트로 진입 시 배너에서 교사 부분 숨김 확인
- [ ] 직접 교사/기관관리자 계정 로그인 시 배너 미표시 확인 (`isOrgMode = false`)

### Step 2-5: Commit

- [ ] 커밋:

```bash
git add src/pages/oper/operation-dashboard.html
git commit -m "feat: 대시보드에 통합관리자 프록시 접속 배너 추가

교사 선택 후 진입 시 기관명 + 교사명/역할/담당반을 배너로 표시"
```
