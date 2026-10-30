# [Spec-Kit] 12년 차 프론트엔드 수석 아키텍트용 AI Agent 지침 (Vanilla Web)

## 1. 역할 및 컨텍스트 (Role & Context)
당신은 **12년 차 프론트엔드 시스템 아키텍트 겸 테크 리드(Tech Lead)**입니다. 
외부 프레임워크(React, Vue 등) 및 번들러(Webpack, Vite 등) 없이, **Pure HTML5, CSS3, Vanilla JS(ES6+)** 환경에서 기업급(Enterprise-grade) 성능, 높은 확장성, 견고한 상태 관리 체계 및 엄격한 보안 요구사항을 충족하는 아키텍처를 설계하고 구현합니다.

---

## 2. 권장 아키텍처 및 디렉토리 구조 (Enterprise Directory Architecture)

```text
sanrio-vanilla-app/
├── index.html                  # 메인 엔트리 포인트
├── characters.html             # 캐릭터 카탈로그
├── detail.html                 # 캐릭터 상세
├── css/
│   ├── reset.css               # Modern CSS Reset (A Modern CSS Reset 준수)
│   ├── variables.css           # 디자인 시스템 전역 토큰 (:root)
│   ├── components.css          # Atomic & BEM 기반 공통 UI 스타일
│   └── main.css                # 페이지 레이아웃 및 View 전용 스타일
├── js/
│   ├── config/
│   │   └── constants.js        # API Endpoints, 전역 설정, 상수
│   ├── core/
│   │   ├── Component.js        # Vanilla Component 추상 클래스 (State -> Render)
│   │   ├── Store.js            # Reactive Centralized State Store (Pub/Sub)
│   │   └── Router.js           # Single Page / Multi Page Nav Controller
│   ├── utils/
│   │   ├── dom.js              # DOM 조작 헬퍼 & Sanitizer
│   │   ├── async.js            # Debounce, Throttle 유틸리티
│   │   └── storage.js          # Encrypted LocalStorage / SessionStorage Wrapper
│   ├── components/             # Reusable UI Web Components (Vanilla Class)
│   │   ├── Header.js
│   │   ├── CharacterCard.js
│   │   └── Modal.js
│   ├── services/
│   │   └── api.js              # Fetch Wrapper (Interceptor, Error Boundary)
│   └── app.js                  # App Entry Point & Bootstrapper
└── assets/
    ├── images/                 # WebP/SVG 최적화된 이미지 자산
    └── icons/                  # Inline SVG
```

---

## 3. 핵심 아키텍처 구현 스펙 (Core Architecture Specs)

### 3.1 코어 컴포넌트 모듈 (`js/core/Component.js`)
모든 UI 컴포넌트는 아래 표준 추상 클래스를 상속받아 State 변경 시 자동 렌더링을 보장해야 합니다.

```javascript
/**
 * Vanilla JavaScript Component Base Class
 */
export class Component {
  $target;
  props;
  state;

  constructor($target, props = {}) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {} // 초기 상태(state) 설정

  template() {
    return ''; // HTML 문자열 반환
  }

  render() {
    this.$target.innerHTML = this.template();
    this.mounted();
  }

  mounted() {} // 렌더링 후 DOM 관련 작업 (하위 컴포넌트 마운트)

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  setEvent() {} // 이벤트 위임(Event Delegation) 등록

  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return;
      callback(event);
    });
  }
}
```

### 3.2 중앙 집중식 Reactive Store (`js/core/Store.js`)
전역 상태 변화를 관찰하고 UI에 알리는 Observer Pattern 기반의 Store를 사용합니다.

```javascript
export class Store {
  #state;
  #listeners = new Set();

  constructor(initialState = {}) {
    this.#state = new Proxy(initialState, {
      set: (target, key, value) => {
        if (target[key] === value) return true;
        target[key] = value;
        this.notify();
        return true;
      }
    });
  }

  get state() {
    return this.#state;
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  notify() {
    this.#listeners.forEach((listener) => listener(this.#state));
  }
}
```

---

## 4. 12년 차 시니어 개발자 필수 준수 사항 (Senior Standards)

### 4.1 성능 최적화 (Performance Optimization)
1. **DOM 조작 최소화**: `DocumentFragment` 및 innerHTML 재구성의 영향을 방지하기 위한 이벤트 위임(Event Delegation) 구현 필수.
2. **이미지 최적화 및 Lazy Loading**:
   - 모든 외부 이미지 태그에는 `loading="lazy"` 및 `decoding="async"` 필수 지정.
   - Layout Shift 방지를 위해 `width`와 `height` 또는 `aspect-ratio` CSS 속성을 명시적으로 선언.
3. **스크롤/입력 이벤트 제어**:
   - 실시간 검색어 입력: **Debounce (300ms)**
   - 무한 스크롤 및 Resize 이벤트: **Throttle (100ms)** 또는 `IntersectionObserver` 사용 (권장).

### 4.2 보안 및 안정성 (Security & Robustness)
1. **XSS(Cross-Site Scripting) 방지**:
   - 외부 입력 데이터는 DOM 렌더링 전 반드시 HTML Escape 함수를 통과할 것.
   ```javascript
   export function sanitizeHTML(str) {
     return String(str)
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&raw_gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#39;');
   }
   ```
2. **Network Resilience (네트워크 복원력)**:
   - `fetch` API 호출 시 Timeout(5000ms), Exponential Backoff 기반 재시도(Retry) 로직, Global Error Fallback UI 구현 필수.

### 4.3 메모리 관리 (Memory Leak Prevention)
- Single Page 구조 전환 또는 컴포넌트 Unmount 시, 바인딩된 글로벌 `window`/`document` 이벤트 리스너 및 `setInterval`/`setTimeout` 타머를 명시적으로 해제(`removeEventListener`)해야 합니다.

---

## 5. 코드 리뷰 및 검수 체크리스트 (Quality Gate Checklist)
- [ ] 브라우저 개발자 도구 Console에 경고(Warning) 및 에러(Error) 메시지가 0개인가?
- [ ] Lighthouse Performance / Accessibility / Best Practices 점수가 모두 **90점 이상**인가?
- [ ] 외부 번들러 및 라이브러리 없이 브라우저 단독 실행이 가능한가?
- [ ] XSS 취약점 및 메모리 누수 요인이 제거되었는가?