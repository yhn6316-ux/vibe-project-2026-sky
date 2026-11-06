# 작업 이력 및 다음 작업 안내

## 현재 구현 상태

- `index.html`에 산리오 일본어 홈페이지의 반응형 랜딩 페이지를 구성했다.
- Vanilla HTML/CSS/JavaScript를 사용하며 별도 프레임워크나 외부 CDN은 사용하지 않는다.
- CSS 모듈 순서는 tokens → base → layout → components → utilities로 유지한다.
- 데스크톱에는 고정 헤더, 카테고리 내비게이션, 우측 퀵 메뉴와 중앙 슬라이드 양옆이 보이는 캐러셀이 있다.
- 모바일(768px 이하)에서는 전용 헤더, 단일 슬라이드 캐러셀, 세로형 중요 공지와 전체 메뉴 오버레이를 사용한다.
- 이미지 및 아이콘은 `images/used` 에셋을 우선 재사용한다.
- `Characters` 섹션은 이전 사용자 요청으로 삭제된 상태이며 복원하지 않는다.

## 2026-11-06 작업 기록

### Goods (굿즈) 섹션 세부 디자인 고도화
- **Goods 섹션 헤더 및 아이콘/텍스트 스타일 조정**:
  - `goods-section__gift-icon`: 크기를 `38x44px`로 조정하고, 전용 CSS filter를 적용하여 `#71C6D6` 민트블루 색상으로 정확히 렌더링.
  - `goods-heading` (`.goods-section__title`): 글자 크기 `52px`, 색상 `#E383A8`로 변경.
  - `goods-section__subtitle`: 글자 크기 `17px`, 색상 `#a2a2a2`로 변경.
- **Goods 카드 (`.goods-cards`) 스타일 개선**:
  - `goods-cards`의 `gap`을 `6.5rem`으로 넓혀 카드 간의 가독성과 여백 확보.
  - 카드 썸네일 우측 상단 NEW 뱃지를 `images/used/apple.svg`로 교체하고, 크기 `59x59px`, 이미지 위로 겹쳐 돋보이도록 위치 조정.
  - `goods-card__title`: 위아래 간격을 `0.6rem 0 1rem`으로 넓히고, 폰트 굵기를 `500` (Medium)으로 변경.
  - `goods-card__category`: 글자 크기 `12px`, 모서리 둥글기 `6px`, 좌우 패딩 여백 `0.8rem`으로 조정.
  - `goods-card__date`: 글자 크기 `14px`, 색상 `#777` (`#777777`)로 변경.
- **Goods TOP 버튼 간격 조정**:
  - `goods-section__top-link`: 위쪽 요소(카드 목록)와의 거리를 넓히기 위해 `margin-top: 3.5rem` 적용.
- **Goods 랭킹 (`.goods-ranking`) 스타일 개선**:
  - 랭킹 뱃지 아이콘: `ranking1.svg`로 교체, 크기 `50x54px`, 이미지 위로 오버랩되도록 배치.
  - 1위, 2위, 3위 순서대로 전용 색상 적용: 1위 `#DBCF81`, 2위 `#D6D4C7`, 3위 `#F2AF90`.
  - 뱃지 중앙에 순위 번호(1, 2, 3) 텍스트를 배치하고, 아이콘 비율에 맞게 살짝 왼쪽 아래로 위치 미세 조정 (`transform: translate(-3px, 3px)`).
  - `goods-ranking__item-title`: 이미지 너비와 동일하게 `width: 162px`를 부여하여 텍스트 정렬 정리 및 굵기를 `500` (Medium)으로 변경.
  - `goods-ranking__image`: 모서리 둥글기 `border-radius: 14px` 적용.
  - `goods-ranking__header` 양옆 점선: 색상을 `#888` (`#888888`)로 변경.
  - `goods-ranking__btn` 내부 아이콘 크기 순서대로 재조정:
    - 쇼핑백 아이콘: `30px`
    - 외부링크 아이콘: `14px`
    - 우측 화살표 원형 아이콘: `18px`

### News Panel (중요 안내) 스타일 개선
- `news-heading`: 글자 크기 `14px`, 색상 `#E383A8`로 변경.
- `news-panel__more`: 글자 크기 `11px`, 색상 `#71C6D6`로 변경.
- `news-panel__more-arrow`: `#71C6D6` 원형 배경 안에 흰색 `#fff` 화살표가 들어가도록 스타일링.
- `news-heading`과 `news-panel__more` 간격(`gap: 0.75rem`) 확대 및 `news-panel__heading` 왼쪽 여백(`padding-inline-start: 1rem`) 추가.
- `news-panel__list`: 날짜 폰트 `11px`, 색상 `#a2a2a2`로 변경, 공지 본문 내용 텍스트 굵기 볼드 제거 (`font-weight: normal`).

### Firebase 기반 로그인 / 회원가입 및 관리자 권한 제어 기능 구현
- **Firebase Firestore 연동 인증 서비스 구축 (`js/services/authService.js`)**:
  - 회원가입 정보: `이름`, `아이디`, `비밀번호`, `이메일` 입력 및 저장.
  - 아이디 중복 체크 (`checkUserIdAvailable`) 및 이메일 중복 체크 (`checkEmailAvailable`) 구현.
  - 기본 관리자 계정 Firestore 자동 초기화/등록:
    - 이름: 관리자 / 아이디: `admin` / 비밀번호: `1111` / 이메일: `admin.com@company.co.kr`
  - 로그인/로그아웃 세션 관리 및 커스텀 이벤트(`sanrio:authChange`)를 통한 실시간 상태 동기화.
- **로그인 / 회원가입 통합 화면 구현 (`pages/login.html`, `js/login.js`, `css/components/auth.css`)**:
  - 공지사항(Notice) 화면과 동일한 산리오 파스텔 핑크 테마, 구름 배너, 리본 데코레이션 적용.
  - 화면 상단: 로그인 폼 + 관리자 계정 안내 및 자동입력 버튼.
  - 화면 하단: 리본 구분선 밑 회원가입 폼 (실시간 유효성 검사 및 중복확인).
- **공통 헤더 및 내비게이션 로그인 상태 연동 (`js/authUi.js`)**:
  - 로그인 시: 상단에 `🎀 [이름]님 환영합니다` (관리자는 `ADMIN` 뱃지 포함) 상태 표시.
  - 로그인 버튼이 `로그아웃` 버튼으로 동적 전환되며, 클릭 시 세션 클리어 지원.
  - 데스크톱 및 모바일 헤더, 퀵 메뉴(Quick Links) 모두 양방향 연동.
- **공지사항(Notice) 관리자(admin) 전용 권한 제어 (`pages/notices.html`, `js/notices.js`)**:
  - 글쓰기(`新規投稿`): `admin` 로그인 시에만 노출.
  - 상세 화면의 수정(`✎ 編集する`) 및 삭제(`🗑 削除する`): `admin` 로그인 시에만 노출 및 삭제 로직 연동.
  - 일반 사용자 또는 비로그인 상태에서 작성/수정 URL 직접 접근 차단 및 리다이렉트 처리.

### Header Navigation 아이템 정중앙 정렬 (`site-nav__link`)
- 사용자의 `site-nav__link 안의 요소를 해당 박스의 정중앙에 위치하도록` 요청 반영:
  - `css/components/header.css`:
    - `.site-nav__link`에 `flex: 1 1 0; display: inline-flex; justify-content: center; align-items: center;`를 적용하여 94px 높이의 primary navigation 내에서 각 아이템 박스가 균등하게 공간을 차지하고, 내부 아이콘 및 텍스트 요소가 해당 박스의 정중앙에 배치되도록 수정.

### Plus (Sanrio+) 섹션 - News 섹션 하단에 신규 구현 (데스크톱 및 모바일 1:1 완벽 반영)
- 사용자의 `news 섹션 아래에 plus섹션을 만들거야. 첨부한 이미지대로 그대로 구현해줘. 이미지는 순서대로 데스크탑, 모바일 화면이야. 사용할 이미지는 sanrio-dt_56, sanrio-dt_32, sanrio-dt_36, sanrio-dt_61, sanrio-dt_67, sanrio-dt_10야. 첨부한 이미지를 그대로 분석해서 구현하고 언급하지 않은 기능은 넣지마. 이미지들이 화면 비율에 맞게 크기가 변하도록하고 미디어쿼리에 반응하도록 구현해줘.` 요청 반영:
  - `css/components/plus.css` 신규 생성 및 `css/main.css`에 `@import url("./components/plus.css");` 등록:
    - 섹션 상단: 완만하고 부드러운 아치형 연청록(#f0f9fa) 배경 (`border-radius: 50% 50% 0 0 / 120px 120px 0 0;`).
    - 헤더: `sanrio-dt_56.png` (Sanrio+ 로고) 및 회원 서비스 소개 텍스트 배치.
    - 뉴스 카드 3종:
      - 카드 1: `sanrio-dt_32.jpg` + 하늘색 사과 NEW 뱃지 + 타이틀 15px + 태그 `Sanrio+` (민트 배경, 둥근 모서리) + 날짜 14px.
      - 카드 2: `sanrio-dt_36.jpg` + 타이틀 15px + 태그 `Sanrio+` + 날짜 14px.
      - 카드 3: `sanrio-dt_61.jpg` + 타이틀 15px + 태그 `Sanrio+` + 날짜 14px.
    - 액션 버튼 2종:
      - `会員登録 ↗` (핑크 타원형 버튼 + 외부 링크 SVG 아이콘)
      - `Sanrio+ TOP ➜` (민트 타원형 버튼 + 우측 원형 화살표)
    - 하단 배너 2종:
      - 대형 특전 배너: `sanrio-dt_67.png` (둥근 모서리, 비율 유지).
      - 스태프 모집 배너: `sanrio-dt_10.jpg` (둥근 모서리, 비율 유지).
    - 미디어 쿼리: 데스크톱 가로 3열 배치에서 모바일(768px 이하) 1열 세로 스택으로 전환되며, 이미지 및 배너가 화면 폭에 맞추어 유연하게 크기 조절되도록 구현.

### News 섹션 - Spots 섹션 하단에 신규 뉴스 섹션 구현 (데스크톱 및 모바일 1:1 완벽 반영)
- 사용자의 `spots 섹션 아래에 news섹션을 만들거야. 첨부한 이미지대로 그대로 구현해줘. 이미지는 순서대로 데스크탑, 모바일 화면이야. 사용할 이미지는 sanrio-dt_31, sanrio-dt_11, sanrio-dt_57야. 첨부한 이미지를 그대로 분석해서 구현하고 언급하지 않은 기능은 넣지마. 이미지들이 화면 비율에 맞게 크기가 변하도록하고 미디어쿼리에 반응하도록 구현해줘.` 요청 반영:
  - `css/components/latest-news.css` 파일 신규 생성 및 `css/main.css`에 `@import url("./components/latest-news.css");` 등록:
    - 상단 섹션 타이틀: 뉴스페이퍼 SVG 아이콘 + `News` (#ea7070) + `ニュース`.
    - 배경 장식: 데스크톱 우측 상단 대형 핑크 원형 배경(`radial-gradient`), 좌측 상단 폼폼푸린 라인 아트(`sanrio-dt_65.png`).
    - 뉴스 카드 3종 (`sanrio-dt_31.jpg`, `sanrio-dt_11.jpg`, `sanrio-dt_57.jpg`):
      - 1번 카드 우측 상단 붉은 사과 `NEW` 뱃지 적용.
      - 타이틀 15px 볼드, 태그 `キャンペーン` (분홍 배경에 둥근 사각 `border-radius: 4px`), 날짜 14px.
      - 화면 비율에 맞게 크기가 변하도록 aspect-ratio 및 `object-fit: cover` 적용.
    - 하단 버튼: `ニュース TOP` 타원형 버튼 (#ea7070) 및 우측 원형 화살표 `➜`, 좌측 하단 캐릭터 꼬리 라인 아트(`sanrio-dt_66.png`) 배치.
    - 모바일(768px 이하) 및 태블릿(1120px 이하) 반응형 미디어 쿼리 완벽 대응 (모바일 시 1열 세로 스택 카드 배치).

### Digital & Spots 섹션 - 뱃지 및 태그 모서리 둥근 네모(border-radius: 4px)로 변경
- 사용자의 `digital-comm-item__badge, digital-news-card__tag, spots-news-card__tag 박스 모서리 둥근 네모로 변경.` 요청 반영:
  - `css/components/digital.css`:
    - `.digital-comm-item__badge`: `border-radius: 4px;` 적용 (기존 pill 형태에서 둥근 사각형으로 변경).
    - `.digital-news-card__tag`: `border-radius: 4px;` 적용.
  - `css/components/spots.css`:
    - `.spots-news-card__tag`: `border-radius: 4px;` 적용.

### Spots (스팟) 섹션 - spots-news-cards 호버 확대 및 텍스트 #F08080, 타이틀 15px #777, 날짜 14px 적용
- 사용자의 `spots-news-cards 이구역의 이미지나 텍스트에 마우스 호버시 이미지 확대 & 텍스트 #F08080로 변경. 타이틀 텍스트 15px #777로 변경. 날짜 텍스트는 14px로 변경.` 요청 반영:
  - `index.html`:
    - `.spots-news-card__thumb-wrap` 내부에 `.spots-news-card__img-box` 래퍼를 감싸 이미지는 내부에서 확대(`overflow: hidden`)되고 우측 상단 NEW 사과 뱃지는 가려지지 않도록 구조 정리.
  - `css/components/spots.css`:
    - `.spots-news-card__img-box`: `border-radius: 14px; overflow: hidden;` 설정.
    - `.spots-news-card__image`: `transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);` 추가.
    - `.spots-news-card__title`: 글자 크기 `15px`, 색상 `#777777`, `transition: color 0.25s ease;` 적용 (모바일 반응형 타이틀 크기도 15px로 동기화).
    - `.spots-news-card__date`: 글자 크기 `14px` 적용.
    - `@media (hover: hover)`:
      - `.spots-news-card:hover .spots-news-card__image`, `.spots-news-card__link:hover .spots-news-card__image`: `transform: scale(1.08);` (이미지 박스 내부에서 확대).
      - `.spots-news-card:hover .spots-news-card__title`, `.spots-news-card__link:hover .spots-news-card__title`: `color: #F08080;` (타이틀 텍스트 색상 전환).

### Spots (스팟) 섹션 - spots-arch-card 외부 링크 아이콘 크기 확대 재반영 (12px -> 18px)
- 사용자의 `'사용된 아이콘 크기 키우기' 다시 구현` 요청 반영:
  - `index.html`: `.spots-arch-card__ext-icon` SVG의 인라인 속성을 `width="18" height="18"`로 확대.
  - `css/components/spots.css`: `.spots-arch-card__ext-icon`의 CSS 크기를 `width: 18px !important; height: 18px !important; margin-left: 4px;`로 명확히 키워 가시성을 확보.

### Spots (스팟) 섹션 - spots-main-grid 테두리 확대, 타이틀 15px #777, 아이콘 확대 및 #72cf9d, 호버 확대 & 텍스트 #F08080 적용
- 사용자의 `spots-main-grid 이미지 테두리 두껍게 수정. 타이틀 텍스트 15px #777로 변경. 끝에 사용된 아이콘 크기 키우기 & #72cf9d로 변경. 이미지나 텍스트에 마우스 호버시 이미지 확대& 텍스트 #F08080로 변경.` 요청 반영:
  - `css/components/spots.css`:
    - `.spots-arch-card__thumb-wrap`: 테두리 두께를 기존 `4px`에서 `6px`(`border: 6px solid #bcead1;`)로 두껍게 수정.
    - `.spots-arch-card__image`: `transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);` 추가.
    - `.spots-arch-card__title`: 글자 크기 `15px`, 글자색 `#777777`, `transition: color 0.25s ease;` 적용.
    - `.spots-arch-card__ext-icon`: 크기 `15px x 15px`로 확대 및 색상 `#72cf9d` 설정.
    - `@media (hover: hover)`:
      - `.spots-arch-card:hover .spots-arch-card__image`, `.spots-arch-card__link:hover .spots-arch-card__image`: `transform: scale(1.08);` 적용 (이미지 박스 내부에서 부드럽게 확대).
      - `.spots-arch-card:hover .spots-arch-card__title`, `.spots-arch-card__link:hover .spots-arch-card__title`: `color: #F08080;` 적용 (마우스 호버 시 텍스트 코랄 핑크 색상 전환).

### Spots (스팟) 섹션 - spots-main-grid 카드 순서 재배치
- 사용자의 `spots-main-grid 이미지 순서 변경 1 -> 2, 2 -> 4, 3 -> 1, 4 -> 3` 요청 반영:
  - `index.html`:
    - 기존 3번째 카드(`sanrio-dt_70.jpg` / サンリオカフェ＆ サンリオカフェワゴン) -> **1번째 카드**로 이동
    - 기존 1번째 카드(`sanrio-dt_68.jpg` / サンリオピューロランド) -> **2번째 카드**로 이동
    - 기존 4번째 카드(`sanrio-dt_71.jpg` / サンリオキャラクター ホテル＆カフェ ガイド) -> **3번째 카드**로 이동
    - 기존 2번째 카드(`sanrio-dt_69.jpg` / サンリオキャラクターパーク ハーモニーランド) -> **4번째 카드**로 이동

### Digital (디지털) 섹션 - digital-news-cards 호버 확대 및 텍스트 #68bfd0, 타이틀 15px #777, 날짜 14px 적용
- 사용자의 `digital-news-cards 이미지와 텍스트에 마우스 호버시 이미지 박스 확대 & 텍스트 색 #68bfd0로 변경. 타이틀 크기 15px #777로 변경.  날짜 텍스트는 14px로 변경` 요청 반영:
  - `css/components/digital.css`:
    - `.digital-news-card__thumb-wrap`: 기존 `overflow: hidden;` 유지.
    - `.digital-news-card__image`: `transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);` 추가.
    - `.digital-news-card__title`: `font-size: 15px; color: #777777; transition: color 0.25s ease;` 적용. (모바일 미디어 쿼리 포함 15px 일치)
    - `.digital-news-card__date`: `font-size: 14px;` 적용.
    - `@media (hover: hover)`:
      - `.digital-news-card:hover .digital-news-card__image`, `.digital-news-card__link:hover .digital-news-card__image`: `transform: scale(1.08);` (썸네일 박스 내부 확대).
      - `.digital-news-card:hover .digital-news-card__title`, `.digital-news-card__link:hover .digital-news-card__title`: `color: #68bfd0;` (타이틀 텍스트 색상 변경).

### Digital (디지털) 섹션 - digital-wallpaper 호버 이미지 교체 제거 및 흰색 딤드(dimmed) 효과 적용
- 사용자의 `digital-wallpaper 마우스 호버시 이미지 바뀌는거 삭제하고, 흰색으로 딤드처리 되게 수정.` 요청 반영:
  - `index.html`:
    - `.digital-wallpaper`: 이전에 추가했던 두 번째 이미지(`sanrio-dt_14.jpg`)를 제거하고 기본 단일 이미지(`sanrio-dt_13.jpg`) 구조로 복원.
  - `css/components/digital.css`:
    - `.digital-wallpaper__card::after` 가상 요소를 생성하여 `background-color: #ffffff; opacity: 0; transition: opacity 0.25s ease;` 설정.
    - `@media (hover: hover)` 내 `.digital-wallpaper__card:hover::after`에 `opacity: 0.35;`를 부여하여 호버 시 은은하고 부드러운 흰색 딤드(dimmed/overlay) 오버레이 효과 적용.
    - 불필요해진 크로스페이드 이미지 전환 스타일 삭제.

### Digital (디지털) 섹션 - digital-comm-grid 이미지 호버 확대 & digital-wallpaper 버튼 삭제 및 호버 시 sanrio-dt_14 전환
- 사용자의 `digital-comm-grid에 쓰인 이미지들에 마우스 호버시 이미지 자체가 확대되도록. digital-wallpaper의 이미지 안에 있는 버튼 삭제 & 마우스 호버시 sanrio-dt_14로 변경.` 요청 반영:
  - `index.html`:
    - `.digital-wallpaper`: 내부 버튼 태그(`.digital-wallpaper__btn`)를 삭제하고, 기본 배경 이미지(`sanrio-dt_13.jpg`)와 호버 전환용 배경 이미지(`sanrio-dt_14.jpg`)를 나란히 배치.
  - `css/components/digital.css`:
    - `.digital-comm-item--theme .digital-comm-item__image`, `.digital-comm-item--stamp .digital-comm-item__image`: `transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);` 속성 추가.
    - 호버 인터랙션 추가: `@media (hover: hover)` 내 `.digital-comm-item:hover .digital-comm-item__image`, `.digital-comm-item__link:hover .digital-comm-item__image`에 `transform: scale(1.08);`을 적용하여 마우스 호버 시 이미지 자체가 확대되도록 설정.
    - `.digital-wallpaper__bg--default`, `.digital-wallpaper__bg--hover`: 기본 상태에서는 `dt_13` 노출 (`opacity: 1`), `dt_14` 숨김 (`opacity: 0`), 호버 시 `transition: opacity 0.3s ease;`를 통해 부드럽게 `sanrio-dt_14.jpg`로 전환.
    - `.digital-wallpaper__btn`: 버튼 요소 삭제 및 잔여 스타일 숨김 처리.

### Digital (디지털) 섹션 - digital-web-cards 호버 확대 및 색상 변경 (#68bfd0, 아이콘 #ebb535 -> #68bfd0 & 크기 확대)
- 사용자의 `digital-web-cards 해당구역 마우스 호버시 이미지 박스 안에서 확대, 글자색 #68bfd0으로 변경. 타이틀 텍스트 끝에 쓰인 아이콘 처음엔 #ebb535이였다가 호버시 #68bfd0으로 변경 & 아이콘 크기 키워줘.` 요청 반영:
  - `css/components/digital.css`:
    - `.digital-web-card__image`: `transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);` 추가 (`.digital-web-card__thumb-wrap`의 `overflow: hidden;` 내부에서 부드럽게 확대).
    - `.digital-web-card__title`: `transition: color 0.25s ease;` 추가.
    - `.digital-web-card__ext-icon`: 크기 `15px x 15px`로 확대, 초기 색상 `#ebb535` 적용, `transition: color 0.25s ease, transform 0.25s ease;` 설정.
    - `@media (hover: hover)`:
      - `.digital-web-card:hover .digital-web-card__image`, `.digital-web-card__link:hover .digital-web-card__image`: `transform: scale(1.08);` (박스 안에서 1.08배 확대).
      - `.digital-web-card:hover .digital-web-card__title`, `.digital-web-card__link:hover .digital-web-card__title`: `color: #68bfd0;` (타이틀 텍스트 색상 변경).
      - `.digital-web-card:hover .digital-web-card__ext-icon`, `.digital-web-card__link:hover .digital-web-card__ext-icon`: `color: #68bfd0;` (외부 링크 아이콘 색상 변경).

### Digital (디지털) 섹션 - digital-apps 호버 인터랙션 (타이틀 #68bfd0, 이미지 테두리 4px #68bfd0) 추가
- 사용자의 `digital-apps 해당구역 타이틀텍스트랑 이미지에 마우스 호버 시 텍스트 색 #68bfd0으로 변경. 이미지는 테두리 #68bfd0 색으로 두껍게 생성.` 요청 반영:
  - `css/components/digital.css`:
    - `.digital-app-item__icon`: `box-sizing: border-box; border: 4px solid transparent; transition: border-color 0.25s ease, box-shadow 0.25s ease;` 설정.
    - `.digital-app-item__name`: `transition: color 0.25s ease;` 설정.
    - `@media (hover: hover)`:
      - `.digital-app-item:hover .digital-app-item__icon`: `border-color: #68bfd0;` (4px 두께의 민트 테두리 생성).
      - `.digital-app-item:hover .digital-app-item__name`: `color: #68bfd0;` (타이틀 텍스트 색상 전환).

## 2026-11-05 작업 기록

### Goods (굿즈) 섹션 - 랭킹 링크 외부 아이콘 색상 (#f49cc2 -> 호버 시 #68bfd0) 적용
- 사용자의 `goods-ranking__grid 타이틀 마지막에 사용된 링크 아이콘 처음엔 #f49cc2이였다가 호버시 #68bfd0로 변경` 요청 반영:
  - `css/components/goods.css`:
    - `.goods-ranking__external-icon`: 기본 색상을 `#f49cc2`로 설정하고 부드러운 색상 전환을 위해 `transition: color 0.25s ease;` 추가.
    - 호버 인터랙션: `.goods-ranking__item:hover .goods-ranking__external-icon`, `.goods-ranking__link:hover .goods-ranking__external-icon`에 `color: #68bfd0;` 적용.

### Goods (굿즈) 섹션 - 카드 및 랭킹 타이틀 글자색 #777 및 볼드체(700) 적용
- 사용자의 `goods-cards, goods-ranking__grid 타이틀 글자색 #777 볼드체로 변경` 요청 반영:
  - `css/components/goods.css`:
    - `.goods-card__title`: `color: #777777; font-weight: var(--font-weight-bold, 700);`
    - `.goods-ranking__item-title`: `color: #777777; font-weight: var(--font-weight-bold, 700);`

### Goods (굿즈) 섹션 - 카드 및 랭킹 타이틀 글자 크기 15px로 변경
- 사용자의 `goods-cards, goods-ranking__grid 타이틀 글자 크기 15px로 변경` 요청 반영:
  - `css/components/goods.css`:
    - `.goods-card__title`: `font-size: 15px;`
    - `.goods-ranking__item-title`: `font-size: 15px;`

### Goods (굿즈) 섹션 - 분홍색 계열 색상 #f49cc2 통일
- 사용자의 `goods-section outer-box에 사용된 분홍색들을 #f49cc2로 동일하게 변경.` 요청 반영:
  - `css/components/goods.css`:
    - Goods 섹션 내 사용되던 기존 분홍색(#ea6497, #e9527f)을 산리오 메인 핑크 컬러인 `#f49cc2`로 일괄 통일.
    - 대상 요소:
      - `.goods-section__title`: `color: #f49cc2;`
      - `.goods-card__new-apple`: `background-color: #f49cc2;` (NEW 사과 뱃지)
      - `.goods-card__category`: `background-color: #f49cc2;` (카테고리 뱃지)
      - `.goods-section__top-link`: `background: #f49cc2;` (굿즈 TOP 버튼 배경)
      - `.goods-section__arrow`: `color: #f49cc2;` (버튼 내부 화살표)
      - `.goods-ranking__header-dot`: `border-bottom: 2px dotted #f49cc2;` (랭킹 헤더 점선)
      - `.goods-ranking__title`: `color: #f49cc2;` (랭킹 헤더 텍스트)
      - `.goods-ranking__btn`: `background: #f49cc2;` (더보기 버튼 배경)
      - `.goods-ranking__btn-arrow`: `color: #f49cc2;` (더보기 버튼 내부 화살표)

### Goods (굿즈) 섹션 - 헤딩 확대, 호버 시 이미지 줌 & 타이틀 #68bfd0, 랭킹 162px 및 점선 연장
- 사용자의 `goods-section__heading 글자 크기 키워. goods-cards 이미지에 마우스 호버되면 이미지 확대되게 & 타이틀 글자색 #68bfd0으로 변경. goods-ranking__image 사용된 이미지 162x162px로 변경. goods-ranking__header 텍스트 크기 23px로 변경 & 점선 길이 길게 수정. goods-ranking__grid 이미지나 글씨에 마우스 호버시 이미지는 확대, 글자색 #68bfd0로 변경.` 요청 반영:
  - `css/components/goods.css`:
    - `.goods-section__title`: 폰트 크기 `2.25rem` → `2.625rem`로 확대, `.goods-section__subtitle` 크기 `0.875rem`로 확대.
    - `.goods-card__thumb-wrap`: `overflow: hidden;` 적용 및 `.goods-card__image`에 부드러운 트랜지션 부여.
    - 호버 인터랙션: `.goods-card:hover .goods-card__image` 호버 시 `scale(1.08)` 줌 인, `.goods-card__title` 호버 시 글자색 `#68bfd0`로 변경.
    - 랭킹 헤더: `.goods-ranking__title` 글자 크기를 정확히 `23px`로 변경, `.goods-ranking__header-dot` 점선 길이 `max-width: 280px`로 대폭 연장.
    - 랭킹 이미지: `.goods-ranking__thumb-wrap` 및 `.goods-ranking__image` 크기를 `162px × 162px`로 확대.
    - 랭킹 호버: `.goods-ranking__item:hover .goods-ranking__image` `scale(1.08)` 줌 인, `.goods-ranking__item-title` 글자색 `#68bfd0`로 변경.
  - `index.html`:
    - `.goods-ranking__image` 5개 항목에 `width="162" height="162"` 속성 일치 적용.

### Characters (캐릭터) 섹션 - 모바일 화면 버튼 위치 겹침 방지 수정
- 사용자의 `'데스크탑 화면에서 characters-section__link 버튼 궤적 배경 안에 위치하도록 위치 수정' 내가 데스크탑화면이라고 언급했는데 모바일화면에서도 버튼 위치가 바뀌어서 다른 요소랑 겹쳐짐. 모바일 화면에서 버튼이 다른 요소랑 겹쳐지지 않게 위치 수정.` 요청 반영:
  - 데스크톱 전용 절대 위치(`position: absolute`) 속성이 모바일 미디어 쿼리 상속으로 겹치는 문제를 해결하기 위해,
  - `css/components/sections.css`의 `@media (max-width: 768px)` 내에 `.characters-section__link`에 `position: relative; inset: auto; transform: none; margin: 1.5rem auto 2rem;`을 명시하여 원래대로 캐릭터 오빗 및 배지 아래로 자연스럽게 흐르는 문서 흐름(relative flow)으로 복원 완료.

### News Panel (중요 공지) - 상하 패딩 및 간격, 목록 폰트 크기 확대, 헤딩 핑크색 조정
- 사용자의 `part-box news-panel 전체 텍스트 위아래 여백줘서 간격 적절하게 조정. news-panel__list 글자 크기 키워. news-panel__heading 글자색 더 부드러운 색으로 변경.` 요청 반영:
  - `css/components/sections.css`:
    - `.news-panel`: 패딩을 `1.25rem 2rem`으로 넓히고, 헤딩과 목록 사이 간격을 `gap: 1.5rem`으로 여유 있게 확장.
    - `.news-panel__heading`: 색상을 부드럽고 산뜻한 산리오 시그니처 핑크인 `#ea6497`로 변경하고 폰트 크기 0.9375rem(15px)로 조정. 우측 구분선 패딩 `1.5rem` 부여.
    - `.news-panel__list`: 항목 간 상하 간격을 `0.75rem`으로 확대.
    - `.news-panel__item`: 글자 크기를 기존 `0.6875rem (11px)`에서 `0.8125rem (13px, var(--font-size-sm))`로 가독성 있게 키우고 `line-height: 1.6`, 날짜와 제목 간격 `0.75rem`으로 균형감 있게 조정.

### Characters (캐릭터) 섹션 - 데스크톱 궤적 배경 내부 버튼 배치 수정
- 사용자의 `데스크탑 화면에서 characters-section__link 버튼 궤적 배경 안에 위치하도록 위치 수정` 요청 반영:
  - `css/components/sections.css`:
    - `.characters-section__link`를 데스크톱 화면에서 `position: absolute; z-index: 3; inset-inline-start: 50%; inset-block-end: 1.5rem; transform: translateX(-50%); margin: 0;`로 수정.
    - 핑크색 궤적 언덕 배경(`.characters-orbit__svg` 곡면 패스) 안쪽에 버튼이 자연스럽게 안착되도록 배치.
    - 모바일 화면(`@media (max-width: 768px)`)에서는 기존처럼 상대 배치 및 콤팩트 규격(`position: relative; margin: 1.5rem auto 2rem; width: calc(100% - var(--space-8));`)을 유지.

### News Panel (중요 공지) - 폭(900px), 헤딩 글자색, 내용 굵기 및 더보기 화살표 아이콘 수정
- 사용자의 `part-box news-panel의 width 900px로 수정. news-panel__heading에 사용된 글자색 더 부드러운색으로 수정. news-panel__list의 날짜 뒤의 내용글자는 볼드체로 수정. news-panel__more에 사용된 아이콘 화살표 아이콘으로 변경.` 요청 반영:
  - `css/layout.css`:
    - `.news-section__inner`: `width: min(100% - var(--space-8), 900px);`
  - `css/components/sections.css`:
    - `.news-panel`: `width: 900px; max-width: 100%; margin-inline: auto; box-sizing: border-box;`
    - `.news-panel__heading`: 기존 짙은 버건디색(`var(--color-primary-deep) = #70203f`)에서 부드러운 로즈 핑크 계열인 `#c95484`로 변경.
    - `.news-panel__item span`: 날짜 뒤의 공지 내용 글자에 볼드체(`font-weight: var(--font-weight-bold, 700);`) 적용. 날짜(`.news-panel__date`)는 일반체(`400`) 유지.
    - `.news-panel__more`: 더보기 버튼을 플렉스 정렬로 구성하고, 우측에 화살표 아이콘(`.news-panel__more-arrow`, `➜`) 적용.
  - `index.html`:
    - `.news-panel__more` 내부의 `⊕` 기호를 전용 화살표 요소(`<span class="news-panel__more-arrow" aria-hidden="true">➜</span>`)로 교체.

### Goods (굿즈) 섹션 - 박스 너비(1200px), 랭킹 박스(#F7F7F7), 제목 점선 및 버튼 아이콘 간격 수정
- 사용자의 `goods-card__category구역 박스 width 1200px로 변경. 박스배경색은 #F7F7F7사용. goods-ranking-heading 글자 좌우에 점선 생성. goods-ranking__btn 좌우끝에 쓴 아이콘 간격 박스 끝족으로 붙어지게 조정.` 요청 반영:
  - `css/components/goods.css`:
    - `.goods-section__inner`: `width: 1200px; max-width: 100%; margin-inline: auto; box-sizing: border-box;` (Goods 섹션 컨테이너 박스 폭을 1200px로 변경하여 Digital, Spots 섹션과 규격 일치).
    - `.goods-ranking`:
      - `width: 1200px; max-width: 100%; margin-inline: auto; box-sizing: border-box;`
      - 배경색을 기존 `#ffffff`에서 `#f7f7f7`로 변경 (모바일 포함).
    - `goods-ranking-heading` 좌우 점선 생성:
      - `.goods-ranking__header-dot`을 기존 단순 원형 점(3px)에서 제목 좌우에 길게 뻗는 핑크 점선(`flex: 1; max-width: 180px; border-bottom: 2px dotted #ea6497;`)으로 구현.
      - `.goods-ranking__title`: `white-space: nowrap;`으로 점선과 줄바꿈 없이 깔끔하게 배치.
    - `goods-ranking__btn` 좌우 아이콘 간격 조정:
      - 좌측 쇼핑백 아이콘(`.goods-ranking__btn-icon`)을 `position: absolute; inset-inline-start: 1.25rem;`로 박스 왼쪽 끝에 밀착.
      - 우측 원형 화살표(`.goods-ranking__btn-arrow`)를 `inset-inline-end: 1.25rem;`로 박스 오른쪽 끝에 밀착.
      - 버튼 패딩을 `padding-inline: 3.5rem;`로 넉넉히 주어 중앙 텍스트가 양 끝 아이콘과 겹치지 않도록 정렬 완료.

### Goods (굿즈) 섹션 - 카드 이미지 규격(340x190px) 및 카테고리 뱃지 모서리 반경 수정
- 사용자의 `goods-cards이구역에 사용된 이미지들 크기 340x190px로 변경. goods-card__category해당 박스 모서리 너무 둥근것을 적당히 둥근 네모로 수정.` 요청 반영:
  - `index.html`:
    - `.goods-card__image` 3개 항목에 `width="340"` 및 `height="190"` 명시.
  - `css/components/goods.css`:
    - 데스크톱 `.goods-cards`: `grid-template-columns: repeat(3, 340px); justify-content: center; gap: 2.5rem;`
    - 데스크톱 `.goods-card`, `.goods-card__thumb-wrap`, `.goods-card__image`: 너비 340px, 높이 190px로 통일.
    - 모바일(`@media (max-width: 768px)`): `.goods-cards` 1열 중앙 정렬, `.goods-card` 및 `.goods-card__thumb-wrap` 최대 너비 340px 및 `aspect-ratio: 340 / 190` 비율 반응형 유지.
    - 카테고리 뱃지 `.goods-card__category`:
      - 기존 타원형 pill(`border-radius: var(--radius-pill, 9999px);`)에서 적당히 둥근 직사각형인 `border-radius: 4px;`로 수정.

### Movies (무비) 섹션 - 모바일 화살표 위치 및 이미지 경계 오버랩 교정
- 사용자의 `movies-info 모바일화면이되면 화살표 아이콘이 이미지 좌우끝에 걸처있게 위치 조정해` 요청 반영:
  - `css/components/movies.css`:
    - `@media (max-width: 768px)` 모바일 분기에서 화살표(`.movies-controls__arrow`) 위치를 모바일 슬라이드 카드 기준선에 맞추어 조정:
      - 세로 정렬: `inset-block-start: calc(calc(min(var(--size-hero-slide-mobile), var(--size-mobile-content)) * 9 / 16) / 2); transform: translateY(-50%);`
      - 좌우 오버랩 위치:
        - Previous: `inset-inline-start: calc(50% - min(var(--size-hero-slide-mobile), var(--size-mobile-content)) / 2 - var(--size-carousel-control) / 2);`
        - Next: `inset-inline-end: calc(50% - min(var(--size-hero-slide-mobile), var(--size-mobile-content)) / 2 - var(--size-carousel-control) / 2);`
    - 카드의 가로 폭이 화면 100%가 아닌 Hero와 동일하게 뷰포트 중앙(`min(80vw, 35rem)`)에 배치될 때, 좌우 화살표 원형 버튼이 카드의 좌우 외곽 모서리에 정확히 50%씩 걸치도록(Hero와 동일) 배치 완료.

### Movies (무비) 섹션 - 애니메이션, 화살표 색상 및 위치 교체 수정
- 사용자의 `movie섹션 이미지들 hero센션 이미지랑 동일하게 왼쪽으로 흘러가게 해줘. 텍스트에 쓰인 애니메이션도 동일하게. 사용된 화살표 아이콘 색은 #91dea9이였다가 #cda1dc로 바뀌는 것으로 설정해. movies-controls__pagination와 movies-info 위치를 서로 바꿔.` 요청 반영:
  - **위치 교체 (`index.html`)**:
    - `.movies-info`가 슬라이드 카드 바로 아래에 오고, 그 아래에 `.movies-controls`(`.movies-controls__pagination`)가 오도록 순서 변경.
  - **화살표 색상 인터랙션 (`css/components/movies.css`)**:
    - 기본 상태: 화살표 및 원형 테두리 색상 `#91dea9`
    - 호버 시: 프로그레스 링 및 화살표 아이콘 색상이 `#cda1dc`로 전환되며 `arrow-out-and-back` 애니메이션 적용.
  - **Hero와 동일한 왼쪽 흐름 슬라이드 및 텍스트 리빌 애니메이션 (`css/components/movies.css`, `js/main.js`)**:
    - Hero와 동일하게 5초마다 왼쪽 방향(`direction: 1`, `translateX(-100%)`)으로 자동 흐름 슬라이드 진행.
    - 슬라이드가 전환될 때 영상 제목(`.movies-info__title`)에 Hero 텍스트와 동일한 `hero-title-reveal`(`1200ms cubic-bezier(0.22, 1, 0.36, 1)`) 애니메이션 트리거.

### Movies (무비) 섹션 - 활성 영상 제목 및 공식 채널 구독 바 추가
- 사용자의 `movie섹션 이미지 아래에 해당 내용을 추가해줘 (첨부 이미지: ポムポムプリン「ポムポム☆PARADISE」(Full Ver.) + 채널 프로필 + チャンネル登録 버튼)` 요청 반영:
  - `index.html`:
    - 캐러셀 스테이지 및 인디케이터 바로 아래에 `.movies-info` 구조 추가:
      - 영상 제목: `<h3 class="movies-info__title" data-js="movies-info-title">ポムポムプリン「ポムポム☆PARADISE」(Full Ver.)</h3>`
      - 채널 정보 바:
        - 채널 아바타 아이콘 (`./images/used/sanrio-channel-avatar.png`, 44x44, 원형)
        - 채널명: `サンリオキャラクターズ`
        - 채널 등록 버튼: `<a class="movies-info__subscribe-btn" href="https://www.youtube.com">チャンネル登録</a>`
  - `css/components/movies.css`:
    - `.movies-info`: 데스크톱 기준 `width: var(--size-hero-slide-width);` (중앙 활성 카드 너비와 일치).
    - `.movies-info__title`: `font-size: 1.25rem; font-weight: 700; color: #555555;`
    - `.movies-info__bar`: `display: flex; justify-content: space-between; align-items: center;`
    - `.movies-info__subscribe-btn`: 코랄 레드(`#e56d6d`) 필 버튼, 호버 인터랙션 적용.
    - `@media (max-width: 768px)`: 모바일 슬라이드 카드 너비에 맞춰 폰트 및 버튼 크기 반응형 최적화.
  - `js/main.js`:
    - 활성 슬라이드 전환 시 `moviesInfoTitle.textContent`가 현재 슬라이드 영상 제목과 동적으로 연동되도록 업데이트.

### Spots (스팟) 섹션 신규 구현 (데스크톱 및 모바일 레퍼런스 1:1 완벽 반영)
- 사용자의 `digital섹션 밑에 spots섹션 만들거야. 첨부한 이미지대로 그대로 구현해. 순서대로 데스크탑, 모바일 화면 이야. 비율에 맞게 이미지 크기나 간격 조정되게하고 미디어쿼리를 적용해. 사용한 이미지는 sanrio-dt_68, sanrio-dt_69, sanrio-dt_70, sanrio-dt_71, sanrio-dt_34, sanrio-dt_27, sanrio-dt_80 이야. 첨부한 이미지랑 이미지파일 대조해서 같은 이미지를 사용해. 다른 구역은 건들지마.` 요청 반영:
  - `css/main.css`: `@import url("./components/spots.css");` 추가.
  - `css/components/spots.css`: 신규 생성.
    1. **배경 장식**:
       - 데스크톱 좌측 상단 은은한 민트 원형 그라데이션(`.spots-section__bg-circle`)
       - 데스크톱 우측 상단 폼폼푸린 친구 마카롱 캐릭터 아웃라인 드로잉(`sanrio-dt_8.png`, `.spots-section__character-outline`)
    2. **헤더**:
       - 성(Castle) SVG 아이콘 (`viewBox="0 0 54.85 34.85549"`, 산호/레드 코랄 `#eb6877`)
       - "Spots" 그린 타이틀 (`#72cf9d`), "スポット" 서브타이틀
    3. **상단 4단 아치 카드 그리드 (`.spots-main-grid`)**:
       - 1: 산리오퓨로랜드 (`./images/used/sanrio-dt_68.jpg`) + 외부링크 아이콘
       - 2: 산리오캐릭터파크 하모니랜드 (`./images/used/sanrio-dt_69.jpg`) + 외부링크 아이콘
       - 3: 산리오카페 & 산리오카페웨건 (`./images/used/sanrio-dt_70.jpg`)
       - 4: 산리오캐릭터 호텔 & 카페 가이드 (`./images/used/sanrio-dt_71.jpg`)
       - 아치 테두리: 민트색 테두리(`border: 4px solid #bcead1`), 상단 반원 둥글기(`border-radius: 130px 130px 16px 16px`)
       - 1200px 컨테이너에 맞춰 `justify-content: space-between;`으로 균등 배치.
    4. **하단 3단 스팟 뉴스 카드 (`.spots-news-cards`)**:
       - 1: 리틀트윈스타즈 아쿠아리움 (`./images/used/sanrio-dt_34.jpg`) + 그린 사과 NEW 뱃지 + 태그 [その他] + 2026/11/02
       - 2: 헬로키티 그리팅 (`./images/used/sanrio-dt_27.jpg`) + 그린 사과 NEW 뱃지 + 태그 [グリーティング] + 2026/11/02
       - 3: 하나마루오바케 팝업스토어 (`./images/used/sanrio-dt_80.jpg`) + 태그 [グリーティング] [ポップアップストア] + 2026/10/30
       - 1200px 컨테이너에 맞춰 `justify-content: space-between;`으로 균등 배치.
    5. **하단 "スポット TOP" 링크 버튼 (`.spots-section__top-link`)**:
       - 민트/그린 라운드 필 버튼 (`#88d49e`), 좌측 상단 걸쳐진 딸기 아이콘(`images/used/icon-berry.svg`), 우측 화살표(➜).
    6. **반응형 미디어쿼리**:
       - 태블릿(769px~1120px): 유동형 4열 아치 카드 및 3열 뉴스 카드 스케일링.
       - 모바일(768px 이하): 첨부된 모바일 이미지와 100% 일치하게 **2x2 2단 아치 그리드** 및 **1열 세로 스택 뉴스 카드**로 변환.

### Digital 섹션 - 1200px 컨테이너 기준 정밀 여백 및 이미지 간격 정렬
- 사용자의 `1200px에 맞춰서 이미지 사이 간격 맞추라고` 요청 반영:
  - `css/components/digital.css`:
    - `.digital-section__inner`: `width: 1200px; max-width: 100%; margin-inline: auto;`로 명확하게 1200px 기준 너비 정렬.
    - **웹 카드 (`.digital-web-cards`)**: 340px 카드 3개가 1200px 양 끝과 균등하게 분배되도록 `justify-content: space-between;` 적용 (카드 간 간격 정확히 90px씩 균등 확보).
    - **디지털 뉴스 카드 (`.digital-news-cards`)**: 340px 카드 3개가 1200px 너비에 완벽하게 일치되도록 `justify-content: space-between;` 적용 (웹 카드와 수직 일치).
    - **커뮤니케이션 (`.digital-comm-grid`)**: 6개 아이템(각 130px)이 1200px 너비 전체에 걸쳐 양 끝과 균등하게 배치되도록 `justify-content: space-between;` 적용 (아이템 간 간격 정확히 84px씩 균등 정렬).
    - **스마트폰 앱 (`.digital-apps`)**: 2개 앱 블록이 1200px 중앙에서 안정된 간격을 유지하도록 `gap: clamp(6rem, 15vw, 12rem);` 설정.

### Digital 섹션 - 구역별 이미지/카드 간격 확대 및 여백 최적화
- 사용자의 `digital섹션 안 구역별 이미지들 간격 너무 좁아. 적절하게 수정` 요청 반영:
  - `css/components/digital.css`:
    - `.digital-section__inner`: `max-width: 1200px;`로 컨테이너 여유 폭 확장.
    - **스마트폰 앱 (`.digital-apps`)**:
      - 데스크톱: 좌우 간격 `gap: 6rem` → `gap: 8rem`
      - 태블릿(769~1120px): `gap: clamp(4rem, 6vw, 6rem)`
      - 모바일(768px 이하): 세로 카드 간격 `1.5rem` → `2rem`, 아이콘-텍스트 간격 `1.25rem` → `1.5rem`
    - **웹 카드 (`.digital-web-cards`)**:
      - 데스크톱: 3열 카드 간격 `gap: 1.75rem` → `gap: 2.5rem`
      - 태블릿: `gap: 1.75rem`
      - 모바일: 세로 카드 간격 `gap: 2.25rem`
    - **커뮤니케이션 (`.digital-comm-grid`)**:
      - 데스크톱: 6개 아이템 간격 `gap: 1.5rem` → `gap: 2.25rem`
      - 태블릿: `gap: clamp(1rem, 2vw, 1.75rem)`
      - 모바일: 3개 아이템 간격 `gap: clamp(1rem, 3.5vw, 1.75rem)`
    - **디지털 뉴스 카드 (`.digital-news-cards`)**:
      - 데스크톱: 3열 카드 간격 `gap: 1.75rem` → `gap: 2.5rem`
      - 태블릿: `gap: 1.75rem`
      - 모바일: 세로 카드 간격 `gap: 2.25rem`

### Digital 섹션 - 브레이크포인트 전환 시점 이미지 크기 최적화
- 사용자의 `브레이크 포인트가 시작되는 시점에서 이미지들이 너무 작음. 적절하게 이미지 크기 조정.` 피드백 반영:
  - `css/components/digital.css`:
    1. **모바일 브레이크포인트 진입 시점 (768px ~ 480px)**:
       - 스마트폰 앱 아이콘: 기존 `68px ~ 84px` → `clamp(84px, 20vw, 105px)`로 상향 조정.
       - 웹 카드 및 뉴스 카드: 기존 `340px` 고정 제한에서 `max-width: 420px; width: 100%;`로 뷰포트 너비를 풍부하게 채우도록 확대.
       - 커뮤니케이션 영역: 기존 `80px ~ 105px` → `clamp(95px, 28vw, 130px)` 및 간격 확대로 태블릿/모바일 경계 구간에서 큼직하게 표시되도록 개선.
    2. **태블릿/데스크톱 구간 (769px ~ 1120px)**:
       - 스마트폰 앱 아이콘: `clamp(124px, 14vw, 136px)`로 데스크톱 원본(136px)에 가깝게 유지.
       - 커뮤니케이션 아이콘: `clamp(112px, 12vw, 130px)`로 크기 보존.

### Digital 섹션 - 미디어쿼리 대응 및 화면 크기별 반응형 이미지 스케일링 구현
- 사용자의 `미디어쿼리 생각해서 이미지들 화면 크기에 따라 크기 적절하게 변경되도록 수정.` 요청 반영:
  - `css/components/digital.css`:
    1. **태블릿 / 중간 데스크톱 분기 (`@media (max-width: 1120px) and (min-width: 769px)`)**:
       - `min-width: 769px` 환경에서 화면 폭이 좁아지더라도 카드가 넘치거나 잘리지 않도록 유동형 그리드(`minmax(0, 1fr)`) 및 `aspect-ratio` 기반 반응형 스케일링 적용.
       - 스마트폰 앱 아이콘: `width: 120px; height: 120px;` (gap: 3.5rem)
       - 브라우저/웹 카드 이미지: 3단 그리드 유지하며 `width: 100%; aspect-ratio: 340 / 190;` 유동형 비율 유지.
       - 커뮤니케이션 이미지: 6개 아이템이 한 줄에 안정적으로 들어가도록 `105px x 150px` (테마) 및 `105px x 105px` (스탬프)로 비례 축소.
       - 배경 배너: `width: min(610px, calc(100% - 2rem)); aspect-ratio: 610 / 170;`로 가변 반응.
       - 디지털 뉴스 카드 이미지: 3단 그리드 유지하며 `width: 100%; aspect-ratio: 340 / 190;` 유동형 비율 유지.
    2. **모바일 분기 (`@media (max-width: 768px)`)**:
       - 모바일 앱 아이콘: `clamp(68px, 18vw, 84px)`로 디바이스 너비에 따른 부드러운 유동 스케일링.
       - 커뮤니케이션 3개 아이템: `clamp(80px, 25vw, 105px)` 및 `aspect-ratio`로 뷰포트에 맞게 자연스럽게 가변.
       - 웹 카드, 뉴스 카드, 벽지 배너의 비율(`aspect-ratio: 340 / 190`, `610 / 170`) 및 `max-width: 100%` 기반 반응형 최적화 완료.

### Digital 섹션 - `inner-box digital-section__inner` min-width 설정 및 요소 간격 조정
- 사용자의 `inner-box digital-section__inner 선택된 요소 min-width 769px로 설정. min-width에 적절하게 각각의 요소들 간격수정.` 요청 반영:
  - `css/components/digital.css`:
    - `.digital-section__inner`: `min-width: 769px; max-width: 1100px; box-sizing: border-box;` 설정.
    - `@media (max-width: 768px)` 모바일 분기: `min-width: auto;`로 오버라이드하여 모바일 반응형 유지.
    - `min-width: 769px` 환경에서 각 블록(앱 목록, 웹 카드 그리드, 커뮤니케이션 그리드, 뉴스 그리드 등)의 gap, margin 및 정렬이 자연스럽게 중앙 배치되도록 간격 검토 및 최적화 완료.

### Digital 섹션 - デジタルニュース (News) 이미지 및 크기 수정
- 사용자의 `digital-category-block 이미지 순서대로 sanrio-dt_35, sanrio-dt_33, sanrio-dt_24 변경. 크기는 340x190px` 요청 반영:
  - `index.html`:
    - 첫 번째 카드: `./images/used/sanrio-dt_35.png` (340x190)
    - 두 번째 카드: `./images/used/sanrio-dt_33.jpg` (340x190)
    - 세 번째 카드: `./images/used/sanrio-dt_24.jpg` (340x190)
  - `css/components/digital.css`:
    - `.digital-news-cards`: `grid-template-columns: repeat(3, 340px); justify-content: center;`
    - `.digital-news-card`: `width: 340px;`
    - `.digital-news-card__thumb-wrap`, `.digital-news-card__image`: `width: 340px; height: 190px;`
    - 모바일 반응형: `max-width: 340px; aspect-ratio: 340 / 190;` 유지.

### Digital 섹션 - 壁紙・ダウンロード (Wallpaper) 이미지 및 크기 수정
- 사용자의 `digital-wallpaper__bg 이미지 sanrio-dt_13로 변경. 610x170px` 요청을 반영:
  - `index.html`: `.digital-wallpaper__bg` 이미지의 `src`를 `./images/used/sanrio-dt_13.jpg`로 변경하고 `width="610" height="170"` 속성 부여.
  - `css/components/digital.css`:
    - `.digital-wallpaper`: 중앙 정렬(`display: flex; justify-content: center;`) 적용.
    - `.digital-wallpaper__card`: 데스크톱 기준 `width: 610px; height: 170px; max-width: 100%;` 적용.
    - 모바일(`@media (max-width: 768px)`): `width: 100%; max-width: 610px; height: auto; aspect-ratio: 610 / 170;`로 반응형 스케일링 유지.

### Movies (무비) 섹션 레퍼런스 이미지 정밀 분석 및 1:1 완벽 재구현
- 사용자의 "hero의 구성이나 사용한 애니메이션 똑같이하고 첨부한 이미지에 필요하지 않은 요소들은 삭제해서 만들면되지 않아? 니가 봐도 결과물이 완전 다르지 않냐? 다시 이미지 첨부할테니까. 이미지 제대로 분석해서 다시 구현해." 피드백을 철저히 반영하여 첨부 이미지(media_1793851417735_6e886368.jpg, media_1793851420012_c17ac768.jpg)의 모든 디테일을 1:1로 일치시켰다.
  1. **Hero 구조 기반 불필요한 요소 완전 배제**:
     - Movies 섹션에서는 제목/설명 텍스트(`copy`, `title`, `description`)와 양옆 캐릭터 배너 장식(`character-decoration`)이 존재하지 않으므로 완전히 제거했다.
     - 오직 순수한 3면 영상 카드 슬라이더(`movies-stage`)와 중앙 세로 높이에 정확히 맞춰진 좌우 원형 화살표 버튼(`movies-controls__arrow`), 하단 5개 인디케이터 도트(`movies-controls__dot`)로만 구성했다.
  2. **좌우 화살표 버튼 위치 및 스타일 일치**:
     - 이전 구현에서 화살표의 상단 오프셋이 맞지 않던 문제를 해결하여, Hero와 동일하게 슬라이드 카드의 세로 정중앙(`inset-block-start: 50%; transform: translateY(-50%)`)에 완벽히 정렬했다.
     - 데스크톱 및 모바일 모두에서 카드의 좌우 외곽 기준선에 오버랩되도록 위치를 맞췄다.
  3. **모바일 하단 버튼 아이콘 정밀 교정**:
     - 리본 아이콘이 아니라 레퍼런스 이미지에 맞추어 좌측 상단에 큼직하게 걸쳐진 **딸기(Berry) 아이콘**(`images/used/icon-berry.svg`, `.movies-section__top-link-icon`)을 적용했다.
     - 배경색(#b18bd3)과 라운드 필 버튼 스타일, 우측 원형 화살표(➜)를 완벽히 일치시켰다.
  4. **섹션 상하 패딩 및 배경 정렬**:
     - 바닥의 불필요한 공백을 없애기 위해 데스크톱 `padding-block: var(--space-8) 0;`, 모바일 `padding-block: var(--space-6) 0;`으로 정돈했다.
     - 좌측 은은한 연보라 원형 그라데이션(`.movies-section__bg-circle`)과 우측 폼폼푸린 라인 드로잉 실루엣(`.movies-section__purin-outline`)을 레퍼런스와 100% 동일한 비율로 맞췄다.

### Movies (무비) 섹션 신규 구현 (Hero와 동일한 3면 캐러셀 및 반응형 1:1 완벽 구현)
- 사용자가 첨부한 산리오 공식 Movies 섹션 이미지(데스크톱: media_1793850282754_ab2ba38a.jpg, 모바일: media_1793850285520_73c9a96d.jpg)를 분석하여 `goods-section` 바로 아래에 동일한 3면 캐러셀 디자인 및 슬라이드 애니메이션으로 정밀 구현했다.
  1. **섹션 마크업 및 배치 (`index.html`)**:
     - `goods-section` 아래, `main` 내부 마지막 섹션으로 `<section class="movies-section outer-box" aria-labelledby="movies-heading">` 배치.
     - **배경 장식**: 상단 좌측 연보라색 은은한 원형 그라데이션(`.movies-section__bg-circle`) 및 상단 우측 폼폼푸린 라인 실루엣 드로잉 장식(`sanrio-dt_7.png`, `.movies-section__purin-outline`) 배치.
     - **섹션 헤더**: 상단 민트색 카메라 아이콘(icon-movie.svg), "Movies" 퍼플 타이틀(#b18bd3), "ムービー" 서브타이틀 배치.
  2. **3면 캐러셀 및 재생 오버레이 버튼 (`css/components/movies.css`)**:
     - Hero 캐러셀과 동일한 3면 양옆 노출 스테이지 구조(Left - Center - Right) 및 5개 영상 슬라이드 데이터셋 적용:
       - 0: 시나모롤 키친 (`sanrio-dt_84.jpg`) [Active Center]
       - 1: 폼폼★PARADISE (`sanrio-dt_81.jpg`) [Right]
       - 2: 산리오 무비 3 (`sanrio-dt_83.jpg`)
       - 3: 산리오 무비 4 (`sanrio-dt_85.jpg`)
       - 4: 시나모롤의 바다 모험 (`sanrio-dt_82.jpg`) [Left]
     - 중앙 활성 카드(`.movies-card--center`) 정중앙에 화이트 반투명 원형 테두리와 퍼플 삼각형 재생 아이콘(`.movies-card__play-btn`) 구현.
     - 좌우 회전 화살표 버튼(`.movies-controls__arrow`)에 퍼플 원형 프로그레스 링 마스크 애니메이션 적용.
     - 하단 5개 인디케이터 도트(`.movies-controls__dot`)에 민트색 액센트(#50c4ad) 및 자동 타이머 프로그레스 링 애니메이션 적용.
  3. **모바일 반응형 (`@media (max-width: 768px)`)**:
     - 단일 슬라이드 중심 클리핑 스테이지 적용(Hero 모바일과 동일).
     - 하단에 모바일 전용 "ムービー TOP" 퍼플 필 버튼(`background: #b18bd3`) 및 좌측 화이트 리본 아이콘(`icon-ribon.svg`), 우측 화살표(➜) 링크 버튼 배치.
  4. **JavaScript 인터랙션 및 자동재생 (`js/main.js`)**:
     - Hero와 동일한 GPU 가속 수평 슬라이드 트랜지션(Next / Previous), 큐 기반 연속 전환, 5초 주기 자동 재생(`movieAutoplayTimer`) 완벽 구현.
     - 다른 기존 섹션 코드나 애니메이션은 건드리지 않고 독립적으로 모듈화 연결 완료.

### Characters Orbit 데스크톱 궤적 배경 채움 및 하단 돌출 제거 복구
- 데스크톱 화면에서 점선 궤적의 뒤쪽 배경이 궤적 점선 안쪽에 딱 맞게 가득 채워지도록 복구하고, 궤적 아랫부분(타원의 하단부)이 화면 밖이나 바닥 쪽으로 돌출되어 보이던 문제를 해결했다.
  1. **배경 일체화 (`index.html`)**:
     - 기존 CSS 직사각형 배경(`.characters-orbit__ground`)은 `display: none`으로 완전히 비활성화.
     - 데스크톱 SVG([`.characters-orbit__svg--desktop`](file:///c:/Users/Administrator.User-2026SSEEIF/Documents/GitHub_SKY/vibe-project-2026-sky/index.html#L503-L511)) 내부에 점선 타원과 동일한 곡률(`rx=1000, ry=240, cy=345.6`)을 가진 채움 패스(`<path d="M -40 352 L -40 345.6 A 1000 240 0 0 1 1960 345.6 L 1960 352 Z" fill="#fcf5fa">`)를 점선 바로 뒤에 배치하여 점선 안쪽에 빈틈없이 배경색(#fcf5fa)이 채워지도록 했다.
  2. **궤적 밑부분 돌출 클리핑 (`index.html`)**:
     - 타원 전체(전체 둘레)가 렌더링되면서 중심선 아래로 넘어가 보이던 하단 아치를 방지하기 위해 SVG 내부에 `<clipPath id="desktop-orbit-clip"><rect x="0" y="0" width="1920" height="346" /></clipPath>`을 적용했다.
     - 이를 통해 상단 궤적 곡선만 깨끗하게 표시되고, 기준선 밑으로 내려가는 불필요한 하단 궤적 부분은 완벽히 제거되었다.

### Characters Orbit 데스크톱 전용 화면 복원 및 브레이크포인트(768px) 모바일 분리
- 사용자의 "characters-orbit이부분 왜 데스크탑 화면에서 보이던걸 모바일 화면과 같이 쓰도록했어? 원래 쓰던 데스크탑회면으로 돌려놔. 브레이크 포인트부터 모바일 화면으로 바뀌는 거야." 요청을 완벽히 반영하여 데스크톱과 모바일 화면을 브레이크포인트 기준으로 명확하게 분리 복원했다.
  1. **HTML 마크업 (`index.html`)**:
     - `.characters-orbit__path` 내부에 데스크톱용 SVG(`.characters-orbit__svg--desktop`, viewBox 1920x352, 가로 아치형 타원 점선)와 모바일용 SVG(`.characters-orbit__svg--mobile`, viewBox 388x491, 원형 점선)를 모두 포함하고 클래스로 제어하도록 복원.
  2. **CSS 스타일 분리 (`css/components/sections.css`)**:
     - **데스크톱 (> 768px)**:
       - `.characters-orbit`: 가로폭 `1920px`, `inset-inline-start: 50%`, `transform: translateX(-50%)`의 원본 가로 아치형 궤도로 복원.
       - `.characters-orbit__svg--desktop`을 `display: block`으로 표시하고, `.characters-orbit__svg--mobile`을 숨김.
       - 중앙 피처 카드(`.characters-feature`): 지름 `244px`, 정중앙(`50%, 30%`), 일본어/영문 이름 텍스트가 카드 내부 상하단에 정상 노출.
       - 모바일 전용 뱃지(`.characters-feature-badge`): 데스크톱에서는 `display: none`으로 숨김.
       - 궤도 캐릭터 크기: `100px x 100px`.
     - **모바일 (<= 768px 미디어 쿼리)**:
       - `.characters-orbit`: `width: 388px`, `height: 491px`, 좌측 고정 원형 레이아웃 적용.
       - `.characters-orbit__svg--desktop` 숨김 및 `.characters-orbit__svg--mobile` 표시.
       - 큰 원의 정중앙(`91px, 250px`)에 캐릭터 이름 뱃지(`.characters-feature-badge`, 140px) 배치.
       - 피처 카드(`.characters-feature`): 140px 크기로 우측 교차점(`270px, 250px`)에 위치하며 텍스트는 숨김.
       - 궤도 캐릭터 크기: `56px x 56px`.
       - 하단 버튼(`.characters-section__link`): 미디어 쿼리에 유연하게 반응하도록 유지.
  3. **JavaScript 동작 분리 (`js/main.js`)**:
     - `desktopOrbitSlots`(기존 9개 가로 아치 슬롯 좌표)와 `mobileOrbitSlots`(기존 모바일 9개 슬롯 좌표)를 분리.
     - `getOrbitSlots = () => (window.innerWidth <= 768 ? mobileOrbitSlots : desktopOrbitSlots)`로 화면 크기에 맞춰 동적 슬롯 좌표 반환.
     - 궤도 회전 애니메이션 시 화면 너비에 따라 알맞은 랩어라운드 좌표 적용 및 윈도우 리사이즈 이벤트 시 실시간 재배치 수행.

### Goods (굿즈) 섹션 신규 구현 (데스크톱 및 모바일 화면 1:1 완벽 구현)
- 사용자가 첨부한 산리오 공식 Goods 섹션 이미지(데스크톱: media_1793848126321_441d4d57.jpg, 모바일: media_1793848130742_057501e4.jpg, media_1793848228899_c9d134d5.jpg)를 분석하여 애니메이션 없이 화면 그대로 정밀하게 신규 구현했다.
- characters-section outer-box 바로 밑, site-footer outer-box 이전에 <section class="goods-section outer-box" aria-labelledby="goods-heading">으로 배치했다.
  1. **섹션 헤더 및 배경 장식 (.goods-section)**:
     - 상단 우측 파스텔 핑크 반투명 원형 그라데이션 장식(.goods-section__bg-circle) 및 상단 좌측 오리 캐릭터(아히루노페클, sanrio-dt_9.png) 라인 드로잉 실루엣 장식 배치.
     - 중앙에 민트색 선물상자 아이콘(icon-goods.svg), "Goods" 타이틀(#ea6497), "グッズ" 서브타이틀 배치.
  2. **Goods 카드 그리드 (.goods-cards, 3개 아이템)**:
     - **아이템 1**: 에리스·나츄라 산리오 콜라보 한정 디자인 (sanrio-dt_58.jpg)
     - **아이템 2**: 【갱신】 산리오 캐릭터즈 마이크로화이버 시리즈 돈키호테 신작 (sanrio-dt_59.jpg)
     - **아이템 3**: 치도리 무늬 베루나 하ロー키티 신작 손목시계 (sanrio-dt_29.jpg)
     - 각 카드 우측 상단에 잎사귀가 달린 빨간 사과 모양의 'NEW' 뱃지(.goods-card__new-badge) 오버랩 배치.
     - 하단에 핑크색 캡슐 알약 형태의 'サンリオライセンス' 카테고리 태그 및 날짜(2026/11/02, 2026/10/23) 메타 정보 구현.
     - 데스크톱: 3열 그리드 가로 배치 / 모바일: 1열 세로 스택 배치.
  3. **중간 이동 링크 버튼 (.goods-section__top-link)**:
     - 핑크색 필 버튼(#ea6497), 좌측 상단 화이트 리본 아이콘(icon-ribon.svg), "グッズ TOP", 우측 원형 화살표(➜) 배치.
     - 모바일 미디어 쿼리에서 가로폭 유연 축소(width: calc(100% - var(--space-8))) 반응형 적용.
  4. **온라인 숍 인기 랭킹 박스 (.goods-ranking, 화이트 라운드 카드)**:
     - 상단 헤더: 좌우 작은 핑크 도트와 함께 "オンラインショップ人気ランキング" 타이틀 배치.
     - 랭킹 5개 아이템 그리드 (데스크톱: 5열 가로 배치 / 모바일: 상위 1~3위만 1열 세로 리스트 배치, 4~5위는 화면대로 숨김 처리):
       - **1위**: 산리오 캐릭터즈 시크릿 ID 포토홀더 (sanrio-dt_87.jpg) + 골드 왕관 뱃지(1)
       - **2위**: 플라가리아 메모리즈 (클로드) 캔뱃지 (sanrio-dt_88.jpg) + 실버 왕관 뱃지(2)
       - **3위**: 헬로키티 시크릿 마스코트 참 (sanrio-dt_89.jpg) + 브론즈 왕관 뱃지(3)
       - **4위**: 플라가리아 메모리즈 (클로드) 아크릴 스탠드 (sanrio-dt_90.jpg)
       - **5위**: 플라가리아 메모리즈 (할릿) 캔뱃지 (sanrio-dt_91.jpg)
       - 각 텍스트 뒤에 공식 외부 링크 아이콘([↗]) 첨부.
     - 하단 핑크 버튼: 쇼핑백 아이콘(icon-onlineshop.svg) + "オンラインショップでもっと見る" + 외부 링크 아이콘 + 우측 원형 화살표(➜).
     - 최하단 주의문구: "※ 在庫切れの場合がございます。詳細はオンラインショップでご確認ください。".
  5. **CSS 모듈 및 스타일 가이드 준수**:
     - css/components/goods.css로 분리 작성하고 css/main.css에 등록(tokens -> base -> layout -> components -> utilities 순서 엄수).
     - 사용자 지침에 따라 별도의 자바스크립트나 애니메이션은 일절 추가하지 않고 정적 화면으로 깔끔하게 구현.

### 하단 링크 버튼 미디어 쿼리 반응형 복원 및 캐릭터 이름 뱃지 큰 원 정중앙 정렬
- 사용자의 "밑에 버튼은 왜 고정시킨거야. 버튼은 미디어 쿼리에 반응해야지. 그리고 캐릭터 이름 나오는 원 위치를 조정해 큰 원의 정중앙에 오도록" 요청에 따라 즉각 교정했다.
  1. **캐릭터 이름 뱃지(.characters-feature-badge) 큰 원 정중앙 배치**:
     - 큰 원형 궤도의 기하학적 중심점인 (cx: 91px, cy: 250px)과 완벽히 일치하도록 위치를 inset-inline-start: 91px; inset-block-start: 250px; transform: translate(-50%, -50%);로 지정했다.
     - 이를 통해 캐릭터 이름과 영문명이 들어가는 파스텔 톤 원형 뱃지가 큰 궤도 원의 정확한 정중앙에 자리잡게 되었다.
  2. **하단 링크 버튼(.characters-section__link) 미디어 쿼리 반응형 복원**:
     - 데스크톱/기본: width: min(27.5rem, calc(100% - var(--space-8))); min-height: 3.25rem; font-size: var(--font-size-base); margin: 2rem auto 2.5rem;
     - 모바일 미디어 쿼리(@media (max-width: 768px)): width: calc(100% - var(--space-8)); max-width: 22rem; min-height: 3rem; font-size: var(--font-size-sm); margin: 1.5rem auto 2rem;
     - 화면 너비에 따라 버튼의 가로폭, 높이, 폰트 크기, 마진이 중앙 정렬을 유지하며 유연하게 반응하도록 정상 복원했다.

### Characters Orbit 좌측 고정 및 원형 피처 카드 겹침 방지 크기 조정
- 사용자의 "위치를 왼쪽으로 고정시켜, 원이 잘려도 되니까 캐릭터 이미지가 보이는 곳 전까진 원이 화면 밖으로 나가서 안보여도 돼. 그리고 이미지 들어가는 원이랑 이미지 겹쳐지니까 원의 크기를 수정해서 겹쳐져서 보이는 요소가 없도록 조정해" 요청에 맞춰 레이아웃을 교정했다.
  1. **궤도 컨테이너 좌측 고정 (inset-inline-start: 0; margin-inline-start: 0;)**:
     - 기존 중앙 정렬(margin: 0 auto;) 대신 화면 좌측 정렬(margin-inline-start: 0; margin-inline-end: auto; inset-inline-start: 0;)로 고정하여, 궤도 원의 좌측 곡선 및 퇴장/진입 지점이 화면 왼쪽 밖으로 자연스럽게 빠져나가며 캐릭터가 등장하는 영역부터 명확히 보이도록 했다.
     - 하단 "キャラクター TOP" 버튼도 margin: 2rem 0 2.5rem 1rem;로 좌측 시작선에 맞춰 안정적으로 배치했다.
  2. **원형 카드 겹침(Overlap) 제거를 위한 크기 및 간격 최적화**:
     - 궤도 상의 캐릭터(Slot 3 및 Slot 5, 56px 크기)와 중앙 메인 원형 카드 간에 발생하던 9.6px의 시각적 겹침을 완벽히 해소하기 위해:
       - 우측 메인 원형 카드(.characters-feature) 및 좌측 텍스트 뱃지(.characters-feature-badge)의 지름을 기존 179px에서 **140px**(width: 140px; height: 140px;)로 축소 조정했다.
       - 내부 이미지 크기를 width: 82px; height: 82px;로 균형감 있게 맞추고, 좌측 텍스트 뱃지의 중심 위치를 inset-inline-start: 130px;로 설정하여 우측 카드와의 오버랩 비율을 유지했다.
       - 이를 통해 Slot 3(코기뮨) 및 Slot 5(리틀트윈스타)의 이미지 외곽과 메인 원 테두리 사이에 **약 10px의 여유로운 클리어런스(Clearance)**가 확보되어 어떤 요소도 겹치지 않고 깔끔하게 분리되어 표시되도록 했다.

### Characters Orbit 고정 크기/위치(Fixed Pixel Layout) 및 미디어 쿼리 비반응 적용
- 사용자가 첨부한 화면 레퍼런스(media_1793846206245_37310e3a.png, 388px x 491px)의 원형 궤적과 레이아웃을 1:1로 픽셀 단위 정밀 분석하여, 어떤 뷰포트 크기에서든 미디어 쿼리에 반응하지 않고 완벽하게 동일한 크기와 위치를 유지하도록 고정화(Fixed Layout)했다.
  1. **고정 픽셀 규격 컨테이너 및 SVG 궤도 (.characters-orbit)**:
     - 궤도 컨테이너 규격을 고정 크기 width: 388px; height: 491px; margin: 0 auto;로 지정하고 overflow: visible;을 적용했다.
     - SVG 점선 궤도를 viewBox="0 0 388 491" 기준, 중심 (91px, 250px), 반지름 179px (<circle cx="91" cy="250" r="179">)로 고정하여 첨부 이미지의 점선 궤적과 정확히 일치시켰다.
     - 점선 스타일은 stroke: #85d6c6; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 0 12;로 통일했다.
  2. **중앙 피처 카드 및 텍스트 뱃지 고정 픽셀 배치**:
     - **우측 메인 피처 카드 (.characters-feature)**: width: 179px; height: 179px; inset-inline-start: 270px; inset-block-start: 250px; transform: translate(-50%, -50%);로 고정하여 궤도 동쪽 정점(91 + 179 = 270px)에 안착.
     - **좌측 텍스트 뱃지 (.characters-feature-badge)**: width: 179px; height: 179px; inset-inline-start: 98px; inset-block-start: 250px; transform: translate(-50%, -50%);로 고정 배치하여 우측 메인 카드와 조화롭게 오버랩.
  3. **9개 슬롯의 고정 픽셀 좌표 (orbitSlots)**:
     - 동적 백분율 및 분기 로직을 전면 제거하고 단일 orbitSlots 배열(픽셀 단위)로 통합:
       - Slot 0 (-140°): left: -46px, top: 135px (진입)
       - Slot 1 (-105°, 포차코/바츠마루 위치): left: 45px, top: 77px
       - Slot 2 (-70°, 폼폼푸린/턱시도샘 위치): left: 152px, top: 82px
       - Slot 3 (-35°, 코기뮨 위치): left: 238px, top: 147px
       - Slot 4 (0°, 시나모롤/한교동 중앙 피처 위치): left: 270px, top: 250px
       - Slot 5 (+35°, 리틀트윈스타 위치): left: 238px, top: 353px
       - Slot 6 (+70°, 헬로키티/쿠로미 위치): left: 152px, top: 418px
       - Slot 7 (+105°, 마이멜로디 위치): left: 45px, top: 423px
       - Slot 8 (+140°): left: -46px, top: 365px (퇴장)
     - 궤도 회전 애니메이션의 랩어라운드 클론 좌표 또한 -70px, 365px 퇴장 및 -70px, 135px 진입으로 픽셀 단위 일치.
  4. **미디어 쿼리 비반응(Responsive Immunity) 보장**:
     - 기존 CSS 하단의 @media (max-width: 768px) 내 캐릭터 궤도 오버라이드 규칙을 완전히 제거하여, 모바일·태블릿·데스크톱을 막론하고 화면 크기에 따라 크기나 위치가 가변되지 않고 항상 첨부 이미지와 100% 동일하게 렌더링되도록 구현했다.

### Characters Orbit 모바일 화면 끝 자연스러운 걸침(Cut-off) 및 점선 테두리 일치 교정
- 사용자의 "원모양이 화면 끝에 좀 잘리게 걸쳐지게 해서 이미지들이 어느 화면에서든 원의 점선 테두리에 위치할 수 있도록 크기와 위치 수정" 요청에 따라 기하학 및 반응형 배치를 최적화했다.
  1. **원형 궤도 확대 및 화면 우측/좌측 걸침 기하학 구성**:
     - SVG 모바일 뷰포트 `viewBox="0 0 390 460"` 및 반지름 `R = 215px`, 중심 `(97, 230)` (`<circle cx="97" cy="230" r="215">`)으로 교정했다.
     - 메인 피처 카드의 중심 위치를 `80.0%, 50.0%` (`x = 312px`)로 배치하여, 카드의 우측 테두리가 화면 우측 가장자리(390px) 밖으로 약 12~20px 자연스럽게 잘리며 걸쳐지도록 구현했다.
     - 궤도 원의 좌측 곡선 또한 화면 좌측 바깥(`x = -118px`)까지 확장되어 궤도 전체가 화면 양 끝에 걸치며 탁 트인 느낌을 선사하도록 했다.
     - 좌측 파스텔 톤 텍스트 뱃지는 `inset-inline-start: 42%`로 위치를 조정하여 우측 메인 카드와 자연스러운 오버랩 비율을 유지했다.
  2. **모든 캐릭터의 점선 테두리 정중앙 일치 배치 (`mobileOrbitSlots`)**:
     - 원의 기하학적 궤적(`x = 97 + 215 * cos(θ)`, `y = 230 + 215 * sin(θ)`)을 따라 9개 슬롯의 백분율 좌표를 재계산하여, 어떤 화면 너비에서도 모든 캐릭터 이미지가 점선의 정중앙을 완벽하게 따라 순환하도록 설정했다:
       - Slot 0 (-140°): `left: -17.4%, top: 20.0%`
       - Slot 1 (-105°, 바츠마루): `left: 10.6%, top: 4.9%`
       - Slot 2 (-70°, 턱시도샘): `left: 43.7%, top: 6.1%`
       - Slot 3 (-35°, 코기뮨): `left: 70.0%, top: 23.2%`
       - Slot 4 (0°, 중앙 피처 한교동): `left: 80.0%, top: 50.0%`
       - Slot 5 (+35°, 리틀트윈스타): `left: 70.0%, top: 76.8%`
       - Slot 6 (+70°, 쿠로미): `left: 43.7%, top: 93.9%`
       - Slot 7 (+105°, 마이멜로디): `left: 10.6%, top: 95.1%`
       - Slot 8 (+140°): `left: -17.4%, top: 80.0%`

### HTML 꼬리말 잔여 스크립트 코드 제거 및 데스크톱 뱃지 숨김 처리
- 푸터 생성 당시 `index.html` 최하단 `</body>` 뒤쪽에 실수로 삽입되어 화면에 텍스트로 노출되던 잔여 스크립트 문자열(``; html = html.replace(' </main>\\n </body>', ...)`)을 깔끔하게 제거하고 표준 `</footer>\r\n </body>\r\n</html>` 닫는 태그로 정상화했다.
- 모바일 전용으로 생성되었던 좌측 텍스트 뱃지(`.characters-feature-badge`)가 데스크톱 뷰포트에서 기본 노출되지 않도록 데스크톱 기본 CSS에 `display: none;`을 명시하고, 모바일 미디어 쿼리(`max-width: 768px`)에서만 `display: flex;`로 정상 표시되도록 분리했다.

### Characters Orbit 모바일 완벽한 원형 궤도 및 점선 정중앙 배치 & 버튼 간격 조정
- 사용자의 수정 요청에 따라 모바일 Characters Orbit의 타원형 왜곡을 완벽한 원(Perfect Circle)으로 수정하고 점선 정중앙 정렬 및 하단 버튼 여백을 최적화했다.
  1. **완벽한 원(Perfect Circle) 기하학적 교정**:
     - 기존 타원형 SVG(`rx="265" ry="172"`)에서 발생하던 찌그러짐을 제거하고, `viewBox="0 0 390 440"` 내에서 중심점 `(92, 220)`, 반지름 `185px`의 완벽한 원(`<circle cx="92" cy="220" r="185">`)으로 변경했다.
     - 우측 중앙 피처 카드의 위치 `(277px, 220px)` (71.0%, 50.0%)가 원의 정동쪽(0°) 정점과 정확히 맞물려 자연스러운 진입/진출 곡선을 형성하도록 했다.
  2. **궤도 캐릭터 점선 정중앙 일치 배치 (`mobileOrbitSlots`)**:
     - 모든 슬롯의 중심 좌표를 원의 방정식 `x = 92 + 185 * cos(θ)`, `y = 220 + 185 * sin(θ)`로 엄밀하게 산출하고 `transform: translate(-50%, -50%)`를 적용하여 캐릭터 이미지 중심이 점선 정중앙을 정확하게 관통하도록 배치했다:
       - Slot 0 (-140°): `left: -12.7%, top: 23.0%`
       - Slot 1 (-105°, 바츠마루): `left: 11.3%, top: 9.4%`
       - Slot 2 (-70°, 턱시도샘): `left: 39.8%, top: 10.5%`
       - Slot 3 (-35°, 코기뮨): `left: 62.4%, top: 25.9%`
       - Slot 4 (0°, 한교동 중앙 피처): `left: 71.0%, top: 50.0%`
       - Slot 5 (+35°, 리틀트윈스타): `left: 62.4%, top: 74.1%`
       - Slot 6 (+70°, 쿠로미): `left: 39.8%, top: 89.5%`
       - Slot 7 (+105°, 마이멜로디): `left: 11.3%, top: 90.6%`
       - Slot 8 (+140°): `left: -12.7%, top: 77.0%`
  3. **하단 "キャラクター TOP" 버튼 간격 조정**:
     - 기존 절대 위치(`position: absolute; inset-block-end: var(--space-4)`)로 인해 하단 궤도 캐릭터들과 겹치거나 답답했던 문제를 해결하기 위해 모바일에서 `position: relative; inset-block-end: auto; margin: 2rem auto 2.5rem`로 전환하여 궤도 하단과 버튼 사이에 넉넉하고 쾌적한 40~50px 간격을 확보했다.

### Characters Orbit 모바일 화면 구현 및 데스크톱 애니메이션 동일 적용
- 사용자가 첨부한 모바일 레퍼런스 화면(`media_1793843241817_b31f66ed.png`)을 정밀 분석하여 모바일 레이아웃을 교정하고, 데스크톱과 100% 동일한 회전 궤도 및 피처 카드 애니메이션을 통합 구현했다.
  1. **모바일 중앙 카드 이중 원형 레이아웃 (`characters-feature` & `characters-feature-badge`)**:
     - **우측 원형 피처 카드**: `71%, 50%` 위치에 180px x 180px 크기로 흰색 원형 배경, SVG 테두리 링 채움 애니메이션, 캐릭터 이미지를 배치하고 데스크톱의 전경 피처로 연동.
     - **좌측 파스텔 톤 텍스트 뱃지**: `34%, 50%` 위치에 180px x 180px 크기로 캐릭터 고유 색상의 파스텔 틴트(`color-mix 18%`) 배경을 적용하고, 일본어 이름(`1rem, bold`)과 영문명(`0.6875rem, bold, opacity 0.8`)을 배치하여 우측 카드가 좌측 뱃지 위로 자연스럽게 겹치도록 구현.
  2. **모바일 궤도 타원 기하학적 정렬 (`mobileOrbitSlots`)**:
     - 모바일 첨부 이미지의 점선 궤적에 완벽히 맞추어 9개 슬롯 좌표 재설정: `Slot 1 바츠마루 (9%, 26%)`, `Slot 2 턱시도샘 (37%, 24%)`, `Slot 3 코기뮨 (59%, 30%)`, `Slot 4 중앙 진입 피처 (71%, 50%)`, `Slot 5 리틀트윈스타 (59%, 69%)`, `Slot 6 쿠로미 (37%, 74%)`, `Slot 7 마이멜로디 (8%, 72%)`, `Slot 0/8 진출입 (-12%)`.
     - SVG 모바일 점선 타원 기하학을 `cx="10" cy="240" rx="265" ry="172"`로 교정하여 캐릭터 궤도 중심선과 일치.
  3. **데스크톱과 동일한 애니메이션 엔진 완전 통합**:
     - 모바일 뷰포트에서 회전을 차단하던 `window.innerWidth <= 768` 가드를 해제하여 모바일에서도 6.0초 주기의 반시계 회전, 랩어라운드 클론 루프, 퇴장(0ms 텍스트 숨김 + 테두리 시계방향 회색 채움 -> 300ms 기존 이미지 축소 페이드아웃 -> 1000ms 100% 완전 소멸 직후 다음 이미지 교체 및 2.0s 테두리 시계방향 컬러 채움 -> 2300ms 텍스트 슬라이드인 -> 3000ms 동시 안착) 애니메이션이 데스크톱과 일치하게 작동하도록 구현.
     - 사이트 진입 시 한교동 인트로 채움(`initFirstFeatureRing`) 및 윈도우 리사이즈 시 동적 슬롯 재계산 연동.

### Footer (푸터) 컴포넌트 신규 구현 (데스크톱 및 모바일 반응형)
- 사용자가 첨부한 산리오 공식 푸터 화면(데스크톱 및 모바일)을 애니메이션 없이 정적이고 정확하게 구현했다.
  1. **페이지 최상단 이동 아치형 돔 (`site-footer__pagetop`)**: 푸터 상단 중앙에 분홍색 반원 돔(`#fa9fc6`, `border-radius: 58px 58px 0 0`)을 배치하고 노란 새 캐릭터 아이콘(`icon-pagetop-bird.png`) 및 `PAGE TOP` 텍스트를 배치하여 부드러운 스크롤 이동을 구현했다.
  2. **FOLLOW 카드 및 관련 링크**:
     - 흰색 라운드 카드 내부 `FOLLOW` 타이틀(`#59b6d7`)과 3개 공식 SNS 아이콘(Facebook, X, YouTube) 배치.
     - 우측/하단 `▶ 소셜미디어`, `▶ 관련 사이트` 링크 배치.
  3. **기업 및 서비스 네비게이션 (`site-footer__nav`)**:
     - 원형 화살표(`➔`) 및 외부 링크 아이콘(`[↗]`, `icon-blank`)이 포함된 7개 주요 링크(`회사정보`, `주주·투자자`, `라이선스 비즈니스`, `채용정보`, `뉴스릴리스`, `지속가능성`, `문의하기`) 구현.
     - 데스크톱: 4열 그리드 배치, 모바일: 1열 세로 스택 배치.
  4. **하위 정책 링크 (`site-footer__sub-nav`)**:
     - 데스크톱: 중앙 정렬 단일 행 가로 배치.
     - 모바일: 첨부 이미지와 동일한 2열 x 3행 그리드 재정렬(`중요 공지` - `사이트맵`, `사이트 소개` - `소셜미디어 정책`, `개인정보처리방침` - `웹 접근성 방침`).
  5. **구분선 및 하단 정보**: 점선 구분선(`1px dotted rgba(255, 255, 255, 0.6)`), 좌측 저작권 고지문 2줄, 우측 `➔ English` 언어 전환 링크 배치.
  6. **규칙 준수**: CSS 모듈 순서(`tokens → base → layout → components → utilities`)에 따라 `css/components/footer.css` 분리 및 `css/main.css` 등록.

## 2026-11-04 작업 기록

### Characters 중앙 카드(`characters-feature`) 마우스 호버 인터랙션 구현
- 마우스가 `characters-feature` 카드에 호버되었을 때의 동적 시각 피드백을 구현했다.
  1. **원 아래쪽부터 테두리색 원형 채움**: `.characters-feature::before` 가상 요소를 생성하여 `background-color: var(--feature-accent-color)`, `border-radius: 50%`로 설정하고 `transform: translateY(100%)`에서 호버 시 `translateY(0)`으로 0.45초간 부드럽게 상승하며 원의 아래쪽부터 둥글게 채워지도록 구현했다.
  2. **원안 글자색 흰색(#fff) 전환**: 호버 시 `.characters-feature__name` 및 `.characters-feature__latin`의 글자색이 `color: #ffffff`로 부드럽게(0.3s ease) 전환되도록 설정했다.
  3. **내부 이미지 제자리 통통 튀는 애니메이션**: 호버 시 `.characters-feature__image--desktop`에 키프레임 `@keyframes feature-image-bounce` (0.75s ease infinite)를 적용하여 제자리에서 위아래로 자연스러운 스쿼시 앤 스트레치와 함께 통통 튀는 모션을 완성했다.

### Characters 미언급 캐릭터(포차코 등) 기존 동적 추출 로직 복원 및 언급 6개 이미지만 한정 적용
- 사용자가 언급하지 않은 포차코(`sanrio-dt_50.png`) 및 기타 캐릭터의 테두리 색상 처리 방식을 이전의 원래 상태(캔버스 `extractImagePrimaryColor` 동적 이미지 색상 추출)로 100% 원복했다.
- 사용자가 명시한 6개 이미지(`sanrio-dt_47`, `sanrio-dt_46`, `sanrio-dt_76`, `sanrio-dt_53`, `sanrio-dt_39`, `sanrio-dt_44`)에 대해서만 지정 색상을 적용하고, 그 외의 모든 이미지 및 동작에는 임의 변경이 발생하지 않도록 코드를 엄격히 분기 및 제한했다.

### Characters 원 테두리 채움 색상 사용자 지정 매핑 (이미지별 대조 색상 적용)
- 사용자가 지정한 이미지와 헥스 컬러 대조 규칙에 맞추어 중앙 원형 테두리(`characters-feature__ring-accent`) 채움 색상을 정확히 매핑하여 변경했다.
  - `sanrio-dt_47.png` (마이멜로디) = `#F6BEC8`
  - `sanrio-dt_46.png` (쿠로미) = `#4B4948`
  - `sanrio-dt_76.png` (리틀트윈스타즈) = `#FEF7AE`
  - `sanrio-dt_53.png` (턱시도샘) = `#6C9BD2`
  - `sanrio-dt_39.png` (바츠마루) = `#231815`
  - `sanrio-dt_44.png` (케로케로케로피) = `#DAE248`
- 캔버스 동적 색상 추출 대신 사용자 지정 1:1 컬러 매핑 테이블(`imageColorMap`, `characterBrandColors`, `getCharacterColor`)을 적용하여 해당 이미지가 중앙에 진입할 때 12시 최상단부터 시계 방향으로 지정된 정확한 헥스 색상으로 테두리가 채워지도록 구현했다.

### Characters 퇴장 시퀀스 순서 재정립(텍스트·테두리 회색 채움 동시 진행 -> 이미지 완전 소멸 후 교체) 및 자연스러운 완급 조절
- 다음 이미지로 넘어가기 전의 순서를 사용자의 요구사항에 맞추어 정확하게 재정립하고 급하게 사라지던 속도를 여유롭고 자연스럽게 완화했다.
  - **0ms (퇴장 1단계)**: 원 내부 텍스트(이름·영문명)가 자연스럽고 여유롭게(0.6s) 페이드아웃되기 시작함과 동시에, 원 테두리가 12시 최상단부터 시계 방향으로 회색(#dedede)으로 채워지기 시작(0.9s linear).
  - **300ms (퇴장 2단계)**: 기존 이미지가 부드럽게 축소되며 자연스럽게 페이드아웃 시작(0.65s ease, 950ms에 100% 완전 소멸).
  - **1000ms (진입 1단계 - 완전 소멸 직후)**: 기존 이미지가 100% 완전 소멸(`opacity: 0 !important`)되어 눈에 일절 보이지 않는 바로 그 시점에 다음 캐릭터로 이미지 교체 및 새 이미지 확대 진입(`1.3s`), 동시에 원 테두리가 12시 최상단부터 시계 방향으로 새 대표 색상 채움 시작(`2.0s linear`).
  - **2300ms (진입 2단계)**: 새 이미지가 원안에 안정적으로 안착된 후 상하 텍스트가 부드럽게 슬라이드 인(`0.7s`).
  - **3000ms**: 텍스트 안착과 테두리 컬러 채움이 정확히 동시 완성.
  - **3000ms ~ 6000ms**: 3.0초간 완성된 캐릭터 카드를 편안하게 감상할 수 있는 감상 구간을 확보하고, 전체 궤도 순환 인터벌을 6.0초로 연장하여 서두르지 않는 우아한 리듬을 완성함.
- 사이트 최초 접속 시 한교동 카드 인트로 채움(`initFirstFeatureRing`)도 `2.0s linear`와 텍스트 등장 시점을 동일하게 일치시켜 전체 시스템의 일관성을 확보함.

### Characters 사이트 오픈 시 첫 번째 원(한교동) 자동 시계방향 테두리 채움 인트로 애니메이션
- 사이트 최초 접속 시 첫 번째 원 카드(한교동)가 멈춰있지 않고, 자동으로 12시 최상단에서 출발하여 시계 방향으로 색이 채워지는 인트로 애니메이션(`initFirstFeatureRing`)을 구현했다.
- 페이지 로드 후 300ms 시점에 한교동 이미지가 피어나며, 테두리가 12시 정점부터 시계 방향으로 1.9초 동안 한교동 시그니처 민트색(`#5ec8ba`)으로 매끄럽게 채워진다.
- 이미지가 안착된 후 상하 텍스트가 부드럽게 등장하여 테두리 링 완성과 정확히 동시 완료된 후, 5.0초 인터벌에 맞춰 다음 캐릭터로 자연스럽게 순환된다.

### Characters 기존 이미지 100% 완전 소멸 시점(380ms)에 즉각 다음 이미지로 전환 연동
- 불필요한 공백 지연이나 겹침 없이, **기존 이미지가 전부 사라져 100% 완전히 안 보이는 바로 그 시점(380ms)**에 즉시 다음 이미지로 교체(`src` 변경 및 `is-image-entering` 진입)되도록 속도와 타이밍을 완벽히 맞췄다.
  - 0ms: 텍스트 페이드아웃 및 기존 이미지 축소 페이드아웃(0.35s), 테두리 회색 복귀(0.38s)가 동시에 일제히 시작.
  - **380ms**: 기존 이미지가 `opacity: 0 !important`, `scale(0.7)`로 완전히 소멸되어 눈에 일절 안 보이는 바로 그 순간, 다음 캐릭터로 즉각 교체되며 새 이미지가 원안으로 피어오르기 시작.
  - **1680ms**: 새 이미지가 원안에 완전히 다 들어와 안착한 직후, 상하 텍스트 슬라이드 페이드인 시작.
  - **2280ms**: 텍스트 안착과 테두리 링 시계방향 컬러 채움이 정확히 동시 완성.
- 이로써 이전 이미지가 화면에 조금이라도 남아있는 상태에서 다음 이미지와 겹치는 현상을 100% 원천 차단하고, 이미지가 전부 안 보이는 즉시 다음 이미지로 바통 터치되는 가장 이상적인 전환 속도를 구현했다.

### Characters 원 내부 이미지 완전 소멸 후 대기 구간 확보 및 다음 이미지 진입 시점 분리
- 이전 이미지가 원안에서 100% 완전히 소멸된 후 다음 이미지가 들어오도록 이미지 교체 시점을 **1200ms**로 조정했다.
  - 0ms: 텍스트 페이드아웃(300ms) 및 테두리 시계방향 회색 복귀(700ms) 시작.
  - 300ms: 텍스트 소멸 완료 후 기존 이미지가 축소 페이드아웃 시작하여 **700ms에 100% 완전 소멸**.
  - **700ms ~ 1200ms (500ms 동안)**: 기존 이미지가 원안에서 흔적 없이 완전히 사라진 **완전한 빈 회색 원 상태(Clean Pause)를 명확히 유지**.
  - **1200ms**: 기존 이미지가 전부 사라진 것을 확인한 후 비로소 새 이미지가 확대 진입하며 테두리 시계방향 컬러 채움 동시 시작.
  - 2500ms ~ 3200ms: 새 이미지 안착 후 텍스트가 부드럽게 등장하여 테두리 링 완성(2.0s)과 3200ms에 완벽히 동시 안착.
- 전체 회전 주기를 **5.5초**로 확장하여 각 단계의 시각적 분리감과 감상 시간을 여유롭게 확보했다.

### Characters 원 테두리 컬러 채움 및 회색 복귀 모두 100% 시계 방향(Clockwise) 연속 순환 구현
- 기존의 offset 부호 반전 및 순간 리셋 방식에서 발생할 수 있는 브라우저 내부 역방향 인터폴레이션 문제를 근본적으로 해결하기 위해, 단조 감소 누적 오프셋(`currentRingOffset -= 754`) 기반의 연속 순환 시스템으로 전면 개선했다.
- **색상 채움 시**: 850ms 시점에 12시 최상단에서 출발하여 **우측(3시) -> 하단(6시) -> 좌측(9시) -> 상단(12시) 순서로 100% 순수한 시계 방향(Clockwise)**으로 2.0초 동안 등속으로 가득 채워짐.
- **회색 복귀 시**: 0ms(텍스트 소멸 시작) 시점에 12시 최상단에서 출발하여 **우측(3시) -> 하단(6시) -> 좌측(9시) -> 상단(12시) 순서로 100% 순수한 시계 방향(Clockwise)**으로 0.8초 동안 등속으로 회색(`#dedede`)이 채워짐.
- 이로써 색상이 채워질 때와 회색으로 다시 채워질 때 모두 12시 정점 기준 완벽한 시계 방향 순환 궤적을 그리도록 100% 일치시켰다.

### Characters 원 테두리 회색 복귀 시작 시점을 텍스트 소멸 시작 시점(0ms)과 완벽 일치 동기화
- 테두리가 회색으로 복귀하는 트리거 시점을 기존 350ms(텍스트 소멸 완료 후)에서 **0ms(텍스트가 사라지기 시작하는 바로 그 순간)**로 앞당겨 동기화했다.
- 이로써 상하 텍스트가 페이드아웃되기 시작함과 동시에 12시 정점부터 시계 방향으로 회색 테두리 복귀(`stroke-dashoffset 0.8s linear`)가 출발하며, 텍스트(350ms)와 이미지(750ms)가 완전히 사라지는 800ms 시점에 회색 테두리 복귀도 정확히 100% 완료된 후 850ms에 새 캐릭터가 등장하도록 정밀 조율했다.

### Characters 원 테두리 회색 복귀 방향 반대 전환 (Clockwise 회색 채움)
- 기존 캐릭터 퇴장 시 테두리가 반시계 방향으로 축소되며 회색이 노출되던 방향을 반대로 전환하기 위해, 퇴장 트랜지션의 목표 대시옵셋을 `+754`에서 **`-754`**로 수정했다.
- 이로써 350ms 시점에 텍스트가 사라진 뒤 이미지가 축소될 때, 12시 최상단에서 출발하여 우측(3시) -> 하단(6시) -> 좌측(9시) -> 상단(12시) 순서로 **시계 방향(Clockwise)으로 회색(`#dedede`)이 채워지며 기존 컬러를 지워나가는 반대 방향 회색 복귀 연출**을 완성했다.

### Characters 원 내부 텍스트 등장 애니메이션 버벅임(Jank) 해결 및 GPU 가속 부드러운 전환
- 키프레임 애니메이션(`@keyframes`)과 기본 CSS `transition` 간의 속성 충돌, 임시 클래스 제거 시점의 스타일 리셋으로 인해 발생하던 텍스트 등장 시의 미세한 버벅임과 스냅 현상을 완전히 해결했다.
- `translate3d(0, 0, 0)` 및 `will-change: opacity, transform`을 부여하여 텍스트 렌더링을 브라우저 GPU 전용 합성 레이어로 격리 및 하드웨어 가속화했다.
- 복잡한 키프레임 대신 단일 `.is-text-hidden` 클래스 토글 방식의 순수 CSS 트랜지션(`0.65s cubic-bezier(0.2, 0, 0, 1)`)으로 구조를 전면 개편했다.
- 이로써 텍스트가 2150ms 시점에 은은한 안개처럼 피어오르며 2800ms에 60/120fps 고주사율로 매끄럽고 부드럽게 제자리에 안착하도록 완성했다.

### Characters 원 테두리 등속(Linear) 2.0초 일정 회전 및 내부 이미지·텍스트 애니메이션 템포 조화
- 이전 cubic-bezier 감속 곡선의 높은 초기 기울기로 인해 초반 0.4초 만에 테두리 70%가 급발진하듯 빠르게 채워지던 현상을 분석 및 해결했다.
- 테두리 회전 속도를 **완전한 등속(`linear`)의 2.0초**(`stroke-dashoffset 2.0s linear`)로 전환하여, 1초에 정확히 180도씩 일정한 속도로 흔들림 없이 편안하게 회전하도록 교정했다.
- 내부 이미지 진입(`1.25s ease-out`)과 텍스트 안착(`0.7s ease-out`) 역시 급격한 튕김 없는 완만한 감속 곡선으로 정돈하여, 테두리 링이 일정한 속도로 돌아가는 호흡과 완벽히 동기화했다.
- 테두리 색 채움(850ms 시작 -> 2.0s 등속 회전)이 **2850ms에 12시 최상단에서 완성되는 순간, 상하 텍스트의 안착도 정확히 동시에 완료**되도록 정밀 일치시켰다.

### Characters 초기 원 테두리 컬러 채움 표시 및 색 채움 방향 시계방향(Clockwise) 전환
- **첫 번째 원(초기 로드 시 한교동) 테두리 채움 복원**: 첫 화면 진입 시 한교동의 테두리가 비어있지 않고 고유의 시폼 민트(`#5ec8ba`) 컬러로 가득 채워져 있도록 `stroke-dashoffset`을 0으로 복원했다.
- **색 채움 회전 방향 시계방향(Clockwise) 전환**: `.characters-feature__ring-accent`의 변환 속성을 `transform: rotate(-90deg)`로 수정하여, 12시 최상단에서 출발하여 **우측(3시) -> 하단(6시) -> 좌측(9시) -> 상단(12시) 순서로 우아하게 순방향(시계방향)으로 1.95초 동안 색이 채워지도록** 방향을 전환했다.
- 이후 캐릭터 교체 시(350ms 시점) 테두리가 12시 정점부터 풀려나며 기본 회색으로 복귀하고, 새 이미지가 등장하는 850ms에 12시 최상단부터 다시 시계방향으로 새 캐릭터의 대표 색상으로 채워지며 텍스트 안착 시점(2800ms)과 정확히 동시에 완료된다.

### Characters 원 테두리 색 채움 속도 완화 및 텍스트 등장 완료 시점과의 동기화
- 테두리 색 채움 속도가 너무 빨라 텍스트가 나타나기도 전에 끝나버리던 문제를 해결하기 위해, 테두리 색 채움 지속 시간을 기존 1.2초에서 **1.95초**(`1.95s cubic-bezier(0.25, 1, 0.4, 1)`)로 여유 있게 완화했다.
- 이미지 등장 시점(850ms)에 시작된 테두리 회전 색 채움이 원을 감싸 돌다가, 이미지가 안착(2100ms)하고 텍스트가 슬라이드 페이드인하여 완전히 안착하는 **2800ms 시점과 정확히 일치하여 동시에 테두리 링 채움이 100% 완료**되도록 정밀 동기화했다.
- 이로써 이미지가 피어나고 텍스트가 내려앉는 전체 시각적 등장이 테두리 링의 완성과 하나의 조화로운 피날레로 맞물리도록 완성했다.

### Characters 원 테두리 채움 시작점을 원의 가장 윗쪽(12시 정점)으로 기하학적 교정
- CSS 변환 행렬의 우항 곱셈 연산 순서에 의해 이전 `rotate(-90deg) scaleX(-1)`가 6시 방향(최하단)에서 출발하던 기하학적 문제를 발견하여, `transform: rotate(-90deg) scaleY(-1)`로 정확히 교정했다.
- 이로써 시작점 좌표가 수학적으로 정확히 `(0, -120)`인 **원의 가장 윗쪽(12시 정점, Top)**에 완벽히 일치하게 되었으며, 출발 직후 좌측(`-120, 0`, 9시 방향)으로 전진하는 순수한 시계 반대 방향 색 채움과 교체 시 12시 정점에서 출발하는 시계 방향 회색 복귀 연출이 100% 의도대로 동작하도록 정밀 완성했다.

### Characters 원 테두리 초기 순수 회색 설정 및 이미지 완전 소멸 후 교체 타이밍 정밀화
- 초기 로드 시 원의 테두리가 순수한 회색(`#dedede`)으로 표시되도록 `.characters-feature__ring-accent`의 기본 `stroke-dashoffset`을 0에서 **754**(완전 숨김)로 교정했다.
- 이전 이미지가 아직 흐릿하게 남아있는 상태에서 다음 이미지로 교체되는 시각적 블링크(Blink)를 방지하기 위해 이미지 교체 시점을 정밀 조율했다:
  - 1단계 (0ms): 텍스트가 350ms 동안 먼저 페이드아웃.
  - 2단계 (350ms): 텍스트 소멸 후 기존 이미지가 400ms 동안 축소 소멸하며, 테두리는 12시부터 시계방향으로 회색 복귀.
  - 3단계 (850ms): 기존 이미지가 완전히 소멸된 시점(350ms + 400ms = 750ms에 100ms 여유를 둔 850ms)에서 비로소 다음 이미지로 `src`를 교체하고 새 이미지의 확장 진입 및 테두리 색 채움을 동시 시작.
- 이로써 이전 이미지가 100% 완전히 사라진 빈 화면을 거쳐 새 캐릭터가 등장하므로 잔상이나 어색한 깜빡임 없는 극도로 정갈한 전환 씬을 완성했다.

### Characters 원 테두리 최상단(12시) 시작 시계반대방향 채움 및 이미지 변경 시 시계방향 회색 채움 연출
- `.characters-feature__ring-accent`의 기준 회전각을 `transform: rotate(-90deg) scaleX(-1)`로 변경하여, 테두리 색 채움 애니메이션이 원 테두리의 가장 위(12시 최상단)에서 시작되도록 좌표계를 정확히 정렬했다.
- **이미지 등장과 동시 채움**: 새 캐릭터 이미지가 원안으로 등장하기 시작하는 순간(780ms)과 완벽히 동시에, 12시 최상단에서 출발하여 좌측(9시) -> 하단(6시) -> 우측(3시) -> 상단(12시) 순서로 **시계 반대 방향으로 1.2초 동안 이미지의 주요 색상이 가득 채워지도록 동기화**했다.
- **이미지 교체 시 시계방향 회색 채움**: 텍스트가 사라지고 다음 이미지로 바뀔 때(400ms 시점), 12시 최상단에서 출발하여 우측(3시) -> 하단(6시) -> 좌측(9시) -> 상단(12시) 순서로 **시계 방향으로 색상이 걷히며 기본 회색(`#dedede`)으로 매끄럽게 채워지도록 퇴장 애니메이션을 구현**했다.

### Characters 중앙 카드 회색 기본 테두리 및 이미지별 주요 색상 시계 반대 방향 회전 변색 연출
- `.characters-feature`의 기본 테두리를 2.5px 순수 회색(`#dedede`) SVG 베이스 링으로 정돈하고, 캐릭터가 진입할 때 해당 캐릭터 이미지의 주요 색상(한교동: 민트, 쿠로미: 라벤더, 멜로디: 핑크 등)으로 테두리가 시계 반대 방향으로 회전하며 물드는 액센트 링 시스템을 구축했다.
- `HTML5 Canvas` 기반의 `extractImagePrimaryColor()` 알고리즘을 도입하여 진입하는 캐릭터 이미지의 고채도 대표 유채색을 실시간 동적 추출하고, 캐릭터별 브랜드 맵(`characterBrandColors`)을 매칭하여 100% 신뢰성 있는 테마 색상을 보장했다.
- 테두리 회전 애니메이션:
  - 캐릭터 진입 시(780ms): 캐릭터가 들어오는 우측(3시 방향)에서 출발하여 상단(12시) -> 좌측(9시) -> 하단(6시) -> 우측(3시)으로 **시계 반대 방향(`scaleY(-1)`)으로 1.3초 동안 회전하며 추출된 대표 색상으로 테두리가 가득 채워짐**.
  - 캐릭터 퇴장 시(0ms): 텍스트가 사라지는 동안 액센트 테두리가 시계 반대 방향으로 되감기며 다시 **기본 회색(`#dedede`)으로 깨끗하게 복귀**.
- 이미지가 원안에 머무르는 동안 테두리가 캐릭터 고유의 색상을 온전히 유지함으로써, 각 캐릭터의 개성과 비주얼 몰입감을 극대화했다.

### Characters 중앙 카드 이미지·텍스트 분리 시차(Choreography) 애니메이션 및 5초 주기 완화
- 요청에 따라 캐릭터 교체 시 **텍스트가 먼저 자연스럽게 사라진 후 이미지가 변경**되고, 진입 시에는 **이미지가 원안에 완전히 다 들어와 안착한 후 텍스트가 뒤따라 등장**하는 단계별 시차 연출을 완성했다.
  - 1단계 (0ms): 상하 텍스트(`is-text-exiting`)가 먼저 400ms 동안 부드럽게 페이드아웃.
  - 2단계 (400ms): 텍스트가 완전히 사라진 후 기존 중앙 이미지가 380ms 동안 축소 페이드아웃(`is-image-exiting`).
  - 3단계 (780ms): 새 캐릭터 이미지(`is-image-entering`)가 먼저 원안으로 들어오며 1.2초 동안 0.65스케일에서 1.0스케일(130px)로 천천히 확대 진입 (이 동안 텍스트는 완전히 숨김 유지).
  - 4단계 (2000ms): 이미지가 원안에 완전히 다 들어와 안착한 직후, 상단 일본어명과 하단 영문 라틴명(`is-text-entering`)이 0.6초 동안 부드럽게 페이드인.
- 전체 궤도 캐릭터들의 이동 활주 시간을 **1.6초**로 여유롭게 늘리고, 순환 회전 주기를 **5.0초**로 대폭 완화하여 한층 우아하고 평온한 템포의 브랜드 감성을 구현했다.

### Characters 중앙 카드 이미지 진입 속도 완화 및 자연스러운 슬로우 모션 튜닝
- 캐릭터가 중앙 원형 카드(`.characters-feature`)로 들어올 때 속도가 너무 빨라 튀어 보이던 현상을 개선하여, 우아하고 여유롭게 피어나는 슬로우 모션 애니메이션으로 전면 개편했다.
- 이미지 등장 애니메이션 지속 시간을 기존 0.65초에서 **1.3초**(`1.3s cubic-bezier(0.16, 1, 0.3, 1)`)로 2배 확대하고, 급격한 바운스 대신 `0.65스케일 -> 45% 지점 페이드인 -> 75% 지점 1.06배 소프트 피크 -> 100% 지점 1.0배 안착`의 우아한 확장 곡선을 적용했다.
- 텍스트명 역시 이미지와 호흡을 맞춰 1.0초 동안 천천히 부드럽게 안착되도록 슬로우 페이드인을 동기화했다.
- 궤도 캐릭터들의 이동 시간도 0.9초에서 **1.1초**로 완만하게 늘리고, 중앙 카드 교체 딜레이를 350ms, 전체 순환 간격을 **3.8초**로 조정하여 진입 시의 시각적 안정감을 대폭 향상했다.

### Characters 중앙 카드 이미지 130px 확대 및 텍스트 간격 여유 확보
- `.characters-feature__image--desktop`(중앙 원형 카드 내부 이미지)의 기본 크기를 요청에 따라 130px(`width: 130px; height: 130px;`)로 확대했다.
- 이미지 확대에 맞춰 진입 시 애니메이션(`feature-image-expand`)을 궤도 크기 수준(약 0.72스케일)에서 시작하여 최대 1.18배까지 풍성하게 팽창 후 정확히 1.0스케일(130px)로 안착하도록 튜닝했다.
- 텍스트와 이미지 사이의 간격이 너무 붙어 보이지 않도록, 상단 일본어명 아래 여백을 14px(`margin-block-end: 0.875rem`), 하단 영문 라틴명 위 여백을 13px(`margin-block-start: 0.8125rem`)로 각각 확대하여 244px 원형 카드 내에서 시각적 숨통과 균형감을 확보했다.

### Characters 좌우 끝 궤도 이탈 및 진입 자연스러운 곡선 순환(Wrap-around) 개선
- 기존에 좌측 끝(8번 슬롯)에 도달한 캐릭터가 우측 끝(0번 슬롯)으로 이동할 때 제자리에서 갑자기 팝업되듯 나타나던 어색한 현상을 완전히 해결했다.
- 순환 이동 시, 좌측 끝(4%, 66.5%)의 캐릭터가 점선 궤적의 연장선을 따라 화면 좌측 하단 밖(`-4%, 85%`)으로 자연스럽게 미끄러져 내려가며 페이드아웃되도록 퇴장 궤적을 연결했다.
- 동시에 우측에서는 해당 캐릭터의 클론 요소가 화면 우측 하단 밖(`104%, 85%`)에서 생성되어 타원 궤도를 타고 우측 끝(96%, 66.5%)으로 부드럽게 미끄러져 올라오며 페이드인되도록 진입 궤적을 구현했다.
- 0.9초 트랜지션이 완료되는 시점에 클론을 원본 요소와 무경계(`transition: none`)로 즉시 교체하여 잔여 요소를 제거하고 DOM 상태를 항상 9개로 깔끔하게 유지하도록 처리했다.
- 이로써 모든 캐릭터가 우측 하단에서 궤도를 타고 솟아올라 언덕을 넘어 좌측 하단으로 퇴장하는 완벽하고 자연스러운 무한 시계 반대 방향 순환 루프를 완성했다.

### Characters 중앙 카드 이미지 등장 시 확대 팝업 애니메이션 및 텍스트·이미지 간격 최적화
- `.characters-feature`(중앙 원형 카드)에 캐릭터가 진입하여 등장할 때, 궤도의 본래 규격(100px)보다 자연스럽게 커지면서 부드럽게 안착하는 확대 팝업 애니메이션(`feature-image-expand`: 0.7스케일에서 최대 1.24배까지 부드럽게 팽창한 뒤 1.16배로 안착)을 적용했다.
- 중앙 카드가 244px로 커진 공간에 맞춰, 상단 일본어 캐릭터명(`.characters-feature__name`) 아래에 `margin-block-end: 0.625rem`(10px), 하단 영문 라틴명(`.characters-feature__latin`) 위에 `margin-block-start: 0.625rem`(10px)의 여백을 부여하여 텍스트와 이미지 사이의 간격을 조화롭고 균형 있게 조정했다.
- 캐릭터명과 영문명 역시 카드가 교체될 때 위아래로 부드럽게 슬라이드 페이드인(`feature-name-in`, `feature-latin-in`)되도록 동기화했다.
- `prefers-reduced-motion: reduce` 설정 시 즉시 1.16배 정적 표시로 전환되도록 모션 감축 규약을 준수했다.

### Characters 궤도 캐릭터 시계 반대 방향 순환 및 중앙 카드 진입 애니메이션 구현
- 궤도에 배치된 9종의 캐릭터(케로피, 바츠마루, 턱시도샘, 코기뮨, 한교동, 리틀트윈스타, 쿠로미, 마이멜로디, 포차코)가 부드러운 호를 그리며 시계 반대 방향(오른쪽 -> 중앙 -> 왼쪽)으로 끊김 없이 회전하도록 애니메이션 시스템을 구현했다.
- 캐릭터가 오른쪽에서 중앙 정점(4번 슬롯, 50%)에 도달하면 중앙 원형 카드(`.characters-feature`) 내부로 자연스럽게 페이드인되며 스케일 업(`scale(1.15)`)되어 흡수된다.
- 중앙 카드는 진입한 캐릭터에 맞춰 상단 일본어 이름, 중앙 100x100 캐릭터 이미지, 하단 영문 라틴 표기명을 부드러운 페이드 전환(`.is-updating`)과 함께 실시간으로 갱신한다.
- 중앙을 통과한 캐릭터는 카드의 좌측 슬롯(5번 슬롯, 35%)으로 다시 매끄럽게 빠져나오며 왼쪽 하단(포차코 위치, 4%)을 향해 계속 이동한다.
- 좌측 끝(8번 슬롯)에 도달한 캐릭터는 화면을 가로질러 튀지 않도록 트랜지션을 일시 해제(`transition: none`)하고 투명 상태에서 우측 끝(0번 슬롯)으로 순간 이동한 뒤 자연스럽게 페이드인되도록 래핑(wrap-around)을 처리했다.
- 주기적인 3.5초 인터벌과 `cubic-bezier(0.25, 1, 0.5, 1)` 기반의 0.9초 부드러운 감속 트랜지션을 적용했다.
- 웹 접근성 및 성능 최적화를 위해 `document.hidden`(탭 비활성화 시), 768px 이하 모바일 환경, `prefers-reduced-motion: reduce` 설정 시 회전 타이머를 일시 정지하도록 완벽 대응했다.

### Characters 캐릭터 간격 확대 및 양 끝 캐릭터 화면 가장자리 확장
- 캐릭터 간의 간격을 기존 9%에서 약 10.5%로 대폭 넓히고, 마지막 양 끝 캐릭터(좌측 pochacco, 우측 keroppi)의 위치를 화면 좌우 끝에서 약 4% 떨어진 위치(`4%`, `96%`)까지 시원하게 확장 배치했다.
- 중앙 244px 카드와 바로 옆 캐릭터(twins, cloud) 사이의 간격도 15%로 넓어져 더욱 쾌적하고 시원한 비주얼을 구성했다.
- 넓어진 X축 간격에 맞춰 8마리 캐릭터의 점선 궤도 타원 상 Y 좌표를 수학적으로 정밀 재계산하여 안착시켰다.

### Characters 중앙 원형 카드 규격 244px 확대 및 상하 여백 재정렬
- `.characters-feature` 원형 카드의 크기를 요청에 따라 244px(`width: 244px; height: 244px;`)로 정확히 확대했다.
- 카드가 커진 만큼 상단 타이틀(`heading`)과의 겹침을 방지하기 위해 상단 마진을 `var(--space-12)`(48px)로 확대했다.
- 하단 `キャラクター TOP` 버튼과의 간격이 좁아지지 않도록 궤도 전체 높이를 22rem(352px)로 늘려 카드 하단과 버튼 사이에 50px 이상의 쾌적한 간격을 확보했다.
- SVG viewBox 및 배경 패스 역시 352px 높이에 맞춰 바닥까지 매끄럽게 연결되도록 동기화했다.

### Characters 점선 테두리 일체형 배경 적용 및 요소 크기 고정 클리핑 처리
- 점선 궤적 SVG 내부에 동일한 매개변수(rx=1000, ry=240, cy=345.6)의 곡선 패스(`<path fill="#fcf5fa">`)를 통합하여, 점선 테두리에 배경이 1px의 오차도 없이 100% 딱 맞도록 일치시켰다.
- `.characters-orbit`을 기준 너비 1920px 고정(`width: 1920px; min-width: 1920px;`) 및 정중앙 정렬(`inset-inline-start: 50%; transform: translateX(-50%)`)로 설정하여, 1920px 와이드 모니터 화면 전체를 채우면서도 브라우저 폭이 줄어들 때 점선 테두리·배경·이미지 크기가 찌그러지거나 같이 줄어들지 않고 완벽하게 고정되도록 처리했다.
- 부모 섹션의 `overflow: hidden`에 의해 창이 좁아지면 화면 정중앙을 기준으로 양옆이 자연스럽게 잘려나가며 가로 스크롤은 발생하지 않는다.

### Characters 점선 궤적 및 배경 화면 전체 너비(100%) 확장
- `.characters-orbit`을 고정 1440px에서 `width: 100%; min-width: 0;`로 변경하여, 1920px 등 대화면에서도 핑크색 배경(`.characters-orbit__ground`)과 점선 궤적(`.characters-orbit__path`)이 화면 좌우 끝까지 100% 가득 차도록 확장했다.
- 점선 궤적 SVG에 `preserveAspectRatio="none"`과 `vector-effect="non-scaling-stroke"`를 적용하여, 화면 너비에 맞춰 유연하게 전체 폭으로 늘어나면서도 10px 간격의 완벽한 원형 도트 모양과 3.5px 선 두께가 찌그러지지 않도록 최적화했다.

### Characters 궤도 화면 정중앙 정렬 버그 수정 (오른쪽 치우침 해결)
- `.characters-orbit`에 `margin-inline: auto`와 `inset-inline-start: 50%; transform: translateX(-50%)`가 중복 적용되어 와이드 화면(1920px 등)에서 궤도 전체가 오른쪽으로 240px 밀려나던 버그를 발견하여 해결했다.
- `margin-inline: auto`를 제거하고 순수한 `inset-inline-start: 50%; transform: translateX(-50%)`로 단일화함으로써, 상단 타이틀, 중앙 행교동 카드(`.characters-feature`), 하단 TOP 버튼이 화면 정중앙(50%) 수직선상에 완벽하게 1자로 일치하도록 교정했다.

### Characters 궤도 테두리 및 배경 원래 위치 복원 및 중앙 카드 기준 완벽한 등간격 정렬
- 궤적 테두리와 내부 배경(`.characters-orbit__ground`)의 위치 및 곡률(`inset-inline: -4%; inset-block-start: 33%; height: 75%; border-radius: 50% 50% 0 0 / 100% 100% 0 0`)을 원래의 완벽한 상태로 원상 복구했다.
- 점선 궤적 SVG 타원(`cx="720" cy="345.6" rx="777.6" ry="240"`) 역시 배경 테두리와 정확히 일치하도록 복원했다.
- 점선의 개별 도트는 완벽한 원형(`stroke-dasharray: 0 10; stroke-linecap: round; stroke-width: 3.5;`)을 유지하며, 시계 반대 방향 회전 속도는 여유로운 24초 주기를 유지하도록 설정했다.
- `.characters-feature`(중앙 원형 카드)는 화면 정중앙(`inset-inline-start: 50%; inset-block-start: 33%; transform: translate(-50%, -50%)`)에 안정적으로 위치시켰다.
- `.characters-feature`(50%)를 기준으로 양옆 캐릭터들을 좌우 정확히 10% 등간격(`twins/cloud: ±14%`, `kuromi/tuxedosam: ±24%`, `melody/badtz: ±34%`, `pochacco/keroppi: ±44%`)으로 배치하여 완벽한 대칭과 균일한 간격을 완성했다.

### Characters 궤도 점선 정원(Circle) 변환 및 회전 속도 완화
- 타원(<ellipse>)으로 구성되어 있던 점선 궤도를 가로/세로 비율이 1:1인 완벽한 정원(<circle cx="720" cy="1205.6" r="1100">)으로 전면 교체하여 왜곡 없는 순수한 원형 곡선을 구현했다.
- 점선을 구성하는 개별 도트 역시 `stroke-dasharray: 0 10; stroke-linecap: round; stroke-width: 3.5;`를 적용하여 찌그러짐 없는 완벽한 원형 도트로 다듬었다.
- 배경 언덕 역시 동일한 원호 곡률(`A 1100 1100`)을 따라 채워지도록 일체화하여 점선과 배경의 기하학적 일치도를 100% 확보했다.
- 점선 회전 애니메이션 속도를 기존 8초에서 `24s`(24초)로 대폭 늦춰 훨씬 부드럽고 여유롭게 흘러가도록 개선했다.
- 변경된 정원 궤도에 맞춰 8마리 캐릭터의 Y 위치를 원의 방정식에 맞게 정확히 재조정했다.

### Characters 궤도 점선 10px 간격 및 시계 반대 방향 무한 애니메이션 구현
- 기존 브라우저 기본 CSS `border: dotted`를 정밀한 SVG 타원(`<ellipse>`) 점선으로 교체했다.
- 점선 간격을 요청에 맞춰 점 3px, 공백 10px(`stroke-dasharray: 3 10`, `stroke-linecap: round`)로 정확히 10px씩 띄워지도록 구현했다.
- CSS 키프레임 애니메이션(`stroke-dashoffset: 0` → `260px`)을 통해 점선이 시계 반대 방향(오른쪽에서 왼쪽 아치 방향)으로 끊김 없이 부드럽고 무한히 회전하도록 처리했다.
- `prefers-reduced-motion: reduce` 설정 시 모션 감축 규약(AGENTS.md)을 준수하도록 대응했다.

### 중앙 원형 카드 내부 이미지 규격 100x100 적용
- `.characters-feature__image--desktop`(중앙 원형 카드 내부의 행교동 이미지)의 크기를 기존 퍼센트(60% x 58%)에서 `width: 100px; height: 100px; object-fit: contain;`으로 변경하여 다른 캐릭터들과 동일한 규격으로 통일했다.

### Characters 섹션 캐릭터 이미지 규격 100x100 통일
- 점선 궤도에 배치된 캐릭터 이미지(`.characters-orbit__character`)의 크기를 가로 100px, 세로 100px (`width: 100px; height: 100px; object-fit: contain;`)로 고정하여 모든 캐릭터의 시각적 크기 규격을 일관되게 맞췄다.

### Characters 섹션 고정 기준 폭 적용 및 중앙 카드 주변 간격 분리
- `.characters-feature`(중앙 원형 카드)와 바로 옆 캐릭터들(좌측 twins, 우측 cloud) 간의 겹침을 방지하기 위해, 양옆 간격을 50px 이상 여유 있게 벌리고 8마리 전체 캐릭터를 7%~93%에 걸쳐 완벽한 대칭 등간격(10% 간격)으로 재배치했다.
- 화면 폭이 좁아질 때 점선, 언덕, 캐릭터들의 물리적 위치가 왜곡되거나 서로 겹치지 않도록 `.characters-orbit`에 기준 폭(`var(--content-width)` = 1440px)을 부여하고 중앙 정렬(`inset-inline-start: 50%; transform: translateX(-50%)`)했다.
- 부모인 `.characters-section`에 `overflow: hidden`이 적용되어 있어, 브라우저 너비가 줄어들어도 요소 간 위치는 고정된 채 양옆이 깔끔하게 클리핑되며 가로 스크롤이 발생하지 않는다.

### Characters 카드 정중앙 정렬 및 상하 여백 밸런스 조정
- `.characters-feature`(중앙 원형 카드)의 중심 좌표를 뒤 점선(`.characters-orbit__path`)의 정점 위치(`inset-block-start: 33%`)와 `transform: translate(-50%, -50%)`로 일치시켜 뒤 점선이 카드 정중앙을 정확하게 관통하도록 배치했다.
- 상단 타이틀(`heading`)과의 여백(`margin-block-start: var(--space-8)`)을 확보하여 카드 윗부분과 타이틀이 겹치지 않도록 간격을 분리했다.
- 하단 `キャラクター TOP` 버튼과 카드가 겹치지 않도록 전체 궤도 높이를 `clamp(19.5rem, 22vw, 21.5rem)`로 잡고 버튼을 `inset-block-end: 1.25rem`에 두어 카드와 버튼 사이 및 버튼 하단 여백을 균형 있게 확보했다.
- 변경된 33% 정점의 원호 곡선에 맞춰 8개 캐릭터의 Y 위치도 자연스럽게 재정렬했다.

### Characters 섹션 점선 궤도 및 배경 아치 곡률 원형화
- 점선(`.characters-orbit__path`)과 배경(`.characters-orbit__ground`)의 모서리 곡률을 기존 `border-radius: 50% 50% 0 0 / 67% 67% 0 0`에서 `50% 50% 0 0 / 100% 100% 0 0`으로 수정하여, 납작하게 눌려 보이던 타원 형태를 원의 일부분(원호)처럼 자연스럽고 동그란 곡선 형태로 개선했다.
- 점선 아치의 정점을 `inset-block-start: 18%`로 조정하고 좌우 인셋을 `-4%`로 확장하여 캐릭터들이 더욱 자연스러운 원호 궤도에 정렬되도록 했다.

### Characters 섹션 하단 여백 및 높이 축소 (첨부 레퍼런스 이미지 기준)
- 첨부된 레퍼런스 이미지에 맞춰 `.characters-orbit`의 높이를 기존 `clamp(24rem, 31vw, 30rem)`에서 `clamp(16rem, 19vw, 18rem)`으로 대폭 축소했다.
- 점선 궤도(`.characters-orbit__path`)와 핑크 언덕(`.characters-orbit__ground`)은 일치 상태를 그대로 유지한 채, 섹션 전체의 불필요한 하단 핑크 여백을 줄였다.
- "キャラクター TOP" 버튼(`.characters-section__link`)을 `inset-block-end: 1rem`에 배치하여 버튼 아래 여백을 첨부 이미지처럼 약 16px 수준으로 콤팩트하게 마감했다.

### Characters 섹션 ground 영역 너비 조정
- `.characters-orbit__ground`가 과도하게 넓게 퍼지던 문제를 해결하기 위해 좌우 및 상하 크기를 좁혔다.
- 점선(`.characters-orbit__path`)과 언덕 테두리(`.characters-orbit__ground`)의 위치가 어긋나지 않도록 원래의 일치하는 좌표와 높이(inset-inline: -2%, inset-block-start: 24%, height: 82%, border-radius)로 완벽하게 재정렬하여 일치시켰다.

### 히어로 캐러셀 배너 추가
- `images/used/sanrio-dt_30.png` (Hello Kitty’s Lounge: 'ここは、やさしさでつながる場所。')를 캐러셀 슬라이드 항목으로 추가했다.
- `js/main.js`의 `slides` 배열에 5번째 슬라이드로 등록했다.
- `index.html`의 인디케이터 도트(추천 5) 버튼을 추가하고 `slide-status`를 1 / 5로 갱신했다.
- 초기 로드 시 0번 활성화 상태에 맞춰 이전(left) 카드 이미지에 `sanrio-dt_30.png`를 연결했다.

## 2026-11-03 작업 전체 기록

### 반응형 페이지 및 헤더

- README와 `spec-kit/AGENTS.md`의 프로젝트 지침을 확인하고, 데스크톱·모바일 레퍼런스에 맞춰 히어로, 헤더, 퀵 메뉴, 캐릭터 장식, 중요 공지 영역을 구성했다.
- 헤더를 화면 상단에 고정하고 데스크톱에는 중앙 로고, 유틸리티 링크와 가로 카테고리 메뉴를 배치했다. 데스크톱 우측 퀵 메뉴도 고정했다.
- 모바일 헤더는 햄버거/로그인, 중앙 로고, 매장 검색/온라인 쇼핑 아이콘 중심으로 재배치하고 데스크톱 카테고리 메뉴와 우측 퀵 메뉴를 숨겼다.
- 헤더 로고에 `images/used/logo.svg`를 적용했다. 헤더 및 퀵 메뉴의 SVG 아이콘과 텍스트는 흰색으로 보이도록 처리했다.
- `icon-news.svg`가 브라우저에서 로드되지 않는 문제를 확인해 SVG namespace를 수정했다.

### 캐러셀, 전환 및 장식

- `images/used`의 배너 이미지를 사용하는 5개 콘텐츠 캐러셀을 구성했다 (`sanrio-dt_30.png` 추가). 이미지·제목·설명·현재 페이지 표시가 같은 항목으로 동기화된다.
- 데스크톱 슬라이드는 너비 640px로 구성하고 중앙 슬라이드를 강조하며 좌우 슬라이드 일부를 노출한다. 화면 폭이 줄어도 중앙 이미지를 중앙에 유지하고 양옆은 화면 경계에서 잘리게 했다.
- 모바일 기준은 768px 이하로 두고 좌우 미리보기 대신 가운데 슬라이드 하나를 최대 80vw로 표시한다. 좌우 이동 버튼, 페이지 인디케이터, 제목과 설명은 모바일에서도 유지한다.
- 복제 슬라이드를 이용한 무한 순환과 5초 자동 전환을 구현했다. 자동 전환은 왼쪽 방향이며 수동 이전/다음 버튼과 인디케이터 조작도 제공한다.
- 중앙 이미지 프레임은 고정하고 이미지 트랙만 움직이도록 구성했다. 전환 후 기준 위치로 순간 복귀해 반복 이동을 이어간다.
- 좌우 버튼에는 `images/used/arrow.svg`, `circle.svg`를 적용했다. 원과 화살표 색은 브랜드 핑크(`#f49cc2`)로 맞췄다. 이전 화살표는 반대 방향으로 표시한다.
- 캐러셀 중앙 이미지에 데스크톱 전용 확대 호버 효과를 적용했으며 확대량을 사용자 요청에 맞게 조정했다. 모바일에서는 확대 효과를 적용하지 않는다.
- 페이지 인디케이터는 원형으로 조정하고, 활성 항목에 5초 진행 링을 표시한다. 모션 감소 설정에서는 자동 재생을 중단한다.
- 슬라이드 전환 중 캡션을 자연스럽게 숨겼다가 다시 표시하고, 모바일 캡션 높이와 줄 수를 제한해 콘텐츠가 길어도 레이아웃이 크게 변하지 않도록 했다.
- `sanrio-dt_73.png`, `sanrio-dt_74.png` 캐릭터 장식을 배치하고 데스크톱에서는 화면 가장자리에 고정했다. 화면 크기에 맞게 잘리되 텍스트 영역을 침범하지 않도록 했다.
- 중요 공지는 데스크톱 및 모바일에 맞는 카드형 레이아웃으로 배치했다.
- 캐러셀 버튼 호버 시 원형 테두리 진행 효과와 화살표 색상 전환을 적용했다. 화살표는 원형 버튼 안에서만 보이도록 잘라내고, 밖으로 나갔을 때 잔상이 남지 않도록 애니메이션을 조정했다.

### 모바일 전체 메뉴 기능 및 디자인

- 모바일 햄버거 메뉴를 작은 드롭다운에서 전체 메뉴 오버레이로 확장했다. 769px 이상에서는 모바일 오버레이를 숨긴다.
- 메뉴는 고정 헤더 하단에서 아래로 펼쳐지고, 닫힐 때 위로 접힌다. 열림 중 헤더 색도 메뉴 색상과 일치하며 햄버거 버튼은 같은 길이의 선으로 X 형태가 되어 닫기 버튼 역할을 한다.
- 메뉴 내부에 반복되던 별도 헤더를 제거하고 기존 고정 헤더의 컨트롤을 재사용했다.
- 검색 입력, 상세 검색 링크, 캐릭터·굿즈·무비·디지털·스폿·뉴스 카테고리, `images/used/sanrio-dt_25.png` Sanrio+ 배너, FOLLOW/SNS/관련 사이트 링크를 구성했다.
- 메뉴 내부만 스크롤되게 하고 스크롤바는 감췄다. 메뉴가 열린 동안 배경 페이지 스크롤을 잠그고, 닫을 때 기존 스크롤 위치와 포커스를 복원한다. Escape 키와 메뉴 링크 선택으로도 닫을 수 있다.
- 메뉴 색상은 초기 `#71C6D6` 적용 후 사용자 레퍼런스에 맞춰 현재 디자인 토큰 `#8bd0dd`로 조정했다. 헤더도 메뉴가 열리면 같은 토큰 색으로 바뀐다.
- 검색 필드는 흰 배경, 8px 모서리, 메뉴 청록색의 아이콘·텍스트·포커스 표시로 구성했다. 검색 안내 링크는 왼쪽 정렬하고 아이콘을 채워진 아래 방향 삼각형으로 바꿨다.
- 카테고리 상단의 점선을 제거하고 항목 사이 구분선은 점 간격이 더 넓고 또렷한 패턴으로 변경했다.
- 카테고리 오른쪽 화살표는 18px 흰 원으로 만들고 `images/used/arrow.svg`를 내부 아이콘으로 사용했다. 화살표 표시 크기는 8px이며 색상은 `#8bd0dd`다.
- 메뉴 콘텐츠 좌우 여백을 24px로 늘렸다. 배너 위 간격과 배너 아래 청록 영역의 여백을 넉넉히 두고, 푸터를 흰 배경·청록 텍스트로 분리했다.
- 푸터의 SNS 아이콘을 갱신된 `images/used/Facebook.svg`, `Twitter.svg`, `YouTube.svg`로 교체하고, FOLLOW 문구·아이콘·관련 링크를 `--color-menu`(`#8bd0dd`)로 통일했다.
- 첨부한 푸터 레퍼런스에 맞춰 SNS 아이콘을 Facebook 파랑 원형, 검은 X, 빨간 YouTube 아이콘으로 표시하고 원 테두리를 제거했다. 하단 링크는 청록 삼각형 마커와 함께 `ソーシャルメディア` 및 `関連サイト` 텍스트로 정렬했다.
- 상세 검색 안내를 버튼형 펼침 메뉴로 변경했다. 클릭하면 자유 검색어, 범위 선택, 인기 키워드, 검색/조건 초기화 UI가 아래로 펼쳐지고 삼각형이 위를 향한다. 인기 키워드는 상세 검색 입력란에 반영하며, `aria-expanded`/`aria-hidden`/`inert` 상태를 함께 관리한다. 지정한 패널 펼침과 화살표 방향 외의 신규 애니메이션은 추가하지 않았다.
- 첨부한 검색 옵션 디자인에 맞춰 네이티브 선택 상자를 사용자 지정 메뉴로 바꿨다. 포인터 커서를 적용하고 옵션 패널은 아래 콘텐츠를 밀지 않고 위에 겹쳐 표시한다. 초기 표시는 `すべて`이며 `すべて`/`いずれかを含む`/`自然文検索` 중 선택 가능하다. 선택 내용은 숨은 폼 값과 접근성 속성에 반영하며 Escape와 조건 초기화도 지원한다. 텍스트 패딩을 조정하고 옵션 호버 스타일은 제거했다.
- 검색 방식 옵션 패널은 고정된 크기의 오버레이로 두고 clip-path만 전환해 열릴 때 위에서 아래로, 닫힐 때 아래에서 위로 자연스럽게 접히도록 했다. 높이 애니메이션을 제거해 내용이 눌려 보이는 현상을 방지했다. 선택 상자와 옵션 패널 테두리를 2px로 두껍게 했다.
- 검색 방식 드롭다운이 열린 상태에서 토글과 옵션 목록 바깥을 클릭하면 목록만 닫히도록 했다. 검색 상세 패널은 열린 채 유지하고 ARIA/inert 상태도 함께 업데이트한다.
- 인기 키워드 칩은 검색어 입력과 독립적으로 동작하며 여러 개를 동시에 선택/해제할 수 있다. 선택한 각 칩은 배경·텍스트 색 반전으로 표시하고, 조건 초기화 시 모든 선택 상태를 해제한다.
- `条件クリア` 버튼을 누르면 검색 조건·키워드 칩·검색 방식 드롭다운을 초기화하고 상세 검색 패널을 닫아 원래 메뉴 상태로 돌아간다.
- 상세 검색 패널 닫힘 시 `visibility`가 전환을 가리지 않도록 지연하고, 420ms 그리드 행 전환으로 아래에서 위로 자연스럽게 접히게 했다. 모션 감소 설정에서는 대기 지연도 제거한다.
- 상세 검색 키워드 입력란의 포커스 시 브라우저 기본 검은색 outline을 제거하고 핑크 테두리를 유지한다.
- 320px 화면에서 로고와 유틸리티가 겹치지 않게 크기를 조정했다.
- 데스크톱 헤더의 `探す` 유틸리티를 버튼으로 바꾸고, 검색 패널을 `.site-header__top` 아래 고정 오버레이로 구성했다. 패널은 본문을 밀지 않고 핑크 배경 위에 펼쳐지며, 본문은 반투명 딤으로 덮인다.
- 검색 패널에 `icon-berry.svg`, `icon-mysearch.svg`, `deco-pull.svg`를 연결하고 범위 선택, 키워드 입력, 인기 키워드, 검색 및 조건 초기화 UI를 배치했다.
- 검색 버튼 재클릭, 바깥 클릭, 딤 영역 클릭, Escape 키로 닫을 수 있게 했으며, 열림/닫힘 상태와 키보드 포커스 순환을 관리한다. 패널은 위에서 아래로 열리고 아래에서 위로 닫히며, 장식도 패널 동작에 맞춰 나타난다.
- 헤더 검색 오버레이는 모바일에서 숨기고, 모션 감소 설정에서는 패널 전환을 최소화한다.
- 검색 패널 닫힘 clip-path를 아래쪽부터 위로 접히는 방향으로 수정하고, 본문 딤 배경은 닫힐 때 550ms 동안 자연스럽게 페이드아웃되도록 했다.
- 검색 폼 배경색을 지정된 `#f0c1d3`로 변경했다.
- 검색 오버레이가 열릴 때 `.quick-links`가 딤/검색 패널 위에 남지 않도록 퀵 링크의 stacking 레벨을 헤더 아래로 조정했다. 브라우저 hit-test에서 해당 위치의 최상단 요소가 검색 딤임을 확인했다.
- 헤더 검색의 인기 키워드 버튼을 제목 아래로 이동하고 테두리를 제거했다. 기본은 핑크 텍스트, 선택 시 핑크 배경·흰색 텍스트로 반전하며 `aria-pressed`와 조건 초기화를 동기화했다.
- 인기 키워드 버튼의 기본 배경을 흰색으로 바꾸고 버튼 여백과 글자 크기를 키워 가독성을 높였다. 선택 상태는 기존대로 핑크 배경·흰색 글자를 유지한다.
- 검색 제출 버튼의 너비를 넓히고 텍스트를 흰색으로 변경했다. 내부 검색 SVG는 버튼의 핑크색으로 보이게 필터링하고, 아이콘 원형 배경과 돋보기 크기를 함께 키웠다.
- 검색 제출 버튼 너비를 440px로 고정하고 돋보기 아이콘을 버튼 오른쪽 안쪽에 배치했다. 버튼 높이와 하단 액션 영역 간격을 확보했다.
- 검색 제출 버튼에 좌→우 방향의 600ms 배경색 전환을 적용했다. 포인터 진입 시 배경은 `#68bfd0`, 원형 아이콘 배경과 돋보기는 흰색/청록색으로 함께 반전하며, 포인터가 나가면 같은 방식으로 핑크 상태로 돌아간다. 모션 감소 설정도 지원한다.
- 검색 제출 버튼 텍스트는 호버 시 기존 문구가 버튼 위쪽으로 빠져 보이지 않고, 동일한 문구가 버튼 아래쪽에서 원래 위치로 들어오도록 클리핑 전환을 적용했다. 포인터가 벗어나면 같은 애니메이션이 역방향으로 동작한다.
- `条件クリア` 버튼에 청록색 배경이 왼쪽에서 오른쪽으로 채워지는 호버 전환과 밑줄 점선이 나타나는 효과를 적용했다. 포인터가 벗어나면 같은 전환으로 원래 핑크 색상과 상태로 돌아간다.
- 검색 조건 초기화 버튼의 글자를 키우고 굵게 했으며, 왼쪽 X 표식을 흰 원 안에 넣고 핑크색·굵은 선으로 강조했다.
- 조건 초기화 버튼 글자 크기를 16px로 한 단계 더 키우고, 원형 X 아이콘은 핑크 배경·흰색 X로 색상을 반전했다.
- 조건 초기화 버튼의 원형 X 아이콘 크기와 X 글자 크기를 기존 대비 30% 줄였다.
- X 글자만 추가로 작게 줄이고, 원형 아이콘은 grid 정렬과 텍스트 중앙 정렬을 유지해 한가운데에 배치했다.
- 검색 제출 버튼의 돋보기 SVG 크기를 22px로, 아이콘 원을 28px로 키우고 핑크/흰 필터에 미세한 컬러 그림자를 더해 아이콘 획을 굵게 보이도록 조정했다.
- 돋보기 윤곽이 과하게 두꺼워 보이지 않도록 아이콘을 20px로 미세하게 줄이고 컬러 윤곽 효과도 0.25px 수준으로 완화했다.
- 돋보기 SVG 획이 여전히 두껍게 보인다는 피드백에 따라 획을 덧대던 drop-shadow 효과를 제거하고 기본 핑크/흰색 필터만 남겼다.
- 검색 제출 버튼의 돋보기 SVG 크기를 22px로, 아이콘 원을 28px로 키우고 핑크/흰 필터에 미세한 컬러 그림자를 더해 아이콘 획을 굵게 보이도록 조정했다.
- 검색 제출 버튼에 좌→우 방향의 600ms 배경색 전환을 적용했다. 포인터 진입 시 배경은 `#68bfd0`, 원형 아이콘 배경과 돋보기는 흰색/청록색으로 함께 반전하며, 포인터가 나가면 같은 방식으로 핑크 상태로 돌아간다. 모션 감소 설정도 지원한다.
- 헤더 검색의 인기 키워드 버튼은 선택 표시만 토글하도록 변경했다. 클릭해도 검색어 입력 내용은 바뀌지 않고 포커스도 입력칸으로 이동하지 않는다.
- 인기 키워드 버튼 글자를 굵게 표시해 강조했다.
- 검색 범위 선택 상자와 키워드 입력 상자를 더 둥글게(기존 radius 토큰) 조정하고, 테두리를 1px로 얇게 했다. 내부 텍스트·placeholder 색을 테두리와 같은 핑크로 통일했으며 포커스 시 추가 outline/그림자가 생기지 않도록 제거했다.
- 검색 범위 선택 상자와 키워드 입력 상자 모서리를 더 둥글게 조정하고, 선택 상자의 기본 화살표를 핑크색 굵은 SVG 화살표로 교체했다. 화살표 주위에 내부 여백을 확보해 테두리에 붙지 않게 배치했다.
- 검색 장식 `deco-pull.svg`를 기본 핑크(`#f49cc2`)로 통일하고 검색 패널이 펼쳐진 뒤 같은 시점부터 자연스럽게 내려오도록 했다. 패널 뒤에 표시되며 닫을 때는 지연 없이 부드럽게 사라진다.
- 검색 장식이 나타날 때 위에서 떨어져 착지 후 좌우로 흔들리며 멈추도록 키프레임 애니메이션을 추가했다. 브라우저에서 검색 패널이 열린 뒤 장식 애니메이션이 시작되는 것을 확인했다.
- 장식 낙하 거리를 4rem, 좌우 흔들림을 최대 18도로 설정하고 전체 애니메이션 시간을 700ms로 줄여 빠르게 보이도록 조정했다.
- 헤더 검색의 검색 방식 선택을 커스텀 리스트박스로 구성해 첨부 레퍼런스의 세 항목을 표시하고, 클릭 시 위에서 아래로 펼쳐지며 선택 영역 밖을 클릭하면 아래에서 위로 접히도록 했다. 키보드 방향키/Home/End/Enter/Escape/Tab 지원, 폼 값 동기화 및 초기화 동작도 연결했다.
- 검색 키워드 입력란의 둥근 모서리·핑크 테두리·색상·높이 스타일을 복구하고, 검색 오버레이를 닫을 때 키워드 값을 비워 재진입 시 초기화된 입력란을 표시한다.
- 검색 오버레이를 닫을 때 검색 방식 선택도 기본값(すべて)으로 초기화하며, 검색 방식 버튼에 포커스된 동안 테두리를 2px로 강조한다.
- 검색 방식 드롭다운의 옵션별 세로 여백을 늘려 전체 높이를 키웠고, 항목 클릭/선택 후에도 목록을 열린 상태로 유지한다. 옵션 바깥 영역 클릭 시에만 닫히며 토글 버튼 재클릭으로는 닫히지 않는다.
- 헤더 유틸리티의 `探す` 버튼을 검색 오버레이 열기/닫기 트리거로 사용한다. 오버레이를 닫으면 검색어와 검색 방식 선택이 기본값으로 초기화되고, 검색 방식 메뉴는 선택 영역 밖을 클릭할 때만 접힌다.
- `section.news` 아래에 Characters 섹션을 추가했다. 데스크톱에는 제목, 캐릭터가 놓인 아치형 점선과 중앙 Hangyodon 원형 카드, TOP 버튼을 배치하고 모바일에는 크림색 타원 궤도와 캐릭터 장식, Pompompurin 강조 원형 구성을 적용했다. 기존 `images/used`의 캐릭터 이미지와 `icon-ribon.svg`, `kitty_symbol.svg`를 사용했으며 애니메이션은 추가하지 않았다.
- 모바일 Characters 섹션의 최소 높이를 42rem에서 39rem으로 줄여 궤적 하단과 섹션 하단 사이의 빈 공간을 줄였다.
- Characters 섹션 캐릭터 장식 이미지의 중심을 데스크톱 아치와 모바일 타원 점선 경로에 맞춰 재배치했다. 모바일 하단 이미지 간 좌우 간격을 넓혀 겹치지 않게 했다.
- Movies 섹션 최하단에 첨부 이미지와 동일한 'ムービー TOP' 필(Pill) 스타일 바로가기 버튼(딸기 아이콘 + 원형 화살표)을 데스크톱 및 모바일 모두에서 자연스럽게 노출되도록 스타일 및 하단 여백을 적용했다.
- `digital-category-block` (コミュニケーション)에 사용된 이미지 크기를 요청대로 변경하고 둥근 모서리(`border-radius: 0`)를 제거했다:
  - 1번(こぎみゅん 着せかえ): `130px x 185px`
  - 2번(サンリオキャラクターズ スタンプ): `130px x 130px`
  - 3번(クロミ 着せかえ): `130px x 185px`
  - 4번(はなまるおばけ スタンプ): `130px x 130px`
  - 5번(バッドばつ丸 着せかえ): `130px x 185px`
  - 6번(クロミ スタンプ): `130px x 130px`
  - 이미지 상단 정렬(`align-items: flex-start;`)을 적용하여 185px 높이의 착세카에와 130px 높이의 스탬프가 상단 라인에 맞추어 깔끔하게 정렬되도록 수정했다.
  - 이미지 모서리 둥글게 처리되었던 스타일(`border-radius`)을 완전히 삭제(`border-radius: 0;`).
  1. 모든 에셋을 `images/used/`의 기존 원본 에셋으로 전면 매핑 및 통일했다:
     - 헤더: 스마트폰 SVG 아이콘(`icon-digital.svg`), 데스크톱 배경 장식 시나모롤(`sanrio-dt_6.png`), 소프트 웜옐로우 원형 그라디언트.
     - 스마트폰 앱: 헬로스위트데이즈(`sanrio-dt_26.webp`), 구데타마(`sanrio-dt_12.png`).
     - 브라우저 웹: `sanrio-dt_31.jpg`, `sanrio-dt_27.jpg`, `sanrio-dt_24.jpg`.
     - 커뮤니케이션: `sanrio-dt_68.jpg`, `sanrio-dt_69.jpg`, `sanrio-dt_70.jpg`, `sanrio-dt_71.jpg`, `sanrio-dt_65.png`, `sanrio-dt_86.png`.
     - 벽지·다운로드: `sanrio-dt_66.png`.
     - 디지털 뉴스: `sanrio-dt_35.png`, `sanrio-dt_32.jpg`, `sanrio-dt_34.jpg`.
     - 하단 버튼: 리본 아이콘(`icon-ribon.svg`)과 골드 필의 "デジタル TOP ➜" 버튼 (Goods / Characters 규격 통일).
- 임의로 추출했던 불필요한 이미지 파일들을 삭제하고 `images/used/` 폴더 내 기존 에셋만을 일관되게 사용하도록 정돈했다.
- `css/main.css`의 순서(`movies.css`와 `footer.css` 사이)에 `css/components/digital.css`를 임포트하고 불필요한 스크립트나 추가 애니메이션 없이 순수 BEM 반응형 정적 레이아웃으로 완료했다.
## 검수 기록

- 과거 통합 브라우저 검수에서 데스크톱/모바일 레이아웃, 슬라이드 자동 및 수동 전환, 현재 페이지 표시, 메뉴 열기·닫기, Escape 동작, 내부 메뉴 스크롤, 페이지 스크롤 잠금/복원, 링크 선택 후 닫힘을 확인했다.
- 768px 이하의 모바일 단일 슬라이드와 769px 이상의 데스크톱 캐러셀 동작을 확인했다. 320px·390px·430px 등 모바일 화면에서 가로 넘침과 이미지 로드 실패가 없는지 점검했다.
- 캐러셀 전환 중 중앙 프레임 유지, 캡션 전환, 원형 진행 링, 호버 화살표 클리핑과 모바일에서의 확대 효과 비활성화를 브라우저에서 확인했다.
- 최근 CSS 수정 후 `css/components/mobile-menu.css`의 문제 검사에서 오류가 없음을 확인했다.
- 헤더 검색 오버레이를 데스크톱 브라우저에서 열고 닫기, 인기 키워드 반영 및 조건 초기화, 바깥 클릭과 Escape 처리, 포커스 복원을 확인했다. 검색 패널 애니메이션과 딤 배경, SVG 로드, 모바일 비노출 및 가로 넘침 없음도 검수했으며 브라우저 오류와 이미지 로드 실패는 없었다.
- Characters 섹션을 데스크톱과 390px 모바일 화면에서 확인했다. 사용한 캐릭터 이미지와 지정 SVG 로드, 모바일 레이아웃의 가로 넘침 없음도 확인했다.
- `node --check .\js\main.js`를 통과했다. 프로젝트에는 별도 패키지 매니페스트나 테스트 스크립트가 없다.
- 프로젝트에 테스트 스크립트가 없어 CLI 자동 테스트를 실행하지 않은 이전 작업이 있다. 필요한 경우 브라우저에서 실제 화면과 상호작용을 검수한다.

## 다음 작업 시 확인할 사항

1. 새 작업 전에 현재 코드와 이 문서를 확인하고 기존 동작을 중복 구현하지 않는다.
2. 캐릭터 전용 섹션은 다시 추가하라는 요청이 없으면 복원하지 않는다.
3. 메뉴 링크 목적지 ID와 실제 페이지 내 요소가 일치하는지 확인한다.
4. CSS 시각 값은 가능한 한 기존 토큰을 사용하고 모바일 가로 넘침과 키보드 접근성을 유지한다.

## 유지해야 할 프로젝트 규칙

- README가 지정한 CSS 모듈 순서를 유지한다: tokens → base → layout → components → utilities.
- Vanilla HTML/CSS/JavaScript를 사용하며 별도 프레임워크나 CDN을 추가하지 않는다.
- `.outer-box` → `.inner-box` → `.part-box` 레이아웃 계층 및 최대 4단계 구조를 유지한다.
- 시맨틱 HTML, `:focus-visible`, WCAG 대비, 모바일 가로 넘침 없음을 유지한다.
