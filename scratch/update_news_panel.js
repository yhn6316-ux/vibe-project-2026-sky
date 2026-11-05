const fs = require('fs');
let css = fs.readFileSync('css/components/sections.css', 'utf8');

const oldNewsCss = `.news-panel {
  width: 900px;
  max-width: 100%;
  margin-inline: auto;
  box-sizing: border-box;
  align-items: center;
  gap: var(--space-4);
  min-height: var(--size-news-panel);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
}

.news-panel__heading {
  display: grid;
  flex: 0 0 auto;
  align-content: center;
  justify-items: center;
  gap: var(--space-2);
  min-height: var(--size-carousel-control);
  padding-inline-end: var(--space-4);
  border-inline-end: var(--border-width-thin) solid var(--color-border);
  color: #c95484;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.news-panel__more {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem var(--space-2);
  border-radius: var(--radius-pill);
  background: var(--color-bg);
  color: var(--color-secondary-deep);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  text-decoration: none;
}

.news-panel__more-arrow {
  display: inline-block;
  font-size: 0.625rem;
  line-height: 1;
}

.news-panel__list {
  display: grid;
  flex: 1;
  gap: var(--space-2);
  min-width: 0;
  padding: 0;
  list-style: none;
}

.news-panel__item {
  display: flex;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  line-height: 1.5;
}

.news-panel__item span {
  font-weight: var(--font-weight-bold, 700);
}

.news-panel__date {
  flex: 0 0 auto;
  font-weight: var(--font-weight-regular, 400);
}`;

const newNewsCss = `.news-panel {
  width: 900px;
  max-width: 100%;
  margin-inline: auto;
  box-sizing: border-box;
  align-items: center;
  gap: var(--space-6, 1.5rem);
  min-height: var(--size-news-panel);
  padding: 1.25rem 2rem;
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
}

.news-panel__heading {
  display: grid;
  flex: 0 0 auto;
  align-content: center;
  justify-items: center;
  gap: var(--space-2);
  min-height: var(--size-carousel-control);
  padding-inline-end: 1.5rem;
  border-inline-end: var(--border-width-thin) solid var(--color-border);
  color: #ea6497;
  font-size: 0.9375rem;
  font-weight: var(--font-weight-bold);
}

.news-panel__more {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.625rem;
  border-radius: var(--radius-pill);
  background: var(--color-bg);
  color: var(--color-secondary-deep);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  text-decoration: none;
}

.news-panel__more-arrow {
  display: inline-block;
  font-size: 0.625rem;
  line-height: 1;
}

.news-panel__list {
  display: grid;
  flex: 1;
  gap: 0.75rem;
  min-width: 0;
  padding: 0;
  list-style: none;
}

.news-panel__item {
  display: flex;
  gap: 0.75rem;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm, 0.8125rem);
  line-height: 1.6;
}

.news-panel__item span {
  font-weight: var(--font-weight-bold, 700);
}

.news-panel__date {
  flex: 0 0 auto;
  font-weight: var(--font-weight-regular, 400);
}`;

css = css.replace(/\r\n/g, '\n');
if (css.includes(oldNewsCss)) {
  css = css.replace(oldNewsCss, newNewsCss);
  css = css.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/components/sections.css', css, 'utf8');
  console.log('Successfully updated news-panel styling in sections.css');
} else {
  console.log('Target not found in sections.css');
}

