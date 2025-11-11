// app/lib/storage.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import wordsData from "@/data/words.json";

// تعريف نوع الكلمة
export interface Word {
  id: number;
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

// تحديث نوع الحالة لدعم الكلمات الصعبة
export type WordStatus = "studying" | "saved" | "hard";

// تعريف الـ store
interface WordStore {
  words: Word[];
  favorites: Word[];
  wordStatusMap: Record<number, WordStatus>;
  pinnedWordId: number | null;

  // دوال التحكم
  toggleWordStatus: (id: number) => void;
  setWordStatus: (id: number, status: WordStatus) => void;
  removeWordFromHard: (id: number) => void;
  addFavorite: (word: Word) => void;
  removeFavorite: (id: number) => void;
  addWord: (word: Word) => void;
  initializeStatuses: () => void;
  setPinnedWordId: (id: number | null) => void;
}

// إنشاء الـ store
export const useWordStore = create<WordStore>()(
  persist(
    (set, get) => ({
      words: wordsData,
      favorites: [],
      wordStatusMap: {},
      pinnedWordId: null,

      // إضافة كلمة جديدة إذا لم تكن موجودة
      addWord: (newWord: Word) => {
        const words = get().words;
        if (!words.some((w) => w.id === newWord.id)) {
          set({ words: [...words, newWord] });
        }
      },

      // مزامنة حالات الكلمات عند فتح التطبيق
      initializeStatuses: () => {
        const state = get();
        const statusMap: Record<number, WordStatus> = {};
        wordsData.forEach((w) => {
          statusMap[w.id] = state.wordStatusMap[w.id] || "studying";
        });
        set({ words: wordsData, wordStatusMap: statusMap });
      },

      // تبديل حالة الكلمة بين "studying" و "saved"
      toggleWordStatus: (id: number) => {
        const currentStatus = get().wordStatusMap[id] || "studying";
        set({
          wordStatusMap: {
            ...get().wordStatusMap,
            [id]: currentStatus === "studying" ? "saved" : "studying",
          },
        });
      },

      // تعيين حالة أي كلمة
      setWordStatus: (id: number, status: WordStatus) => {
        set({
          wordStatusMap: {
            ...get().wordStatusMap,
            [id]: status,
          },
        });
      },

      // إزالة كلمة من حالة "hard"
      removeWordFromHard: (id: number) => {
        const statusMap = { ...get().wordStatusMap };
        if (statusMap[id] === "hard") {
          statusMap[id] = "studying";
          set({ wordStatusMap: statusMap });
        }
      },

      // إضافة كلمة للمفضلة
      addFavorite: (word: Word) => {
        const favorites = get().favorites;
        if (!favorites.some((f) => f.id === word.id)) {
          set({ favorites: [...favorites, word] });
        }
      },

      // إزالة كلمة من المفضلة
      removeFavorite: (id: number) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },

      // تعيين الكلمة المثبتة
      setPinnedWordId: (id: number | null) => {
        set({ pinnedWordId: id });
      },
    }),
    {
      name: "word-storage",
      partialize: (state) => ({
        favorites: state.favorites,
        wordStatusMap: state.wordStatusMap,
        pinnedWordId: state.pinnedWordId,
        words: state.words,
      }),
    }
  )
);

// دوال مساعدة
export const getFavorites = (): Word[] => useWordStore.getState().favorites;

export const removeFromFavorites = (id: number) => {
  const store = useWordStore.getState();
  if (store.favorites.some((f) => f.id === id)) {
    store.removeFavorite(id);
  }
};
