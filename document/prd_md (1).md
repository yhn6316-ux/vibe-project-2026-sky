# [프론트엔드 PRD] 산리오 프론트엔드 개발 명세서

## 1. 기술 스택 (Tech Stack Specification)
- **프레임워크**: Next.js 14+ (앱 라우터)
- **프로그래밍 언어**: TypeScript (엄격 모드)
- **스타일링**: Tailwind CSS, Framer Motion (애니메이션), Shadcn UI (기본 컴포넌트)
- **상태 관리**:
  - 클라이언트 상태: Zustand (전역 UI, 모달, 사용자 세션 등)
  - 서버 상태: TanStack Query v5 (React Query)
- **아이콘 및 자산**: Lucide React, Next Image Optimization (이미지 최적화)

---

## 2. 디렉토리 및 컴포넌트 구조 (Directory Architecture)
```text
src/
├── app/                  # Next.js 앱 라우터
│   ├── (home)/           # 메인 페이지
│   ├── characters/       # 캐릭터 목록 및 [id] 상세
│   ├── news/             # 뉴스 목록 및 [id] 상세
│   └── shops/            # 매장 찾기
├── components/
│   ├── ui/               # 기본 UI 컴포넌트 (버튼, 카드, 입력창, 모달 등)
│   ├── layout/           # 헤더, 네비게이션, 푸터, 전역 배너
│   └── features/         # 비즈니스 로직 결합 컴포넌트 (캐릭터 그리드, 매장 지도 등)
├── hooks/                # 사용자 정의 훅 (useDebounce, useGeoLocation 등)
├── stores/               # Zustand 전역 상태 (useFilterStore, useThemeStore 등)
└── types/                # TypeScript 타입 및 인터페이스
```

---

## 3. 화면별 프론트엔드 세부 구현 요구사항

### 3.1 전역 헤더 및 네비게이션 (GNB)
- **데스크톱**: 마우스 호버 시 딜레이(200ms)가 적용된 드롭다운 메뉴, 고정형(Sticky) 헤더
- **모바일**: 슬라이드아웃 햄버거 메뉴, 하단 빠른 네비게이션
- **상태 관리**: 현재 선택된 언어 및 테마 모드 유지

### 3.2 캐릭터 그리드 및 필터 (Character Catalog UI)
- **무한 스크롤 / 가상화**: 캐릭터 수가 많을 경우 `@tanstack/react-virtual` 적용
- **상호작용**:
  - 캐릭터 카드 마우스 호버 시 통통 튀는 크기 조절 효과 (`hover:scale-105 transition-transform`)
  - 필터 변경 시 스켈레톤 UI 및 로딩 표시기 표출

### 3.3 캐릭터 상세 페이지 (Character Detail UI)
- **Next.js 정적 사이트 생성(SSG) / 정적 재생성(ISR)**: 동적 라우트 `app/characters/[id]/page.tsx`
- **배경화면 다운로드**: Canvas 또는 파일 저장 Blob 기반 모달 UI

---

## 4. 애니메이션 및 사용자 경험(UX) 표준
- **스프링 애니메이션**: 산리오 브랜드 특성에 어울리는 통통 튀는 모션 적용 (`framer-motion` spring transition)
- **이미지 최적화**: 모든 캐릭터 이미지는 Next.js `<Image />` 사용 (`priority`, `sizes`, `placeholder="blur"` 설정)