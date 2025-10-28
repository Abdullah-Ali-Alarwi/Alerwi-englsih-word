import wordsData from "@/data/words.json"; // افترض أن لديك ملف words.json في نفس المجلد
export interface Word {
  id: number;
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

const WORDS_KEY = "words";
const FAVORITES_KEY = "favorites";

// جلب جميع الكلمات
export function getWords(): Word[] {
  if (typeof window === "undefined") return [];

  const localData = localStorage.getItem(WORDS_KEY);
  if (localData) {
    return JSON.parse(localData);
  }

  // إذا كان LocalStorage فارغًا، استخدم البيانات من JSON
  localStorage.setItem(WORDS_KEY, JSON.stringify(wordsData));
  return wordsData;
}

// إضافة كلمة جديدة
export function addWord(newWord: Word) {
  if (typeof window === "undefined") return;

  const words = getWords();
  const exists = words.some((w) => w.word === newWord.word);
  if (!exists) {
    words.push(newWord);
    localStorage.setItem(WORDS_KEY, JSON.stringify(words));
  }
}

// جلب المفضلة
export function getFavorites(): Word[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

// إضافة إلى المفضلة
export function addToFavorites(word: Word) {
  if (typeof window === "undefined") return;
  const favorites = getFavorites();
  const exists = favorites.some((w) => w.id === word.id);
  if (!exists) {
    favorites.push(word);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

// إزالة من المفضلة
export function removeFromFavorites(id: number) {
  if (typeof window === "undefined") return;
  const favorites = getFavorites().filter((w) => w.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
