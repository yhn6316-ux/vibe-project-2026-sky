"use strict";

const slides = [
  {
    image: "./images/used/sanrio-dt_38.jpg",
    title: "おともだちリップチャーム",
    description: "おともだちと一緒におでかけしたくなる、かわいいリップチャームが登場。",
  },
  {
    image: "./images/used/sanrio-dt_60.jpg",
    title: "ゲームソフト「サンリオ パーティランド」発売記念",
    description: "楽しい企画が続々登場♪ サンリオの仲間たちとパーティを楽しもう。",
  },
  {
    image: "./images/used/sanrio-dt_37.jpg",
    title: "ハローキティのスペシャルコンテンツ",
    description: "ハローキティのかわいい世界を楽しもう。",
  },
  {
    image: "./images/used/sanrio-dt_62.jpg",
    title: "サンリオおでかけレポ",
    description: "ぬいぐるみと一緒に楽しむ、サンリオのおでかけスポットをご紹介。",
  },
];

const title = document.querySelector('[data-js="slide-title"]');
const description = document.querySelector('[data-js="slide-description"]');
const track = document.querySelector('[data-js="slide-track"]');
const stage = track?.closest(".hero-stage");
const status = document.querySelector('[data-js="slide-status"]');
const dots = Array.from(document.querySelectorAll('[data-js="slide-dot"]'));
const previousButton = document.querySelector('[data-js="previous-slide"]');
const nextButton = document.querySelector('[data-js="next-slide"]');
const headerSearchToggle = document.querySelector('[data-js="header-search-toggle"]');
const headerSearchOverlay = document.querySelector('[data-js="header-search-overlay"]');
const headerSearchPanel = document.querySelector("#header-search-panel");
const headerSearchForm = document.querySelector('[data-js="header-search-form"]');
const headerSearchInput = document.querySelector("#header-search-keyword");
const headerSearchCategoryControl = document.querySelector('[data-js="header-search-category-control"]');
const headerSearchCategory = document.querySelector("#header-search-category");
const headerSearchCategoryToggle = document.querySelector('[data-js="header-search-category-toggle"]');
const headerSearchCategoryValue = document.querySelector('[data-js="header-search-category-value"]');
const headerSearchCategoryOptions = document.querySelector('[data-js="header-search-category-options"]');
const headerSearchCategoryOptionItems = Array.from(
  document.querySelectorAll(".site-search__category-option"),
);
const menuToggle = document.querySelector('[data-js="menu-toggle"]');
const siteHeader = document.querySelector(".site-header");
const mobileMenu = document.querySelector('[data-js="mobile-menu"]');
const menuSearchInput = document.querySelector("#mobile-menu-search");
const searchHelpToggle = document.querySelector('[data-js="search-help-toggle"]');
const detailSearchPanel = document.querySelector('[data-js="search-panel"]');
const detailSearchForm = document.querySelector('[data-js="detail-search-form"]');
const detailSearchInput = document.querySelector("#mobile-menu-search-detail");
const searchModeInput = document.querySelector("#mobile-menu-search-category");
const searchModeToggle = document.querySelector('[data-js="search-mode-toggle"]');
const searchModeLabel = document.querySelector('[data-js="search-mode-label"]');
const searchModeOptions = document.querySelector('[data-js="search-mode-options"]');

if (
  !(
    title instanceof HTMLElement
    && description instanceof HTMLElement
    && track instanceof HTMLElement
    && stage instanceof HTMLElement
    && track.querySelectorAll(".hero-card").length === 3
    && status instanceof HTMLElement
    && previousButton instanceof HTMLButtonElement
    && nextButton instanceof HTMLButtonElement
    && headerSearchToggle instanceof HTMLButtonElement
    && headerSearchOverlay instanceof HTMLElement
    && headerSearchPanel instanceof HTMLElement
    && headerSearchForm instanceof HTMLFormElement
    && headerSearchInput instanceof HTMLInputElement
    && headerSearchCategoryControl instanceof HTMLElement
    && headerSearchCategory instanceof HTMLInputElement
    && headerSearchCategoryToggle instanceof HTMLButtonElement
    && headerSearchCategoryValue instanceof HTMLElement
    && headerSearchCategoryOptions instanceof HTMLElement
    && headerSearchCategoryOptionItems.length > 0
    && headerSearchCategoryOptionItems.every((option) => option instanceof HTMLElement)
    && menuToggle instanceof HTMLButtonElement
    && siteHeader instanceof HTMLElement
    && mobileMenu instanceof HTMLElement
    && menuSearchInput instanceof HTMLInputElement
    && searchHelpToggle instanceof HTMLButtonElement
    && detailSearchPanel instanceof HTMLElement
    && detailSearchForm instanceof HTMLFormElement
    && detailSearchInput instanceof HTMLInputElement
    && searchModeInput instanceof HTMLInputElement
    && searchModeToggle instanceof HTMLButtonElement
    && searchModeLabel instanceof HTMLElement
    && searchModeOptions instanceof HTMLElement
    && dots.length === slides.length
    && dots.every((dot) => dot instanceof HTMLButtonElement)
  )
) {
  throw new Error("おすすめコンテンツまたはナビゲーションの操作要素が見つかりません。");
}

let activeIndex = 0;
let isAnimating = false;
let animatingDirection = 0;
const autoplayDelay = 5000;
const pendingDirections = [];
let autoplayTimer;
let contentRevealTimer;
let isMobileMenuOpen = false;
let isHeaderSearchOpen = false;
let isHeaderSearchCategoryOpen = false;
let headerSearchCloseTimer;
let mobileMenuCloseTimer;
let pageScrollPosition = 0;
let savedBodyStyles;
let pendingMenuTarget;
let backgroundInertStates = [];
let restoreMenuFocusOnClose = true;

const updateSlideContent = (animateTitle = false) => {
  const cards = Array.from(track.querySelectorAll(".hero-card"));
  const roles = [
    { name: "left", index: (activeIndex + slides.length - 1) % slides.length },
    { name: "center", index: activeIndex },
    { name: "right", index: (activeIndex + 1) % slides.length },
  ];

  cards.forEach((card, position) => {
    const role = roles[position];
    const slide = slides[role.index];
    const image = card.querySelector(".hero-card__image");
    if (!(image instanceof HTMLImageElement)) {
      throw new Error("おすすめスライドの画像が見つかりません。");
    }

    card.className = role.name === "center"
      ? "hero-card hero-card--center"
      : `hero-card hero-card--side hero-card--${role.name}`;
    if (role.name === "center") {
      card.setAttribute("data-js", "active-slide");
    } else {
      card.removeAttribute("data-js");
    }

    image.dataset.js = role.name === "center" ? "active-image" : `${role.name}-image`;
    image.src = slide.image;
    image.alt = role.name === "center" ? slide.title : "";
    if (role.name === "center") {
      image.removeAttribute("aria-hidden");
    } else {
      image.setAttribute("aria-hidden", "true");
    }
  });

  const nextTitle = slides[activeIndex].title;
  const nextDescription = slides[activeIndex].description;
  window.clearTimeout(contentRevealTimer);
  if (animateTitle) {
    [title, description].forEach((element) => {
      element.classList.remove("is-revealing");
      element.classList.add("is-hidden");
    });
    contentRevealTimer = window.setTimeout(() => {
      title.textContent = nextTitle;
      description.textContent = nextDescription;
      [title, description].forEach((element) => {
        element.classList.remove("is-hidden");
        void element.offsetWidth;
        element.classList.add("is-revealing");
      });
    }, 300);
  } else {
    title.textContent = nextTitle;
    description.textContent = nextDescription;
    [title, description].forEach((element) => {
      element.classList.remove("is-hidden", "is-revealing");
    });
  }

  status.textContent = `${activeIndex + 1} / ${slides.length}`;
  dots.forEach((dot, index) => {
    dot.setAttribute("aria-current", String(index === activeIndex));
  });
};

const animateNextDirection = () => {
  if (isAnimating || pendingDirections.length === 0) {
    return;
  }

  isAnimating = true;
  const direction = pendingDirections.shift();
  animatingDirection = direction;
  const cards = Array.from(track.querySelectorAll(".hero-card"));
  const nextIndex = (activeIndex + direction + slides.length) % slides.length;
  window.clearTimeout(contentRevealTimer);
  [title, description].forEach((element) => {
    element.classList.remove("is-revealing");
    element.classList.add("is-hidden");
  });
  const incomingImages = cards.map((card, position) => {
    const image = card.querySelector(".hero-card__image");
    if (!(image instanceof HTMLImageElement)) {
      throw new Error("おすすめスライドの画像が見つかりません。");
    }

    const roleIndex = (nextIndex + position - 1 + slides.length) % slides.length;
    const incomingImage = document.createElement("img");
    incomingImage.className = "hero-card__image hero-card__image--incoming";
    incomingImage.src = slides[roleIndex].image;
    incomingImage.alt = position === 1 ? slides[roleIndex].title : "";
    if (position !== 1) {
      incomingImage.setAttribute("aria-hidden", "true");
    }
    card.append(incomingImage);
    return incomingImage;
  });
  const transitionDuration = getComputedStyle(incomingImages[0]).transitionDuration.split(",")[0].trim();
  const durationUnit = transitionDuration.endsWith("ms") ? 1 : 1000;
  const transitionTimeout = Number.parseFloat(transitionDuration) * durationUnit + 50;

  let transitionFinished = false;
  let transitionFallback;
  const onTransitionEnd = (event) => {
    if (incomingImages.includes(event.target) && event.propertyName === "transform") {
      finishTransition();
    }
  };
  const finishTransition = () => {
    if (transitionFinished) {
      return;
    }
    transitionFinished = true;
    window.clearTimeout(transitionFallback);
    track.removeEventListener("transitionend", onTransitionEnd);

    cards.forEach((card, position) => {
      const currentImage = card.querySelector(".hero-card__image:not(.hero-card__image--incoming)");
      if (!(currentImage instanceof HTMLImageElement)) {
        throw new Error("おすすめスライドの切り替えに失敗しました。");
      }
      currentImage.remove();
      incomingImages[position].classList.remove("hero-card__image--incoming");
    });
    activeIndex = nextIndex;
    track.classList.remove("is-sliding-next", "is-sliding-previous");
    updateSlideContent(true);
    stage.scrollLeft = 0;

    requestAnimationFrame(() => {
      isAnimating = false;
      animatingDirection = 0;
      animateNextDirection();
    });
  };

  track.addEventListener("transitionend", onTransitionEnd);

  requestAnimationFrame(() => {
    track.classList.add(direction > 0 ? "is-sliding-next" : "is-sliding-previous");
    transitionFallback = window.setTimeout(finishTransition, transitionTimeout);
  });
};

const queueSlide = (targetIndex) => {
  const startingIndex = (
    activeIndex
    + (isAnimating ? animatingDirection : 0)
    + pendingDirections.reduce((total, direction) => total + direction, 0)
    + slides.length * 2
  ) % slides.length;
  pendingDirections.length = 0;
  const forward = (targetIndex - startingIndex + slides.length) % slides.length;
  const backward = (startingIndex - targetIndex + slides.length) % slides.length;
  const direction = forward <= backward ? 1 : -1;
  const steps = Math.min(forward, backward);

  for (let step = 0; step < steps; step += 1) {
    pendingDirections.push(direction);
  }
  animateNextDirection();
};

const startAutoplay = () => {
  window.clearTimeout(autoplayTimer);
  if (
    document.hidden
    || isMobileMenuOpen
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  autoplayTimer = window.setTimeout(() => {
    pendingDirections.push(1);
    animateNextDirection();
    startAutoplay();
  }, autoplayDelay);
};

const restorePageScroll = () => {
  if (savedBodyStyles) {
    document.body.style.position = savedBodyStyles.position;
    document.body.style.top = savedBodyStyles.top;
    document.body.style.insetInline = savedBodyStyles.insetInline;
    document.body.style.width = savedBodyStyles.width;
    document.body.style.overflow = savedBodyStyles.overflow;
    savedBodyStyles = undefined;
  }
  backgroundInertStates.forEach(([element, wasInert]) => {
    element.inert = wasInert;
  });
  backgroundInertStates = [];
  window.scrollTo({ top: pageScrollPosition, left: 0, behavior: "instant" });
};

const finishMobileMenuClose = () => {
  if (isMobileMenuOpen) {
    return;
  }

  window.clearTimeout(mobileMenuCloseTimer);
  mobileMenu.classList.remove("is-visible");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenu.inert = true;
  restorePageScroll();

  if (pendingMenuTarget) {
    const target = document.getElementById(pendingMenuTarget);
    if (target) {
      window.history.replaceState(null, "", `#${pendingMenuTarget}`);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    pendingMenuTarget = undefined;
  } else if (restoreMenuFocusOnClose) {
    menuToggle.focus();
  }
  startAutoplay();
};

const closeMobileMenu = (targetId, restoreFocus = true, immediate = false) => {
  if (!isMobileMenuOpen) {
    return;
  }

  isMobileMenuOpen = false;
  pendingMenuTarget = targetId;
  restoreMenuFocusOnClose = restoreFocus;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "メニューを開く");
  siteHeader.classList.remove("is-menu-open");
  mobileMenu.classList.remove("is-open");
  window.clearTimeout(mobileMenuCloseTimer);
  if (immediate) {
    finishMobileMenuClose();
  } else {
    mobileMenuCloseTimer = window.setTimeout(
      finishMobileMenuClose,
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--duration-menu-fallback")) || 500,
    );
  }
};

const openMobileMenu = () => {
  if (
    isMobileMenuOpen
    || !window.matchMedia("(max-width: 768px)").matches
  ) {
    return;
  }

  isMobileMenuOpen = true;
  window.clearTimeout(mobileMenuCloseTimer);
  pendingMenuTarget = undefined;
  restoreMenuFocusOnClose = true;
  pageScrollPosition = window.scrollY;
  savedBodyStyles = {
    position: document.body.style.position,
    top: document.body.style.top,
    insetInline: document.body.style.insetInline,
    width: document.body.style.width,
    overflow: document.body.style.overflow,
  };
  backgroundInertStates = Array.from(document.body.children)
    .filter((element) => element !== mobileMenu && !element.contains(menuToggle))
    .map((element) => [element, element.inert]);
  backgroundInertStates.forEach(([element]) => {
    element.inert = true;
  });
  document.body.style.position = "fixed";
  document.body.style.top = `-${pageScrollPosition}px`;
  document.body.style.insetInline = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "メニューを閉じる");
  siteHeader.classList.add("is-menu-open");
  mobileMenu.inert = false;
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileMenu.classList.add("is-visible");
  void mobileMenu.offsetHeight;
  mobileMenu.classList.add("is-open");
  menuSearchInput.focus();
  window.clearTimeout(autoplayTimer);
};

const finishHeaderSearchClose = () => {
  if (isHeaderSearchOpen) {
    return;
  }

  window.clearTimeout(headerSearchCloseTimer);
  headerSearchOverlay.classList.remove("is-closing");
  headerSearchOverlay.setAttribute("aria-hidden", "true");
};

const closeHeaderSearchCategory = (restoreFocus = false) => {
  if (!isHeaderSearchCategoryOpen) {
    return;
  }

  isHeaderSearchCategoryOpen = false;
  headerSearchCategoryControl.classList.remove("is-open");
  headerSearchCategoryToggle.setAttribute("aria-expanded", "false");
  headerSearchCategoryOptions.setAttribute("aria-hidden", "true");
  headerSearchCategoryOptions.inert = true;
  if (restoreFocus) {
    headerSearchCategoryToggle.focus();
  }
};

const openHeaderSearchCategory = (focusSelectedOption = false) => {
  if (!isHeaderSearchCategoryOpen) {
    isHeaderSearchCategoryOpen = true;
    headerSearchCategoryControl.classList.add("is-open");
    headerSearchCategoryToggle.setAttribute("aria-expanded", "true");
    headerSearchCategoryOptions.setAttribute("aria-hidden", "false");
    headerSearchCategoryOptions.inert = false;
  }

  if (focusSelectedOption) {
    const selectedOption = headerSearchCategoryOptions.querySelector('[aria-selected="true"]');
    if (!(selectedOption instanceof HTMLElement)) {
      throw new Error("검색 방식 선택 항목을 찾을 수 없습니다.");
    }
    selectedOption.focus();
  }
};

const selectHeaderSearchCategory = (value) => {
  const selectedOption = headerSearchCategoryOptionItems.find(
    (option) => option.dataset.value === value,
  );
  if (!(selectedOption instanceof HTMLElement)) {
    throw new Error(`검색 방식 선택 항목을 찾을 수 없습니다: ${value}`);
  }

  const label = selectedOption.dataset.triggerLabel;
  if (!label) {
    throw new Error("검색 방식 선택 항목의 이름이 비어 있습니다.");
  }

  headerSearchCategory.value = value;
  headerSearchCategoryValue.textContent = label;
  headerSearchCategoryOptionItems.forEach((option) => {
    option.setAttribute("aria-selected", String(option === selectedOption));
  });
  headerSearchCategory.dispatchEvent(new Event("input", { bubbles: true }));
  headerSearchCategory.dispatchEvent(new Event("change", { bubbles: true }));
};

const closeHeaderSearch = (restoreFocus = true) => {
  if (!isHeaderSearchOpen) {
    return;
  }

  closeHeaderSearchCategory();
  selectHeaderSearchCategory("all");
  headerSearchInput.value = "";
  isHeaderSearchOpen = false;
  headerSearchToggle.setAttribute("aria-expanded", "false");
  headerSearchOverlay.inert = true;
  headerSearchOverlay.setAttribute("aria-hidden", "true");
  headerSearchOverlay.classList.remove("is-open");
  headerSearchOverlay.classList.add("is-closing");
  if (restoreFocus) {
    headerSearchToggle.focus();
  }
  window.clearTimeout(headerSearchCloseTimer);
  headerSearchCloseTimer = window.setTimeout(
    finishHeaderSearchClose,
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--duration-search")) || 550,
  );
};

const openHeaderSearch = () => {
  if (
    isHeaderSearchOpen
    || window.matchMedia("(max-width: 768px)").matches
  ) {
    return;
  }

  isHeaderSearchOpen = true;
  window.clearTimeout(headerSearchCloseTimer);
  headerSearchOverlay.classList.remove("is-closing");
  headerSearchOverlay.inert = false;
  headerSearchOverlay.setAttribute("aria-hidden", "false");
  void headerSearchPanel.offsetHeight;
  headerSearchOverlay.classList.add("is-open");
  headerSearchToggle.setAttribute("aria-expanded", "true");
  headerSearchInput.focus();
};

previousButton.addEventListener("click", () => {
  pendingDirections.push(-1);
  animateNextDirection();
  startAutoplay();
});
nextButton.addEventListener("click", () => {
  pendingDirections.push(1);
  animateNextDirection();
  startAutoplay();
});
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slideIndex = Number(dot.dataset.slideIndex);
    if (Number.isInteger(slideIndex) && slideIndex >= 0 && slideIndex < slides.length) {
      queueSlide(slideIndex);
      startAutoplay();
    }
  });
});

document.addEventListener("visibilitychange", startAutoplay);

headerSearchToggle.addEventListener("click", () => {
  if (isHeaderSearchOpen) {
    closeHeaderSearch();
  } else {
    openHeaderSearch();
  }
});
headerSearchOverlay.addEventListener("click", (event) => {
  if (
    !(event.target instanceof Element)
    || !event.target.closest('[data-js="header-search-close"]')
  ) {
    return;
  }

  closeHeaderSearch();
});
headerSearchCategoryToggle.addEventListener("click", () => {
  if (!isHeaderSearchCategoryOpen) {
    openHeaderSearchCategory();
  }
});
headerSearchCategoryToggle.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    openHeaderSearchCategory(true);
  } else if (event.key === "Escape" && isHeaderSearchCategoryOpen) {
    event.preventDefault();
    closeHeaderSearchCategory();
  }
});
headerSearchCategoryOptions.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const option = event.target.closest(".site-search__category-option");
  if (!(option instanceof HTMLElement) || !headerSearchCategoryOptionItems.includes(option)) {
    return;
  }

  const value = option.dataset.value;
  if (!value) {
    throw new Error("검색 방식 선택 항목에 값이 없습니다.");
  }
  selectHeaderSearchCategory(value);
});
headerSearchCategoryOptions.addEventListener("keydown", (event) => {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const currentIndex = headerSearchCategoryOptionItems.indexOf(event.target);
  if (currentIndex < 0) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeHeaderSearchCategory(true);
    return;
  }

  if (event.key === "Tab") {
    closeHeaderSearchCategory();
    if (event.shiftKey) {
      event.preventDefault();
      headerSearchCategoryToggle.focus();
    } else {
      event.preventDefault();
      headerSearchInput.focus();
    }
    return;
  }

  let nextIndex = currentIndex;
  if (event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % headerSearchCategoryOptionItems.length;
  } else if (event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + headerSearchCategoryOptionItems.length)
      % headerSearchCategoryOptionItems.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = headerSearchCategoryOptionItems.length - 1;
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const value = event.target.dataset.value;
    if (!value) {
      throw new Error("검색 방식 선택 항목에 값이 없습니다.");
    }
    selectHeaderSearchCategory(value);
    return;
  } else {
    return;
  }

  event.preventDefault();
  headerSearchCategoryOptionItems[nextIndex].focus();
});
document.addEventListener("click", (event) => {
  if (
    isHeaderSearchCategoryOpen
    && event.target instanceof Node
    && !headerSearchCategoryControl.contains(event.target)
  ) {
    closeHeaderSearchCategory();
  }

  if (
    !isHeaderSearchOpen
    || !(event.target instanceof Node)
    || headerSearchPanel.contains(event.target)
    || headerSearchToggle.contains(event.target)
  ) {
    return;
  }

  closeHeaderSearch();
});
headerSearchPanel.addEventListener("transitionend", (event) => {
  if (event.target === headerSearchPanel && event.propertyName === "clip-path" && !isHeaderSearchOpen) {
    finishHeaderSearchClose();
  }
});
headerSearchPanel.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const keywordButton = event.target.closest("[data-header-search-keyword]");
  if (keywordButton instanceof HTMLButtonElement) {
    keywordButton.setAttribute(
      "aria-pressed",
      String(keywordButton.getAttribute("aria-pressed") !== "true"),
    );
  }
});
headerSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
headerSearchForm.addEventListener("reset", () => {
  headerSearchCategory.value = "all";
  headerSearchForm.querySelectorAll("[data-header-search-keyword]").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });
  window.setTimeout(() => {
    const selectedOption = headerSearchCategoryOptionItems.find(
      (option) => option.dataset.value === headerSearchCategory.value,
    );
    if (!(selectedOption instanceof HTMLElement)) {
      throw new Error("초기화된 검색 방식 선택 항목을 찾을 수 없습니다.");
    }
    const label = selectedOption.dataset.triggerLabel;
    if (!label) {
      throw new Error("검색 방식 선택 항목의 이름이 비어 있습니다.");
    }
    headerSearchCategoryValue.textContent = label;
    headerSearchCategoryOptionItems.forEach((option) => {
      option.setAttribute("aria-selected", String(option === selectedOption));
    });
  });
});
headerSearchForm.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeHeaderSearch();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }
  const focusableElements = Array.from(
    headerSearchPanel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled)'),
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
});

menuToggle.addEventListener("click", () => {
  if (isMobileMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

searchHelpToggle.addEventListener("click", () => {
  const isExpanded = searchHelpToggle.getAttribute("aria-expanded") === "true";
  searchHelpToggle.setAttribute("aria-expanded", String(!isExpanded));
  detailSearchPanel.setAttribute("aria-hidden", String(isExpanded));
  detailSearchPanel.inert = isExpanded;
  detailSearchPanel.classList.toggle("is-expanded", !isExpanded);
});
detailSearchPanel.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const searchModeButton = event.target.closest("[data-search-mode]");
  if (searchModeButton instanceof HTMLButtonElement) {
    searchModeInput.value = searchModeButton.dataset.searchMode ?? "";
    searchModeLabel.textContent = searchModeInput.value === "include-all"
      ? "すべて"
      : searchModeButton.textContent.trim();
    searchModeOptions.querySelectorAll('[role="option"]').forEach((option) => {
      option.setAttribute("aria-selected", String(option === searchModeButton));
    });
    searchModeToggle.setAttribute("aria-expanded", "false");
    searchModeOptions.setAttribute("aria-hidden", "true");
    searchModeOptions.inert = true;
    searchModeOptions.classList.remove("is-expanded");
    searchModeToggle.focus();
    return;
  }

  const keywordButton = event.target.closest("[data-search-keyword]");
  if (keywordButton instanceof HTMLButtonElement) {
    const isPressed = keywordButton.getAttribute("aria-pressed") === "true";
    keywordButton.setAttribute("aria-pressed", String(!isPressed));
  }
});
searchModeToggle.addEventListener("click", () => {
  const isExpanded = searchModeToggle.getAttribute("aria-expanded") === "true";
  searchModeToggle.setAttribute("aria-expanded", String(!isExpanded));
  searchModeOptions.setAttribute("aria-hidden", String(isExpanded));
  searchModeOptions.inert = isExpanded;
  searchModeOptions.classList.toggle("is-expanded", !isExpanded);
});
document.addEventListener("click", (event) => {
  if (
    !(event.target instanceof Node)
    || searchModeToggle.getAttribute("aria-expanded") !== "true"
    || searchModeToggle.contains(event.target)
    || searchModeOptions.contains(event.target)
  ) {
    return;
  }

  searchModeToggle.setAttribute("aria-expanded", "false");
  searchModeOptions.setAttribute("aria-hidden", "true");
  searchModeOptions.inert = true;
  searchModeOptions.classList.remove("is-expanded");
});
searchModeOptions.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    searchModeToggle.setAttribute("aria-expanded", "false");
    searchModeOptions.setAttribute("aria-hidden", "true");
    searchModeOptions.inert = true;
    searchModeOptions.classList.remove("is-expanded");
    searchModeToggle.focus();
  }
});
detailSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
detailSearchForm.addEventListener("reset", () => {
  searchModeInput.value = "include-all";
  searchModeLabel.textContent = "すべて";
  searchModeOptions.querySelectorAll('[role="option"]').forEach((option) => {
    option.setAttribute("aria-selected", String(option instanceof HTMLButtonElement && option.dataset.searchMode === "include-all"));
  });
  detailSearchInput.value = "";
  detailSearchForm.querySelectorAll("[data-search-keyword]").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });
  searchModeToggle.setAttribute("aria-expanded", "false");
  searchModeOptions.setAttribute("aria-hidden", "true");
  searchModeOptions.inert = true;
  searchModeOptions.classList.remove("is-expanded");
  searchHelpToggle.setAttribute("aria-expanded", "false");
  detailSearchPanel.setAttribute("aria-hidden", "true");
  detailSearchPanel.inert = true;
  detailSearchPanel.classList.remove("is-expanded");
});

mobileMenu.addEventListener("transitionend", (event) => {
  if (event.target === mobileMenu && event.propertyName === "clip-path" && !isMobileMenuOpen) {
    finishMobileMenuClose();
  }
});
mobileMenu.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const menuLink = event.target.closest('[data-js="menu-link"]');
  if (menuLink instanceof HTMLAnchorElement) {
    const targetId = menuLink.hash.slice(1);
    if (targetId) {
      event.preventDefault();
      closeMobileMenu(targetId);
    }
  }
});
mobileMenu.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeMobileMenu();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }
  const focusableElements = Array.from(
    mobileMenu.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled)'),
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
});
window.addEventListener("resize", () => {
  if (isHeaderSearchOpen && window.matchMedia("(max-width: 768px)").matches) {
    closeHeaderSearch(false);
  }
  if (isMobileMenuOpen && !window.matchMedia("(max-width: 768px)").matches) {
    closeMobileMenu(undefined, false, true);
  }
});

updateSlideContent();
startAutoplay();
