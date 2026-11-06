/**
 * authService.js - Firebase Firestore 기반 회원가입 / 로그인 / 인증 상태 관리 서비스
 * 
 * 기능:
 * 1. 기본 관리자 계정(admin) Firestore 자동 초기화 (수동 등록 사양 충족)
 * 2. 아이디 중복 체크, 이메일 중복 체크
 * 3. 회원가입: 이름, 아이디, 비밀번호, 이메일 Firestore 'users' 컬렉션에 저장
 * 4. 로그인: 아이디, 비밀번호 검증 후 SessionStorage / LocalStorage에 세션 저장 및 이벤트 브로드캐스트
 * 5. 로그아웃: 세션 클리어 및 리다이렉트 / UI 갱신
 * 6. 현재 로그인 사용자 조회 및 관리자(isAdmin) 여부 판별
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase/firebaseConfig.js";

const USERS_COLLECTION = "users";
const SESSION_KEY = "sanrio_auth_user";

// 기본 관리자 계정 정보
export const ADMIN_CREDENTIALS = {
  name: "관리자",
  userId: "admin",
  password: "1111",
  email: "admin.com@company.co.kr",
  role: "admin",
  createdAt: new Date().toISOString(),
};

/**
 * 관리자 계정 초기화 (Firestore에 없으면 생성)
 */
export const initAdminAccount = async () => {
  try {
    const adminDocRef = doc(db, USERS_COLLECTION, ADMIN_CREDENTIALS.userId);
    const snap = await getDoc(adminDocRef);
    if (!snap.exists()) {
      await setDoc(adminDocRef, ADMIN_CREDENTIALS);
      console.log("관리자 계정(admin)이 Firestore에 성공적으로 등록되었습니다.");
    }
  } catch (err) {
    console.error("관리자 계정 초기화 중 오류 발생:", err);
  }
};

// 모듈 로드시 관리자 계정 자동 확인/등록
initAdminAccount();

/**
 * 아이디 중복 확인
 * @param {string} userId 
 * @returns {Promise<boolean>} 사용 가능하면 true, 중복이면 false
 */
export const checkUserIdAvailable = async (userId) => {
  const trimmedId = userId.trim();
  if (!trimmedId) return false;
  const userDocRef = doc(db, USERS_COLLECTION, trimmedId);
  const snap = await getDoc(userDocRef);
  return !snap.exists();
};

/**
 * 이메일 중복 확인
 * @param {string} email 
 * @returns {Promise<boolean>} 사용 가능하면 true, 중복이면 false
 */
export const checkEmailAvailable = async (email) => {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) return false;
  const q = query(
    collection(db, USERS_COLLECTION),
    where("email", "==", trimmedEmail)
  );
  const snap = await getDocs(q);
  return snap.empty;
};

/**
 * 회원가입
 * @param {Object} userData { name, userId, password, email }
 * @returns {Promise<Object>} 등록된 사용자 정보 (비밀번호 제외)
 */
export const registerUser = async ({ name, userId, password, email }) => {
  const cleanName = (name || "").trim();
  const cleanId = (userId || "").trim();
  const cleanPassword = (password || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanName) throw new Error("이름을 입력해주세요.");
  if (!cleanId) throw new Error("아이디를 입력해주세요.");
  if (!cleanPassword) throw new Error("비밀번호를 입력해주세요.");
  if (!cleanEmail) throw new Error("이메일을 입력해주세요.");

  // 중복 검사
  const isIdOk = await checkUserIdAvailable(cleanId);
  if (!isIdOk) {
    throw new Error("이미 사용 중인 아이디입니다.");
  }

  const isEmailOk = await checkEmailAvailable(cleanEmail);
  if (!isEmailOk) {
    throw new Error("이미 등록된 이메일 주소입니다.");
  }

  const role = cleanId === ADMIN_CREDENTIALS.userId ? "admin" : "user";
  const newUser = {
    name: cleanName,
    userId: cleanId,
    password: cleanPassword,
    email: cleanEmail,
    role,
    createdAt: new Date().toISOString(),
  };

  const userDocRef = doc(db, USERS_COLLECTION, cleanId);
  await setDoc(userDocRef, newUser);

  const { password: _, ...safeUser } = newUser;
  return safeUser;
};

/**
 * 로그인
 * @param {string} userId 
 * @param {string} password 
 * @returns {Promise<Object>} 로그인한 사용자 객체
 */
export const loginUser = async (userId, password) => {
  const cleanId = (userId || "").trim();
  const cleanPassword = (password || "").trim();

  if (!cleanId || !cleanPassword) {
    throw new Error("아이디와 비밀번호를 모두 입력해주세요.");
  }

  const userDocRef = doc(db, USERS_COLLECTION, cleanId);
  let snap = await getDoc(userDocRef);

  // Firestore에 관리자 계정이 없는데 관리자로 로그인 시도하는 경우 자동 생성 후 다시 조회
  if (!snap.exists() && cleanId === ADMIN_CREDENTIALS.userId && cleanPassword === ADMIN_CREDENTIALS.password) {
    await initAdminAccount();
    snap = await getDoc(userDocRef);
  }

  if (!snap.exists()) {
    throw new Error("존재하지 않는 아이디입니다.");
  }

  const userData = snap.data();
  if (userData.password !== cleanPassword) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const sessionUser = {
    name: userData.name,
    userId: userData.userId,
    email: userData.email,
    role: userData.role || (userData.userId === "admin" ? "admin" : "user"),
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  // 상태 변경 이벤트 통지
  window.dispatchEvent(new CustomEvent("sanrio:authChange", { detail: sessionUser }));
  return sessionUser;
};

/**
 * 로그아웃
 */
export const logoutUser = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("sanrio:authChange", { detail: null }));
};

/**
 * 현재 로그인 사용자 정보 가져오기
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

/**
 * 관리자 여부 확인
 * @returns {boolean}
 */
export const isAdminUser = () => {
  const user = getCurrentUser();
  return !!user && (user.role === "admin" || user.userId === "admin");
};

