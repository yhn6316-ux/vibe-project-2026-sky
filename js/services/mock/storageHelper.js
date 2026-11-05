/**
 * LocalStorage Mock DB 도우미 유틸리티
 * 
 * localstorage_to_firebase_guidelines.md 지침 준수:
 * - 네트워크 레이턴시 시뮬레이션 (100~300ms)
 * - 안전한 JSON 직렬화 / 역직렬화
 * - 브라우저 localStorage 미지원 또는 Node 테스트 환경 fallback
 */

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// Node 테스트 환경이나 프라이빗 브라우징 fallback을 위한 메모리 저장소
const memoryStore = new Map();

const getStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== "undefined" && globalThis.localStorage) {
    return globalThis.localStorage;
  }
  return {
    getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key) : null),
    setItem: (key, val) => memoryStore.set(key, String(val)),
    removeItem: (key) => memoryStore.delete(key),
  };
};

export const storageHelper = {
  get: async (key, defaultValue = null) => {
    await delay(120);
    try {
      const storage = getStorage();
      const item = storage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`[storageHelper] Failed to read key "${key}":`, error);
      return defaultValue;
    }
  },

  set: async (key, value) => {
    await delay(120);
    try {
      const storage = getStorage();
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
    } catch (error) {
      if (
        typeof DOMException !== "undefined" &&
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        throw new Error("ブラウザーの保存容量(約5MB)を超えました。添付ファイルや本文を減らしてください。");
      }
      throw error;
    }
  },

  remove: async (key) => {
    await delay(100);
    const storage = getStorage();
    storage.removeItem(key);
  },
};
