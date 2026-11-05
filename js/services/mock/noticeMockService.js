/**
 * 공지사항 Mock 데이터 서비스 (LocalStorage 기반)
 * 
 * localstorage_to_firebase_guidelines.md 규칙 준수:
 * 1. UI 컴포넌트의 직접 접근 배제 (Strict Decoupling)
 * 2. 모든 함수는 async (Promise 반환)
 * 3. Firestore 친화적 데이터 모델링 (문자열 id, ISO 타임스탬프, NoSQL 구조)
 * 4. crypto.randomUUID() 식별자 생성
 * 5. 최초 실행 시 이미지 4의 1001~1007 7건 자동 시딩
 */

import { storageHelper } from "./storageHelper.js";

const STORAGE_KEY = "notices";

// 7건의 초기 시드 데이터 (1001 ~ 1007)
export const initialNoticesSeed = [
  {
    id: "notice-seed-1007",
    no: 1007,
    title: "サンリオショップ 一部店舗の営業時間変更のお知らせ",
    category: "ショップ",
    badge: "お知らせ",
    content: "<p>サンリオショップ一部店舗の営業時間を変更いたします。<br>ご来店の際は各店舗の営業時間をご確認ください。</p>",
    attachments: [],
    createdAt: "2026-10-29T10:00:00.000Z",
    updatedAt: "2026-10-29T10:00:00.000Z",
  },
  {
    id: "notice-seed-1006",
    no: 1006,
    title: "「Sanrio characters DREAM FESTIVAL」開催決定♡",
    category: "イベント",
    badge: "イベント",
    content: "<p>「Sanrio characters DREAM FESTIVAL」の開催が決定いたしました！♡<br>たくさんの楽しい企画をご用意しております。続報をお楽しみに♪</p>",
    attachments: [],
    createdAt: "2026-10-24T10:00:00.000Z",
    updatedAt: "2026-10-24T10:00:00.000Z",
  },
  {
    id: "notice-seed-1005",
    no: 1005,
    title: "サンリオオンラインショップ メンテナンスのお知らせ",
    category: "ショップ",
    badge: "お知らせ",
    content: "<p>システムメンテナンスのため、サンリオオンラインショップのサービスを一時停止いたします。<br>ご不便をおかけしますが、ご理解のほどよろしくお願い申し上げます。</p>",
    attachments: [],
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "notice-seed-1004",
    no: 1004,
    title: "ハローキティ50周年記念グッズ 発売のお知らせ",
    category: "グッズ",
    badge: "イベント",
    content: "<p>ハローキティ50周年を記念した限定アニバーサリーグッズが発売されます！♡<br>特別なデザインのアイテムをぜひチェックしてくださいね。</p>",
    attachments: [],
    createdAt: "2026-10-16T10:00:00.000Z",
    updatedAt: "2026-10-16T10:00:00.000Z",
  },
  {
    id: "notice-seed-1003",
    no: 1003,
    title: "「ピューロランド」11月の休館日について",
    category: "スポット",
    badge: "お知らせ",
    content: "<p>サンリオピューロランドの11月休館日スケジュールをご案内いたします。<br>ご来場前に公式カレンダーをご確認いただきますようお願いいたします。</p>",
    attachments: [],
    createdAt: "2026-10-14T10:00:00.000Z",
    updatedAt: "2026-10-14T10:00:00.000Z",
  },
  {
    id: "notice-seed-1002",
    no: 1002,
    title: "サンリオキャラクター大賞 投票スタート！♡",
    category: "キャンペーン",
    badge: "キャンペーン",
    // 상세 화면 이미지 3의 실제 본문 텍스트 일치
    content: `<p>今年も「サンリオキャラクター大賞」の投票がスタートしました♡<br>みなさまの投票で、いちばん好きなキャラクターを応援してください！</p>
<p><strong>🎀 投票期間</strong><br>2026年10月10日（土）〜 11月16日（日）17:00まで</p>
<p><strong>🎀 投票方法</strong><br>サンリオ公式サイトより、1日1回投票できます♪<br>※投票にはサンリオIDが必要です。</p>
<p>たくさんの投票をお待ちしております♡</p>`,
    attachments: [
      {
        name: "sanrio-character-award-2026.png",
        size: 220918,
        type: "image/png",
        url: "../images/used/notice-award-thumb.png",
      },
    ],
    createdAt: "2026-10-10T10:00:00.000Z",
    updatedAt: "2026-10-10T10:00:00.000Z",
  },
  {
    id: "notice-seed-1001",
    no: 1001,
    title: "公式アプリのアップデートについて",
    category: "アプリ",
    badge: "お知らせ",
    content: "<p>サンリオ公式アプリの最新バージョンを公開いたしました。<br>より快適にご利用いただけるようパフォーマンスの改善と不具合の修正を行いました。</p>",
    attachments: [],
    createdAt: "2026-10-08T10:00:00.000Z",
    updatedAt: "2026-10-08T10:00:00.000Z",
  },
];

// 내부 헬퍼: 저장소에서 공지사항 목록 읽기 (초기 데이터 없으면 시딩)
const getRawNotices = async () => {
  const existing = await storageHelper.get(STORAGE_KEY, null);
  if (existing && Array.isArray(existing) && existing.length > 0) {
    return existing;
  }
  // 초기 시드 주입
  await storageHelper.set(STORAGE_KEY, initialNoticesSeed);
  return [...initialNoticesSeed];
};

export const noticeMockService = {
  /**
   * 공지사항 목록 조회 (카테고리 필터, 검색어 필터, 내림차순 정렬)
   */
  getNotices: async ({ category = "すべて", keyword = "" } = {}) => {
    const list = await getRawNotices();
    const cleanKeyword = keyword.trim().toLowerCase();

    return list
      .filter((item) => {
        if (category && category !== "すべて" && item.category !== category) {
          return false;
        }
        if (cleanKeyword && !item.title.toLowerCase().includes(cleanKeyword)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => (b.no ?? 0) - (a.no ?? 0));
  },

  /**
   * ID로 공지사항 단건 조회
   */
  getNoticeById: async (id) => {
    const list = await getRawNotices();
    const found = list.find((item) => item.id === id);
    return found ? { ...found } : null;
  },

  /**
   * 신규 공지사항 생성
   */
  createNotice: async (data) => {
    const list = await getRawNotices();
    const maxNo = list.reduce((max, cur) => Math.max(max, cur.no || 0), 1000);
    const now = new Date().toISOString();

    const newNotice = {
      id: crypto.randomUUID(), // Firestore 호환 고유 ID
      no: maxNo + 1,
      title: data.title?.trim() || "",
      category: data.category || "お知らせ",
      badge: data.badge || (data.category === "キャンペーン" ? "キャンペーン" : data.category === "イベント" ? "イベント" : "お知らせ"),
      content: data.content || "",
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newNotice, ...list];
    await storageHelper.set(STORAGE_KEY, updatedList);
    return { ...newNotice };
  },

  /**
   * 공지사항 수정
   */
  updateNotice: async (id, data) => {
    const list = await getRawNotices();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Notice with ID "${id}" was not found.`);
    }

    const current = list[index];
    const now = new Date().toISOString();

    const updated = {
      ...current,
      title: data.title !== undefined ? data.title.trim() : current.title,
      category: data.category !== undefined ? data.category : current.category,
      badge: data.badge !== undefined ? data.badge : (data.category === "キャンペーン" ? "キャンペーン" : data.category === "イベント" ? "イベント" : "お知らせ"),
      content: data.content !== undefined ? data.content : current.content,
      attachments: Array.isArray(data.attachments) ? data.attachments : current.attachments,
      updatedAt: now,
    };

    list[index] = updated;
    await storageHelper.set(STORAGE_KEY, list);
    return { ...updated };
  },

  /**
   * 공지사항 삭제
   */
  deleteNotice: async (id) => {
    const list = await getRawNotices();
    const filtered = list.filter((item) => item.id !== id);
    await storageHelper.set(STORAGE_KEY, filtered);
  },

  /**
   * 시드 데이터로 강제 초기화 (디버깅 / 리셋용)
   */
  resetToSeed: async () => {
    await storageHelper.set(STORAGE_KEY, initialNoticesSeed);
    return [...initialNoticesSeed];
  },
};

