const fs = require('fs');

// 1. Update css/tokens.css: --header-height: 194px;
let tokens = fs.readFileSync('css/tokens.css', 'utf8');
tokens = tokens.replace(/--header-height:\s*10rem;/, '--header-height: 194px;');
fs.writeFileSync('css/tokens.css', tokens, 'utf8');
console.log('Updated tokens.css --header-height to 194px');

// 2. Update css/components/header.css
let headerCss = fs.readFileSync('css/components/header.css', 'utf8');

const target = `.site-header__nav {
  position: relative;
  align-items: center;
  justify-content: space-between;
  height: 150px;
  min-height: 150px;
}

/* Scrolled Header State (Desktop Only):
   스크롤을 내리면 site-header__top 박스는 사라지고,
   내용(로고 & 유틸リティ 툴)이 primary-navigation으로 합쳐짐.
   로고는 가장 왼쪽, 툴은 가장 오른쪽, primary-navigation 기존 항목들은 그대로 유지 */
@media (min-width: 769px) {
  .site-header {
    transition: height 0.3s ease, box-shadow 0.3s ease;
  }

  .site-header.is-scrolled {
    height: 150px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .site-header.is-scrolled .site-header__inner {
    width: min(100% - var(--space-4), 78rem);
    transition: width 0.3s ease;
  }

  .site-header.is-scrolled .site-header__top {
    display: none;
  }

  .site-header.is-scrolled .site-header__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 150px;
  }

  .site-header.is-scrolled .site-header__logo {
    display: block;
    position: static;
    transform: none;
    width: 105px;
    margin-right: 1.5rem;
    flex-shrink: 0;
  }

  .site-header.is-scrolled .site-header__tools {
    position: static;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-left: 1.5rem;
    flex-shrink: 0;
  }

  .site-header.is-scrolled .site-header__tool {
    gap: 2px;
    font-size: 0.625rem;
  }

  .site-header.is-scrolled .site-header__tool-icon {
    width: 1.15rem;
    height: 1.15rem;
  }

  .site-header.is-scrolled .site-header__search-backdrop,
  .site-header.is-scrolled .site-header__search-panel {
    inset-block-start: 150px;
  }

  .site-header.is-scrolled .site-header__search-decoration {
    inset-block-start: calc(150px + var(--size-search-overlay-height) - var(--space-2));
  }
}`.replace(/\n/g, '\r\n');

const replacement = `.site-header__nav {
  position: relative;
  align-items: center;
  justify-content: space-between;
  height: 94px;
  min-height: 94px;
}

/* Scrolled Header State (Desktop Only):
   스크롤을 내리면 site-header__top 박스는 사라지고,
   내용(로고 & 유틸リティ 툴)이 primary-navigation으로 합쳐짐.
   로고는 가장 왼쪽, 툴은 가장 오른쪽, primary-navigation 기존 항목들은 그대로 유지 */
@media (min-width: 769px) {
  .site-header {
    transition: height 0.3s ease, box-shadow 0.3s ease;
  }

  .site-header.is-scrolled {
    height: 94px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .site-header.is-scrolled .site-header__inner {
    width: min(100% - var(--space-4), 78rem);
    transition: width 0.3s ease;
  }

  .site-header.is-scrolled .site-header__top {
    display: none;
  }

  .site-header.is-scrolled .site-header__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 94px;
  }

  .site-header.is-scrolled .site-header__logo {
    display: block;
    position: static;
    transform: none;
    width: 105px;
    margin-right: 1.5rem;
    flex-shrink: 0;
  }

  .site-header.is-scrolled .site-header__tools {
    position: static;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-left: 1.5rem;
    flex-shrink: 0;
  }

  .site-header.is-scrolled .site-header__tool {
    gap: 2px;
    font-size: 0.625rem;
  }

  .site-header.is-scrolled .site-header__tool-icon {
    width: 1.15rem;
    height: 1.15rem;
  }

  .site-header.is-scrolled .site-header__search-backdrop,
  .site-header.is-scrolled .site-header__search-panel {
    inset-block-start: 94px;
  }

  .site-header.is-scrolled .site-header__search-decoration {
    inset-block-start: calc(94px + var(--size-search-overlay-height) - var(--space-2));
  }
}`.replace(/\n/g, '\r\n');

if (!headerCss.includes(target)) {
  console.error('Target not found in header.css!');
  process.exit(1);
}

headerCss = headerCss.replace(target, replacement);
fs.writeFileSync('css/components/header.css', headerCss, 'utf8');
console.log('Successfully updated header.css nav height to 94px');

