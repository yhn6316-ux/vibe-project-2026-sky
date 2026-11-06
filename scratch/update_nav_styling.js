const fs = require('fs');
let css = fs.readFileSync('css/components/header.css', 'utf8');

const target = `.site-header__nav {
  position: relative;
  align-items: center;
  justify-content: space-between;
  min-height: var(--size-nav-row);
}

/* Scrolled Header State (Desktop Only):
   스크롤을 내리면 site-header__top 박스는 사라지고,
   내용(로고 & 유틸리티 툴)이 primary-navigation으로 합쳐짐.
   로고는 가장 왼쪽, 툴은 가장 오른쪽, primary-navigation 기존 항목들은 그대로 유지 */
@media (min-width: 769px) {
  .site-header {
    transition: height 0.3s ease, box-shadow 0.3s ease;
  }

  .site-header.is-scrolled {
    height: var(--size-nav-row);
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
    height: var(--size-nav-row);
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
    inset-block-start: var(--size-nav-row);
  }

  .site-header.is-scrolled .site-header__search-decoration {
    inset-block-start: calc(var(--size-nav-row) + var(--size-search-overlay-height) - var(--space-2));
  }
}

.site-nav__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--size-nav-target);
  padding-inline: var(--space-2);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.site-nav__link + .site-nav__link {
  border-inline-start: var(--border-width-thin) solid var(--color-nav-divider);
  padding-inline-start: var(--space-4);
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
   내용(로고 & 유틸리티 툴)이 primary-navigation으로 합쳐짐.
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
}

.site-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 100%;
  padding-inline: var(--space-3);
  color: var(--color-white);
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  text-align: center;
}

.site-nav__link + .site-nav__link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 14px;
  background-color: #ffffff;
}`.replace(/\n/g, '\r\n');

if (!css.includes(target)) {
  console.error('Target not found!');
  process.exit(1);
}

css = css.replace(target, replacement);
fs.writeFileSync('css/components/header.css', css, 'utf8');
console.log('Successfully updated header.css');

