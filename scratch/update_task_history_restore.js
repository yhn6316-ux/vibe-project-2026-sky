const fs = require('fs');
let task = fs.readFileSync('task-history/task.md', 'utf8');

const fixRecord = `### Header (헤더) - 최상단 스크롤 복귀 시 초기 상태 복원 안정화
- 사용자의 \`다시 스크롤을 최상단으로 올리면 가장 처음의 상태로 돌아가도록 해줘.\` 요청 반영:
  - \`js/main.js\`:
    - \`restoreHeaderToOriginal\` 전용 복원 로직 구현:
      - 스크롤이 최상단(\`scrollY <= 10\`)에 도달하거나 모바일 화면 전환 시, \`is-scrolled\` 클래스를 제거하고 \`site-header__logo\`와 \`site-header__tools\`를 초기 HTML DOM 순서(\`mobileTools -> logo -> tools\`)대로 \`.site-header__top\`에 정확히 원상 복구.
      - 다양한 브라우저 호환성을 위해 \`window.scrollY || window.pageYOffset || document.documentElement.scrollTop\` 교차 감지 및 \`scrollend\` 리스너를 함께 등록하여 스크롤 중단 시점에도 완벽 복원 보장.

`.replace(/\n/g, '\r\n');

task = task.replace('## 2026-11-06 작업 기록\r\n\r\n', '## 2026-11-06 작업 기록\r\n\r\n' + fixRecord);
fs.writeFileSync('task-history/task.md', task, 'utf8');
console.log('Updated task-history');

