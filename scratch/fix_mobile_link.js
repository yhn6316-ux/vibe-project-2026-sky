const fs = require('fs');
let css = fs.readFileSync('css/components/sections.css', 'utf8');

const oldMobileLink = `  .characters-section__link {
    width: calc(100% - var(--space-8));
    max-width: 22rem;
    min-height: 3rem;
    font-size: var(--font-size-sm);
    margin: 1.5rem auto 2rem;
  }`;

const newMobileLink = `  .characters-section__link {
    position: relative;
    inset: auto;
    transform: none;
    z-index: 3;
    width: calc(100% - var(--space-8));
    max-width: 22rem;
    min-height: 3rem;
    font-size: var(--font-size-sm);
    margin: 1.5rem auto 2rem;
  }`;

css = css.replace(/\r\n/g, '\n');
if (css.includes(oldMobileLink)) {
  css = css.replace(oldMobileLink, newMobileLink);
  css = css.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/components/sections.css', css, 'utf8');
  console.log('Successfully fixed mobile .characters-section__link');
} else {
  console.log('Target not found in sections.css');
}

