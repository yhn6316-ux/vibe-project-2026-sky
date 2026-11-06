import {
  loginUser,
  registerUser,
  checkUserIdAvailable,
  checkEmailAvailable,
  getCurrentUser,
  ADMIN_CREDENTIALS,
} from "./services/authService.js";
import { initHeaderAuthUI } from "./authUi.js";

// DOM 헬퍼
const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  // 헤더 인증 UI 활성화
  initHeaderAuthUI();

  // 이미 로그인되어 있는 경우
  const currentUser = getCurrentUser();
  const loginSection = $("#login-section");
  const loginForm = $("#login-form");
  const registerForm = $("#register-form");

  if (currentUser) {
    if (loginSection) {
      loginSection.innerHTML = `
        <div class="auth-card__header">
          <span class="auth-card__icon" aria-hidden="true">🎀</span>
          <h1 class="auth-card__title">이미 로그인된 상태입니다</h1>
          <p class="auth-card__desc"><strong>${currentUser.name}</strong> (${currentUser.userId}) 님으로 접속 중입니다.</p>
        </div>
        <div style="display:flex; justify-content:center; gap: 1rem; margin-top: 1.5rem;">
          <a href="./notices.html" class="auth-submit-btn" style="text-decoration:none;">공지사항 바로가기</a>
          <button type="button" class="auth-submit-btn" style="background:#888; text-decoration:none;" id="btn-already-logout">로그아웃</button>
        </div>
      `;
      const logoutBtn = $("#btn-already-logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          import("./services/authService.js").then(({ logoutUser }) => {
            logoutUser();
            window.location.reload();
          });
        });
      }
    }
    return;
  }

  // 1. 관리자 정보 자동 채우기 버튼 이벤트
  const fillAdminBtn = $("#btn-fill-admin");
  if (fillAdminBtn) {
    fillAdminBtn.addEventListener("click", () => {
      const idInput = $("#login-user-id");
      const pwInput = $("#login-password");
      if (idInput && pwInput) {
        idInput.value = ADMIN_CREDENTIALS.userId;
        pwInput.value = ADMIN_CREDENTIALS.password;
      }
    });
  }

  // 2. 로그인 폼 제출 처리
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const idInput = $("#login-user-id");
      const pwInput = $("#login-password");
      const errorMsg = $("#login-error");
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (errorMsg) {
        errorMsg.textContent = "";
        errorMsg.hidden = true;
      }

      const userId = idInput.value.trim();
      const password = pwInput.value.trim();

      if (!userId || !password) {
        if (errorMsg) {
          errorMsg.textContent = "아이디와 비밀번호를 모두 입력해주세요.";
          errorMsg.hidden = false;
        }
        return;
      }

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "로그인 중...";
        }

        const user = await loginUser(userId, password);
        alert(`${user.name}님 환영합니다!`);

        // 리다이렉트 (이전 페이지가 공지사항이거나 파라미터가 있으면 공지사항으로, 아니면 인덱스/공지사항)
        const referrer = document.referrer;
        if (referrer && (referrer.includes("notices.html") || referrer.includes("index.html"))) {
          window.location.href = referrer;
        } else {
          window.location.href = "./notices.html";
        }
      } catch (err) {
        if (errorMsg) {
          errorMsg.textContent = err.message || "로그인에 실패했습니다.";
          errorMsg.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>로그인</span><span aria-hidden="true">➜</span>';
        }
      }
    });
  }

  // 3. 회원가입: 아이디 중복 체크 버튼
  const checkIdBtn = $("#btn-check-id");
  let isIdChecked = false;
  let checkedIdValue = "";

  if (checkIdBtn) {
    checkIdBtn.addEventListener("click", async () => {
      const idInput = $("#reg-user-id");
      const feedback = $("#reg-id-feedback");
      const val = idInput.value.trim();

      if (!val) {
        if (feedback) {
          feedback.textContent = "아이디를 입력해주세요.";
          feedback.className = "auth-feedback auth-feedback--error";
          feedback.hidden = false;
        }
        idInput.focus();
        return;
      }

      try {
        checkIdBtn.disabled = true;
        checkIdBtn.textContent = "확인 중...";

        const available = await checkUserIdAvailable(val);
        if (available) {
          isIdChecked = true;
          checkedIdValue = val;
          if (feedback) {
            feedback.textContent = "사용 가능한 아이디입니다.";
            feedback.className = "auth-feedback auth-feedback--success";
            feedback.hidden = false;
          }
        } else {
          isIdChecked = false;
          checkedIdValue = "";
          if (feedback) {
            feedback.textContent = "이미 사용 중인 아이디입니다.";
            feedback.className = "auth-feedback auth-feedback--error";
            feedback.hidden = false;
          }
        }
      } catch (err) {
        if (feedback) {
          feedback.textContent = "중복 확인 중 오류가 발생했습니다.";
          feedback.className = "auth-feedback auth-feedback--error";
          feedback.hidden = false;
        }
      } finally {
        checkIdBtn.disabled = false;
        checkIdBtn.textContent = "중복확인";
      }
    });
  }

  // 아이디 변경 시 중복체크 리셋
  const regIdInput = $("#reg-user-id");
  if (regIdInput) {
    regIdInput.addEventListener("input", () => {
      if (regIdInput.value.trim() !== checkedIdValue) {
        isIdChecked = false;
        const feedback = $("#reg-id-feedback");
        if (feedback) feedback.hidden = true;
      }
    });
  }

  // 4. 회원가입 폼 제출 처리
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nameInput = $("#reg-name");
      const idInput = $("#reg-user-id");
      const pwInput = $("#reg-password");
      const pwConfirmInput = $("#reg-password-confirm");
      const emailInput = $("#reg-email");
      const errorMsg = $("#register-error");
      const successMsg = $("#register-success");
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      if (errorMsg) {
        errorMsg.textContent = "";
        errorMsg.hidden = true;
      }
      if (successMsg) {
        successMsg.textContent = "";
        successMsg.hidden = true;
      }

      const name = nameInput.value.trim();
      const userId = idInput.value.trim();
      const password = pwInput.value.trim();
      const passwordConfirm = pwConfirmInput.value.trim();
      const email = emailInput.value.trim();

      // 기본 유효성 검사
      if (!name || !userId || !password || !email) {
        if (errorMsg) {
          errorMsg.textContent = "모든 항목을 입력해주세요.";
          errorMsg.hidden = false;
        }
        return;
      }

      if (password !== passwordConfirm) {
        if (errorMsg) {
          errorMsg.textContent = "비밀번호가 일치하지 않습니다.";
          errorMsg.hidden = false;
        }
        pwConfirmInput.focus();
        return;
      }

      if (!isIdChecked || checkedIdValue !== userId) {
        // 자동 중복확인 시도
        try {
          const available = await checkUserIdAvailable(userId);
          if (!available) {
            if (errorMsg) {
              errorMsg.textContent = "이미 사용 중인 아이디입니다. 아이디 중복확인을 해주세요.";
              errorMsg.hidden = false;
            }
            return;
          }
        } catch (e) {
          if (errorMsg) {
            errorMsg.textContent = "아이디 중복확인을 진행해주세요.";
            errorMsg.hidden = false;
          }
          return;
        }
      }

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "회원가입 처리 중...";
        }

        await registerUser({ name, userId, password, email });

        if (successMsg) {
          successMsg.textContent = "🎉 회원가입이 완료되었습니다! 위 로그인 폼에서 로그인해주세요.";
          successMsg.hidden = false;
        }
        registerForm.reset();
        isIdChecked = false;
        checkedIdValue = "";

        // 로그인 폼으로 스크롤 이동 및 아이디 채워주기
        const loginIdInput = $("#login-user-id");
        if (loginIdInput) {
          loginIdInput.value = userId;
          $("#login-password")?.focus();
        }
        loginSection?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        if (errorMsg) {
          errorMsg.textContent = err.message || "회원가입 중 오류가 발생했습니다.";
          errorMsg.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>회원가입 완료</span><span aria-hidden="true">🎀</span>';
        }
      }
    });
  }
});

