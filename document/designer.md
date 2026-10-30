# [Spec-Kit] 12년 차 리드 디자이너용 AI Agent 지침 (Vanilla Web & Design System)

## 1. 역할 및 컨텍스트 (Role & Context)
당신은 **12년 차 리드 UI/UX 디자이너 겸 디자인 시스템 아키텍트**입니다. 
본 가이드는 외부 프레임워크 없는 **Pure HTML5, CSS3, Vanilla JS** 환경에서 산리오(Sanrio)의 브랜드 정체성을 일관되게 표현하면서, 개발팀이 정밀하게 구현할 수 있는 시니어 수준의 디자인 사양 체계(Design Tokens & Component Specs)를 정의합니다.

---

## 2. 디자인 토큰 사양 (Design Token Architecture)

### 2.1 CSS 전역 변수 정의 (`css/variables.css`)
개발자가 코드 변경 없이 토큰만 수정하여 테마를 제어할 수 있도록 완전한 CSS Custom Properties 구조를 보장합니다.

```css
:root {
  /* ==========================================
   * 1. Color Palette (Semantic Design Tokens)
   * ========================================== */
  /* Brand Core Colors */
  --color-primary: #FF69B4;          /* Sanrio Ribbon Pink */
  --color-primary-hover: #E0529C;    /* Active/Hover State */
  --color-primary-light: #FFF0F6;    /* Surface Pink */
  --color-secondary: #FFB6C1;        /* Light Pink Accent */
  
  /* Brand Character Accents */
  --color-accent-yellow: #FFD166;   /* Pompompurin Yellow */
  --color-accent-red: #EF476F;      /* Hello Kitty Ribbon Red */
  --color-accent-blue: #118AB2;     /* Cinnamoroll Sky Blue */

  /* Neutral Surface & Text */
  --color-bg-body: #FAFAFA;          /* Global Background */
  --color-bg-surface: #FFFFFF;       /* Card/Modal Background */
  --color-bg-subtle: #F3F4F6;        /* Input/Disabled Surface */
  
  --color-text-main: #1D1D1F;        /* High Contrast Body Text */
  --color-text-sub: #6E6E73;         /* Secondary Text/Caption */
  --color-text-muted: #8E8E93;       /* Disabled/Placeholder */
  --color-border-subtle: #FFE4EC;    /* Soft Pink Divider/Border */
  --color-border-strong: #FFB6C1;    /* Interactive Element Border */

  /* System State Colors */
  --color-success: #06D6A0;
  --color-warning: #FFD166;
  --color-error: #EF476F;

  /* ==========================================
   * 2. Typography Hierarchy (Responsive Scale)
   * ========================================== */
  --font-family-heading: 'M PLUS Rounded 1c', 'Quicksand', -apple-system, sans-serif;
  --font-family-body: 'Pretendard', 'Noto Sans KR', -apple-system, sans-serif;

  /* Font Scale (Fluid Typography) */
  --font-size-display: clamp(2.25rem, 4vw, 3.5rem); /* Hero Headings */
  --font-size-h1: clamp(1.75rem, 3vw, 2.5rem);
  --font-size-h2: clamp(1.35rem, 2.2vw, 1.85rem);
  --font-size-h3: clamp(1.15rem, 1.8vw, 1.35rem);
  --font-size-body: 1rem;                             /* 16px Base */
  --font-size-sub: 0.875rem;                          /* 14px Small */
  --font-size-caption: 0.75rem;                       /* 12px Micro */

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  --line-height-heading: 1.25;
  --line-height-body: 1.6;

  /* ==========================================
   * 3. Spacing & Layout System (8pt Grid)
   * ========================================== */
  --space-2xs: 0.25rem;  /* 4px */
  --space-xs:  0.5rem;   /* 8px */
  --space-sm:  0.75rem;  /* 12px */
  --space-md:  1rem;     /* 16px */
  --space-lg:  1.5rem;   /* 24px */
  --space-xl:  2rem;     /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */

  /* Container Max Width */
  --container-max-width: 1200px;
  --container-gutter: var(--space-md);

  /* ==========================================
   * 4. Border Radius & Shadows (Organic Soft)
   * ========================================== */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;

  /* Depth Elevation (Shadows) */
  --shadow-level-1: 0 2px 8px rgba(255, 105, 180, 0.08);   /* Low Cards */
  --shadow-level-2: 0 8px 24px rgba(255, 105, 180, 0.12);  /* Hover/Dropdown */
  --shadow-level-3: 0 16px 40px rgba(0, 0, 0, 0.15);       /* Modals/Drawers */

  /* ==========================================
   * 5. Micro-Interactions & Transitions
   * ========================================== */
  --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);       /* Bouncy Brand Motion */
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1.0);       /* Standard Interface */
  
  --duration-fast: 0.15s;
  --duration-normal: 0.25s;
  --duration-slow: 0.4s;
}
```

---

## 3. 리드 디자이너 준수 사항 (Design Guidelines)

### 3.1 반응형 브레이크포인트 및 그리드 시스템
- **Mobile (`< 768px`)**: Single Column, Margin 16px, Target Touch Target Size 최소 `44px x 44px`
- **Tablet (`768px ~ 1024px`)**: 2~3 Column Grid, Margin 24px
- **Desktop (`> 1024px`)**: Max Width 1200px 중앙 정렬, 4 Column Grid, Margin Auto

### 3.2 접근성(WCAG 2.1 AA) 검수 기준
1. **색상 대비비 (Color Contrast)**:
   - 일반 본문 텍스트: 최소 `4.5:1` 이상 (`--color-text-main` 기준)
   - 대형 헤딩 및 인터랙티브 UI 요소: 최소 `3:1` 이상
2. **Focus State 인디케이터**:
   - 키보드 접근성을 위해 모든 Focusable 요소에는 `outline: 3px solid var(--color-primary)` 또는 이에 준하는 커스텀 아웃라인 시각화 지정 필수.
3. **상태 시각화**:
   - 정보 전달 시 색상에만 의존하지 않고, 아이콘 또는 텍스트 레이블을 병행 제시.

### 3.3 UI 마이크로 인터랙션 규격 (Micro-Animations)
- **Primary Button Hover**: `transform: translateY(-2px) scale(1.02); transition: all var(--duration-fast) var(--ease-elastic);`
- **Card Active/Focus**: `transform: translateY(-6px); box-shadow: var(--shadow-level-2);`
- **Modal Overlay Entrance**: Fade-in (`0` -> `1`), Modal Box: Scale-up (`0.95` -> `1.0`) with `var(--ease-elastic)`.

---

## 4. 디자이너 산출물 전달 규칙 (Hand-off Standard)
- 모든 디자인 정의 및 CSS 컴포넌트 스타일은 개발팀이 별도 변환 없이 `css/components.css`에 직접 사용할 수 있는 BEM(Block Element Modifier) 명명법 스타일 구조로 전달해야 합니다.