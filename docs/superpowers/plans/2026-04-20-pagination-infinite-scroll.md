# 페이지네이션 / 무한스크롤 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 운영관리 7개 화면에 페이지네이션(5개) 또는 무한스크롤(2개)을 적용한다.

**Architecture:** 각 HTML 파일은 단독으로 동작하므로 공유 JS 없이 파일별로 직접 수정한다. 페이지네이션은 `« ‹ 1~10 › »` 그룹형 표준을 적용하고, 무한스크롤은 IntersectionObserver를 사용한다.

**Tech Stack:** Vanilla JS, IntersectionObserver API, 기존 CSS 변수 시스템

---

## 현황 요약

| 화면 | 파일 | 현재 상태 | 목표 |
|------|------|-----------|------|
| 공지사항 | `operation-announcement.html` | renderTable — 전체 출력 | 페이지네이션 추가 |
| 투약의뢰서 | `operation-medicine.html` | renderTable — 전체 출력 | 페이지네이션 추가 |
| 멤버/승인 | `operation-member.html` | renderPageBtns — ‹/›만 | « ‹ 1~10 › » 업그레이드 |
| 진급/졸업 | `operation-graduation.html` | renderPagination — «/» 없음 | « ‹ 1~10 › » 업그레이드 |
| 초대장관리 | `operation-invitation.html` | renderHistoryTable — 전체 출력 | 히스토리 테이블에 페이지네이션 추가 |
| 알림장 | `operation-notice-board.html` | renderTable — 전체 출력 | 무한스크롤 |
| 앨범 | `operation-album.html` | renderAlbums — 전체 출력 | 무한스크롤 |

---

## 표준 페이지네이션 스펙

- 한 페이지당 **10건**
- 페이지 그룹: 한 번에 최대 **10개 번호** 표시 (1~10, 11~20, …)
- 버튼: `«` 처음 / `‹` 이전 / 페이지 번호들 / `›` 다음 / `»` 끝
- 우측 텍스트: `1–10 / 43건`
- 1페이지뿐이면 페이지네이션 영역 숨김

```javascript
// 모든 페이지네이션 화면에 공통 적용할 함수 템플릿
const PAGE_SIZE = 10;

function renderPagination(containerId, total, currentPage, goFnName) {
  const el = document.getElementById(containerId);
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  if (totalPages <= 1) { el.style.display = 'none'; return; }
  el.style.display = 'flex';

  const groupStart = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const groupEnd   = Math.min(groupStart + 9, totalPages);
  const pages = [];
  for (let p = groupStart; p <= groupEnd; p++) pages.push(p);

  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to   = Math.min(currentPage * PAGE_SIZE, total);

  el.innerHTML = `
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="${goFnName}(1)" title="처음">«</button>
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="${goFnName}(${currentPage-1})" title="이전">‹</button>
    ${pages.map(p=>`<button class="page-btn${p===currentPage?' active':''}" onclick="${goFnName}(${p})">${p}</button>`).join('')}
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="${goFnName}(${currentPage+1})" title="다음">›</button>
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="${goFnName}(${totalPages})" title="끝">»</button>
    <span class="page-info">${from}–${to} / ${total}건</span>
  `;
}
```

### 페이지네이션 CSS (각 파일 `<style>` 블록에 없으면 추가)

```css
.pagination{display:flex;align-items:center;justify-content:center;gap:4px;padding:14px 16px;border-top:1px solid var(--border-light);}
.page-btn{min-width:32px;height:32px;padding:0 6px;border-radius:var(--radius-md);border:1.5px solid var(--border-light);background:var(--bg-surface);font-size:13px;font-weight:600;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.15s;font-family:'Pretendard',sans-serif;}
.page-btn:hover:not(:disabled){background:var(--accent-light);border-color:var(--accent);color:var(--accent-dark);}
.page-btn.active{background:var(--accent);border-color:var(--accent);color:white;}
.page-btn:disabled{opacity:.4;cursor:not-allowed;}
.page-info{font-size:12px;color:var(--text-muted);margin-left:8px;}
```

---

## 표준 무한스크롤 스펙

- 첫 로드: **15건**
- 추가 로드: 스크롤 끝 도달 시 **10건씩** 추가
- IntersectionObserver로 sentinel div 감시
- 필터 변경 시 offset 초기화 후 재렌더

```javascript
const INFINITE_BATCH_FIRST = 15;
const INFINITE_BATCH_MORE  = 10;
let infiniteOffset = 0;
let infiniteLoading = false;
let infiniteObserver = null;

function initInfiniteScroll() {
  if (infiniteObserver) infiniteObserver.disconnect();
  const sentinel = document.getElementById('scrollSentinel');
  infiniteObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !infiniteLoading) loadMoreItems();
  }, { threshold: 0.1 });
  infiniteObserver.observe(sentinel);
}

function resetInfiniteScroll(container) {
  infiniteOffset = 0;
  container.innerHTML = '';
  loadMoreItems(true);
}

function loadMoreItems(first = false) {
  infiniteLoading = true;
  const batchSize = first ? INFINITE_BATCH_FIRST : INFINITE_BATCH_MORE;
  const batch = filteredData.slice(infiniteOffset, infiniteOffset + batchSize);
  if (!batch.length) { infiniteLoading = false; return; }
  appendItems(batch); // 각 페이지의 renderItem 호출
  infiniteOffset += batch.length;
  infiniteLoading = false;
}
```

---

## Task 1: 공지사항 페이지네이션

**Files:**
- Modify: `src/pages/oper/operation-announcement.html`

### 현재 구조
- `let filteredNotices = [...notices]` → `renderTable(filteredNotices)` → tbody 전체 출력
- 테이블 하단에 페이지네이션 영역 없음

### 변경 내용

- [ ] **Step 1: `<style>`에 CSS 추가**

`operation-announcement.html` `<style>` 블록 안에 아래 CSS가 없으면 추가한다 (기존에 있으면 스킵).

```css
.pagination{display:flex;align-items:center;justify-content:center;gap:4px;padding:14px 16px;border-top:1px solid var(--border-light);}
.page-btn{min-width:32px;height:32px;padding:0 6px;border-radius:var(--radius-md);border:1.5px solid var(--border-light);background:var(--bg-surface);font-size:13px;font-weight:600;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.15s;font-family:'Pretendard',sans-serif;}
.page-btn:hover:not(:disabled){background:var(--accent-light);border-color:var(--accent);color:var(--accent-dark);}
.page-btn.active{background:var(--accent);border-color:var(--accent);color:white;}
.page-btn:disabled{opacity:.4;cursor:not-allowed;}
.page-info{font-size:12px;color:var(--text-muted);margin-left:8px;}
```

- [ ] **Step 2: 테이블 하단에 pagination div 추가**

테이블(`<table>`)을 감싸는 컨테이너 또는 `</table>` 직후 아래 추가:

```html
<div id="noticePagination" class="pagination" style="display:none;"></div>
```

- [ ] **Step 3: JS에 상태 변수와 renderPagination 함수 추가**

`let filteredNotices = [...notices];` 아래에 추가:

```javascript
const PAGE_SIZE = 10;
let noticePage = 1;
```

스크립트 블록 어딘가에 함수 추가:

```javascript
function renderPagination(containerId, total, currentPage, goFnName) {
  const el = document.getElementById(containerId);
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  if (totalPages <= 1) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  const groupStart = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const groupEnd   = Math.min(groupStart + 9, totalPages);
  const pages = [];
  for (let p = groupStart; p <= groupEnd; p++) pages.push(p);
  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to   = Math.min(currentPage * PAGE_SIZE, total);
  el.innerHTML = `
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="${goFnName}(1)" title="처음">«</button>
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="${goFnName}(${currentPage-1})" title="이전">‹</button>
    ${pages.map(p=>`<button class="page-btn${p===currentPage?' active':''}" onclick="${goFnName}(${p})">${p}</button>`).join('')}
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="${goFnName}(${currentPage+1})" title="다음">›</button>
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="${goFnName}(${totalPages})" title="끝">»</button>
    <span class="page-info">${from}–${to} / ${total}건</span>
  `;
}

function goNoticePage(p) {
  noticePage = p;
  renderTable(filteredNotices);
  window.scrollTo(0, 0);
}
```

- [ ] **Step 4: `renderTable` 함수 수정**

기존 `renderTable(data)` 내부에서 tbody에 전체 출력하던 부분을 슬라이스로 변경:

```javascript
function renderTable(data) {
  const tbody = document.getElementById('noticeBody');
  document.getElementById('resultsCount').textContent = data.length;
  document.getElementById('tableFooterInfo').textContent = `전체 ${notices.length}건 중 ${data.length}건 표시`;

  const start = (noticePage - 1) * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);

  if (!pageData.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px 20px;color:var(--text-muted);">공지사항이 없습니다.</td></tr>`;
    document.getElementById('noticePagination').style.display = 'none';
    return;
  }

  tbody.innerHTML = pageData.map(n => { /* 기존 행 렌더 코드 그대로 */ }).join('');
  renderPagination('noticePagination', data.length, noticePage, 'goNoticePage');
}
```

- [ ] **Step 5: `applyFilter` 에서 페이지 초기화 추가**

`applyFilter()` 안에서 `renderTable(filteredNotices)` 호출 직전에:

```javascript
noticePage = 1;
```

- [ ] **Step 6: 브라우저에서 동작 확인**

공지사항 화면을 열고: 목록이 10건씩 표시되는지, «‹›» 버튼이 동작하는지, 필터 변경 시 1페이지로 돌아오는지 확인.

- [ ] **Step 7: 커밋**

```bash
git add src/pages/oper/operation-announcement.html
git commit -m "feat: 공지사항 페이지네이션 (1~10 그룹형) 적용"
```

---

## Task 2: 투약의뢰서 페이지네이션

**Files:**
- Modify: `src/pages/oper/operation-medicine.html`

### 현재 구조
- `let filteredData = [...MEDICINES]` → `applyFilter()` → `renderTable()` → tbody 전체 출력
- 테이블 하단에 페이지네이션 없음

- [ ] **Step 1: `<style>`에 페이지네이션 CSS 추가** (Task 1의 Step 1과 동일 CSS)

- [ ] **Step 2: 테이블 하단에 pagination div 추가**

`<table>` 또는 테이블 컨테이너 직후:

```html
<div id="medicinePagination" class="pagination" style="display:none;"></div>
```

- [ ] **Step 3: JS에 상태 변수와 함수 추가**

`let filteredData = [...MEDICINES];` 아래:

```javascript
const PAGE_SIZE = 10;
let medicinePage = 1;
```

`renderPagination` 함수 (Task 1의 Step 3과 동일 함수 본문) + 페이지 이동 함수:

```javascript
function renderPagination(containerId, total, currentPage, goFnName) { /* Task 1과 동일 */ }

function goMedicinePage(p) {
  medicinePage = p;
  renderTable();
}
```

- [ ] **Step 4: `renderTable` 수정**

```javascript
function renderTable() {
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');

  if (!filteredData.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    document.getElementById('medicinePagination').style.display = 'none';
    return;
  }
  empty.style.display = 'none';

  const start    = (medicinePage - 1) * PAGE_SIZE;
  const pageData = filteredData.slice(start, start + PAGE_SIZE);

  tbody.innerHTML = pageData.map(m => { /* 기존 행 렌더 코드 그대로 */ }).join('');
  renderPagination('medicinePagination', filteredData.length, medicinePage, 'goMedicinePage');
}
```

- [ ] **Step 5: `applyFilter`에서 페이지 초기화**

`applyFilter()` 안 `renderTable()` 호출 직전:

```javascript
medicinePage = 1;
```

- [ ] **Step 6: 동작 확인** — 10건씩 표시, «‹›» 동작, 필터 초기화 시 1페이지

- [ ] **Step 7: 커밋**

```bash
git add src/pages/oper/operation-medicine.html
git commit -m "feat: 투약의뢰서 페이지네이션 (1~10 그룹형) 적용"
```

---

## Task 3: 멤버/승인 페이지네이션 업그레이드

**Files:**
- Modify: `src/pages/oper/operation-member.html`

### 현재 구조
- `PAGE_SIZE = 10`, `teacherPage`, `childPage` 변수 존재
- `renderPageBtns(wrId, total, cur, cb)` — ‹/›만, «/» 없음, 그룹 없음

- [ ] **Step 1: `renderPageBtns` 함수를 표준 `renderPagination`으로 교체**

기존 `renderPageBtns` 함수 전체를 아래로 교체:

```javascript
function renderPagination(containerId, total, currentPage, goFnName) {
  const el = document.getElementById(containerId);
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  if (totalPages <= 1) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  const groupStart = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const groupEnd   = Math.min(groupStart + 9, totalPages);
  const pages = [];
  for (let p = groupStart; p <= groupEnd; p++) pages.push(p);
  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to   = Math.min(currentPage * PAGE_SIZE, total);
  el.innerHTML = `
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="${goFnName}(1)" title="처음">«</button>
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="${goFnName}(${currentPage-1})" title="이전">‹</button>
    ${pages.map(p=>`<button class="page-btn${p===currentPage?' active':''}" onclick="${goFnName}(${p})">${p}</button>`).join('')}
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="${goFnName}(${currentPage+1})" title="다음">›</button>
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="${goFnName}(${totalPages})" title="끝">»</button>
    <span class="page-info">${from}–${to} / ${total}건</span>
  `;
}
```

- [ ] **Step 2: `renderTeacherTable`, `renderChildTable` 내 pagination 호출 수정**

기존에 `renderPageBtns(...)` 를 호출하던 부분을 `renderPagination(...)` 으로 변경.

교사 테이블:
```javascript
renderPagination('teacherPagination', filteredTeachers.length, teacherPage, 'goTeacherPage');
```

원아 테이블:
```javascript
renderPagination('childPagination', filteredChildren.length, childPage, 'goChildPage');
```

- [ ] **Step 3: `goTeacherPage`, `goChildPage` 함수 확인/추가**

이미 있으면 유지, 없으면 추가:

```javascript
function goTeacherPage(p) { teacherPage = p; renderTeacherTable(); }
function goChildPage(p)   { childPage   = p; renderChildTable();   }
```

- [ ] **Step 4: pagination div id 확인**

HTML에서 pagination 컨테이너 id가 `teacherPagination`, `childPagination` 인지 확인. 다르면 Step 2의 id를 실제 id로 맞춤.

- [ ] **Step 5: 동작 확인** — 그룹 번호, «/» 버튼 동작

- [ ] **Step 6: 커밋**

```bash
git add src/pages/oper/operation-member.html
git commit -m "feat: 멤버/승인 페이지네이션 그룹형(1~10, 처음/끝) 업그레이드"
```

---

## Task 4: 진급/졸업 페이지네이션 업그레이드

**Files:**
- Modify: `src/pages/oper/operation-graduation.html`

### 현재 구조
- `renderPagination(containerId, total, currentPage, fnName)` 존재
- `‹` / 페이지 번호(최대 7개) / `›` — «/» 없음

- [ ] **Step 1: `renderPagination` 함수를 표준으로 교체**

기존 함수 전체를 Task 3의 Step 1과 동일한 표준 함수로 교체.  
단, 호출부(`renderProcessingTable`, `renderCompletedTable`)의 함수 시그니처는 그대로이므로 교체 후 호환됨.

- [ ] **Step 2: 동작 확인** — «/» 버튼 추가됐는지, 그룹 10개 표시

- [ ] **Step 3: 커밋**

```bash
git add src/pages/oper/operation-graduation.html
git commit -m "feat: 진급/졸업 페이지네이션 그룹형(1~10, 처음/끝) 업그레이드"
```

---

## Task 5: 초대장관리 히스토리 테이블 페이지네이션

**Files:**
- Modify: `src/pages/oper/operation-invitation.html`

### 현재 구조
- `renderHistoryTable()` — 전체 `INVITE_HISTORY` 출력
- 부모 초대 카드(`renderParentCards`)와 교사 테이블(`renderTeacherTable`)은 데이터가 소량이므로 스킵

- [ ] **Step 1: CSS 추가** (페이지네이션 CSS, Task 1 Step 1과 동일)

- [ ] **Step 2: HTML에 pagination div 추가**

히스토리 테이블 하단:

```html
<div id="historyPagination" class="pagination" style="display:none;"></div>
```

- [ ] **Step 3: JS 상태 변수와 함수 추가**

```javascript
const HISTORY_PAGE_SIZE = 10;
let historyPage = 1;
let filteredHistory = [...INVITE_HISTORY];
```

`renderPagination` 표준 함수 추가 (PAGE_SIZE 대신 HISTORY_PAGE_SIZE 사용):

```javascript
function renderHistoryPagination(containerId, total, currentPage) {
  const el = document.getElementById(containerId);
  const totalPages = Math.ceil(total / HISTORY_PAGE_SIZE) || 1;
  if (totalPages <= 1) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  const groupStart = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const groupEnd   = Math.min(groupStart + 9, totalPages);
  const pages = [];
  for (let p = groupStart; p <= groupEnd; p++) pages.push(p);
  const from = (currentPage - 1) * HISTORY_PAGE_SIZE + 1;
  const to   = Math.min(currentPage * HISTORY_PAGE_SIZE, total);
  el.innerHTML = `
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="goHistoryPage(1)" title="처음">«</button>
    <button class="page-btn" ${currentPage===1?'disabled':''} onclick="goHistoryPage(${currentPage-1})" title="이전">‹</button>
    ${pages.map(p=>`<button class="page-btn${p===currentPage?' active':''}" onclick="goHistoryPage(${p})">${p}</button>`).join('')}
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="goHistoryPage(${currentPage+1})" title="다음">›</button>
    <button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="goHistoryPage(${totalPages})" title="끝">»</button>
    <span class="page-info">${from}–${to} / ${total}건</span>
  `;
}

function goHistoryPage(p) { historyPage = p; renderHistoryTable(); }
```

- [ ] **Step 4: `renderHistoryTable` 수정**

```javascript
function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  const empty = document.getElementById('historyEmpty');

  if (!filteredHistory.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = '';
    document.getElementById('historyPagination').style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';

  const start    = (historyPage - 1) * HISTORY_PAGE_SIZE;
  const pageData = filteredHistory.slice(start, start + HISTORY_PAGE_SIZE);

  tbody.innerHTML = pageData.map(h => { /* 기존 행 렌더 코드 그대로 */ }).join('');
  renderHistoryPagination('historyPagination', filteredHistory.length, historyPage);
}
```

- [ ] **Step 5: 동작 확인**

- [ ] **Step 6: 커밋**

```bash
git add src/pages/oper/operation-invitation.html
git commit -m "feat: 초대장관리 히스토리 페이지네이션 (1~10 그룹형) 적용"
```

---

## Task 6: 알림장 무한스크롤

**Files:**
- Modify: `src/pages/oper/operation-notice-board.html`

### 현재 구조 파악 선행 필요
- `renderTable(filteredNotices)` 또는 유사 함수 확인 후 아래 적용

- [ ] **Step 1: HTML에 sentinel div 추가**

테이블/카드 리스트 컨테이너 바로 아래:

```html
<div id="scrollSentinel" style="height:1px;"></div>
<div id="loadingSpinner" style="display:none;text-align:center;padding:16px;color:var(--text-muted);font-size:13px;">불러오는 중...</div>
```

- [ ] **Step 2: JS 상태 변수와 무한스크롤 함수 추가**

```javascript
const BATCH_FIRST = 15;
const BATCH_MORE  = 10;
let infiniteOffset  = 0;
let infiniteLoading = false;
let infiniteObserver = null;

function initInfiniteScroll() {
  if (infiniteObserver) infiniteObserver.disconnect();
  infiniteObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !infiniteLoading) loadMoreNotices();
  }, { threshold: 0.1 });
  infiniteObserver.observe(document.getElementById('scrollSentinel'));
}

function loadMoreNotices() {
  infiniteLoading = true;
  const spinner = document.getElementById('loadingSpinner');
  const batch = filteredNotices.slice(infiniteOffset, infiniteOffset + BATCH_MORE);
  if (!batch.length) { spinner.style.display = 'none'; infiniteLoading = false; return; }
  spinner.style.display = 'block';
  appendNoticeRows(batch);
  infiniteOffset += batch.length;
  spinner.style.display = 'none';
  infiniteLoading = false;
}
```

- [ ] **Step 3: `renderTable(data)` 를 초기 렌더 + 무한스크롤 시작으로 교체**

```javascript
function renderTable(data) {
  const tbody = document.getElementById('noticeBody'); // 실제 id 확인
  document.getElementById('resultsCount').textContent = data.length;

  infiniteOffset = 0;
  tbody.innerHTML = '';

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">공지사항이 없습니다.</td></tr>`;
    return;
  }

  const first = data.slice(0, BATCH_FIRST);
  appendNoticeRows(first);
  infiniteOffset = first.length;
  initInfiniteScroll();
}

function appendNoticeRows(batch) {
  const tbody = document.getElementById('noticeBody');
  batch.forEach(n => {
    const tr = document.createElement('tr');
    tr.innerHTML = /* 기존 행 렌더 코드 (단일 n에 대해) */;
    tbody.appendChild(tr);
  });
}
```

- [ ] **Step 4: 필터 변경 시 자동 초기화 확인**

`applyFilter()` → `renderTable(filteredNotices)` 호출하면 자동으로 offset 초기화되므로 별도 처리 불필요.

- [ ] **Step 5: 동작 확인** — 첫 15건, 스크롤 끝에서 10건씩 추가

- [ ] **Step 6: 커밋**

```bash
git add src/pages/oper/operation-notice-board.html
git commit -m "feat: 알림장 무한스크롤 (IntersectionObserver) 적용"
```

---

## Task 7: 앨범 무한스크롤

**Files:**
- Modify: `src/pages/oper/operation-album.html`

### 현재 구조
- `filteredAlbums` → `renderAlbums()` → `renderGrid(container)` or `renderList(container)` — 전체 출력

- [ ] **Step 1: HTML에 sentinel div 추가**

`<div id="albumContainer"></div>` 바로 아래:

```html
<div id="scrollSentinel" style="height:1px;"></div>
<div id="albumLoadingSpinner" style="display:none;text-align:center;padding:16px;color:var(--text-muted);font-size:13px;">불러오는 중...</div>
```

- [ ] **Step 2: JS 상태 변수 및 무한스크롤 함수 추가**

기존 상태 변수 선언부 근처에 추가:

```javascript
const ALBUM_BATCH_FIRST = 12; // 그리드 3열 기준 4행
const ALBUM_BATCH_MORE  = 9;  // 3열 기준 3행
let albumOffset   = 0;
let albumLoading  = false;
let albumObserver = null;

function initAlbumInfiniteScroll() {
  if (albumObserver) albumObserver.disconnect();
  albumObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !albumLoading) loadMoreAlbums();
  }, { threshold: 0.1 });
  albumObserver.observe(document.getElementById('scrollSentinel'));
}

function loadMoreAlbums() {
  albumLoading = true;
  const batch = filteredAlbums.slice(albumOffset, albumOffset + ALBUM_BATCH_MORE);
  if (!batch.length) { albumLoading = false; return; }
  const container = document.getElementById('albumContainer');
  const grid = container.querySelector('.album-grid, .album-list-view');
  if (grid) {
    if (currentView === 'grid') {
      batch.forEach(a => { grid.insertAdjacentHTML('beforeend', renderAlbumCard(a)); });
    } else {
      batch.forEach(a => { grid.insertAdjacentHTML('beforeend', renderAlbumListItem(a)); });
    }
  }
  albumOffset += batch.length;
  albumLoading = false;
}
```

- [ ] **Step 3: `renderGrid`, `renderList` 분리 — 공통 카드 렌더 함수 추출**

기존 `renderGrid` 내부 `.map(a => ...)` 의 템플릿을 별도 함수로 추출:

```javascript
function renderAlbumCard(a) {
  // 기존 renderGrid 내의 template literal 그대로
  const key   = getAlbumKey(a);
  const badge = CLASS_BADGE[key] || CLASS_BADGE['mixed'];
  const grad  = COVER_GRADIENT[key] || COVER_GRADIENT['mixed'];
  const emoji = COVER_EMOJI[key]    || '🖼️';
  const pct   = a.totalRecipients ? Math.round(a.readCount/a.totalRecipients*100) : 0;
  const isDraft = a.status === 'draft';
  const canEdit = !AL_IS_TEACHER || a.authorId === 'USR002';
  return `<div class="album-card${isDraft?' is-draft':''}" onclick="openDetail('${a.id}')">
    <!-- 기존 카드 HTML 그대로 -->
  </div>`;
}

function renderAlbumListItem(a) {
  // 기존 renderList 내의 template literal 그대로
}
```

- [ ] **Step 4: `renderAlbums()` 무한스크롤 방식으로 교체**

```javascript
function renderAlbums() {
  const container = document.getElementById('albumContainer');
  albumOffset = 0;

  if (!filteredAlbums.length) {
    container.innerHTML = `<div class="empty-state">...</div>`;
    return;
  }

  const wrapClass = currentView === 'grid' ? 'album-grid' : 'album-list-view';
  const first = filteredAlbums.slice(0, ALBUM_BATCH_FIRST);
  const items = currentView === 'grid'
    ? first.map(renderAlbumCard).join('')
    : first.map(renderAlbumListItem).join('');

  container.innerHTML = `<div class="${wrapClass}">${items}</div>`;
  albumOffset = first.length;
  initAlbumInfiniteScroll();
}
```

- [ ] **Step 5: `setView` 변경 시 재렌더 확인**

기존 `setView(v)` → `renderAlbums()` 를 호출하므로 자동으로 초기화됨.

- [ ] **Step 6: 동작 확인** — 첫 12장, 스크롤 끝에서 9장씩 추가, 그리드/리스트 전환 시 초기화

- [ ] **Step 7: 커밋**

```bash
git add src/pages/oper/operation-album.html
git commit -m "feat: 앨범 무한스크롤 (IntersectionObserver) 적용"
```

---

## 완료 체크리스트

- [ ] Task 1: 공지사항 페이지네이션
- [ ] Task 2: 투약의뢰서 페이지네이션
- [ ] Task 3: 멤버/승인 업그레이드
- [ ] Task 4: 진급/졸업 업그레이드
- [ ] Task 5: 초대장관리 페이지네이션
- [ ] Task 6: 알림장 무한스크롤
- [ ] Task 7: 앨범 무한스크롤
