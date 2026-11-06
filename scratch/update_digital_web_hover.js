const fs = require('fs');
let css = fs.readFileSync('css/components/digital.css', 'utf8');

const target = `.digital-web-card__image {
  width: 340px;
  height: 190px;
  object-fit: cover;
  display: block;
}

.digital-web-card__title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.45;
  color: #555555;
  word-break: break-all;
}

.digital-web-card__ext-icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 3px;
  color: #888888;
}`;

const replacement = `.digital-web-card__image {
  width: 340px;
  height: 190px;
  object-fit: cover;
  display: block;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.digital-web-card__title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.45;
  color: #555555;
  word-break: break-all;
  transition: color 0.25s ease;
}

.digital-web-card__ext-icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 4px;
  width: 15px;
  height: 15px;
  color: #ebb535;
  transition: color 0.25s ease, transform 0.25s ease;
}

@media (hover: hover) {
  .digital-web-card:hover .digital-web-card__image,
  .digital-web-card__link:hover .digital-web-card__image {
    transform: scale(1.08);
  }

  .digital-web-card:hover .digital-web-card__title,
  .digital-web-card__link:hover .digital-web-card__title {
    color: #68bfd0;
  }

  .digital-web-card:hover .digital-web-card__ext-icon,
  .digital-web-card__link:hover .digital-web-card__ext-icon {
    color: #68bfd0;
  }
}`;

css = css.replace(/\r\n/g, '\n');
if (css.includes(target)) {
  css = css.replace(target, replacement);
  css = css.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/components/digital.css', css, 'utf8');
  console.log('Successfully updated digital.css with digital-web-cards hover effects');
} else {
  console.log('target not found in digital.css');
}

