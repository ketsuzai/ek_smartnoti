# 댓글 삭제 기능 설계

**날짜:** 2026-04-07  
**적용 범위:** 알림장, 공지사항, 앨범 댓글  
**권한:** 교사 — 자신이 등록한 댓글만 삭제 가능

---

## 1. 디자인 기준

공지사항 댓글 flat 스타일 (`.comment-item > .comment-avatar + .comment-body`)을 기준으로 세 페이지 통일.  
알림장의 버블(`.comment-bubble`) 스타일은 flat 스타일로 교체.  
앨범은 댓글 데이터 + UI 신규 추가.

---

## 2. 삭제 버튼 UX

- 위치: `.comment-header` 우측 (flex `margin-left:auto`)
- 표시 조건: `isTeacher && comment.author === 현재사용자명`
- 스타일: `font-size:11px`, `color:var(--text-muted)`, hover → `color:var(--danger-text)`
- 클릭: 별도 confirm 없이 즉시 삭제 + `showToast('댓글이 삭제되었습니다', 'success')`
- 현재 사용자 = `sessionStorage.getItem('userName') || '박교사'` (프로토타입 기본값)

---

## 3. 파일별 변경 사항

### operation-announcement.html
- `renderComments()` — 삭제 버튼 HTML 추가 (조건부)
- `deleteComment(commentId)` 함수 추가
- `.comment-delete-btn` CSS 추가

### operation-notice-board.html
- mock 댓글 데이터에 `id` 필드 추가
- 버블 스타일 CSS 제거, flat 스타일 CSS 추가 (`comment-body`, `comment-header`, `comment-text`)
- 댓글 렌더링 함수 flat 구조로 변경
- `deleteComment(childId, commentId)` 함수 추가
- 세션 변수 (`NB_IS_TEACHER`, `NB_USER_NAME`) 추가

### operation-album.html
- `ALBUMS_RAW`의 `comments` 필드를 `commentCount`로 rename
- `commentList` 배열 필드 추가 (mock 데이터)
- 상세 모달에 댓글 섹션 HTML 추가
- `renderAlbumComments(albumId)` 함수 추가
- `deleteAlbumComment(albumId, commentId)` 함수 추가
- 공지사항 스타일 댓글 CSS 추가

---

## 4. 댓글 데이터 구조 (통일)

```js
{
  id: 'c' + timestamp,
  author: '박교사',
  initials: '박',
  isTeacher: true,
  text: '...',
  time: '2026.03.21 10:05',
  replies: []  // 공지사항만 사용
}
```
