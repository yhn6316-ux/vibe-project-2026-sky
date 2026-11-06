const fs = require('fs');
let task = fs.readFileSync('task-history/task.md', 'utf8');

const entry = `### Header (헤더) - primary-navigation 높이 94px, 중앙정렬, 14px, #fff 구분선 길이 단축 조정
- 사용자의 \`primary-navigation 높이를 94px로 수정. 각 박스 안의 내용을 박스 중앙정렬로 변경. 글씨 14px로 변경. 구분선 색 #fff로 변경. 길이를 텍스트 길이와 어울리게 짧게 조정.\` 요청 반영:
  - \`css/components/header.css\`:
    - \`.site-header__nav\`: 높이 \`height: 94px; min-height: 94px;\`로 수정.
    - \`.site-header.is-scrolled\`: 높이 및 하위 요소 오프셋을 \`94px\`로 동기화.
    - \`.site-nav__link\`:
      - 박스 안의 내용을 완벽하게 박스 중앙 정렬(\`display: inline-flex; align-items: center; justify-content: center; height: 100%;\`).
      - 글씨 크기를 \`14px\`로 지정 (\`font-size: 14px;\`).
      - 링크 구분선: 기존 요소 전체 높이의 테두리 대신 \`::before\` 가상 요소를 적용하여 색상 \`#ffffff\`, 높이 \`14px\`(글자 높이와 어울리는 짧은 길이)로 수직 중앙(\`top: 50%; transform: translateY(-50%);\`) 배치.

`.replace(/\n/g, '\r\n');

task = task.replace('## 2026-11-06 작업 기록\r\n\r\n', '## 2026-11-06 작업 기록\r\n\r\n' + entry);
fs.writeFileSync('task-history/task.md', task, 'utf8');
console.log('Updated task-history');

