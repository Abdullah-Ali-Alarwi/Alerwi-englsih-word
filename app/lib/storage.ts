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

type WordStatus = "studying" | "saved";

// تعريف الـ store
interface WordStore {
  words: Word[];
  favorites: Word[];
  wordStatusMap: { [key: number]: WordStatus };
  pinnedWordId: number | null;

  // الدوال
  toggleWordStatus: (id: number) => void;
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

      addWord: (newWord: Word) => {
        const words = get().words;
        if (!words.some((w) => w.word === newWord.word)) {
          set({ words: [...words, newWord] });
        }
      },

      initializeStatuses: () => {
        const state = get();
        const storedWords = state.words;
        const initialWords = wordsData;

        // تحقق إذا بيانات JSON تغيرت
        const isChanged =
          storedWords.length !== initialWords.length ||
          storedWords.some((w, i) => w.id !== initialWords[i].id);

        if (isChanged) {
          const statusMap: { [key: number]: WordStatus } = {};
          initialWords.forEach((w) => {
            statusMap[w.id] = state.wordStatusMap[w.id] || "studying";
          });

          set({
            words: initialWords,
            wordStatusMap: statusMap,
          });
        }
      },

      toggleWordStatus: (id: number) => {
        const currentStatus = get().wordStatusMap[id] || "studying";
        set({
          wordStatusMap: {
            ...get().wordStatusMap,
            [id]: currentStatus === "studying" ? "saved" : "studying",
          },
        });
      },

      addFavorite: (word: Word) => {
        const favorites = get().favorites;
        if (!favorites.some((f) => f.id === word.id)) {
          set({ favorites: [...favorites, word] });
        }
      },

      removeFavorite: (id: number) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },

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
        words: state.words, // نحتفظ بالكلمات بس نحدثها إذا تغير JSON
      }),
    }
  )
);

// دوال مساعدة يمكن استدعاؤها مباشرة
export const getFavorites = () => useWordStore.getState().favorites;

export const removeFromFavorites = (id: number) =>
  useWordStore.getState().favorites.find((f) => f.id === id)
    ? useWordStore.getState().removeFavorite(id)
    : null;
