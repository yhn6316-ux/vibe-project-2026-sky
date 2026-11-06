const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const target = `const headerTopBox = document.querySelector(".site-header__top");
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

const replacement = `const headerTopBox = document.querySelector(".site-header__top");
const headerNavBox = document.querySelector("#primary-navigation");
const headerLogo = document.querySelector(".site-header__logo");
const headerTools = document.querySelector(".site-header__tools");
const headerMobileTools = document.querySelector(".site-header__mobile-tools");

let isHeaderScrolled = false;

const restoreHeaderToOriginal = () => {
  if (!isHeaderScrolled && headerTopBox && headerLogo?.parentElement === headerTopBox && headerTools?.parentElement === headerTopBox) {
    return;
  }
  isHeaderScrolled = false;
  siteHeader.classList.remove("is-scrolled");

  if (headerTopBox) {
    if (headerMobileTools && headerMobileTools.parentElement === headerTopBox) {
      headerTopBox.insertBefore(headerLogo, headerMobileTools.nextSibling);
    } else {
      headerTopBox.insertBefore(headerLogo, headerTopBox.firstChild);
    }
    headerTopBox.appendChild(headerTools);
  }
};

const handleHeaderScroll = () => {
  if (window.matchMedia("(max-width: 768px)").matches) {
    restoreHeaderToOriginal();
    return;
  }

  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  const shouldScroll = scrollY > 10;

  if (shouldScroll) {
    if (!isHeaderScrolled) {
      isHeaderScrolled = true;
      siteHeader.classList.add("is-scrolled");
      if (headerLogo && headerNavBox) {
        headerNavBox.insertBefore(headerLogo, headerNavBox.firstChild);
      }
      if (headerTools && headerNavBox) {
        headerNavBox.appendChild(headerTools);
      }
    }
  } else {
    restoreHeaderToOriginal();
  }
};

window.addEventListener("scroll", handleHeaderScroll, { passive: true });
window.addEventListener("scrollend", handleHeaderScroll, { passive: true });
handleHeaderScroll();`.replace(/\n/g, '\r\n');

if (!js.includes(target)) {
  console.error('Target not found!');
  process.exit(1);
}

js = js.replace(target, replacement);
fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Successfully updated main.js');

