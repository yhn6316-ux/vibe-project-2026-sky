/**
 * Firestore 기반 공지사항 서비스 구현체
 * 
 * - Firestore 연동 및 기존 첨부파일(Base64 인라인 저장) 유지
 * - 컬렉션이 비어있는 경우 초기 시드 데이터(1001~1007) 자동 주입 지원
 */

import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebaseConfig.js";
import { initialNoticesSeed } from "../mock/noticeMockService.js";

const COLLECTION_NAME = "notices";

export const noticeFirebaseService = {
  /**
   * 공지사항 목록 조회 (카테고리 필터, 검색어 필터, no 내림차순 정렬)
   */
  getNotices: async ({ category = "すべて", keyword = "" } = {}) => {
    const colRef = collection(db, COLLECTION_NAME);

    // 1. 전체 또는 카테고리 쿼리
    let q;
    if (category && category !== "すべて") {
      q = query(colRef, where("category", "==", category));
    } else {
      q = query(colRef);
    }

    let snapshot = await getDocs(q);

    // 컬렉션이 완전히 비어있을 경우, 최초 1회 초기 시드 데이터 자동 주입
    if (snapshot.empty && (!category || category === "すべて")) {
      await noticeFirebaseService.resetToSeed();
      snapshot = await getDocs(query(colRef));
    }

    let list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 번호(no) 내림차순 정렬
    list.sort((a, b) => (b.no ?? 0) - (a.no ?? 0));

    // 키워드 검색 필터링 (클라이언트 단 검색)
    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter((item) => (item.title || "").toLowerCase().includes(kw));
    }

    return list;
  },

  /**
   * ID로 공지사항 단건 조회
   */
  getNoticeById: async (id) => {
    if (!id) return null;
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  /**
   * 신규 공지사항 생성
   */
  createNotice: async (data) => {
    // 가장 큰 no 번호 계산
    const allNotices = await noticeFirebaseService.getNotices();
    const maxNo = allNotices.reduce((max, cur) => Math.max(max, cur.no || 0), 1000);
    const now = new Date().toISOString();
    const newId = crypto.randomUUID();

    const newNotice = {
      no: maxNo + 1,
      title: data.title?.trim() || "",
      category: data.category || "お知らせ",
      badge:
        data.badge ||
        (data.category === "キャンペーン"
          ? "キャンペーン"
          : data.category === "イベント"
          ? "イベント"
          : "お知らせ"),
      content: data.content || "",
      // 첨부파일 기존 base64 인라인 방식 유지
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = doc(db, COLLECTION_NAME, newId);
    await setDoc(docRef, newNotice);

    return { id: newId, ...newNotice };
  },

  /**
   * 공지사항 수정
   */
  updateNotice: async (id, data) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      throw new Error(`Notice with ID "${id}" was not found.`);
    }

    const current = snap.data();
    const now = new Date().toISOString();

    const updatedFields = {
      title: data.title !== undefined ? data.title.trim() : current.title,
      category: data.category !== undefined ? data.category : current.category,
      badge:
        data.badge !== undefined
          ? data.badge
          : data.category === "キャンペーン"
          ? "キャンペーン"
          : data.category === "イベント"
          ? "イベント"
          : "お知らせ",
      content: data.content !== undefined ? data.content : current.content,
      attachments:
        Array.isArray(data.attachments) ? data.attachments : current.attachments,
      updatedAt: now,
    };

    await updateDoc(docRef, updatedFields);
    return { id, ...current, ...updatedFields };
  },

  /**
   * 공지사항 삭제
   */
  deleteNotice: async (id) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  /**
   * 초기 시드 데이터 Firestore에 주입
   */
  resetToSeed: async () => {
    for (const item of initialNoticesSeed) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      const { id, ...data } = item;
      await setDoc(docRef, data);
    }
  },
};
