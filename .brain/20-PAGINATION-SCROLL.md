# 20. 페이지네이션 / 무한스크롤 설계

## 적용 방식 결정

| 화면 | 방식 | 이유 |
|------|------|------|
| 공지사항 | 페이지네이션 | 처리·추적형, 위치 기억 필요 |
| 투약의뢰서 | 페이지네이션 | 상태 처리형 |
| 멤버/승인 | 페이지네이션 | 업무형, 특정 행 탐색 |
| 진급/졸업 | 페이지네이션 | 일괄 처리형 |
| 초대장관리 | 페이지네이션 (히스토리) | 이력 추적형 |
| 알림장 | 무한스크롤 | 피드형 읽기 |
| 앨범 | 무한스크롤 | 사진 갤러리형 탐색 |
| 출석부 | 미적용 | 날짜 단위 1페이지 뷰 |
| 반관리 | 미적용 | 반 수 소량 |

---

## 페이지네이션 표준 스펙

- **형식:** `« ‹ 1 2 3 4 5 6 7 8 9 10 › »`
- 한 페이지당 **10건**
- 페이지 그룹: **최대 10개** 번호 표시 (1~10, 11~20, …)
- `«` 처음 / `‹` 이전 / 번호들 / `›` 다음 / `»` 끝
- 우측 텍스트: `1–10 / 43건`
- 총 페이지가 1이면 숨김

### 공통 CSS

```css
.pagination{display:flex;align-items:center;justify-content:center;gap:4px;padding:14px 16px;border-top:1px solid var(--border-light);}
.page-btn{min-width:32px;height:32px;padding:0 6px;border-radius:var(--radius-md);border:1.5px solid var(--border-light);background:var(--bg-surface);font-size:13px;font-weight:600;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.15s;font-family:'Pretendard',sans-serif;}
.page-btn:hover:not(:disabled){background:var(--accent-light);border-color:var(--accent);color:var(--accent-dark);}
.page-btn.active{background:var(--accent);border-color:var(--accent);color:white;}
.page-btn:disabled{opacity:.4;cursor:not-allowed;}
.page-info{font-size:12px;color:var(--text-muted);margin-left:8px;}
```

### 공통 JS 함수

```javascript
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

### 파일별 구현 현황

| 파일 | 상태 변수 | pagination div id | 이동 함수 |
|------|-----------|-------------------|-----------|
| operation-announcement.html | `noticePage` | `noticePagination` | `goNoticePage(p)` |
| operation-medicine.html | `medicinePage` | `medicinePagination` | `goMedicinePage(p)` |
| operation-member.html | `teacherPage`, `childPage` | `teacherPagination`, `childPagination` | `goTeacherPage(p)`, `goChildPage(p)` |
| operation-graduation.html | 기존 변수 유지 | `processingPagination`, `completedPagination` | 기존 함수 유지 |
| operation-invitation.html | `historyPage` | `historyPagination` | `goHistoryPage(p)` |

---

## 무한스크롤 표준 스펙

- **API:** IntersectionObserver (sentinel div 감시)
- 첫 로드: **15건** (알림장), **12건** (앨범 — 3열×4행)
- 추가 로드: **10건** (알림장), **9건** (앨범 — 3열×3행)
- 필터 변경 → offset 초기화 → 자동 재렌더

### 파일별 구현 현황

| 파일 | sentinel id | 첫 로드 | 추가 로드 |
|------|-------------|---------|-----------|
| operation-notice-board.html | `scrollSentinel` | 15건 | 10건 |
| operation-album.html | `scrollSentinel` | 12건 | 9건 |

---

## 구현 진행 현황

| 화면 | 완료 |
|------|------|
| 공지사항 | ✅ |
| 투약의뢰서 | ✅ |
| 멤버/승인 업그레이드 | ✅ |
| 진급/졸업 업그레이드 | ✅ |
| 초대장관리 | ✅ |
| 알림장 | ✅ |
| 앨범 | ✅ |

> 상세 구현 플랜: `docs/superpowers/plans/2026-04-20-pagination-infinite-scroll.md`
