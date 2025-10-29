"use client";

import { useEffect, useState } from "react";
import { getWords, addToFavorites, getFavorites, Word } from "@/app/lib/storage";
import Link from "next/link";

export default function ReviewPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<Word[]>([]);
  const [searchWord, setSearchWord] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");

  // تحميل الكلمات والموقع الحالي من localStorage بعد تحميل الكلمات
  useEffect(() => {
    const savedWords = getWords();
    setWords(savedWords);

    const savedIndex = Number(localStorage.getItem("currentIndex")) || 0;
    if (savedIndex >= 0 && savedIndex < savedWords.length) {
      setIndex(savedIndex);
    } else {
      setIndex(0);
    }

    const savedFavorites = getFavorites ? getFavorites() : [];
    setFavorites(savedFavorites);
  }, []);

  // حفظ الكلمة الحالية عند التغيير
  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem("currentIndex", index.toString());
    }
  }, [index, words]);

  const nextWord = () => setIndex((prev) => (prev + 1) % words.length);
  const prevWord = () => setIndex((prev) => (prev - 1 + words.length) % words.length);

  const handleAddFavorite = (word: Word) => {
    addToFavorites(word);
    setFavorites((prev) => [...prev, word]);
  };

  const handleSearchWord = () => {
    const foundIndex = words.findIndex((w) =>
      w.word.toLowerCase().includes(searchWord.toLowerCase())
    );
    if (foundIndex !== -1) {
      setIndex(foundIndex);
      setSearchWord("");
    } else {
      alert("❌ لا توجد كلمة مطابقة!");
    }
  };

  const handleSearchId = () => {
    const idNum = parseInt(searchId);
    const foundIndex = words.findIndex((w) => w.id === idNum);
    if (foundIndex !== -1) {
      setIndex(foundIndex);
      setSearchId("");
    } else {
      alert("❌ لا توجد كلمة مطابقة!");
    }
  };

  // 🔊 دالة القراءة
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // يمكنك تغييره حسب اللغة
      window.speechSynthesis.speak(utterance);
    } else {
      alert("");
    }
  };

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <p className="text-xl mb-4">لا توجد كلمات بعد! أضف كلمات لبدء المراجعة.</p>
        <Link href="/" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition">
          العودة إلى الرئيسية
        </Link>
      </div>
    );
  }

  const currentWord = words[index];
  const isFavorite = favorites.some((fav) => fav.id === currentWord.id);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">مراجعة يومية</h1>

      {/* مربعات البحث */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 w-full max-w-md">
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="بحث بالكلمة..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 text-white focus:outline-none border border-gray-700"
          />
          <button
            onClick={handleSearchWord}
            className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-500 transition"
          >
            بحث
          </button>
        </div>

        <div className="flex gap-2 w-full">
          <input
            type="number"
            placeholder="احبث بالرقم..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 text-white focus:outline-none border border-gray-700"
          />
          <button
            onClick={handleSearchId}
            className="bg-green-600 px-3 py-2 rounded hover:bg-green-500 transition"
          >
            بحث
          </button>
        </div>
      </div>

      {/* عرض الكلمة الحالية */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-md text-center">
        <p className="text-gray-400 mb-2">
          الكلمة {index + 1}  ---      من اصل   ---    {words.length}
        </p>
        <h2 className="text-2xl font-semibold mb-3">{currentWord.word}</h2>
        <p className="text-lg text-green-400 mb-4">{currentWord.meaning}</p>
        <p className="italic mb-2">"{currentWord.example}"</p>
        <p className="text-gray-300 mb-4">{currentWord.exampleTranslation}</p>

        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => speakText(currentWord.word)}
            className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-500 transition"
          >
            🔊 استمع للكلمة
          </button>
          <button
            onClick={() => speakText(`${currentWord.example}. ${currentWord.exampleTranslation}`)}
            className="bg-green-600 px-3 py-2 rounded hover:bg-green-500 transition"
          >
            🔊  استمع للمثال
          </button>
        </div>

        <button
          onClick={() => handleAddFavorite(currentWord)}
          disabled={isFavorite}
          className={`px-3 py-2 rounded transition ${
            isFavorite
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {isFavorite ? "❤️ تمت الإضافة" : "🤍 أضف إلى المفضلة"}
        </button>
      </div>

      {/* أزرار التنقل */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={prevWord}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Previous
        </button>

        <button
          onClick={nextWord}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
        >
          Next
        </button>
      </div>

      {/* روابط التنقل */}
      <div className="flex gap-4 mt-6">
        <Link href="/" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
          العودة إلى الرئيسية
        </Link>

        <Link href="/favorites" className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500 transition">
          عرض المفضلة
        </Link>
      </div>
    </div>
  );
}
