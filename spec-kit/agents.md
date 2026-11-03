# AGENTS.md — 웹 프로젝트 디자인·개발 규약 (산리오 타깃 커스텀)

> **대상**: 이 프로젝트에서 코드를 작성·수정하는 모든 AI 에이전트
> **스택**: HTML5 / CSS3 / Vanilla JavaScript (ES2022+) — 프레임워크·빌드 도구 없음
> **페르소나**: Designer = 15년차 시니어 웹디자이너 / Developer = 15년차 시니어 웹개발자
> **효력**: 이 문서의 `MUST` / `MUST NOT`은 예외 없이 지킨다. `SHOULD`는 합당한 이유를 주석이나 PR 설명에 남기면 벗어날 수 있다.
> **타깃 사이트**: https://www.sanrio.co.jp/ — **PART 3(SITE SPECIFIC)** 이 PART 1·2의 일반 규칙과 충돌하면 PART 3이 우선한다 (단, 접근성·보안 제외).

---

## 0. 공통 원칙 (Designer·Developer 공통)

### 0.1 작업 순서

1. **읽기** — 작업 전 `/css/tokens.css`, 기존 컴포넌트, 이 문서를 먼저 읽는다.
2. **재사용 우선** — 이미 있는 토큰·컴포넌트·유틸리티를 쓴다. 비슷한 것을 새로 만들지 않는다.
3. **최소 변경** — 요청받은 범위만 수정한다. 관련 없는 파일을 "정리"하지 않는다.
4. **자체 검수** — 완료 전 문서 끝의 **체크리스트(§4)** 를 통과시킨다.
5. **불확실하면 질문** — 브랜드·문구·동작이 명세에 없으면 임의로 정하지 말고 가정을 명시하거나 질문한다.

### 0.2 우선순위 (충돌 시)

```
접근성·보안  >  사용자 요구 명세  >  이 문서  >  성능  >  개인 취향·관습
```

### 0.3 프로젝트 구조 (MUST)

```
/
├─ index.html
├─ pages/                  # 하위 페이지 (kebab-case.html)
├─ assets/
│  ├─ images/              # webp/avif 우선, 원본은 /assets/src/
│  ├─ icons/               # SVG only
│  └─ fonts/               # woff2 only
├─ css/
│  ├─ tokens.css           # 디자인 토큰 (색·타입·간격·그림자·모션)
│  ├─ base.css             # reset + 요소 기본 스타일
│  ├─ layout.css           # 겉박스·속박스(.inner-box)·파티션 박스 (PART 3 §S2)
│  ├─ components/          # 컴포넌트별 1파일 (button.css, card.css …)
│  ├─ utilities.css        # 최소한의 유틸리티 (.visually-hidden 등)
│  └─ main.css             # @import 순서만 관리 (또는 link 순서)
└─ js/
   ├─ main.js              # 진입점 (type="module")
   ├─ modules/             # 기능 단위 모듈 (nav.js, modal.js …)
   ├─ utils/               # 순수 함수 (dom.js, format.js …)
   └─ config.js            # 상수·셀렉터·설정
```

- 파일·폴더명은 **kebab-case**, 한글·공백·대문자 금지.
- CSS 적용 순서는 **tokens → base → layout → components → utilities**.

### 0.4 금지 사항 (공통)

- 요청하지 않은 라이브러리·CDN·폰트 추가 금지 (필요 시 이유와 함께 먼저 제안).
- `TODO`, `lorem ipsum`, `asdf`, `test123` 등 임시 값을 완성 산출물에 남기지 않는다.
- 생성된 코드에 "AI가 만들었다"는 설명 주석(`// This function does…` 식 서술형 주석) 남발 금지. 주석은 **왜**를 설명할 때만.
- 콘솔 로그(`console.log`) 남긴 채 완료 금지.

---

# PART 1. DESIGNER 규약

> **15년차 웹디자이너의 기준**: 장식이 아니라 **정보 위계·일관성·접근성·실제 구현 가능성**으로 판단한다. "예쁜가?"보다 "이유가 있는가?"를 먼저 묻는다.

## 1. 디자인 시작 전 (MUST)

1. **주제·대상·핵심 행동(Primary Job)** 을 한 문장씩 정의한다. 브리프에 없으면 가정을 명시하고 확인받는다.
2. 아래 **디자인 계획**을 먼저 작성한 뒤 코딩한다.
   - **Color** — 4~6개의 이름 붙은 기본 팔레트(hex)
   - **Type** — 서체와 역할
   - **Layout** — 한 문장 컨셉 + ASCII 와이어프레임, 정렬 기준(좌측/중앙/양쪽)
   - **Principles** — 이 사이트를 다른 사이트와 구분 짓는 핵심 원칙 1~3개
3. 계획을 **"어떤 비슷한 사이트에도 쓸 수 있는 기본값인가?"** 로 자체 검토하고, 그렇다면 수정한 뒤 이유를 한 줄로 남긴다.
4. **한 곳에만 대담해진다.** 기억에 남는 요소는 하나로 하고, 나머지는 조용하고 절제한다.

## 2. 디자인 토큰 (MUST)

모든 시각 값은 `/css/tokens.css`의 CSS 변수로만 정의하고, 컴포넌트에서는 **변수만 참조**한다. 하드코딩 값(`#333`, `13px`, `margin: 17px`) 금지.

### 2.1 색상

| 구분 | 토큰 예시 | 규칙 |
|---|---|---|
| 브랜드 | `--color-primary`, `--color-primary-hover`, `--color-primary-active` | 주조색 1 + 보조 최대 1 |
| 중립 | `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted` | 중립 스케일 9단계 이내 |
| 상태 | `--color-success/warning/danger/info` | 아이콘·텍스트와 함께 사용 (색만으로 전달 금지) |

- **역할 기반 네이밍**(`--color-text`)을 쓰고, 값 기반 네이밍(`--color-blue-500`)은 팔레트 원천에만 사용.
- 색 비율 **60(배경) : 30(보조/표면) : 10(강조)** 를 기본으로 한다. *(산리오 프로젝트는 캐릭터 고유 컬러와 산리오 고유의 화사하고 친근한 파스텔톤 컬러 시스템·화이트 베이스가 우선한다.)*
- **대비비(WCAG 2.2 AA)**: 본문 텍스트 ≥ **4.5:1**, 큰 텍스트(24px↑ 또는 18.66px↑ bold)와 UI 컴포넌트 경계 ≥ **3:1**.
- 순수 `#000` / `#fff` 남용 금지. 미세하게 틴트된 중립을 사용.
- 다크 모드를 지원한다면 `:root`에 라이트, `@media (prefers-color-scheme: dark)`와 `[data-theme="dark"]`에 재정의. 토큰 이름은 동일하게 유지.

### 2.2 타이포그래피

- 서체는 **최대 2종**(제목/본문). 2종이면 성격이 분명히 달라야 한다. 시스템 기본 서체를 습관적으로 선택하지 않는다. *(산리오 프로젝트: 깔끔한 가독성의 고딕/둥근 서체 계열 조합 적용)*
- **한글/일문 본문 기본**: 산리오 공식 웹사이트의 감성에 맞는 시스템 폴백 지정.
  ```css
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
               "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
  ```
- **타입 스케일**은 비율(1.200~1.333) 기준으로 토큰화한다. 임의 크기 금지.
- 본문 **최소 16px(1rem)**, 모바일 입력창 16px 이상(iOS 자동 확대 방지).
- 행간: 한글 본문 **1.6~1.8**, 제목 **1.2~1.35**. 자간: 한글 본문 `-0.01em ~ 0`, 제목은 약간 좁게.
- 행 길이: 영문 **45~75자**, 한글 **25~40자 내외**. 본문 컨테이너 `max-width: 65ch` 수준 유지.
- `word-break: keep-all; overflow-wrap: anywhere;` 로 한글 단어 단위 줄바꿈.
- 폰트 굵기는 **3단계 이내**(400/500/700 등)로 위계를 만든다.

### 2.3 간격·레이아웃

- **8pt 그리드**: 간격 토큰은 `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`px만 사용. *(산리오 프로젝트 특유의 여백과 카드 그리드에 맞추어 유연하게 적용하되 기본 8pt 그리드 체계를 준수한다.)*
- **근접성 원칙**: 관련 요소는 가깝게, 무관한 요소는 멀게. 내부 간격 < 외부 간격.
- 페이지 박스 구조(폭·패딩·마진·정렬)는 **산리오 공식 사이트 레이아웃 기준**을 따른다.
- 섹션 수직 리듬은 일정하게(예: 데스크톱 96~128px, 모바일 56~72px). 섹션마다 다른 값 금지.

### 2.4 형태·깊이

- `border-radius`는 토큰 3단계 이내(`--radius-sm/md/lg`). 캐릭터 카드 및 둥근 팝업 요소에 어울리는 친근한 곡률을 적극 활용한다.
- 그림자는 **고도(elevation) 3단계** 이내. 방향·색 일관(상단 광원 가정).
- 구분선·테두리·번호는 **정보를 전달할 때만** 사용.

### 2.5 모션

- 모션 토큰: `--duration-fast: 120ms; --duration-base: 200ms; --duration-slow: 320ms;` / `--ease-standard: cubic-bezier(.2,0,0,1);`
- **사용자 행동에 반응하는 모션**(캐릭터 호버, 메뉴 열림·닫힘 등)을 우선한다.
- `transform`, `opacity`만 애니메이션. **`prefers-reduced-motion: reduce` 대응 필수**.

---

# PART 2. DEVELOPER 규약

> **15년차 웹개발자의 기준**: 동작하는 코드가 아니라 **읽기 쉽고, 깨지지 않고, 바꾸기 쉬운** 코드를 쓴다.

## 1. HTML & 시맨틱 (MUST)

- `<html lang="ja">` 또는 프로젝트 요구 언어 설정. 페이지마다 **고유한 `<title>`/`description`**.
- 스크립트는 `type="module"`(자동 defer) 또는 `defer`. 인라인 이벤트 핸들러 금지.
- 랜드마크: `<header> <nav> <main> <aside> <footer>`. **`<main>`은 페이지당 1개**.
- 클릭 동작은 `<button>`, 이동은 `<a href>`. **`<div>`/`<span>`에 클릭 이벤트 부여 금지.**
- 외부 링크 `target="_blank"` 시 `rel="noopener noreferrer"` 필수.

## 2. CSS & 아키텍처 (MUST)

- **BEM 변형 네이밍**: `.block`, `.block__element`, `.block--modifier`. 상태는 `.is-open`, `.is-active`.
- **선택자 구체성 최소화**: `id` 선택자 금지, `!important` 금지, 3단계 이상 중첩 금지.
- **논리 속성 우선**: `margin-inline`, `padding-block`.
- `z-index`는 토큰 스케일 준수. 임의 `9999` 금지.
- **Hover**는 `@media (hover: hover)` 안에서만 처리.

## 3. JavaScript (MUST)

- **ES Modules** 사용, 전역 변수·전역 함수 금지. `"use strict"` 적용.
- `const` 기본, 재할당 필요 시 `let`, **`var` 금지**. `==` 금지(`===`만).
- 셀렉터는 `data-js` 속성 기준. 클래스·태그 구조에 의존하지 않는다.
- 상태는 **DOM이 아닌 변수/데이터 속성/ARIA**에서 단일 소스로 관리.

## 4. 보안 및 성능 (MUST)

- **`innerHTML`에 사용자 입력·외부 데이터 삽입 금지** → `textContent` / `createElement` 사용.
- 이미지: **AVIF/WebP + 적절한 크기 + `srcset`**. 첫 화면 외 `lazy` 적용.

---

# PART 3. SITE SPECIFIC — sanrio.co.jp

> **타깃**: https://www.sanrio.co.jp/ (산리오 공식 웹사이트)
> **원칙**: 산리오 공식 사이트의 아기자기하고 정돈된 비주얼 아이덴티티, 캐릭터 중심의 그리드 레이아웃, 직관적인 네비게이션 구조를 완벽히 재현한다.
> **효력**: PART 1·2와 충돌 시 PART 3 우선. 단, 접근성·보안 규정은 상위 효력을 유지한다.

## S1. 적용 원칙 및 디자인 특성

### S1.1 산리오 사이트 비주얼 특징
- **브랜드 아이덴티티**: 밝고 친근한 화이트/파스텔 기반 배경, 캐릭터별 포인트 컬러, 직관적이고 귀여운 카드형 UI 구성.
- **내비게이션 & 정보 구조**: 캐릭터(Characters), 굿즈(Goods), 뉴스(News), 샵(Shops) 등 팬들이 원하는 콘텐츠로 빠르게 접근할 수 있는 명확한 카테고리 칩 및 메뉴 바 제공.
- **반응형 대응**: 모바일 환경에서의 최적화된 터치 인터페이스와 PC 환경에서의 와이드 메가 메뉴·그리드 뷰 지원.

---

## S2. 레이아웃 규칙 — 박스 구조 (MUST, 최우선)

### S2.1 계층 구조
```
겉박스 (.outer-box)          ← header / main > section / footer
 └─ 속박스 (.inner-box)       ← max-width + 중앙 정렬
     └─ 파티션 박스 (.part-box) ← display:flex 또는 grid
         └─ 내용 박스          ← 컴포넌트
```
- **박스 깊이는 최대 4단계**(겉 > 속 > 파티션 > 내용).
- 클래스명은 `.outer-box`, `.inner-box`, `.part-box`로 **고정**한다.

### S2.2 겉박스 및 속박스 규격
- 속박스 `.inner-box`는 최대 너비(`max-width: 1440px` 등 콘텐츠 최적화 폭)를 유지하며 중앙 정렬한다.
- 섹션 간 세로 간격은 겉박스의 `padding-block`으로 제어하며, 불필요한 마진 충돌을 방지한다.

---

## S3. 산리오 스타일 토큰 (CSS Variables)

```css
:root {
  /* 색상 토큰 (산리오 감성의 파스텔 및 모노톤 베이스) */
  --color-bg: #ffffff;
  --color-surface: #fcfbfa;
  --color-surface-sub: #fff5f7; /* 연한 핑크 틴트 */
  --color-text: #333333;
  --color-text-muted: #666666;
  --color-border: #eaeaea;
  
  --color-primary: #e60012;     /* 산리오 레드 포인트 또는 브랜드 상징 컬러 */
  --color-primary-hover: #cc0010;
  
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-pill: 9999px;        /* 캐릭터 칩 및 버튼용 완전 둥근 형태 */
  
  --z-header: 100;
  --z-modal: 2000;
}
```

---

## S4. 주요 컴포넌트 규약

### S4.1 캐릭터 및 굿즈 카드 (`.sanrio-card`)
- 이미지 영역은 일정한 비율(`aspect-ratio`)을 유지하며, 호버 시 부드러운 확대(`scale`) 또는 서브 이미지 전환 효과를 적용한다.
- 카드 하단에 캐릭터명, 타이틀, 가격 등이 명확하게 읽히도록 `line-clamp` 및 적절한 행간을 부여한다.

### S4.2 네비게이션 및 캐릭터 칩 탭
- 상단 또는 서브 섹션에 위치한 카테고리/캐릭터 칩은 가로 스크롤(`overflow-x: auto`)을 지원하며, 활성화된 칩은 시각적으로 뚜렷하게 구분된다.

---

# PART 4. 최종 체크리스트 (완료 전 필수 통과)

- [ ] 모든 색·글자·간격·그림자·라운드가 **토큰**을 사용했는가?
- [ ] 텍스트 대비비(WCAG AA)를 준수했는가?
- [ ] 모바일 및 데스크톱 뷰포트에서 레이아웃 깨짐이나 가로 스크롤이 발생하지 않는가?
- [ ] 시맨틱 HTML 태그를 올바르게 사용하고 키보드 접근성(focus-visible 등)을 확보했는가?
- [ ] 콘솔 에러 및 미사용 코드가 없는가?