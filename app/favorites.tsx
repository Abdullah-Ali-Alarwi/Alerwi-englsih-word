"use client";

import { useEffect, useState } from "react";
import { getFavorites, removeFromFavorites, Word } from "@/app/lib/storage";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Word[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id: number) => {
    removeFromFavorites(id);
    setFavorites(getFavorites());
  };

  // دالة قراءة النصوص مع حماية SSR
  const speakText = (text: string, lang: string = "en-US") => {
    if (typeof window === "undefined") return; // حماية ضد SSR

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <p className="text-xl mb-4">لا توجد كلمات محفوظة بعد!</p>
        <Link href="/" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">⭐ الكلمات المفضلة</h1>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {favorites.map((word) => (
          <div
            key={word.id}
            className="bg-gray-800 p-5 rounded-xl shadow-md flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{word.word}</h2>
              <button
                onClick={() => speakText(word.word)}
                className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white"
              >
                🔊
              </button>
            </div>

            <p className="text-green-400">{word.meaning}</p>

            <div className="flex items-center justify-between">
              <p className="italic text-gray-300">"{word.example}"</p>
              <button
                onClick={() => speakText(word.example)}
                className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white"
              >
                🔊
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-400">{word.exampleTranslation}</p>
              <button
                onClick={() => speakText(word.exampleTranslation, "ar-SA")}
                className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white"
              >
                🔊
              </button>
            </div>

            <button
              onClick={() => handleRemove(word.id)}
              className="mt-3 bg-red-600 hover:bg-red-500 px-3 py-2 rounded transition"
            >
              إزالة ❌
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
