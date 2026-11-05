const fs = require('fs');
let css = fs.readFileSync('css/components/sections.css', 'utf8');

const oldLinkDesktop = `.characters-section__link {
  position: relative;
  inset: auto;
  transform: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(27.5rem, calc(100% - var(--space-8)));
  min-height: 3.25rem;
  margin: 2rem auto 2.5rem;
  padding-inline: var(--space-8);
  border-radius: var(--radius-pill);
  background: var(--color-secondary);
  color: var(--color-white);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-label);
  text-decoration: none;
}`;

const newLinkDesktop = `.characters-section__link {
  position: absolute;
  z-index: 3;
  inset-inline-start: 50%;
  inset-block-end: 1.5rem;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(27.5rem, calc(100% - var(--space-8)));
  min-height: 3.25rem;
  margin: 0;
  padding-inline: var(--space-8);
  border-radius: var(--radius-pill);
  background: var(--color-secondary);
  color: var(--color-white);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-label);
  text-decoration: none;
}`;

css = css.replace(/\r\n/g, '\n');
if (css.includes(oldLinkDesktop)) {
  css = css.replace(oldLinkDesktop, newLinkDesktop);
  css = css.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/components/sections.css', css, 'utf8');
  console.log('Successfully updated .characters-section__link positioning');
} else {
  console.log('Target not found in sections.css');
}

