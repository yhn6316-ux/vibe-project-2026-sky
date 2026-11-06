/**
 * 공지사항 서비스 통합 엔트리포인트 (Service Facade)
 * 
 * Firebase Firestore 연동 활성화 상태
 */

// 1. Firebase Firestore 서비스 활성화
export {
  noticeFirebaseService as noticeService,
} from "./firebase/noticeFirebaseService.js";

import { noticeFirebaseService } from "./firebase/noticeFirebaseService.js";
export const getNotices = noticeFirebaseService.getNotices;
export const getNoticeById = noticeFirebaseService.getNoticeById;
export const createNotice = noticeFirebaseService.createNotice;
export const updateNotice = noticeFirebaseService.updateNotice;
export const deleteNotice = noticeFirebaseService.deleteNotice;
export const resetToSeed = noticeFirebaseService.resetToSeed;

/*
// [참고: 필요 시 Mock(LocalStorage)으로 복구할 때 사용]
// export { noticeMockService as noticeService, initialNoticesSeed } from "./mock/noticeMockService.js";
// import { noticeMockService } from "./mock/noticeMockService.js";
// export const getNotices = noticeMockService.getNotices;
// export const getNoticeById = noticeMockService.getNoticeById;
// export const createNotice = noticeMockService.createNotice;
// export const updateNotice = noticeMockService.updateNotice;
// export const deleteNotice = noticeMockService.deleteNotice;
// export const resetToSeed = noticeMockService.resetToSeed;
*/
