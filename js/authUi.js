/**
 * authUi.js - 헤더 및 공통 영역 로그인/로그아웃 상태 UI 연동 컴포넌트
 * 
 * - 상단 로그인 상태 표시 ("{이름}님 환영합니다 ♥")
 * - 로그인 버튼을 로그아웃 버튼으로 동적 전환 및 이벤트 연결
 * - 로그인 상태에 따른 실시간 갱신 (커스텀 이벤트 "sanrio:authChange" 수신)
 */

import { getCurrentUser, logoutUser } from "./services/authService.js";

export const initHeaderAuthUI = () => {
  // 상대 경로 판별 (pages 디렉토리 여부)
  const isInsidePages = window.location.pathname.includes("/pages/");
  const loginPageUrl = isInsidePages ? "./login.html" : "./pages/login.html";

  const renderAuthElements = () => {
    const user = getCurrentUser();

    // 1. 헤더 내 로그인 툴바/버튼 컨테이너 찾기 또는 생성
    const desktopTools = document.querySelector(".site-header__tools");
    const mobileTools = document.querySelector(".site-header__mobile-tools");

    // 데스크톱 로그인/로그아웃 위젯
    if (desktopTools) {
      let authDesktopItem = document.querySelector("[data-auth-desktop]");
      if (!authDesktopItem) {
        authDesktopItem = document.createElement("div");
        authDesktopItem.setAttribute("data-auth-desktop", "true");
        authDesktopItem.className = "header-auth-status";
        // 데스크톱 툴바의 맨 앞에 삽입
        desktopTools.insertBefore(authDesktopItem, desktopTools.firstChild);
      }

      if (user) {
        authDesktopItem.innerHTML = `
          <div class="auth-welcome">
            <span class="auth-welcome__ribbon" aria-hidden="true">🎀</span>
            <span class="auth-welcome__text"><strong class="auth-user-name">${user.name}</strong>님 환영합니다</span>
            ${user.role === "admin" ? '<span class="auth-badge-admin">관리자</span>' : ""}
          </div>
          <button type="button" class="site-header__tool header-auth-btn" data-auth-action="logout" title="로그아웃">
            <svg class="site-header__tool-icon header-auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>로그아웃</span>
          </button>
        `;
      } else {
        authDesktopItem.innerHTML = `
          <a class="site-header__tool header-auth-btn" href="${loginPageUrl}" title="로그인 / 회원가입">
            <svg class="site-header__tool-icon header-auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>로그인</span>
          </a>
        `;
      }
    }

    // 모바일 로그인/로그아웃 버튼 업데이트
    if (mobileTools) {
      let mobileLogin = mobileTools.querySelector(".site-header__mobile-login");
      if (mobileLogin) {
        if (user) {
          mobileLogin.setAttribute("href", "#logout");
          mobileLogin.innerHTML = `
            <img src="${isInsidePages ? '../' : './'}images/used/icon-mypage-portal.svg" alt="" aria-hidden="true">
            <span>로그아웃</span>
          `;
          mobileLogin.onclick = (e) => {
            e.preventDefault();
            if (confirm("로그아웃 하시겠습니까?")) {
              logoutUser();
              window.location.reload();
            }
          };
        } else {
          mobileLogin.setAttribute("href", loginPageUrl);
          mobileLogin.innerHTML = `
            <img src="${isInsidePages ? '../' : './'}images/used/icon-mypage-portal.svg" alt="" aria-hidden="true">
            <span>로그인</span>
          `;
          mobileLogin.onclick = null;
        }
      }
    }

    // 인덱스 페이지의 퀵 링크(aside.quick-links) 처리
    const quickLinks = document.querySelector(".quick-links");
    if (quickLinks) {
      const firstQuickLink = quickLinks.querySelector(".quick-links__link:first-child");
      if (firstQuickLink) {
        if (user) {
          firstQuickLink.setAttribute("href", "#logout");
          const textSpan = firstQuickLink.querySelector("span");
          if (textSpan) textSpan.textContent = "로그아웃";
          firstQuickLink.onclick = (e) => {
            e.preventDefault();
            if (confirm("로그아웃 하시겠습니까?")) {
              logoutUser();
              window.location.reload();
            }
          };
        } else {
          firstQuickLink.setAttribute("href", loginPageUrl);
          const textSpan = firstQuickLink.querySelector("span");
          if (textSpan) textSpan.textContent = "로그인";
          firstQuickLink.onclick = null;
        }
      }

      // 두 번째 링크 (회원가입 링크)
      const secondQuickLink = quickLinks.querySelector(".quick-links__link:nth-child(2)");
      if (secondQuickLink) {
        if (user) {
          // 이미 로그인된 경우 프로필 또는 안내
          secondQuickLink.setAttribute("href", "#");
          const textSpan = secondQuickLink.querySelector("span");
          if (textSpan) textSpan.innerHTML = `${user.name}님<br>접속중`;
        } else {
          secondQuickLink.setAttribute("href", `${loginPageUrl}#register-section`);
          const textSpan = secondQuickLink.querySelector("span");
          if (textSpan) textSpan.innerHTML = `Sanrio+<br>会員登録`;
        }
      }
    }

    // 로그아웃 버튼 이벤트 바인딩
    const logoutBtns = document.querySelectorAll('[data-auth-action="logout"]');
    logoutBtns.forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        if (confirm("로그아웃 하시겠습니까?")) {
          logoutUser();
          window.location.reload();
        }
      };
    });
  };

  // 초기 렌더링
  renderAuthElements();

  // 로그인/로그아웃 상태 변경 감지
  window.addEventListener("sanrio:authChange", () => {
    renderAuthElements();
  });
};

