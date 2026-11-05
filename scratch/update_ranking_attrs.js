const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const items = ['87', '88', '89', '90', '91'];
items.forEach(id => {
  const target = `src="./images/used/sanrio-dt_${id}.jpg"`;
  const replacement = `src="./images/used/sanrio-dt_${id}.jpg" width="162" height="162"`;
  if (html.includes(target) && !html.includes(replacement)) {
    html = html.replace(target, replacement);
  }
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated ranking image attributes in index.html');

