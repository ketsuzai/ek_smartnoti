/**
 * operation-header.js
 * 운영관리 섹션 공통 헤더 — CSS 주입 + 날짜/알림/설정/글로벌임시보관함 렌더 + 모달
 * 사용법: <script src="operation-header.js" defer></script>
 *         <div class="topbar-right" id="topbarRight"></div>  ← 플레이스홀더
 */
(function () {

  // ─── CSS 주입 ─────────────────────────────────────────────────
  const css = `
/* notif-dot badge */
.notif-dot{position:relative;}
.notif-dot::after{content:'';position:absolute;top:6px;right:6px;width:6px;height:6px;border-radius:50%;background:var(--red,#EF4444);pointer-events:none;}

/* ─── 글로벌 임시보관함 모달 ─── */
.gdraft-overlay{position:fixed;inset:0;background:rgba(12,45,72,0.35);z-index:600;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:.2s;}
.gdraft-overlay.open{opacity:1;pointer-events:all;}
.gdraft-box{background:var(--bg-surface,#fff);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.18);width:560px;max-width:95vw;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;transform:scale(.96);transition:.2s;}
.gdraft-overlay.open .gdraft-box{transform:scale(1);}
.gdraft-header{padding:18px 24px 14px;border-bottom:1px solid var(--border-light,#DBEAFE);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.gdraft-title{font-size:15px;font-weight:800;color:var(--text-primary,#0C2D48);}
.gdraft-close{width:28px;height:28px;border-radius:6px;background:var(--bg-base,#F0F7FF);border:1.5px solid var(--border-light,#DBEAFE);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--text-secondary,#4B7FA3);transition:.15s;font-family:inherit;}
.gdraft-close:hover{background:var(--red-bg,#FEE2E2);border-color:var(--red-bg,#FEE2E2);color:var(--red-text,#991B1B);}
.gdraft-body{padding:18px 24px;overflow-y:auto;flex:1;}
.gdraft-body::-webkit-scrollbar{width:4px;}
.gdraft-body::-webkit-scrollbar-thumb{background:var(--border-medium,#BAD9F7);border-radius:2px;}
.gdraft-footer{padding:12px 24px;border-top:1px solid var(--border-light,#DBEAFE);display:flex;justify-content:flex-end;flex-shrink:0;}
.gdraft-list{display:flex;flex-direction:column;gap:8px;}
.gdraft-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg-base,#F0F7FF);border-radius:10px;border:1.5px solid var(--border-light,#DBEAFE);transition:.18s;}
.gdraft-item:hover{border-color:var(--accent,#0EA5E9);background:var(--accent-light,#E0F2FE);}
.gdraft-item-left{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.gdraft-type-badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;white-space:nowrap;flex-shrink:0;}
.gdraft-type-announcement{background:var(--blue-bg,#DBEAFE);color:var(--blue-text,#1E40AF);}
.gdraft-type-notice_board{background:var(--green-bg,#D1FAE5);color:var(--green-text,#065F46);}
.gdraft-type-album{background:var(--purple-bg,#EDE9FE);color:var(--purple-text,#5B21B6);}
.gdraft-item-info{flex:1;min-width:0;}
.gdraft-item-title{font-size:14px;font-weight:700;color:var(--text-primary,#0C2D48);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.gdraft-item-meta{font-size:12px;color:var(--text-muted,#94B8D0);margin-top:3px;}
.gdraft-resume-btn{height:32px;padding:0 14px;border:1.5px solid var(--border-medium,#BAD9F7);border-radius:8px;background:var(--bg-surface,#fff);font-size:12px;font-weight:700;color:var(--text-secondary,#4B7FA3);cursor:pointer;font-family:inherit;white-space:nowrap;transition:.15s;flex-shrink:0;}
.gdraft-resume-btn:hover{border-color:var(--accent,#0EA5E9);color:var(--accent,#0EA5E9);background:var(--accent-light,#E0F2FE);}
.gdraft-section-label{font-size:11px;font-weight:700;color:var(--text-muted,#94B8D0);text-transform:uppercase;letter-spacing:.5px;padding:12px 0 6px;border-bottom:1px solid var(--border-light,#DBEAFE);margin-bottom:6px;}
.gdraft-section-label:first-child{padding-top:0;}
.gdraft-empty{text-align:center;padding:40px 20px;color:var(--text-muted,#94B8D0);font-size:14px;}
`;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── 타입 메타 ────────────────────────────────────────────────
  const TYPE_META = {
    announcement: { label: '공지사항', cls: 'gdraft-type-announcement' },
    notice_board:  { label: '알림장',   cls: 'gdraft-type-notice_board' },
    album:         { label: '앨범',     cls: 'gdraft-type-album' },
  };

  // ─── 목 데이터 ────────────────────────────────────────────────
  const GLOBAL_DRAFTS = [
    { id:'gd1', type:'announcement', title:'입학식 안내문',         target:'전체',   savedAt:'2026.03.22 14:30' },
    { id:'gd2', type:'announcement', title:'4월 행사 계획',          target:'햇님반', savedAt:'2026.03.18 11:20' },
    { id:'gd3', type:'notice_board', title:'김민준 성장일기 3월',    target:'햇님반', savedAt:'2026.03.21 09:45' },
    { id:'gd4', type:'notice_board', title:'오늘의 급식 특이사항',   target:'달님반', savedAt:'2026.03.15 16:00' },
    { id:'gd5', type:'album',        title:'봄맞이 체육대회 준비',   target:'전체',   savedAt:'2026.03.23 10:00' },
    { id:'gd6', type:'album',        title:'별님반 수학놀이',        target:'별님반', savedAt:'2026.03.21 08:30' },
  ];

  // ─── 헤더 렌더 ────────────────────────────────────────────────
  function renderTopbarRight() {
    const el = document.getElementById('topbarRight');
    if (!el) return;
    const d   = new Date();
    const fmt = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
    el.innerHTML = `
      <span class="topbar-date" style="font-size:13px;color:var(--text-muted,#94B8D0);font-family:'JetBrains Mono',monospace;">${fmt}</span>
      <button class="icon-btn" title="글로벌 임시보관함" onclick="openGlobalDraftModal()" style="position:relative;">
        📂
        <span style="position:absolute;top:4px;right:4px;min-width:16px;height:16px;background:var(--amber,#F59E0B);color:#fff;border-radius:8px;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 3px;font-family:'Pretendard',sans-serif;line-height:1;">${GLOBAL_DRAFTS.length}</span>
      </button>
      <div class="icon-btn notif-dot" title="알림" style="cursor:pointer;">🔔</div>
      <div class="icon-btn" title="설정" style="cursor:pointer;">⚙️</div>
    `;
  }

  // ─── 모달 HTML 주입 ──────────────────────────────────────────
  function injectModal() {
    if (document.getElementById('globalDraftModal')) return;
    const div = document.createElement('div');
    div.innerHTML = `
<div class="gdraft-overlay" id="globalDraftModal">
  <div class="gdraft-box">
    <div class="gdraft-header">
      <span class="gdraft-title">📂 글로벌 임시보관함</span>
      <button class="gdraft-close" onclick="closeGlobalDraftModal()">✕</button>
    </div>
    <div class="gdraft-body">
      <div id="globalDraftListContainer"></div>
    </div>
    <div class="gdraft-footer">
      <button class="gdraft-resume-btn" onclick="closeGlobalDraftModal()">닫기</button>
    </div>
  </div>
</div>`;
    document.body.appendChild(div.firstElementChild);

    document.getElementById('globalDraftModal').addEventListener('click', function (e) {
      if (e.target === this) closeGlobalDraftModal();
    });
  }

  // ─── 글로벌 임시보관함 함수 ───────────────────────────────────
  window.openGlobalDraftModal = function () {
    renderGlobalDraftList();
    document.getElementById('globalDraftModal').classList.add('open');
  };

  window.closeGlobalDraftModal = function () {
    document.getElementById('globalDraftModal').classList.remove('open');
  };

  function renderGlobalDraftList() {
    const container = document.getElementById('globalDraftListContainer');
    if (!container) return;
    if (!GLOBAL_DRAFTS.length) {
      container.innerHTML = '<div class="gdraft-empty">📭 임시보관함이 비어 있습니다</div>';
      return;
    }

    // 타입별 그룹핑
    const groups = [
      { type: 'announcement', items: GLOBAL_DRAFTS.filter(d => d.type === 'announcement') },
      { type: 'notice_board', items: GLOBAL_DRAFTS.filter(d => d.type === 'notice_board') },
      { type: 'album',        items: GLOBAL_DRAFTS.filter(d => d.type === 'album') },
    ].filter(g => g.items.length > 0);

    container.innerHTML = groups.map(g => {
      const meta  = TYPE_META[g.type];
      const items = g.items.map(d => `
        <div class="gdraft-item">
          <div class="gdraft-item-left">
            <span class="gdraft-type-badge ${meta.cls}">${meta.label}</span>
            <div class="gdraft-item-info">
              <div class="gdraft-item-title">${d.title}</div>
              <div class="gdraft-item-meta">저장: ${d.savedAt} · 대상: ${d.target}</div>
            </div>
          </div>
          <button class="gdraft-resume-btn" onclick="closeGlobalDraftModal()">이어쓰기</button>
        </div>`).join('');
      return `<div class="gdraft-section-label">${meta.label}</div><div class="gdraft-list">${items}</div>`;
    }).join('');
  }

  // ─── 초기화 ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    renderTopbarRight();
    injectModal();
  });

})();
