/**
 * Firestore 기반 공지사항 서비스 구현체 스텁 (마이그레이션 대비용)
 * 
 * localstorage_to_firebase_guidelines.md 5단계 명세에 맞춘 구현 템플릿입니다.
 * Firebase SDK 설치 및 firebaseConfig 설정 후 postService 진입점만 교체하면 즉시 동작합니다.
 */

/*
// [Firebase 마이그레이션 활성화 시 주석 해제]
import { 
  collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, where 
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const COLLECTION_NAME = "notices";
*/

export const noticeFirebaseService = {
  getNotices: async ({ category = "すべて", keyword = "" } = {}) => {
    throw new Error("noticeFirebaseService: Firebase SDK와 Firestore 설정이 아직 연결되지 않았습니다. noticeService.js에서 Mock 모드를 사용하세요.");
    /*
    const colRef = collection(db, COLLECTION_NAME);
    let q = query(colRef, orderBy("no", "desc"));
    if (category && category !== "すべて") {
      q = query(colRef, where("category", "==", category), orderBy("no", "desc"));
    }
    const snapshot = await getDocs(q);
    let list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(kw));
    }
    return list;
    */
  },

  getNoticeById: async (id) => {
    throw new Error("noticeFirebaseService: Firestore 연결 대기 중");
    /*
    const d = await getDoc(doc(db, COLLECTION_NAME, id));
    return d.exists() ? ({ id: d.id, ...d.data() }) : null;
    */
  },

  createNotice: async (data) => {
    throw new Error("noticeFirebaseService: Firestore 연결 대기 중");
    /*
    const nowIso = new Date().toISOString();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
    return { id: docRef.id, ...data, createdAt: nowIso, updatedAt: nowIso };
    */
  },

  updateNotice: async (id, data) => {
    throw new Error("noticeFirebaseService: Firestore 연결 대기 중");
    /*
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { id, ...data };
    */
  },

  deleteNotice: async (id) => {
    throw new Error("noticeFirebaseService: Firestore 연결 대기 중");
    /*
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    */
  },
};

