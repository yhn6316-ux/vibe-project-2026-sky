const fs = require('fs');
let css = fs.readFileSync('css/components/goods.css', 'utf8');

// 1. Update .goods-ranking__external-icon color to #f49cc2 with transition
const targetIcon = `.goods-ranking__external-icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
  color: #888888;
}`;

const newIcon = `.goods-ranking__external-icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
  color: #f49cc2;
  transition: color 0.25s ease;
}`;

// 2. In hover query, add external icon color change to #68bfd0
const targetHover = `  .goods-ranking__item:hover .goods-ranking__item-title,
  .goods-ranking__link:hover .goods-ranking__item-title {
    color: #68bfd0;
  }`;

const newHover = `  .goods-ranking__item:hover .goods-ranking__item-title,
  .goods-ranking__link:hover .goods-ranking__item-title {
    color: #68bfd0;
  }

  .goods-ranking__item:hover .goods-ranking__external-icon,
  .goods-ranking__link:hover .goods-ranking__external-icon {
    color: #68bfd0;
  }`;

css = css.replace(/\r\n/g, '\n');
if (css.includes(targetIcon)) {
  css = css.replace(targetIcon, newIcon);
} else {
  console.log('targetIcon not matched');
}

if (css.includes(targetHover)) {
  css = css.replace(targetHover, newHover);
} else {
  console.log('targetHover not matched');
}

css = css.replace(/\n/g, '\r\n');
fs.writeFileSync('css/components/goods.css', css, 'utf8');
console.log('Successfully updated external-icon hover color');

