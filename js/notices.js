/**
 * notices.js - 공지사항 UI 컨트롤러
 * 
 * localstorage_to_firebase_guidelines.md 규칙 준수:
 * 1. localStorage 직접 호출 절대 금지! 오직 noticeService만 호출
 * 2. 모든 서비스 통신은 async/await, try/catch, 로딩 상태 관리
 * 3. 4개 화면 흐름 완벽 지원:
 *    - 목록 (list) -> 상세 (detail) -> 수정 (edit) -> 상세 (detail)
 *    - 목록 (list) -> 신규작성 (create) -> 목록 (list)
 * 4. 검증 및 5MB 한도 파일 핸들링
 */

import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "./services/noticeService.js";
import { isAdminUser } from "./services/authService.js";
import { initHeaderAuthUI } from "./authUi.js";

// DOM 셀렉터 헬퍼
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 뷰 요소
const listView = $('[data-js="notice-list-view"]');
const detailView = $('[data-js="notice-detail-view"]');
const formView = $('[data-js="notice-form-view"]');
const loadingSpinner = $('[data-js="loading"]');
const globalError = $('[data-js="global-error"]');

// 상태 변수
const PAGE_SIZE = 7;
let currentPage = 1;
let currentNotice = null;
let attachments = [];
let isHtmlMode = false;

// URL 파라미터 기반 라우팅
const getRouteParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    view: params.get("view") || "list",
    id: params.get("id"),
  };
};

// UI 피드백 헬퍼
const setLoading = (loading) => {
  if (loadingSpinner) {
    loadingSpinner.hidden = !loading;
  }
};

const showGlobalError = (message) => {
  if (globalError) {
    globalError.textContent = message;
    globalError.hidden = false;
  }
};

const hideGlobalError = () => {
  if (globalError) {
    globalError.hidden = true;
    globalError.textContent = "";
  }
};

// 날짜 포맷팅 (YYYY.MM.DD)
const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

// 뱃지 CSS 클래스 매핑
const getBadgeClass = (badge) => {
  if (badge === "イベント") return "badge--event";
  if (badge === "キャンペーン") return "badge--campaign";
  return "badge--notice";
};

// -------------------------------------------------------------
// 1. 목록 화면 (List View)
// -------------------------------------------------------------
const renderPagination = (totalPages) => {
  const paginationNav = $('[data-js="pagination"]');
  if (!paginationNav) return;
  paginationNav.innerHTML = "";

  if (totalPages <= 1) return;

  const createBtn = (label, targetPage, { disabled = false, isCurrent = false, isArrow = false } = {}) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `page-btn ${isArrow ? "page-btn--arrow" : ""} ${isCurrent ? "is-current" : ""}`;
    btn.textContent = label;
    btn.disabled = disabled;
    if (isCurrent) btn.setAttribute("aria-current", "page");
    btn.addEventListener("click", () => {
      currentPage = targetPage;
      renderListView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return btn;
  };

  // 이전 버튼 (‹)
  paginationNav.appendChild(
    createBtn("‹", Math.max(1, currentPage - 1), {
      disabled: currentPage === 1,
      isArrow: true,
    })
  );

  // 페이지 번호 (1, 2, 3...)
  for (let p = 1; p <= totalPages; p++) {
    paginationNav.appendChild(
      createBtn(String(p), p, {
        isCurrent: p === currentPage,
      })
    );
  }

  // 다음 버튼 (›)
  paginationNav.appendChild(
    createBtn("›", Math.min(totalPages, currentPage + 1), {
      disabled: currentPage === totalPages,
      isArrow: true,
    })
  );
};

const renderListView = async () => {
  hideGlobalError();
  setLoading(true);

  try {
    // 관리자 여부에 따라 글쓰기(新規投稿) 버튼 표시/숨김
    const newBtn = $('.notice-btn-new');
    if (newBtn) {
      newBtn.style.display = isAdminUser() ? "inline-flex" : "none";
    }

    const category = $('[data-js="category-filter"]')?.value || "すべて";
    const keyword = $('[data-js="keyword-input"]')?.value || "";

    const list = await getNotices({ category, keyword });
    const totalCount = list.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const tbody = $('[data-js="notice-rows"]');
    const emptyMsg = $('[data-js="empty-message"]');

    if (!tbody) return;
    tbody.innerHTML = "";

    if (totalCount === 0) {
      if (emptyMsg) emptyMsg.hidden = false;
    } else {
      if (emptyMsg) emptyMsg.hidden = true;

      const pageItems = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

      pageItems.forEach((notice) => {
        const tr = document.createElement("tr");
        tr.className = "notice-tr";
        const detailUrl = `?view=detail&id=${encodeURIComponent(notice.id)}`;

        tr.innerHTML = `
          <td class="td-no"><a href="${detailUrl}">${notice.no}</a></td>
          <td class="td-title">
            <a href="${detailUrl}" class="title-link">
              <span class="notice-badge ${getBadgeClass(notice.badge)}">${notice.badge}</span>
              <span class="title-text">${escapeHtml(notice.title)}</span>
            </a>
          </td>
          <td class="td-category"><a href="${detailUrl}">${escapeHtml(notice.category)}</a></td>
          <td class="td-date"><a href="${detailUrl}">${formatDate(notice.createdAt)}</a></td>
          <td class="td-arrow"><a href="${detailUrl}" class="row-arrow">›</a></td>
        `;

        // 행 전체 클릭 시 상세로 이동
        tr.addEventListener("click", (e) => {
          if (e.target.tagName !== "A") {
            window.location.href = detailUrl;
          }
        });

        tbody.appendChild(tr);
      });
    }

    renderPagination(totalPages);
  } catch (error) {
    console.error("Failed to render notice list:", error);
    showGlobalError(error.message || "お知らせ一覧の読み込みに失敗しました。");
  } finally {
    setLoading(false);
  }
};

// -------------------------------------------------------------
// 2. 상세 화면 (Detail View)
// -------------------------------------------------------------
const renderDetailView = async (id) => {
  hideGlobalError();
  setLoading(true);

  try {
    if (!id) {
      throw new Error("お知らせIDが指定されていません。");
    }

    currentNotice = await getNoticeById(id);
    if (!currentNotice) {
      throw new Error("指定されたお知らせが見つかりませんでした。");
    }

    // 뱃지, 제목, 날짜
    const badgeEl = $('[data-js="detail-badge"]');
    if (badgeEl) {
      badgeEl.className = `notice-badge ${getBadgeClass(currentNotice.badge)}`;
      badgeEl.textContent = currentNotice.badge;
    }

    const titleEl = $('[data-js="detail-title"]');
    if (titleEl) titleEl.textContent = currentNotice.title;

    const dateEl = $('[data-js="detail-date"]');
    if (dateEl) {
      dateEl.textContent = formatDate(currentNotice.createdAt);
      dateEl.dateTime = currentNotice.createdAt;
    }

    // 본문 HTML 렌더링
    const contentEl = $('[data-js="detail-content"]');
    if (contentEl) {
      contentEl.innerHTML = currentNotice.content || "";
    }

    // 썸네일 이미지 영역
    const thumbBox = $('[data-js="detail-thumbnail"]');
    if (thumbBox) {
      const imgAttachment = currentNotice.attachments?.find((att) =>
        att.type?.startsWith("image/") || att.url || att.dataUrl
      );

      if (imgAttachment) {
        const imgSrc = imgAttachment.url || imgAttachment.dataUrl;
        thumbBox.innerHTML = `
          <img class="detail-hero-image" src="${imgSrc}" alt="${escapeHtml(imgAttachment.name || currentNotice.title)}">
        `;
      } else {
        // 기본 썸네일 (산리오 캐릭터 일러스트 배너)
        thumbBox.innerHTML = `
          <div class="notice-campaign-poster">
            <p class="poster-sub">サンリオキャラクター大賞</p>
            <p class="poster-main">投票スタート!♡</p>
            <div class="poster-characters">
              <img src="../images/used/sanrio-dt_40.png" alt="ハローキティ">
              <img src="../images/used/sanrio-dt_47.png" alt="マイメロディ">
              <img src="../images/used/sanrio-dt_46.png" alt="クロミ">
              <img src="../images/used/sanrio-dt_42.png" alt="シナモロール">
              <img src="../images/used/sanrio-dt_7.png" alt="ポムポムプリン">
            </div>
          </div>
        `;
      }
    }

    // 관리자 전용 수정/삭제 버튼 제어
    const adminActions = $('[data-js="admin-detail-actions"]');
    if (adminActions) {
      adminActions.style.display = isAdminUser() ? "inline-flex" : "none";
    }

    // 편집 버튼 링크
    const editBtn = $('[data-js="edit-link"]');
    if (editBtn) {
      editBtn.href = `?view=edit&id=${encodeURIComponent(currentNotice.id)}`;
    }

    // 삭제 버튼 이벤트
    const deleteBtn = $('[data-js="delete-button"]');
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        if (!isAdminUser()) {
          alert("관리자만 삭제할 수 있습니다.");
          return;
        }
        if (confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
          setLoading(true);
          try {
            await deleteNotice(currentNotice.id);
            alert("공지사항이 삭제되었습니다.");
            window.location.href = "?view=list";
          } catch (err) {
            alert(err.message || "삭제 실패");
          } finally {
            setLoading(false);
          }
        }
      };
    }
  } catch (error) {
    console.error("Failed to render notice detail:", error);
    showGlobalError(error.message || "お知らせの読み込みに失敗しました。");
  } finally {
    setLoading(false);
  }
};

// -------------------------------------------------------------
// 3. 신규 작성 / 수정 화면 (Form View)
// -------------------------------------------------------------
const renderAttachmentList = () => {
  const listEl = $('[data-js="file-list"]');
  if (!listEl) return;
  listEl.innerHTML = "";

  attachments.forEach((file, index) => {
    const li = document.createElement("li");
    li.className = "file-preview-item";

    const sizeStr = file.size ? `(${(file.size / (1024 * 1024)).toFixed(2)}MB)` : "";
    li.innerHTML = `
      <span class="file-name">📄 ${escapeHtml(file.name)} ${sizeStr}</span>
      <button type="button" class="file-remove-btn" aria-label="ファイルを削除">×</button>
    `;

    li.querySelector(".file-remove-btn")?.addEventListener("click", () => {
      attachments.splice(index, 1);
      renderAttachmentList();
    });

    listEl.appendChild(li);
  });
};

const updateKuromiEmptyState = () => {
  const editor = $('[data-js="content-editor"]');
  const emptyState = $('[data-js="editor-empty"]');
  if (!editor || !emptyState) return;

  const text = editor.innerText.trim();
  emptyState.hidden = text.length > 0 || editor.innerHTML.includes("<img");
};

const renderFormView = async (isEdit, id) => {
  // 관리자 권한 확인 (비관리자 접근 차단)
  if (!isAdminUser()) {
    alert("관리자만 접근할 수 있는 페이지입니다.");
    window.location.href = "?view=list";
    return;
  }

  hideGlobalError();
  setLoading(true);

  try {
    const formHeading = $('[data-js="form-heading"]');
    const submitBtn = $('[data-js="submit-button"]');
    const editCurrentBanner = $('[data-js="edit-current"]');

    attachments = [];

    if (isEdit) {
      if (!id) throw new Error("編集対象のIDがありません。");
      currentNotice = await getNoticeById(id);
      if (!currentNotice) throw new Error("編集対象のお知らせが見つかりません。");

      // 헤딩 & 버튼 텍스트 변경
      if (formHeading) formHeading.textContent = "お知らせ編集";
      if (submitBtn) {
        submitBtn.innerHTML = `<span class="btn-icon" aria-hidden="true">✎</span> 更新する`;
      }

      // 상단 현재 정보 배너 표시 (画像2)
      if (editCurrentBanner) {
        editCurrentBanner.hidden = false;
        const curBadge = $('[data-js="current-badge"]');
        if (curBadge) {
          curBadge.className = `notice-badge ${getBadgeClass(currentNotice.badge)}`;
          curBadge.textContent = currentNotice.badge;
        }
        const curTitle = $('[data-js="current-title"]');
        if (curTitle) curTitle.textContent = currentNotice.title;
        const curDate = $('[data-js="current-date"]');
        if (curDate) curDate.textContent = formatDate(currentNotice.createdAt);
      }

      // 폼 필드 채우기
      const titleInput = $('[data-js="title-input"]');
      if (titleInput) {
        titleInput.value = currentNotice.title || "";
        const counter = $('[data-js="title-count"]');
        if (counter) counter.textContent = `${titleInput.value.length}/100`;
      }

      const catInput = $('[data-js="category-input"]');
      if (catInput) catInput.value = currentNotice.category || "";

      const editor = $('[data-js="content-editor"]');
      if (editor) {
        editor.innerHTML = currentNotice.content || "";
      }

      if (Array.isArray(currentNotice.attachments)) {
        attachments = [...currentNotice.attachments];
      }
    } else {
      // 신규 작성
      if (formHeading) formHeading.textContent = "新規投稿";
      if (submitBtn) {
        submitBtn.innerHTML = `<span class="btn-icon" aria-hidden="true">✎</span> 投稿する`;
      }
      if (editCurrentBanner) editCurrentBanner.hidden = true;

      const titleInput = $('[data-js="title-input"]');
      if (titleInput) {
        titleInput.value = "";
        const counter = $('[data-js="title-count"]');
        if (counter) counter.textContent = "0/100";
      }

      const catInput = $('[data-js="category-input"]');
      if (catInput) catInput.value = "";

      const editor = $('[data-js="content-editor"]');
      if (editor) editor.innerHTML = "";
    }

    updateKuromiEmptyState();
    renderAttachmentList();
  } catch (error) {
    console.error("Failed to render form view:", error);
    showGlobalError(error.message || "フォームの初期化に失敗しました。");
  } finally {
    setLoading(false);
  }
};

// -------------------------------------------------------------
// 폼 이벤트 및 에디터 인터랙션
// -------------------------------------------------------------
const setupFormEvents = () => {
  // 제목 글자수 카운터
  const titleInput = $('[data-js="title-input"]');
  const titleCount = $('[data-js="title-count"]');
  if (titleInput && titleCount) {
    titleInput.addEventListener("input", () => {
      titleCount.textContent = `${titleInput.value.length}/100`;
      $('[data-js="title-error"]').hidden = true;
    });
  }

  // 카테고리 셀렉트 에러 리셋
  const catInput = $('[data-js="category-input"]');
  if (catInput) {
    catInput.addEventListener("change", () => {
      $('[data-js="category-error"]').hidden = true;
    });
  }

  // 에디터 입력 및 빈 상태 감지
  const editor = $('[data-js="content-editor"]');
  if (editor) {
    editor.addEventListener("input", () => {
      updateKuromiEmptyState();
      $('[data-js="content-error"]').hidden = true;
    });
  }

  // 툴바 버튼 커맨드 처리
  $$("[data-command]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.command;
      if (!editor) return;
      editor.focus();

      if (cmd === "insertEmoji") {
        document.execCommand("insertText", false, "♡");
      } else if (cmd === "createLink") {
        const url = prompt("リンク先URLを入力してください (例: https://example.com)");
        if (url && /^(https?:\/\/|mailto:)/i.test(url.trim())) {
          document.execCommand("createLink", false, url.trim());
        }
      } else if (cmd === "insertImage") {
        const imgUrl = prompt("画像URLを入力してください");
        if (imgUrl) document.execCommand("insertImage", false, imgUrl.trim());
      } else if (cmd === "insertVideo") {
        const vidUrl = prompt("動画埋め込みURLを入力してください");
        if (vidUrl) {
          document.execCommand("insertHTML", false, `<p>🎬 <a href="${vidUrl}" target="_blank">${vidUrl}</a></p>`);
        }
      } else {
        document.execCommand(cmd, false, null);
      }
      updateKuromiEmptyState();
    });
  });

  // HTML 편집 모드 토글
  const htmlToggleBtn = $('[data-js="html-toggle"]');
  const htmlSource = $('[data-js="html-source"]');
  if (htmlToggleBtn && htmlSource && editor) {
    htmlToggleBtn.addEventListener("click", () => {
      isHtmlMode = !isHtmlMode;
      if (isHtmlMode) {
        htmlSource.value = editor.innerHTML;
        editor.hidden = true;
        htmlSource.hidden = false;
        htmlToggleBtn.textContent = "プレビュー ↗";
        htmlSource.focus();
      } else {
        editor.innerHTML = htmlSource.value;
        htmlSource.hidden = true;
        editor.hidden = false;
        htmlToggleBtn.textContent = "HTML編集 ↗";
        updateKuromiEmptyState();
        editor.focus();
      }
    });
  }

  // 첨부파일 선택 처리 (최대 5MB, 10개 한도)
  const fileInput = $('[data-js="file-input"]');
  const fileError = $('[data-js="file-error"]');
  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      if (fileError) fileError.hidden = true;
      const files = Array.from(e.target.files || []);

      if (attachments.length + files.length > 10) {
        if (fileError) {
          fileError.textContent = "添付ファイルは最大10個までです。";
          fileError.hidden = false;
        }
        fileInput.value = "";
        return;
      }

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          if (fileError) {
            fileError.textContent = `ファイル「${file.name}」は5MBを超えています。5MB以下のファイルを選択してください。`;
            fileError.hidden = false;
          }
          fileInput.value = "";
          return;
        }
      }

      // Base64 읽기
      for (const file of files) {
        try {
          const dataUrl = await readFileAsDataUrl(file);
          attachments.push({
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl,
          });
        } catch (err) {
          console.error("File read error:", err);
        }
      }

      fileInput.value = "";
      renderAttachmentList();
    });
  }

  // 폼 제출 (저장/수정)
  const form = $('[data-js="notice-form"]');
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titleInput = $('[data-js="title-input"]');
      const catInput = $('[data-js="category-input"]');
      const editor = $('[data-js="content-editor"]');
      const htmlSource = $('[data-js="html-source"]');

      const title = titleInput?.value.trim() || "";
      const category = catInput?.value || "";
      const content = isHtmlMode ? htmlSource?.value.trim() : editor?.innerHTML.trim();
      const contentText = editor?.innerText.trim() || "";

      let hasError = false;

      if (!title) {
        $('[data-js="title-error"]').hidden = false;
        hasError = true;
      }
      if (!category) {
        $('[data-js="category-error"]').hidden = false;
        hasError = true;
      }
      if (!contentText && !content.includes("<img")) {
        $('[data-js="content-error"]').hidden = false;
        hasError = true;
      }

      if (hasError) return;

      const submitBtn = $('[data-js="submit-button"]');
      if (submitBtn) submitBtn.disabled = true;
      setLoading(true);

      const { view, id } = getRouteParams();
      const isEdit = view === "edit";

      const badge = category === "キャンペーン" ? "キャンペーン" : category === "イベント" ? "イベント" : "お知らせ";

      try {
        if (isEdit) {
          await updateNotice(id, {
            title,
            category,
            badge,
            content,
            attachments,
          });
          // 수정 후 상세 화면으로 이동
          window.location.href = `?view=detail&id=${encodeURIComponent(id)}`;
        } else {
          await createNotice({
            title,
            category,
            badge,
            content,
            attachments,
          });
          // 신규 작성 후 목록 화면으로 이동
          window.location.href = "?view=list";
        }
      } catch (err) {
        console.error("Notice submit error:", err);
        showGlobalError(err.message || "投稿の保存に失敗しました。");
        if (submitBtn) submitBtn.disabled = false;
        setLoading(false);
      }
    });
  }

  // 검색 및 필터 이벤트
  $('[data-js="category-filter"]')?.addEventListener("change", () => {
    currentPage = 1;
    renderListView();
  });

  $('[data-js="search-form"]')?.addEventListener("submit", (e) => {
    e.preventDefault();
    currentPage = 1;
    renderListView();
  });

  $('[data-js="keyword-input"]')?.addEventListener("input", () => {
    currentPage = 1;
    renderListView();
  });

  // 링크 복사 버튼
  $('[data-js="copy-link"]')?.addEventListener("click", async () => {
    const copyStatus = $('[data-js="copy-status"]');
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (copyStatus) copyStatus.textContent = "URLをコピーしました！♡";
      setTimeout(() => {
        if (copyStatus) copyStatus.textContent = "";
      }, 3000);
    } catch (err) {
      if (copyStatus) copyStatus.textContent = "コピーに失敗しました";
    }
  });
};

// 파일 FileReader Promise 헬퍼
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました。"));
    reader.readAsDataURL(file);
  });

// HTML 이스케이프 유틸
const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// -------------------------------------------------------------
// 라우터 초기화
// -------------------------------------------------------------
const initRouter = () => {
  const { view, id } = getRouteParams();

  // 모든 뷰 숨김
  [listView, detailView, formView].forEach((v) => {
    if (v) v.hidden = true;
  });

  if (view === "detail") {
    if (detailView) detailView.hidden = false;
    renderDetailView(id);
  } else if (view === "create") {
    if (formView) formView.hidden = false;
    renderFormView(false, null);
  } else if (view === "edit") {
    if (formView) formView.hidden = false;
    renderFormView(true, id);
  } else {
    if (listView) listView.hidden = false;
    renderListView();
  }
};

// 페이지 로드 시 구동
document.addEventListener("DOMContentLoaded", () => {
  initHeaderAuthUI();
  setupFormEvents();
  initRouter();
});

// 브라우저 뒤로가기/앞으로가기 대응
window.addEventListener("popstate", () => {
  initRouter();
});
