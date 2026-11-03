

# 🚀 산리오 공식 웹사이트 클론 프로젝트

## ⚠️ AI 에이전트 필수 실행 지침 (CRITICAL)

본 프로젝트는 AI 에이전트 기반의 자동화 개발 체계로 진행됩니다. 코드를 구현·수정·분석하기 전, **아래 절차를 엄격히 준수**하십시오.

### 1. 이전 작업 이력 확인 (`task-history/task.md`)

작업을 시작할 때 먼저 `task-history/task.md`를 읽어 현재 구현 상태, 완료된 작업, 남은 확인 사항을 파악하십시오. 이미 완료된 작업을 중복 수행하지 말고, 사용자의 새 요청 범위에 이어서 작업하십시오. 작업 완료 후에는 다음 세션이 연속해서 진행할 수 있도록 이력과 현재 상태를 업데이트하십시오.

* **작업 이력 경로**: `task-history/task.md`

### 2. 개발 규약 사전 로드 (`spec-kit/AGENTS.md`)

작업 이력 확인 후, 반드시 `spec-kit/AGENTS.md` 문서를 완독하고 요구되는 규칙을 이해한 뒤 작업을 실행하십시오.

* **규약 문서 경로**: `spec-kit/AGENTS.md`


* **규약 적용 우선순위**:

$$\text{접근성/보안} > \text{사용자 요구 명세} > \text{spec-kit/AGENTS.md} > \text{성능} > \text{기타 관습}$$


* **SITE SPECIFIC 우선 규칙**: `AGENTS.md` 내 **PART 3 (SITE SPECIFIC)** 은 산리오 사이트(`[https://www.sanrio.co.jp/](https://www.sanrio.co.jp/)`) 전용 규약으로 PART 1·2의 일반 규칙보다 최우선 적용됩니다.



---

## 📋 개발 시작 시 체크리스트

AI 에이전트는 코드 작성 전 다음 핵심 준수사항을 확인해야 합니다.

1. `task-history/task.md`를 읽고 기존 작업 내용과 현재 상태를 확인합니다.


2. `spec-kit/AGENTS.md`를 읽고 프로젝트 개발 규약을 확인합니다.


3. **프로젝트 구조 준수 (HTML5 / CSS3 / Vanilla JS)**


* 프레임워크나 external CDN/라이브러리를 임의로 추가하지 않습니다.


* CSS 모듈화 및 적용 순서: `tokens.css` → `base.css` → `layout.css` → `components/*.css` → `utilities.css`




4. **레이아웃 계층구조 고정 (최대 4단계)**


* `겉박스 (.outer-box)` > `속박스 (.inner-box)` > `파티션 박스 (.part-box)` > `내용 박스` 계층을 엄격히 유지합니다.


* 클래스명 동의어(`.container`, `.wrapper`, `.row` 등) 사용 금지.




5. **디자인 토큰 사용 (`/css/tokens.css`)**


* 색상, 폰트, radius, 간격 값 등에 픽셀/색상 코드 하드코딩을 전면 금지하며 항상 변수를 참조합니다.




6. **시맨틱 마크업 및 접근성 (WCAG 2.2 AA)**


* `<div>`/`<span>`에 클릭 이벤트를 직접 부여하지 않고 `<button>` 또는 `<a>`를 사용합니다.


* 텍스트 대비비 4.5:1 이상 및 포커스 링(`:focus-visible`) 표시 준수.





---

## 🛠️ 시작 커맨드 예시 (Prompt Instruction for Agents)

AI 작업 세션 시작 시 에이전트에게 전달할 프롬프트 예시:

> *"README.md, task-history/task.md, spec-kit/AGENTS.md를 확인했습니다. 기존 작업과 중복되지 않도록 산리오 구현 타깃 사이트 규정에 맞추어 [작업할 컴포넌트/페이지명] 개발을 진행하세요."*
> 
>