const fs = require('fs');
let css = fs.readFileSync('css/components/digital.css', 'utf8');

const target = `.digital-app-item__icon {
  width: 136px;
  height: 136px;
  border-radius: 28px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.digital-app-item__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.digital-app-item__name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.35;
  color: #888888;
}

.digital-app-item__os {
  margin: 0;
  font-size: 0.6875rem;
  color: #888888;
  letter-spacing: 0.05em;
}`;

const replacement = `.digital-app-item__icon {
  width: 136px;
  height: 136px;
  border-radius: 28px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  border: 4px solid transparent;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.digital-app-item__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.digital-app-item__name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.35;
  color: #888888;
  transition: color 0.25s ease;
}

.digital-app-item__os {
  margin: 0;
  font-size: 0.6875rem;
  color: #888888;
  letter-spacing: 0.05em;
}

@media (hover: hover) {
  .digital-app-item:hover .digital-app-item__icon {
    border-color: #68bfd0;
  }

  .digital-app-item:hover .digital-app-item__name {
    color: #68bfd0;
  }
}`;

css = css.replace(/\r\n/g, '\n');
if (css.includes(target)) {
  css = css.replace(target, replacement);
  css = css.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/components/digital.css', css, 'utf8');
  console.log('Successfully updated digital.css with app hover effects');
} else {
  console.log('target not found in digital.css');
}

