/**
 * 공지사항 서비스 통합 엔트리포인트 (Service Facade)
 * 
 * localstorage_to_firebase_guidelines.md [5.2단계] 규칙 준수:
 * UI 컴포넌트는 오직 이 엔트리포인트를 통해서만 데이터를 조작합니다.
 * 향후 Firebase 전환 시 이곳의 export 대상만 변경하면 모든 UI 코드는 변경 없이 유지됩니다.
 */

// 1. [현재 활성화] LocalStorage 기반 Mock 서비스
export {
  noticeMockService as noticeService,
  initialNoticesSeed,
} from "./mock/noticeMockService.js";

// 하위 호환성을 위해 개별 함수도 동일하게 re-export
import { noticeMockService } from "./mock/noticeMockService.js";
export const getNotices = noticeMockService.getNotices;
export const getNoticeById = noticeMockService.getNoticeById;
export const createNotice = noticeMockService.createNotice;
export const updateNotice = noticeMockService.updateNotice;
export const deleteNotice = noticeMockService.deleteNotice;
export const resetToSeed = noticeMockService.resetToSeed;

/*
// 2. [Firebase Firestore 전환 시 아래 코드로 교체]
// export { noticeFirebaseService as noticeService } from "./firebase/noticeFirebaseService.js";
// import { noticeFirebaseService } from "./firebase/noticeFirebaseService.js";
// export const getNotices = noticeFirebaseService.getNotices;
// export const getNoticeById = noticeFirebaseService.getNoticeById;
// export const createNotice = noticeFirebaseService.createNotice;
// export const updateNotice = noticeFirebaseService.updateNotice;
// export const deleteNotice = noticeFirebaseService.deleteNotice;
*/

