"use client";

import { useWordStore, Word } from "@/app/lib/storage";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useWordStore();

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("🔊 قراءة النصوص غير مدعومة في هذا الجهاز أو أثناء البناء على السيرفر.");
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">المفضلة</h1>
        <p className="text-gray-400 text-lg">لا توجد كلمات محفوظة بعد!</p>
        <Link
          href="/"
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded shadow transition"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">المفضلة ({favorites.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...favorites].reverse().map((word: Word) => ( // ✅ عكس الترتيب
          <div
            key={word.id}
            className="p-5 rounded-xl shadow-lg flex flex-col justify-between bg-gray-800 hover:bg-gray-700 transition"
          >
            <h2 className="text-2xl font-bold text-white">{word.word}</h2>
            <p className="text-gray-300 italic mb-1">{word.meaning}</p>
            <p className="text-gray-400 text-sm">
              <span className="font-semibold">Example: </span>
              {word.example}
            </p>
            <p className="text-gray-400 text-sm">
              <span className="font-semibold">Translation: </span>
              {word.exampleTranslation}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => speakText(word.word)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded transition"
              >
                🔊 قراءة الكلمة
              </button>

              <button
                onClick={() =>
                  speakText(`${word.meaning}. ${word.example}. ${word.exampleTranslation}`)
                }
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded transition"
              >
                🔊 قراءة المثال
              </button>

              <button
                onClick={() => removeFavorite(word.id)}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2 rounded transition"
              >
                إزالة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
