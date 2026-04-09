# 댓글 삭제 기능 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 알림장·공지사항·앨범 세 페이지에 교사 본인 댓글 삭제 기능 추가 및 댓글 디자인을 공지사항 스타일로 통일

**Architecture:** 각 파일을 독립적으로 수정. 삭제 버튼은 `isTeacher && author === currentUserName` 조건으로 렌더링. 삭제는 mock 데이터 배열 splice 후 즉시 재렌더링.

**Tech Stack:** Vanilla HTML5/CSS3/JS, sessionStorage, 프론트엔드 모킹

---

## 파일 목록

| 파일 | 변경 유형 |
|------|---------|
| `src/pages/oper/operation-announcement.html` | 수정 — 삭제 버튼 CSS+JS 추가 |
| `src/pages/oper/operation-notice-board.html` | 수정 — 댓글 CSS flat 스타일로 교체, `id` 추가, 삭제 추가 |
| `src/pages/oper/operation-album.html` | 수정 — 댓글 데이터·UI·삭제 신규 추가 |

---

## Task 1: 공지사항(announcement) 댓글 삭제 기능 추가

**Files:**
- Modify: `src/pages/oper/operation-announcement.html`

### 변경 포인트

공지사항은 댓글 구조가 이미 완비되어 있음. 삭제 버튼 CSS + `deleteComment()` 함수 + `renderComments()` 수정만 필요.

현재 사용자 이름: `sessionStorage.getItem('userName') || '박교사'`

- [ ] **Step 1: `.comment-delete-btn` CSS를 line 213 (`.comment-send-btn:hover` 바로 뒤) 에 추가**

```css
.comment-delete-btn{background:none;border:none;cursor:pointer;font-size:11px;color:var(--text-muted);padding:0 2px;margin-left:auto;font-family:'Pretendard',sans-serif;line-height:1;transition:color .15s;}
.comment-delete-btn:hover{color:#EF4444;}
```

- [ ] **Step 2: `renderComments()` 함수 (line 1393~1428)를 삭제 버튼 포함 버전으로 교체**

```js
function renderComments(comments) {
  const list = document.getElementById('drawerCommentList');
  const ME = sessionStorage.getItem('userName') || '박교사';
  if (!comments.length) {
    list.innerHTML = '<div class="comment-empty">아직 댓글이 없습니다</div>';
    return;
  }
  list.innerHTML = comments.map(c => {
    const canDel = c.isTeacher && c.author === ME;
    return `
    <div class="comment-item" id="citem-${c.id}">
      <div class="comment-avatar${c.isTeacher?' teacher':''}">${escHtml(c.initials)}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${escHtml(c.author)}</span>
          <span class="comment-time">${c.time}</span>
          ${canDel ? `<button class="comment-delete-btn" onclick="deleteComment('${c.id}')">삭제</button>` : ''}
        </div>
        <div class="comment-text">${escHtml(c.text)}</div>
        <button class="reply-btn" onclick="toggleReplyInput('${c.id}')">답변</button>
        <div id="reply-input-${c.id}" style="display:none;" class="reply-input-row">
          <input class="reply-input" id="reply-text-${c.id}" placeholder="답변을 입력하세요">
          <button class="reply-submit-btn" onclick="submitReply('${c.id}')">전송</button>
        </div>
        ${(c.replies||[]).length ? `<div class="comment-reply-wrap">
          ${(c.replies||[]).map(r => {
            const canDelR = r.isTeacher && r.author === ME;
            return `
            <div class="comment-item" id="citem-${r.id}">
              <div class="comment-avatar${r.isTeacher?' teacher':''}">${escHtml(r.initials)}</div>
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-author">${escHtml(r.author)}</span>
                  <span class="comment-time">${r.time}</span>
                  ${canDelR ? `<button class="comment-delete-btn" onclick="deleteReply('${c.id}','${r.id}')">삭제</button>` : ''}
                </div>
                <div class="comment-text">${escHtml(r.text)}</div>
              </div>
            </div>`;
          }).join('')}
        </div>` : ''}
      </div>
    </div>`;
  }).join('');
}
```

- [ ] **Step 3: `deleteComment()`, `deleteReply()` 함수를 `submitComment()` 함수 바로 뒤 (line 1470 뒤) 에 추가**

```js
function deleteComment(commentId) {
  const n = notices.find(x => x.id === currentNoticeId);
  if (!n) return;
  const idx = n.comments.findIndex(x => x.id === commentId);
  if (idx === -1) return;
  n.comments.splice(idx, 1);
  n.commentCount = n.comments.length;
  renderComments(n.comments);
  document.getElementById('drawerCommentCount').textContent = n.comments.length;
  applyFilter();
  showToast('댓글이 삭제되었습니다', 'success');
}

function deleteReply(commentId, replyId) {
  const n = notices.find(x => x.id === currentNoticeId);
  if (!n) return;
  const c = n.comments.find(x => x.id === commentId);
  if (!c) return;
  const idx = (c.replies||[]).findIndex(x => x.id === replyId);
  if (idx === -1) return;
  c.replies.splice(idx, 1);
  renderComments(n.comments);
  showToast('답변이 삭제되었습니다', 'success');
}
```

- [ ] **Step 4: 브라우저에서 `operation-announcement.html` 열고 동작 확인**
  - 공지사항 상세 드로어 열기 → 댓글 목록에서 `박교사` 댓글에만 "삭제" 버튼 표시
  - 삭제 클릭 → 댓글 사라지고 toast 표시
  - 학부모 댓글에는 삭제 버튼 없음

- [ ] **Step 5: 커밋**

```bash
git add src/pages/oper/operation-announcement.html
git commit -m "feat: 공지사항 댓글 삭제 기능 추가 (교사 본인 댓글·답변)"
```

---

## Task 2: 알림장(notice-board) 댓글 디자인 통일 + 삭제 기능

**Files:**
- Modify: `src/pages/oper/operation-notice-board.html`

### 변경 포인트

1. 버블 CSS(`comment-bubble`, `comment-meta`, `cr-teacher`, `cr-parent`) 제거 → 공지사항 flat 스타일 CSS 추가
2. mock 댓글 데이터에 `id` 필드 추가, 교사 댓글 샘플 추가
3. 댓글 렌더링 함수 flat 구조로 변경
4. 댓글 전송 기능 실제 데이터 추가 방식으로 구현
5. 삭제 버튼 추가

현재 사용자: `sessionStorage.getItem('userName') || '박교사'`  
현재 교사 여부: `NB_EFFECTIVE === 'teacher'` (`NB_ASSIGNED` null check로 파악 가능)

- [ ] **Step 1: 버블 스타일 CSS (line 341~362) 를 flat 스타일로 교체**

기존 블록:
```css
/* ━━━ 댓글 ━━━ */
.comment-section{border-top:1px solid var(--border-light);padding-top:14px;}
.comment-list{display:flex;flex-direction:column;gap:10px;margin-bottom:12px;}
.comment-item{display:flex;gap:10px;}
.comment-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;}
.comment-bubble{flex:1;background:var(--bg-base);border-radius:0 10px 10px 10px;padding:8px 12px;border:1px solid var(--border-light);}
.comment-bubble.teacher-bubble{background:var(--accent-light);border-color:var(--border-medium);}
.comment-meta{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.comment-author{font-size:13px;font-weight:700;color:var(--text-primary);}
.comment-role{font-size:12px;font-weight:600;padding:1px 6px;border-radius:6px;}
.cr-teacher{background:var(--blue-bg);color:var(--blue-text);}
.cr-parent{background:var(--green-bg);color:var(--green-text);}
.comment-time{font-size:12px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;margin-left:auto;}
.comment-text{font-size:13px;line-height:1.55;color:var(--text-primary);}
.reply-item{margin-left:30px;}
.reply-item .comment-bubble{background:#fff;border:1px dashed var(--border-medium);}
.comment-input-wrap{display:flex;gap:8px;align-items:flex-end;}
.comment-textarea{flex:1;border:1.5px solid var(--border-light);border-radius:var(--radius-md);padding:9px 12px;font-size:13px;font-family:'Pretendard',sans-serif;resize:none;height:60px;outline:none;transition:border-color .18s;line-height:1.5;}
.comment-textarea:focus{border-color:var(--accent);}
.comment-send-btn{height:60px;width:44px;border-radius:var(--radius-md);background:var(--accent);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;transition:.18s;flex-shrink:0;}
.comment-send-btn:hover{background:var(--accent-dark);}
```

교체할 내용:
```css
/* ━━━ 댓글 ━━━ */
.comment-section{border-top:1px solid var(--border-light);padding-top:14px;}
.comment-list{display:flex;flex-direction:column;gap:12px;margin-bottom:12px;}
.comment-item{display:flex;gap:10px;}
.comment-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;}
.comment-avatar.teacher{background:var(--green-bg);color:var(--green-text);}
.comment-body{flex:1;min-width:0;}
.comment-header{display:flex;align-items:center;gap:6px;margin-bottom:3px;}
.comment-author{font-size:13px;font-weight:700;color:var(--text-primary);}
.comment-role-badge{font-size:11px;font-weight:600;padding:1px 5px;border-radius:5px;}
.crb-teacher{background:var(--blue-bg);color:var(--blue-text);}
.crb-parent{background:var(--green-bg);color:var(--green-text);}
.comment-time{font-size:12px;color:var(--text-muted);}
.comment-text{font-size:13px;color:var(--text-primary);line-height:1.6;word-break:break-word;}
.comment-delete-btn{background:none;border:none;cursor:pointer;font-size:11px;color:var(--text-muted);padding:0 2px;margin-left:auto;font-family:'Pretendard',sans-serif;line-height:1;transition:color .15s;}
.comment-delete-btn:hover{color:#EF4444;}
.comment-empty{font-size:13px;color:var(--text-muted);text-align:center;padding:14px 0;}
.comment-input-wrap{display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border-light);}
.comment-textarea{flex:1;border:1.5px solid var(--border-light);border-radius:var(--radius-md);padding:9px 12px;font-size:13px;font-family:'Pretendard',sans-serif;resize:none;height:60px;outline:none;transition:border-color .18s;line-height:1.5;}
.comment-textarea:focus{border-color:var(--accent);}
.comment-send-btn{height:60px;width:44px;border-radius:var(--radius-md);background:var(--accent);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;transition:.18s;flex-shrink:0;}
.comment-send-btn:hover{background:var(--accent-dark);}
```

- [ ] **Step 2: mock 댓글 데이터에 `id` 필드 + 교사 댓글 샘플 추가**

MOCK_SENT 첫 번째 notice (id:'S001')의 children 중 C001 에 교사 댓글 추가, 모든 댓글에 id 추가.

기존 (line ~867~877):
```js
    children:[
      { id:'C001', name:'김도현', color:'#3B82F6', isRead:true, commentCount:1,
        comments:[{ author:'김민지 엄마', type:'parent', color:'#10B981', relation:'엄마', text:'집에서도 블록 얘기를 하더라고요! 감사합니다 선생님 😊', time:'15:22' }]},
      { id:'C002', name:'이서연', color:'#10B981', isRead:true, commentCount:2,
        comments:[
          { author:'이지영 엄마', type:'parent', color:'#10B981', relation:'엄마', text:'점심을 조금 먹었군요, 집에 와서도 입맛이 없더라고요.', time:'16:10' },
          { author:'이지영 엄마', type:'parent', color:'#10B981', relation:'엄마', text:'내일은 잘 먹으면 좋겠어요 😊', time:'16:11' }
        ]},
      { id:'C003', name:'박준서', color:'#F59E0B', isRead:false, commentCount:1,
        comments:[{ author:'박민수 아빠', type:'parent', color:'#F59E0B', relation:'아빠', text:'오늘도 잘 지냈군요, 감사합니다.', time:'17:00' }]}
    ]
```

교체할 내용:
```js
    children:[
      { id:'C001', name:'김도현', color:'#3B82F6', isRead:true, commentCount:2,
        comments:[
          { id:'nb_c1', author:'김민지 엄마', type:'parent', color:'#10B981', relation:'엄마', text:'집에서도 블록 얘기를 하더라고요! 감사합니다 선생님 😊', time:'15:22' },
          { id:'nb_c2', author:'박교사', type:'teacher', color:'#3B82F6', relation:'교사', text:'네, 오늘 정말 집중해서 잘 했어요 😊', time:'15:45' }
        ]},
      { id:'C002', name:'이서연', color:'#10B981', isRead:true, commentCount:2,
        comments:[
          { id:'nb_c3', author:'이지영 엄마', type:'parent', color:'#10B981', relation:'엄마', text:'점심을 조금 먹었군요, 집에 와서도 입맛이 없더라고요.', time:'16:10' },
          { id:'nb_c4', author:'이지영 엄마', type:'parent', color:'#10B981', relation:'엄마', text:'내일은 잘 먹으면 좋겠어요 😊', time:'16:11' }
        ]},
      { id:'C003', name:'박준서', color:'#F59E0B', isRead:false, commentCount:1,
        comments:[{ id:'nb_c5', author:'박민수 아빠', type:'parent', color:'#F59E0B', relation:'아빠', text:'오늘도 잘 지냈군요, 감사합니다.', time:'17:00' }]}
    ]
```

세 번째 notice (S003) children도 동일하게 `id` 추가 (모든 comment 객체에 고유 id 추가):
- C004의 댓글들: `nb_c6`, `nb_c7` / C005: `nb_c8` / C007: `nb_c9`

- [ ] **Step 3: 댓글 렌더링 로직 (line ~1566~1580 두 군데) flat 구조로 변경**

**첫 번째 렌더링** (panel openNoticeDetail 내 line ~1566):

기존:
```js
    const comments = child.comments.map(cm => {
      const isTeacher = cm.type === 'teacher';
      const wrapClass = cm.isReply ? 'comment-item reply-item' : 'comment-item';
      return `<div class="${wrapClass}">
        <div class="comment-avatar" style="background:${cm.color}">${cm.author[0]}</div>
        <div class="comment-bubble ${isTeacher?'teacher-bubble':''}">
          <div class="comment-meta">
            <span class="comment-author">${cm.author}</span>
            <span class="comment-role ${isTeacher?'cr-teacher':'cr-parent'}">${isTeacher?'교사':'학부모'}</span>
            <span class="comment-time">${cm.time}</span>
          </div>
          <div class="comment-text">${cm.text}</div>
        </div>
      </div>`;
    }).join('');
```

교체할 내용:
```js
    const NB_ME = sessionStorage.getItem('userName') || '박교사';
    const comments = child.comments.map(cm => {
      const isTeacher = cm.type === 'teacher';
      const canDel = isTeacher && cm.author === NB_ME;
      return `<div class="comment-item" id="nbcitem-${cm.id}">
        <div class="comment-avatar${isTeacher?' teacher':''}" style="${isTeacher?'':'background:'+cm.color}">${cm.author[0]}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">${cm.author}</span>
            <span class="comment-role-badge ${isTeacher?'crb-teacher':'crb-parent'}">${isTeacher?'교사':'학부모'}</span>
            <span class="comment-time">${cm.time}</span>
            ${canDel ? `<button class="comment-delete-btn" onclick="deleteNbComment('${child.id}','${cm.id}',this)">삭제</button>` : ''}
          </div>
          <div class="comment-text">${cm.text}</div>
        </div>
      </div>`;
    }).join('');
```

**두 번째 렌더링** (line ~1738, rdp/단일 패널 렌더링):

기존:
```js
  const comments = child.comments.map(cm => {
    const isTeacher = cm.type === 'teacher';
    const wrapClass = cm.isReply ? 'comment-item reply-item' : 'comment-item';
    return `<div class="${wrapClass}">
      <div class="comment-avatar" style="background:${cm.color}">${cm.author[0]}</div>
      <div class="comment-bubble ${isTeacher?'teacher-bubble':''}">
        <div class="comment-meta">
          <span class="comment-author">${cm.author}</span>
          <span class="comment-role ${isTeacher?'cr-teacher':'cr-parent'}">${isTeacher?'교사':'학부모'}</span>
          <span class="comment-time">${cm.time}</span>
        </div>
        <div class="comment-text">${cm.text}</div>
      </div>
    </div>`;
  }).join('');
```

교체할 내용 (동일 패턴, child.id 접근 방식 확인 필요):
```js
  const NB_ME = sessionStorage.getItem('userName') || '박교사';
  const comments = child.comments.map(cm => {
    const isTeacher = cm.type === 'teacher';
    const canDel = isTeacher && cm.author === NB_ME;
    return `<div class="comment-item" id="nbcitem-${cm.id}">
      <div class="comment-avatar${isTeacher?' teacher':''}" style="${isTeacher?'':'background:'+cm.color}">${cm.author[0]}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${cm.author}</span>
          <span class="comment-role-badge ${isTeacher?'crb-teacher':'crb-parent'}">${isTeacher?'교사':'학부모'}</span>
          <span class="comment-time">${cm.time}</span>
          ${canDel ? `<button class="comment-delete-btn" onclick="deleteNbComment('${child.id}','${cm.id}',this)">삭제</button>` : ''}
        </div>
        <div class="comment-text">${cm.text}</div>
      </div>
    </div>`;
  }).join('');
```

- [ ] **Step 4: 댓글 전송 버튼을 실제 데이터에 추가하도록 수정 + `deleteNbComment()` 함수 추가**

현재 `comment-send-btn`은 `onclick="showToast(...)"` 만 실행. 실제 데이터에 추가하도록 변경.

comment-send-btn HTML은 두 군데 있음. 각각의 인접 textarea에 id를 부여하고 JS 함수로 처리.

첫 번째 (multiNotice 상세 패널 내):
```html
<textarea class="comment-textarea" id="nb-comment-input-${child.id}" placeholder="${child.name} 학부모에게 답글을 작성하세요..."></textarea>
<button class="comment-send-btn" onclick="submitNbComment('${child.id}')">➤</button>
```

두 번째 (단일 rdp 패널 내) — 해당 child.id 사용:
```html
<textarea class="comment-textarea" id="nb-comment-input-${child.id}" placeholder="${child.name} 학부모에게 답글을 작성하세요..."></textarea>
<button class="comment-send-btn" onclick="submitNbComment('${child.id}')">➤</button>
```

`submitNbComment()` + `deleteNbComment()` 함수는 파일 하단 JS 영역에 추가:
```js
function submitNbComment(childId) {
  const inp = document.getElementById('nb-comment-input-' + childId);
  const text = inp ? inp.value.trim() : '';
  if (!text) { showToast('댓글 내용을 입력하세요', 'warning'); return; }
  const ME = sessionStorage.getItem('userName') || '박교사';
  // MOCK_SENT + MOCK_RECEIVED 통합 검색
  const allNotices = [...MOCK_SENT, ...MOCK_RECEIVED];
  for (const n of allNotices) {
    const child = (n.children||[]).find(c => c.id === childId);
    if (child) {
      child.comments.push({ id:'nb_c'+Date.now(), author:ME, type:'teacher', color:'#3B82F6', relation:'교사', text, time: new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}) });
      child.commentCount = child.comments.length;
      if (inp) inp.value = '';
      // 현재 열린 패널 재렌더링
      if (typeof openNoticeDetail === 'function' && currentNoticeId) openNoticeDetail(currentNoticeId);
      showToast('댓글이 등록되었습니다', 'success');
      return;
    }
  }
}

function deleteNbComment(childId, commentId, btn) {
  const allNotices = [...MOCK_SENT, ...MOCK_RECEIVED];
  for (const n of allNotices) {
    const child = (n.children||[]).find(c => c.id === childId);
    if (child) {
      const idx = child.comments.findIndex(x => x.id === commentId);
      if (idx !== -1) {
        child.comments.splice(idx, 1);
        child.commentCount = child.comments.length;
        const el = document.getElementById('nbcitem-' + commentId);
        if (el) el.remove();
        showToast('댓글이 삭제되었습니다', 'success');
      }
      return;
    }
  }
}
```

> **주의:** `currentNoticeId` 변수명은 알림장 파일 내 실제 변수명을 확인 후 사용할 것. `openNoticeDetail` 재호출이 어색하면 단순 `el.remove()` 방식 사용.

- [ ] **Step 5: 브라우저에서 동작 확인**
  - 알림장 발행된 글 클릭 → 상세 패널 → 댓글 flat 스타일로 표시
  - `박교사` 댓글에만 "삭제" 버튼 표시, 학부모 댓글에는 없음
  - 삭제 클릭 → 댓글 사라지고 toast 표시
  - 교사 로그인 상태에서만 삭제 버튼 노출

- [ ] **Step 6: 커밋**

```bash
git add src/pages/oper/operation-notice-board.html
git commit -m "feat: 알림장 댓글 디자인 flat 스타일 통일 + 삭제 기능 추가"
```

---

## Task 3: 앨범(album) 댓글 섹션 신규 추가 + 삭제 기능

**Files:**
- Modify: `src/pages/oper/operation-album.html`

### 변경 포인트

1. `ALBUMS_RAW`에 `commentList` 배열 추가 (기존 `comments` 카운트 유지)
2. 상세 모달(`detailModal`) body에 댓글 섹션 HTML 추가
3. `openDetail()` 함수에 `renderAlbumComments()` 호출 추가
4. `renderAlbumComments()`, `submitAlbumComment()`, `deleteAlbumComment()` 함수 추가
5. 댓글 CSS 추가 (공지사항 flat 스타일)

- [ ] **Step 1: 앨범 댓글 CSS를 line 171 (`.detail-modal-box` CSS 바로 뒤) 에 추가**

```css
/* ━━━ ALBUM COMMENTS ━━━ */
.album-comment-section{border-top:1px solid var(--border-light);margin-top:16px;padding-top:14px;}
.album-comment-title{font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:10px;}
.comment-list{display:flex;flex-direction:column;gap:12px;margin-bottom:12px;}
.comment-item{display:flex;gap:10px;}
.comment-avatar{width:30px;height:30px;border-radius:50%;background:var(--accent-light);color:var(--accent-dark);font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.comment-avatar.teacher{background:var(--green-bg);color:var(--green-text);}
.comment-body{flex:1;min-width:0;}
.comment-header{display:flex;align-items:center;gap:6px;margin-bottom:3px;}
.comment-author{font-size:13px;font-weight:700;color:var(--text-primary);}
.comment-time{font-size:12px;color:var(--text-muted);}
.comment-text{font-size:13px;color:var(--text-primary);line-height:1.6;word-break:break-word;}
.comment-delete-btn{background:none;border:none;cursor:pointer;font-size:11px;color:var(--text-muted);padding:0 2px;margin-left:auto;font-family:'Pretendard',sans-serif;line-height:1;transition:color .15s;}
.comment-delete-btn:hover{color:#EF4444;}
.comment-empty{font-size:13px;color:var(--text-muted);text-align:center;padding:14px 0;}
.album-comment-input-row{display:flex;gap:8px;padding-top:12px;border-top:1px solid var(--border-light);}
.album-comment-input{flex:1;height:36px;padding:0 12px;border:1.5px solid var(--border-light);border-radius:var(--radius-md);font-size:13px;font-family:'Pretendard',sans-serif;outline:none;transition:.18s;color:var(--text-primary);}
.album-comment-input:focus{border-color:var(--accent);}
.album-comment-send-btn{height:36px;padding:0 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:700;cursor:pointer;font-family:'Pretendard',sans-serif;}
.album-comment-send-btn:hover{background:var(--accent-dark);}
```

> **주의:** 앨범 파일에 이미 `.comment-*` CSS 클래스가 없으면 추가. 이미 있으면 중복 방지를 위해 기존 것 확인 후 병합.

- [ ] **Step 2: `ALBUMS_RAW` 첫 3개 앨범에 `commentList` 추가 (line ~481~493)**

기존 A001:
```js
{id:'A001', title:'봄 소풍 나들이', cls:'전체', count:34, author:'김원장', date:'2026.03.22', likes:18, comments:5},
```

교체 (A001~A003, `commentList` 추가):
```js
{id:'A001', title:'봄 소풍 나들이',    cls:'전체',  count:34, author:'김원장', date:'2026.03.22', likes:18, comments:5,
  commentList:[
    {id:'ac1', author:'김민지 엄마', initials:'김', isTeacher:false, text:'사진이 너무 예쁘게 잘 나왔어요!', time:'2026.03.22 15:20'},
    {id:'ac2', author:'박교사',      initials:'박', isTeacher:true,  text:'날씨가 좋아서 아이들이 정말 신나했어요 😊', time:'2026.03.22 16:00'},
    {id:'ac3', author:'이현우 엄마', initials:'이', isTeacher:false, text:'즐거운 시간 만들어 주셔서 감사합니다!', time:'2026.03.22 17:10'},
  ]},
{id:'A002', title:'3월 생일 파티',     cls:'전체',  count:28, author:'김원장', date:'2026.03.20', likes:24, comments:8,
  commentList:[
    {id:'ac4', author:'최준혁 엄마', initials:'최', isTeacher:false, text:'생일 파티 준비해 주셔서 감사해요!', time:'2026.03.20 14:30'},
    {id:'ac5', author:'박교사',      initials:'박', isTeacher:true,  text:'아이들 모두 너무 즐거워했어요!', time:'2026.03.20 15:00'},
  ]},
{id:'A003', title:'햇님반 텃밭 가꾸기',cls:'햇님반', count:18, author:'박교사', date:'2026.03.18', likes:12, comments:3,
  commentList:[
    {id:'ac6', author:'박교사',      initials:'박', isTeacher:true,  text:'아이들이 직접 씨앗을 심어봤어요!', time:'2026.03.18 11:00'},
    {id:'ac7', author:'김서준 엄마', initials:'김', isTeacher:false, text:'집에서도 식물 키우고 싶다고 하더라고요!', time:'2026.03.18 18:20'},
  ]},
```

나머지 A004~A012는 `commentList:[]` 추가:
```js
{id:'A004', ..., comments:4, commentList:[]},
// ... 등 동일 패턴
```

- [ ] **Step 3: 상세 모달 HTML (`detailModal` body, line ~351~353) 에 댓글 섹션 추가**

기존:
```html
    <div class="modal-body">
      <div class="photo-grid" id="photoGrid"></div>
    </div>
```

교체:
```html
    <div class="modal-body">
      <div class="photo-grid" id="photoGrid"></div>
      <div class="album-comment-section">
        <div class="album-comment-title">댓글 (<span id="albumCommentCount">0</span>)</div>
        <div class="comment-list" id="albumCommentList"></div>
        <div class="album-comment-input-row">
          <input class="album-comment-input" id="albumCommentInput" placeholder="댓글을 입력하세요">
          <button class="album-comment-send-btn" onclick="submitAlbumComment()">전송</button>
        </div>
      </div>
    </div>
```

- [ ] **Step 4: `openDetail()` 함수에 `renderAlbumComments()` 호출 추가 (line ~706 `openModal` 직전)**

기존:
```js
  document.getElementById('photoGrid').innerHTML = photoItems;
  openModal('detailModal');
```

교체:
```js
  document.getElementById('photoGrid').innerHTML = photoItems;
  renderAlbumComments(id);
  currentAlbumId = id;
  openModal('detailModal');
```

상단 변수 선언부 (line ~452 `const AL_USER_ROLE` 이전) 에 추가:
```js
let currentAlbumId = null;
```

- [ ] **Step 5: `renderAlbumComments()`, `submitAlbumComment()`, `deleteAlbumComment()` 함수를 파일 하단 JS 영역에 추가**

```js
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ALBUM COMMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function renderAlbumComments(albumId) {
  const a = albums.find(x => x.id === albumId);
  const list = document.getElementById('albumCommentList');
  const countEl = document.getElementById('albumCommentCount');
  if (!a || !list) return;
  const cmts = a.commentList || [];
  const ME = sessionStorage.getItem('userName') || '박교사';
  countEl.textContent = cmts.length;
  if (!cmts.length) {
    list.innerHTML = '<div class="comment-empty">아직 댓글이 없습니다</div>';
    return;
  }
  list.innerHTML = cmts.map(c => {
    const canDel = c.isTeacher && c.author === ME;
    return `
    <div class="comment-item" id="acitem-${c.id}">
      <div class="comment-avatar${c.isTeacher?' teacher':''}">${escHtml ? escHtml(c.initials) : c.initials}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${c.author}</span>
          <span class="comment-time">${c.time}</span>
          ${canDel ? `<button class="comment-delete-btn" onclick="deleteAlbumComment('${albumId}','${c.id}')">삭제</button>` : ''}
        </div>
        <div class="comment-text">${c.text}</div>
      </div>
    </div>`;
  }).join('');
}

function submitAlbumComment() {
  const inp = document.getElementById('albumCommentInput');
  const text = inp ? inp.value.trim() : '';
  if (!text) return;
  const a = albums.find(x => x.id === currentAlbumId);
  if (!a) return;
  const ME = sessionStorage.getItem('userName') || '박교사';
  if (!a.commentList) a.commentList = [];
  a.commentList.push({
    id: 'ac'+Date.now(),
    author: ME,
    initials: ME[0],
    isTeacher: true,
    text,
    time: new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\. /g,'.').replace('.','') + ' ' + new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})
  });
  a.comments = a.commentList.length;
  if (inp) inp.value = '';
  renderAlbumComments(currentAlbumId);
  renderCurrentView();
  showToast('댓글이 등록되었습니다', 'success');
}

function deleteAlbumComment(albumId, commentId) {
  const a = albums.find(x => x.id === albumId);
  if (!a || !a.commentList) return;
  const idx = a.commentList.findIndex(x => x.id === commentId);
  if (idx === -1) return;
  a.commentList.splice(idx, 1);
  a.comments = a.commentList.length;
  renderAlbumComments(albumId);
  renderCurrentView();
  showToast('댓글이 삭제되었습니다', 'success');
}
```

> **주의:** `escHtml` 함수가 앨범 파일에 없으면 `c.initials` 직접 사용. `renderCurrentView()`는 앨범 카드의 댓글 수 업데이트용 — 실제 함수명 확인 후 사용 (없으면 제거).

- [ ] **Step 6: 브라우저에서 동작 확인**
  - 앨범 카드 클릭 → 상세 모달에 댓글 섹션 표시
  - A001/A002/A003은 댓글 목록 표시, 나머지는 "아직 댓글이 없습니다"
  - `박교사` 댓글에만 "삭제" 버튼 표시
  - 댓글 작성 → 목록에 추가
  - 삭제 클릭 → 댓글 사라지고 toast

- [ ] **Step 7: 커밋**

```bash
git add src/pages/oper/operation-album.html
git commit -m "feat: 앨범 댓글 섹션 추가 + 삭제 기능 (교사 본인 댓글)"
```

---

## 셀프 리뷰

**스펙 커버리지:**
- [x] 알림장 댓글 삭제 (Task 2)
- [x] 공지사항 댓글·답변 삭제 (Task 1)
- [x] 앨범 댓글 삭제 (Task 3)
- [x] 교사 본인만 삭제 가능 (ME === comment.author 조건)
- [x] 공지사항 디자인으로 통일 (Task 2 flat CSS, Task 3 flat CSS)

**주의 사항:**
- 알림장 Task 2에서 `currentNoticeId` 변수명이 파일 내 실제와 다를 경우 확인 필요
- 앨범 `renderCurrentView()` 함수명은 실제 파일 내 함수 확인 필요 (`applyFilter()` 또는 `renderAlbums()` 일 수 있음)
- 알림장 두 번째 렌더링 위치(line ~1738)의 `child.id` 접근 맥락 확인 필요
