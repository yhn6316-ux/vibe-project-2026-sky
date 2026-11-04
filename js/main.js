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
  {
    image: "./images/used/sanrio-dt_30.png",
    title: "Hello Kitty’s Lounge",
    description: "ここは、やさしさでつながる場所。",
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


// --- Characters Orbit Counter-Clockwise Rotation ---
const orbitCharactersData = [
  { id: "keroppi", name: "けろけろけろっぴ", latin: "KEROKEROKEROPPI", image: "./images/used/sanrio-dt_44.png" },
  { id: "badtz", name: "バッドばつ丸", latin: "BAD BADTZ-MARU", image: "./images/used/sanrio-dt_39.png" },
  { id: "tuxedosam", name: "タキシードサム", latin: "TUXEDOSAM", image: "./images/used/sanrio-dt_53.png" },
  { id: "cloud", name: "こぎみゅん", latin: "COGIMYUN", image: "./images/used/sanrio-dt_40.png" },
  { id: "hangyodon", name: "ハンギョドン", latin: "HANGYODON", image: "./images/used/sanrio-dt_42.png" },
  { id: "twins", name: "リトルツインスターズ", latin: "LITTLE TWIN STARS", image: "./images/used/sanrio-dt_76.png" },
  { id: "kuromi", name: "クロミ", latin: "KUROMI", image: "./images/used/sanrio-dt_46.png" },
  { id: "melody", name: "マイメロディ", latin: "MY MELODY", image: "./images/used/sanrio-dt_47.png" },
  { id: "pochacco", name: "ポチャッコ", latin: "POCHACCO", image: "./images/used/sanrio-dt_50.png" },
];

const orbitSlots = [
  { left: "96%", top: "66.5%", opacity: 1, scale: 1 },    // 0: Right end
  { left: "86%", top: "49%", opacity: 1, scale: 1 },      // 1
  { left: "75.5%", top: "39%", opacity: 1, scale: 1 },    // 2
  { left: "65%", top: "33%", opacity: 1, scale: 1 },      // 3
  { left: "50%", top: "30%", opacity: 0, scale: 1.15 },   // 4: Central feature (entered inside card)
  { left: "35%", top: "33%", opacity: 1, scale: 1 },      // 5
  { left: "24.5%", top: "39%", opacity: 1, scale: 1 },    // 6
  { left: "14%", top: "49%", opacity: 1, scale: 1 },      // 7
  { left: "4%", top: "66.5%", opacity: 1, scale: 1 },     // 8: Left end
];

const featureContainer = document.querySelector('[data-js="characters-feature"]');
const featureRingAccentEl = document.querySelector('[data-js="feature-ring-accent"]');
const featureNameEl = document.querySelector('[data-js="feature-name"]');
const featureImageEl = document.querySelector('[data-js="feature-image"]');
const featureLatinEl = document.querySelector('[data-js="feature-latin"]');
const orbitElements = Array.from(document.querySelectorAll('[data-orbit-character]'));

let currentOrbitStep = 0;
let featureTimers = [];
let currentRingOffset = 754;

// 사용자가 명시적으로 지정한 6개 이미지 전용 색상 매핑 (그 외 모든 이미지는 기존 동적 추출 로직을 그대로 유지)
const userSpecifiedImageColors = {
  "sanrio-dt_47": "#F6BEC8",
  "sanrio-dt_46": "#4B4948",
  "sanrio-dt_76": "#FEF7AE",
  "sanrio-dt_53": "#6C9BD2",
  "sanrio-dt_39": "#231815",
  "sanrio-dt_44": "#DAE248",
};

// 캐릭터별 기본 브랜드 폴백 컬러 맵 (원래 상태 100% 복원)
const characterBrandColors = {
  hangyodon: "#5ec8ba",
  cloud: "#f5a878",
  tuxedosam: "#3ea6de",
  badtz: "#ffba00",
  keroppi: "#78c544",
  twins: "#60c2e8",
  kuromi: "#a865c9",
  melody: "#ff6b98",
  pochacco: "#00b2a9",
};

// 캔버스를 통해 이미지의 지배적인 유채색(채도 높은 주요 색상)을 동적 추출하는 헬퍼 함수 (포차코 등 미언급 캐릭터에 그대로 적용)
const extractImagePrimaryColor = (imgElement, fallbackColor) => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return fallbackColor;

    canvas.width = 40;
    canvas.height = 40;
    ctx.drawImage(imgElement, 0, 0, 40, 40);
    const imgData = ctx.getImageData(0, 0, 40, 40).data;

    let bestColor = fallbackColor;
    let highestScore = -1;

    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      const a = imgData[i + 3];

      // 투명 픽셀 제외
      if (a < 120) continue;

      // 지나치게 어두운 외곽선이나 순백 배경 제외
      const brightness = (r + g + b) / 3;
      if (brightness < 25 || brightness > 240) continue;

      // 채도 점수: 최대 채널 - 최소 채널
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;

      if (saturation > highestScore) {
        highestScore = saturation;
        bestColor = `rgb(${r}, ${g}, ${b})`;
      }
    }

    return highestScore > 30 ? bestColor : fallbackColor;
  } catch (err) {
    return fallbackColor;
  }
};

const clearFeatureTimers = () => {
  featureTimers.forEach((t) => window.clearTimeout(t));
  featureTimers = [];
};

const updateFeatureCard = (charId) => {
  const char = orbitCharactersData.find((c) => c.id === charId);
  if (!char || !featureContainer) return;

  clearFeatureTimers();

  // 1단계 (0ms): 텍스트들이 자연스럽게 사라짐(0.6s)과 동시에 원 테두리가 12시 최상단부터 시계방향으로 회색(#dedede)으로 채워지기 시작 (0.9초간 여유롭게)
  featureContainer.classList.add("is-text-hidden");
  featureContainer.classList.remove("is-image-entering", "is-image-exiting");

  if (featureRingAccentEl) {
    currentRingOffset -= 754;
    featureRingAccentEl.style.transition = "stroke-dashoffset 0.9s linear";
    featureRingAccentEl.style.strokeDashoffset = String(currentRingOffset);
  }

  // 2단계 (300ms): 기존 이미지가 자연스럽고 부드럽게 축소 페이드아웃 시작 (0.65s 소요 -> 950ms에 완전히 100% 소멸)
  const t1 = window.setTimeout(() => {
    featureContainer.classList.add("is-image-exiting");
  }, 300);
  featureTimers.push(t1);

  // 3단계 (1000ms): ★ 기존 이미지가 완벽하게 전부 다 사라진 바로 그 시점에서 다음 이미지로 변경 및 새 이미지 등장 시작! ★
  // 동시에 원 테두리가 12시 최상단부터 시계방향으로 2.0s 등속 채움 시작
  const t2 = window.setTimeout(() => {
    if (featureNameEl) featureNameEl.textContent = char.name;
    if (featureLatinEl) featureLatinEl.textContent = char.latin;

    // 사용자가 명시한 6개 이미지인지 확인
    let specifiedColor = null;
    if (char.image) {
      for (const [key, color] of Object.entries(userSpecifiedImageColors)) {
        if (char.image.includes(key)) {
          specifiedColor = color;
          break;
        }
      }
    }

    if (featureRingAccentEl) {
      featureRingAccentEl.style.stroke = "";
    }

    if (specifiedColor) {
      // 사용자가 언급한 이미지만 지정된 색상으로 정확히 적용
      featureContainer.style.setProperty("--feature-accent-color", specifiedColor);
      if (featureImageEl && featureImageEl instanceof HTMLImageElement) {
        featureImageEl.src = char.image;
        featureImageEl.alt = char.name;
      }
    } else {
      // 언급하지 않은 이미지(포차코 등)는 기존 원래의 동적 이미지 색상 추출 로직을 100% 그대로 유지
      const fallbackColor = characterBrandColors[char.id] || "#5ec8ba";

      if (featureImageEl && featureImageEl instanceof HTMLImageElement) {
        featureImageEl.src = char.image;
        featureImageEl.alt = char.name;

        const applyExtractedColor = () => {
          const extracted = extractImagePrimaryColor(featureImageEl, fallbackColor);
          featureContainer.style.setProperty("--feature-accent-color", extracted);
        };

        if (featureImageEl.complete && featureImageEl.naturalWidth > 0) {
          applyExtractedColor();
        } else {
          featureContainer.style.setProperty("--feature-accent-color", fallbackColor);
          featureImageEl.onload = applyExtractedColor;
        }
      } else {
        featureContainer.style.setProperty("--feature-accent-color", fallbackColor);
      }
    }

    featureContainer.classList.remove("is-image-exiting");
    void featureContainer.offsetWidth; // reflow image
    featureContainer.classList.add("is-image-entering");

    // 새 캐릭터 테두리 12시 최상단부터 시계방향 2.0s 등속 채움 시작 (1000ms + 2000ms = 3000ms 완료)
    if (featureRingAccentEl) {
      currentRingOffset -= 754;
      featureRingAccentEl.style.transition = "stroke-dashoffset 2.0s linear, stroke 0.4s ease";
      featureRingAccentEl.style.strokeDashoffset = String(currentRingOffset);
    }
  }, 1000);
  featureTimers.push(t2);

  // 4단계 (2300ms): 새 이미지가 안착된 후 텍스트 등장 시작 (700ms 동안 진행되어 3000ms에 테두리와 완벽히 동시 완성)
  const t3 = window.setTimeout(() => {
    featureContainer.classList.remove("is-image-entering");
    featureContainer.classList.remove("is-text-hidden");
  }, 2300);
  featureTimers.push(t3);
};

const advanceCharactersOrbit = () => {
  if (
    document.hidden ||
    window.innerWidth <= 768 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  // Clean up any lingering clone from previous transition
  document.querySelectorAll(".characters-orbit__character--clone").forEach((c) => c.remove());

  // Find the character currently at slot 8 (leftmost position) before moving
  const wrappingChar = orbitElements.find((el) => {
    const initialIndex = Number(el.dataset.orbitIndex);
    return (initialIndex + currentOrbitStep) % 9 === 8;
  });

  currentOrbitStep = (currentOrbitStep + 1) % 9;

  // Seamless wrap-around for the left-to-right character transition:
  // 1) The real element at slot 8 slides smoothly out along the arc towards bottom-left off-screen
  // 2) A clone simultaneously slides in along the arc from bottom-right off-screen into slot 0
  // 3) When transition completes (1650ms), silently swap the real element into slot 0 and remove the clone
  if (wrappingChar) {
    wrappingChar.style.transition = "";
    wrappingChar.style.opacity = "0";
    wrappingChar.style.insetInlineStart = "-4%";
    wrappingChar.style.insetBlockStart = "85%";
    wrappingChar.style.transform = "translate(-50%, -50%) scale(0.9)";

    const clone = wrappingChar.cloneNode(true);
    clone.classList.add("characters-orbit__character--clone");
    clone.removeAttribute("data-orbit-character");
    clone.style.transition = "none";
    clone.style.opacity = "0";
    clone.style.insetInlineStart = "104%";
    clone.style.insetBlockStart = "85%";
    clone.style.transform = "translate(-50%, -50%) scale(0.9)";

    if (wrappingChar.parentElement) {
      wrappingChar.parentElement.appendChild(clone);
    }

    void clone.offsetWidth;

    clone.style.transition = "";
    clone.style.opacity = "1";
    clone.style.insetInlineStart = orbitSlots[0].left;
    clone.style.insetBlockStart = orbitSlots[0].top;
    clone.style.transform = `translate(-50%, -50%) scale(${orbitSlots[0].scale})`;

    window.setTimeout(() => {
      wrappingChar.style.transition = "none";
      wrappingChar.style.opacity = "1";
      wrappingChar.style.insetInlineStart = orbitSlots[0].left;
      wrappingChar.style.insetBlockStart = orbitSlots[0].top;
      wrappingChar.style.transform = `translate(-50%, -50%) scale(${orbitSlots[0].scale})`;
      void wrappingChar.offsetWidth;
      wrappingChar.style.transition = "";
      clone.remove();
    }, 1650);
  }

  // Animate all remaining characters along the orbit
  orbitElements.forEach((el) => {
    if (el === wrappingChar) return;

    const initialIndex = Number(el.dataset.orbitIndex);
    const slotIdx = (initialIndex + currentOrbitStep) % 9;
    const slot = orbitSlots[slotIdx];

    el.style.transition = "";
    el.style.opacity = String(slot.opacity);
    el.style.insetInlineStart = slot.left;
    el.style.insetBlockStart = slot.top;
    el.style.transform = `translate(-50%, -50%) scale(${slot.scale})`;

    // When this character enters slot 4 (center), update the central feature!
    if (slotIdx === 4) {
      updateFeatureCard(el.dataset.characterId);
    }
  });
};

// 사이트를 열면 자동으로 처음 원(한교동)부터 12시 최상단에서 시계방향으로 색이 채워지는 인트로 애니메이션
const initFirstFeatureRing = () => {
  if (!featureContainer || !featureRingAccentEl) return;

  featureContainer.classList.add("is-text-hidden");
  featureContainer.style.setProperty("--feature-accent-color", "#5ec8ba");

  window.setTimeout(() => {
    // 1. 이미지 확대 진입 시작
    featureContainer.classList.add("is-image-entering");

    // 2. 테두리가 12시 최상단부터 시계방향으로 1.9s 동안 한교동 민트색으로 채워짐
    currentRingOffset = 0;
    featureRingAccentEl.style.transition = "stroke-dashoffset 2.0s linear, stroke 0.4s ease";
    featureRingAccentEl.style.strokeDashoffset = "0";

    // 3. 이미지가 안착된 후 텍스트 등장 시작 -> 1900ms에 테두리와 동시 완성
    window.setTimeout(() => {
      featureContainer.classList.remove("is-image-entering");
      featureContainer.classList.remove("is-text-hidden");
    }, 1300);
  }, 300);
};

if (featureContainer) {
  initFirstFeatureRing();
}

if (orbitElements.length > 0) {
  window.setInterval(advanceCharactersOrbit, 6000);
}
