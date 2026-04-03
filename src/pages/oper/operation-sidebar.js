/**
 * operation-sidebar.js
 * 운영관리 섹션 공통 사이드바 — CSS 주입 + HTML 렌더 + 상태 초기화
 * 사용법: <script src="operation-sidebar.js" defer></script>
 *         <aside id="appSidebar"></aside>  ← 사이드바 플레이스홀더
 */
(function () {
  // ─── CSS 주입 ────────────────────────────────────────────────
  const css = `
.sidebar{width:var(--sidebar-width);background:var(--sidebar-bg);display:flex;flex-direction:column;height:100vh;position:fixed;left:0;top:0;z-index:100;box-shadow:4px 0 20px rgba(12,45,72,0.18);}
.sidebar-logo{height:var(--header-height);display:flex;align-items:center;gap:10px;padding:0 20px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
.logo-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--accent),#38BDF8);display:flex;align-items:center;justify-content:center;font-size:16px;}
.logo-text{font-size:15px;font-weight:700;color:#fff;}
.logo-sub{font-size:13px;color:var(--sidebar-text);}
.org-banner{margin:12px 10px;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.25);border-radius:10px;padding:10px 12px;}
.org-banner-name{font-size:15px;font-weight:700;color:#fff;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.role-badge{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:700;padding:2px 8px;border-radius:20px;}
.role-badge.super{background:rgba(99,102,241,0.25);color:#A5B4FC;}
.role-badge.org{background:rgba(14,165,233,0.25);color:#7DD3FC;}
.role-badge.teacher{background:rgba(20,184,166,0.25);color:#5EEAD4;}
.super-context-banner{margin:0 10px 8px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);border-radius:10px;padding:8px 12px;display:none;}
.super-context-banner.show{display:block;}
.scb-label{font-size:10px;color:#A5B4FC;font-weight:600;margin-bottom:3px;}
.scb-btns{display:flex;gap:5px;margin-top:6px;}
.scb-btn{flex:1;font-size:10px;font-weight:700;padding:4px 6px;border-radius:6px;border:none;cursor:pointer;font-family:'Pretendard',sans-serif;transition:0.18s;}
.scb-btn.change{background:rgba(14,165,233,0.2);color:#7DD3FC;}
.scb-btn.change:hover{background:rgba(14,165,233,0.35);}
.scb-btn.exit{background:rgba(239,68,68,0.2);color:#FCA5A5;}
.scb-btn.exit:hover{background:rgba(239,68,68,0.35);}
.sidebar-nav{flex:1;overflow-y:auto;padding:6px 0;}
.sidebar-nav::-webkit-scrollbar{width:3px;}
.sidebar-nav::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
.nav-section{padding:14px 16px 4px;}
.nav-section-label{font-size:10px;font-weight:700;color:rgba(184,217,240,0.45);letter-spacing:1px;text-transform:uppercase;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;margin:1px 8px;border-radius:10px;color:var(--sidebar-text);font-size:15px;font-weight:500;cursor:pointer;transition:0.18s;text-decoration:none;user-select:none;}
.nav-item:hover{background:var(--sidebar-hover);color:#fff;}
.nav-item.active{background:var(--sidebar-active);color:#fff;font-weight:600;}
.nav-item.active .nav-icon{color:#38BDF8;}
.nav-item.disabled{opacity:0.35;cursor:not-allowed;pointer-events:none;}
.nav-icon{font-size:15px;flex-shrink:0;}
.nav-badge{margin-left:auto;background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;}
.nav-badge.sky{background:var(--accent);}
.sidebar-footer{padding:12px 14px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
.sidebar-user{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;cursor:pointer;transition:0.18s;}
.sidebar-user:hover{background:var(--sidebar-hover);}
.user-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;}
.user-name{font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.user-role-lbl{font-size:11px;color:var(--sidebar-text);}
.logout-icon{margin-left:auto;font-size:15px;color:var(--sidebar-text);transition:color 0.2s;}
.logout-icon:hover{color:var(--red);}
`;
  const styleEl = document.createElement('style');
  styleEl.id = 'sidebar-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── HTML 구조 주입 ─────────────────────────────────────────
  const aside = document.getElementById('appSidebar');
  if (!aside) return; // 플레이스홀더 없으면 중단
  aside.className = 'sidebar';
  aside.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon">🧒</div>
      <div>
        <div class="logo-text">키드키즈 알림장</div>
        <div class="logo-sub" id="sidePortalLabel">기관 포털</div>
      </div>
    </div>
    <div class="org-banner">
      <div class="org-banner-name" id="sideOrgName">해맑은 어린이집</div>
      <span class="role-badge org" id="sideRoleBadge">🏫 기관관리자</span>
    </div>
    <div class="super-context-banner" id="superContextBanner">
      <div class="scb-label">🔑 통합관리자 운영관리 모드</div>
      <div class="scb-btns">
        <button class="scb-btn change" onclick="changeOrg()">기관 변경</button>
        <button class="scb-btn exit"   onclick="exitContext()">컨텍스트 종료</button>
      </div>
    </div>
    <nav class="sidebar-nav" id="sidebarNav"></nav>
    <div class="sidebar-footer">
      <div class="sidebar-user" onclick="logout()">
        <div class="user-avatar" id="sideUserAvatar"
             style="background:linear-gradient(135deg,#0EA5E9,#38BDF8)">관</div>
        <div style="flex:1;min-width:0">
          <div class="user-name" id="sideUserName">기관관리자</div>
          <div class="user-role-lbl" id="sideUserRole">기관관리자</div>
        </div>
        <span class="logout-icon" title="로그아웃">⏻</span>
      </div>
    </div>
  `;

  // ─── 초기화 ─────────────────────────────────────────────────
  function init() {
    const userRole      = sessionStorage.getItem('userRole')  || 'org_admin';
    const userName      = sessionStorage.getItem('userName')  || '관리자';
    const opContext     = JSON.parse(sessionStorage.getItem('operationContext') || 'null');
    const effectiveRole = (opContext && opContext.contextRole) ? opContext.contextRole : userRole;
    const orgName       = opContext?.orgName ?? sessionStorage.getItem('orgName') ?? '해맑은 어린이집';
    const isTeacher     = effectiveRole === 'teacher';
    const isSuper       = userRole === 'super';

    document.getElementById('sideOrgName').textContent = orgName;
    document.getElementById('sideUserName').textContent = userName;
    document.getElementById('sideUserAvatar').textContent = userName.charAt(0);

    const badge = document.getElementById('sideRoleBadge');
    if (isTeacher) {
      badge.textContent = '📚 교사관리자';
      badge.className = 'role-badge teacher';
      document.getElementById('sideUserAvatar').style.background = 'linear-gradient(135deg,#14B8A6,#2DD4BF)';
      document.getElementById('sideUserRole').textContent = '교사관리자';
      document.getElementById('sidePortalLabel').textContent = '교사 포털';
      // super가 교사 컨텍스트로 진입한 경우 컨텍스트 배너 유지
      if (isSuper && opContext) document.getElementById('superContextBanner').classList.add('show');
    } else if (isSuper) {
      badge.textContent = '🔑 통합관리자';
      badge.className = 'role-badge super';
      document.getElementById('sideUserAvatar').style.background = 'linear-gradient(135deg,#6366F1,#818CF8)';
      document.getElementById('sideUserRole').textContent = 'Super Admin';
      document.getElementById('sidePortalLabel').textContent = '운영관리 모드';
      if (opContext) document.getElementById('superContextBanner').classList.add('show');
    } else {
      badge.textContent = '🏫 기관관리자';
      badge.className = 'role-badge org';
      document.getElementById('sideUserRole').textContent = '기관관리자';
      document.getElementById('sidePortalLabel').textContent = '기관 포털';
    }

    // breadcrumbOrg (대시보드에는 없는 요소)
    const bcOrg = document.getElementById('breadcrumbOrg');
    if (bcOrg) bcOrg.textContent = orgName;

    renderNav(effectiveRole);
  }

  function renderNav(role) {
    const isTeacher   = role === 'teacher';
    const inviteBadge = isTeacher ? '1' : '2';
    const noticeBadge = isTeacher ? '3' : '5';
    const filename    = location.pathname.split('/').pop();

    const NAV = [
      { icon:'🏠', label:'대시보드',                             href:'operation-dashboard.html'  },
      { section: '학급 관리' },
      { icon:'👥', label:'반 관리',                              href:'operation-class.html'       },
      { icon:'🧒', label:'원아 관리',                            href:'operation-child.html'       },
      { icon:'📨', label:'초대장 관리',                          href:'operation-invitation.html',
                   badge: inviteBadge, badgeClass:'sky'                                            },
      { section: '콘텐츠' },
      { icon:'📋', label:'알림장',                               href:'operation-notice-board.html',
                   badge: noticeBadge                                                               },
      { icon:'📢', label:'공지사항',                             href:'operation-announcement.html'},
      { icon:'🖼️', label:'앨범',                                 href:'operation-album.html'       },
      { icon:'📅', label:'일정 관리',                            href:'operation-schedule.html'    },
      { icon:'💬', label:'상담 관리',                            href:'operation-consulting.html'  },
      { icon:'💊', label:'투약의뢰서',                           href:'operation-medicine.html'    },
      { section: '기관 관리' },
      { icon:'🏢', label: isTeacher ? '기관정보 조회' : '기관정보 관리',
                   href: 'operation-org-info.html'                                                 },
      { section: '통계' },
      { icon:'📊', label:'통계',                                 href:'operation-dashboard.html'   },
    ];

    const nav = document.getElementById('sidebarNav');
    nav.innerHTML = NAV.map(m => {
      if (m.section) {
        return `<div class="nav-section"><span class="nav-section-label">${m.section}</span></div>`;
      }
      const isActive    = (filename === m.href);
      const badgeHtml   = m.badge ? `<span class="nav-badge ${m.badgeClass || ''}">${m.badge}</span>` : '';
      const disabledCls = m.disabled ? 'disabled' : '';
      return `<a class="nav-item ${isActive ? 'active' : ''} ${disabledCls}" href="${m.href}">
        <span class="nav-icon">${m.icon}</span>${m.label}${badgeHtml}
      </a>`;
    }).join('');
  }

  // DOM 준비 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ─── 전역 함수 노출 ─────────────────────────────────────────
  window.changeOrg = function () {
    sessionStorage.removeItem('operationContext');
    sessionStorage.removeItem('assignedClasses');
    sessionStorage.removeItem('currentClass');
    location.href = 'operation-org-selector.html';
  };

  window.exitContext = function () {
    sessionStorage.removeItem('operationContext');
    sessionStorage.removeItem('assignedClasses');
    sessionStorage.removeItem('currentClass');
    location.href = '../dashboard.html';
  };

  window.logout = function () {
    if (confirm('로그아웃 하시겠습니까?')) {
      sessionStorage.clear();
      location.href = '/';
    }
  };
})();
