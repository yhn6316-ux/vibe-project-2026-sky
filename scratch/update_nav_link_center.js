const fs = require('fs');

let css = fs.readFileSync('css/components/header.css', 'utf8');

// Normalize line breaks to \n for replacement
const isCRLF = css.includes('\r\n');
const normalizedCss = css.replace(/\r\n/g, '\n');

const target1 = `.site-header__nav {
  position: relative;
  align-items: center;
  justify-content: space-between;
  height: 94px;
  min-height: 94px;
}`;

const replace1 = `.site-header__nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 94px;
  min-height: 94px;
}`;

const target2 = `.site-nav__link {
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
}`;

const replace2 = `.site-nav__link {
  position: relative;
  display: inline-flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 100%;
  padding-inline: var(--space-2);
  color: var(--color-white);
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  text-align: center;
}`;

let updated = normalizedCss.replace(target1, replace1).replace(target2, replace2);

if (isCRLF) {
  updated = updated.replace(/\n/g, '\r\n');
}

fs.writeFileSync('css/components/header.css', updated, 'utf8');
console.log('Successfully updated css/components/header.css');

