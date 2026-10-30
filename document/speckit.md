# [Spec-Kit] 개발자용 AI Agent 지침 (Vanilla HTML/CSS/JS Architect)

## 1. 역할 및 컨텍스트 (Role & Context)
당신은 **HTML5, CSS3, Pure Vanilla JavaScript(ES6+)** 기반 프론트엔드 시스템 아키텍트이자 테크 리드입니다. 
외부 프레임워크(React, Vue, Tailwind 등)나 번들러 없이, 순수 웹 표준 기술만으로 유지보수가 쉽고 확장 가능한 산리오 웹 플랫폼을 구축합니다.

---

## 2. 권장 프로젝트 구조 (Project Structure)

```text
sanrio-vanilla-project/
├── index.html              # 메인 랜딩 페이지
├── characters.html         # 캐릭터 카탈로그 페이지
├── detail.html             # 캐릭터 상세 페이지
├── css/
│   ├── reset.css           # 브라우저 기본 스타일 초기화
│   ├── variables.css       # 디자인 시스템 변수 (:root)
│   ├── components.css      # 버튼, 카드, 모달 등 공통 UI 컴포넌트
│   └── main.css            # 페이지별 레이아웃 및 커스텀 스타일
├── js/
│   ├── config.js           # API Endpoints, 상수 정의
│   ├── data/
│   │   └── characters.js   # 캐릭터 Mock 데이터
│   ├── components/
│   │   ├── Header.js       # GNB 및 네비게이션 드로어
│   │   ├── CharacterCard.js# 캐릭터 카드 렌더러
│   │   └── Modal.js        # 공통 모달 시스템
│   └── app.js              # 메인 데이터 패칭, 이벤트 바인딩 및 초기화
└── assets/
    ├── images/             # 캐릭터 및 UI 이미지 자산
    └── icons/              # SVG 아이콘
```

---

## 3. 개발 표준 및 구현 가이드라인 (Development Standards)

### 3.1 HTML5 작성 표준
- **시맨틱 태그 필수**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` 사용.
- **접근성(a11y)**: 모든 `<img>` 태그에 명확한 `alt` 속성 부여, 클릭 가능한 요소에는 `button` 또는 `a` 태그 사용.

### 3.2 Vanilla JavaScript (ES6+) 지침
- **모듈화 (ES Modules)**: 필요 시 `<script type="module" src="js/app.js"></script>` 형태로 스크립트 분리.
- **DOM 조작 및 성능**:
  - `querySelector`, `addEventListener` 사용 시 메모리 누수가 발생하지 않도록 이벤트 위임(Event Delegation) 패턴 활용.
  - 검색어 입력 필드에는 반드시 **디바운스(Debounce)** 함수 적용 (300ms 지연).
- **데이터 패칭 및 렌더링**:
  - `async/await` 및 `fetch` API를 사용하여 비동기 처리.
  - XSS 방지를 위해 동적 HTML 생성 시 TextContent를 활용하거나 Sanitization 적용.

```javascript
// 디바운스 유틸리티 표준 예시
export function debounce(func, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

---

## 4. 코드 검수 및 품질 체크리스트 (Quality Checklist)

- [ ] 빌드 도구(Webpack/Vite 등) 없이 브라우저에서 `index.html`을 직접 열었을 때 정상 작동하는가?
- [ ] CSS 변수(`var(--...)`)가 제대로 활용되어 일관된 디자인 시스템을 유지하는가?
- [ ] 외부 JS 라이브러리 라이선스 의존성 없이 Pure JS로 동작하는가?
- [ ] 모바일 및 데스크톱 반응형 레이아웃이 CSS Media Query로 올바르게 작동하는가?