const fs = require('fs');
let task = fs.readFileSync('task-history/task.md', 'utf8');

const entry = `## 2026-11-06 작업 기록

### Header (헤더) - 데스크톱 스크롤 시 primary-navigation 상단 고정 및 site-header__top 요소 병합
- 사용자의 \`첫화면에서 스크롤을 내리면 part-box site-header__top의 내용이 primary-navigation에 합쳐지고, part-box site-header__top의 박스는 사라짐. primary-navigation에 합쳐질때 primary-navigation은 아무것도 변경하지 않고, site-header__logo은 가장 왼쪽에 위치 part-box site-header__tools은 가장 오른쪽에 위치하도록 함. 스크롤을 내리면 primary-navigation은 화면 촤상단에 고정되도록.\` 요청 반영:
  - \`css/components/header.css\`:
    - \`@media (min-width: 769px)\` 내 \`.site-header.is-scrolled\` 스타일 추가:
      - \`.site-header.is-scrolled\`: 높이를 네비게이션 단일 행 높이(\`--size-nav-row\`)로 축소하고 상단 고정 유지.
      - \`.site-header.is-scrolled .site-header__top\`: \`display: none;\`으로 상단 박스 숨김 처리.
      - \`.site-header.is-scrolled #primary-navigation\`: 기존 메뉴 링크 항목들의 순서와 스타일은 아무것도 변경하지 않고 그대로 유지.
      - \`.site-header.is-scrolled .site-header__logo\`: \`#primary-navigation\`의 가장 첫 번째(왼쪽)에 배치.
      - \`.site-header.is-scrolled .site-header__tools\`: \`#primary-navigation\`의 가장 마지막(오른쪽)에 배치.
      - 검색 오버레이 패널 위치도 축소된 헤더 높이에 맞게 동기화.
  - \`js/main.js\`:
    - \`handleHeaderScroll\` 핸들러 추가: 데스크톱 화면에서 \`scrollY > 40\` 시 \`siteHeader.classList.add('is-scrolled')\`를 부여하고 \`.site-header__logo\`를 \`#primary-navigation\`의 첫 번째 자식으로, \`.site-header__tools\`를 마지막 자식으로 DOM 이동.
    - 스크롤을 최상단으로 올리거나 모바일 화면으로 리사이즈 시 원래의 \`.site-header__top\` 위치로 자동 복원.

`.replace(/\n/g, '\r\n');

task = task.replace('## 2026-11-06 작업 기록\r\n\r\n', entry);
fs.writeFileSync('task-history/task.md', task, 'utf8');
console.log('Updated task-history/task.md');

