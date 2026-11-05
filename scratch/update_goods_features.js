const fs = require('fs');
let css = fs.readFileSync('css/components/goods.css', 'utf8');

// 1. Heading font size increase
css = css.replace(
  `.goods-section__title {
  margin: 0;
  font-family: var(--font-display, inherit);
  font-size: 2.25rem;`,
  `.goods-section__title {
  margin: 0;
  font-family: var(--font-display, inherit);
  font-size: 2.625rem;`
);

css = css.replace(
  `.goods-section__subtitle {
  margin: 0.25rem 0 0;
  font-size: var(--font-size-xs, 0.75rem);`,
  `.goods-section__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;`
);

// 2. goods-card hover zoom & title color #68bfd0
const targetThumb = `.goods-card__thumb-wrap {
  position: relative;
  width: 340px;
  height: 190px;
  border-radius: var(--radius-card, 16px);
  overflow: visible;
  margin-block-end: 0.75rem;
  background-color: #f7f7f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.goods-card__image {
  width: 340px;
  height: 190px;
  object-fit: cover;
  border-radius: var(--radius-card, 16px);
  display: block;
}`;

const newThumb = `.goods-card__thumb-wrap {
  position: relative;
  width: 340px;
  height: 190px;
  border-radius: var(--radius-card, 16px);
  overflow: hidden;
  margin-block-end: 0.75rem;
  background-color: #f7f7f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.goods-card__image {
  width: 340px;
  height: 190px;
  object-fit: cover;
  border-radius: var(--radius-card, 16px);
  display: block;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (hover: hover) {
  .goods-card:hover .goods-card__image,
  .goods-card__link:hover .goods-card__image {
    transform: scale(1.08);
  }

  .goods-card:hover .goods-card__title,
  .goods-card__link:hover .goods-card__title {
    color: #68bfd0;
  }
}`;

css = css.replace(/\r\n/g, '\n');
if (css.includes(targetThumb)) {
  css = css.replace(targetThumb, newThumb);
} else {
  console.log('targetThumb not matched');
}

// title transition
css = css.replace(
  `color: #333333;\n  display: -webkit-box;`,
  `color: #333333;\n  transition: color 0.25s ease;\n  display: -webkit-box;`
);

// 3. goods-ranking__header text 23px & dots longer
const targetRankingHeader = `.goods-ranking__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-block-end: 2rem;
}

.goods-ranking__header-dot {
  flex: 1;
  max-width: 180px;
  height: 0;
  border-bottom: 2px dotted #ea6497;
  border-radius: 0;
  background: none;
}

.goods-ranking__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: var(--font-weight-bold, 700);
  color: #ea6497;
  letter-spacing: 0.05em;
  white-space: nowrap;
}`;

const newRankingHeader = `.goods-ranking__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.75rem;
  margin-block-end: 2rem;
}

.goods-ranking__header-dot {
  flex: 1;
  max-width: 280px;
  height: 0;
  border-bottom: 2px dotted #ea6497;
  border-radius: 0;
  background: none;
}

.goods-ranking__title {
  margin: 0;
  font-size: 23px;
  font-weight: var(--font-weight-bold, 700);
  color: #ea6497;
  letter-spacing: 0.05em;
  white-space: nowrap;
}`;

if (css.includes(targetRankingHeader)) {
  css = css.replace(targetRankingHeader, newRankingHeader);
} else {
  console.log('targetRankingHeader not matched');
}

// 4. goods-ranking__thumb-wrap & image: 162x162px, hover zoom & text #68bfd0
const targetRankingThumb = `.goods-ranking__thumb-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  margin-block-end: 0.875rem;
  display: grid;
  place-items: center;
}

.goods-ranking__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}`;

const newRankingThumb = `.goods-ranking__thumb-wrap {
  position: relative;
  width: 162px;
  height: 162px;
  margin-block-end: 0.875rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 12px;
}

.goods-ranking__image {
  width: 162px;
  height: 162px;
  object-fit: contain;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (hover: hover) {
  .goods-ranking__item:hover .goods-ranking__image,
  .goods-ranking__link:hover .goods-ranking__image {
    transform: scale(1.08);
  }

  .goods-ranking__item:hover .goods-ranking__item-title,
  .goods-ranking__link:hover .goods-ranking__item-title {
    color: #68bfd0;
  }
}`;

if (css.includes(targetRankingThumb)) {
  css = css.replace(targetRankingThumb, newRankingThumb);
} else {
  console.log('targetRankingThumb not matched');
}

css = css.replace(
  `color: #555555;\n  text-align: left;`,
  `color: #555555;\n  transition: color 0.25s ease;\n  text-align: left;`
);

css = css.replace(/\n/g, '\r\n');
fs.writeFileSync('css/components/goods.css', css, 'utf8');
console.log('Successfully updated goods.css');

