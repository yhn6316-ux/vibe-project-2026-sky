const fs = require('fs');
let task = fs.readFileSync('task-history/task.md', 'utf8');

const entry = `### Header (헤더) - primary-navigation 94px 복원 및 site-header outer-box 높이 194px 최적화
- 사용자의 \`높이를 94px로 다시 수정하고, site-header outer-box의 높이를 조정해서 보기 좋게 수정.\` 요청 반영:
  - \`css/components/header.css\`:
    - \`.site-header__nav\`: 높이를 \`height: 94px; min-height: 94px;\`로 복원.
    - \`.site-header.is-scrolled\`: 높이 및 오프셋을 \`94px\`로 일관성 있게 복원.
  - \`css/tokens.css\`:
    - \`--header-height\`: 상단 영역(\`--size-header-top: 100px\`)과 94px 네비게이션이 합쳐진 전체 헤더 높이를 정확히 \`194px\`로 지정하여, 하위 콘텐츠가 헤더 아래로 파고들거나 어색한 빈 여백이 남지 않고 자연스럽게 밀착되도록 완벽히 조정.

`.replace(/\n/g, '\r\n');

task = task.replace('## 2026-11-06 작업 기록\r\n\r\n', '## 2026-11-06 작업 기록\r\n\r\n' + entry);
fs.writeFileSync('task-history/task.md', task, 'utf8');
console.log('Updated task-history');

