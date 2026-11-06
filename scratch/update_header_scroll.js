const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const target = 'window.addEventListener("resize", () => {\r\n  if (isHeaderSearchOpen && window.matchMedia("(max-width: 768px)").matches) {\r\n    closeHeaderSearch(false);\r\n  }\r\n  if (isMobileMenuOpen && !window.matchMedia("(max-width: 768px)").matches) {\r\n    closeMobileMenu(undefined, false, true);\r\n  }\r\n});';

const replacement = `window.addEventListener("resize", () => {
  if (isHeaderSearchOpen && window.matchMedia("(max-width: 768px)").matches) {
    closeHeaderSearch(false);
  }
  if (isMobileMenuOpen && !window.matchMedia("(max-width: 768px)").matches) {
    closeMobileMenu(undefined, false, true);
  }
  handleHeaderScroll();
});

// --- Desktop Header Scroll Sticky & Merge ---
const headerTopBox = document.querySelector(".site-header__top");
const headerNavBox = document.querySelector("#primary-navigation");
const headerLogo = document.querySelector(".site-header__logo");
const headerTools = document.querySelector(".site-header__tools");

let isHeaderScrolled = false;

const handleHeaderScroll = () => {
  if (window.matchMedia("(max-width: 768px)").matches) {
    if (isHeaderScrolled) {
      isHeaderScrolled = false;
      siteHeader.classList.remove("is-scrolled");
      if (headerLogo && headerTopBox && headerLogo.parentElement !== headerTopBox) {
        headerTopBox.insertBefore(headerLogo, headerTools || null);
      }
      if (headerTools && headerTopBox && headerTools.parentElement !== headerTopBox) {
        headerTopBox.appendChild(headerTools);
      }
    }
    return;
  }

  const scrollY = window.scrollY || window.pageYOffset;
  const shouldScroll = scrollY > 40;

  if (shouldScroll && !isHeaderScrolled) {
    isHeaderScrolled = true;
    siteHeader.classList.add("is-scrolled");
    if (headerLogo && headerNavBox) {
      headerNavBox.insertBefore(headerLogo, headerNavBox.firstChild);
    }
    if (headerTools && headerNavBox) {
      headerNavBox.appendChild(headerTools);
    }
  } else if (!shouldScroll && isHeaderScrolled) {
    isHeaderScrolled = false;
    siteHeader.classList.remove("is-scrolled");
    if (headerLogo && headerTopBox) {
      headerTopBox.insertBefore(headerLogo, headerTools || null);
    }
    if (headerTools && headerTopBox) {
      headerTopBox.appendChild(headerTools);
    }
  }
};

window.addEventListener("scroll", handleHeaderScroll, { passive: true });
handleHeaderScroll();`.replace(/\n/g, '\r\n');

if (!js.includes(target)) {
  console.error('Target not found!');
  process.exit(1);
}

js = js.replace(target, replacement);
fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Successfully updated js/main.js');

