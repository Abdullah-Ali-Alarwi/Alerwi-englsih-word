"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getWords, Word, addToFavorites, getFavorites } from "@/app/lib/storage";
import WordCard from "@/app/components/WordCard";

type WordStatus = "studying" | "saved";

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [pinnedWordId, setPinnedWordId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Word[]>([]);
  const [wordStatusMap, setWordStatusMap] = useState<{ [key: number]: WordStatus }>({});
  const wordRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // تحميل البيانات من localStorage
  useEffect(() => {
    setWords(getWords());
    setFavorites(getFavorites());

    const savedPinned = localStorage.getItem("pinnedWordId");
    if (savedPinned) setPinnedWordId(Number(savedPinned));

    const savedStatuses = localStorage.getItem("wordStatusMap");
    if (savedStatuses) setWordStatusMap(JSON.parse(savedStatuses));
  }, []);

  // تحديث localStorage والتمرير عند تغيير pinnedWordId
  useEffect(() => {
    if (pinnedWordId !== null) {
      const element = wordRefs.current[pinnedWordId];
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
      localStorage.setItem("pinnedWordId", pinnedWordId.toString());
    }
  }, [pinnedWordId]);

  // تغيير حالة الكلمة
  const toggleWordStatus = (id: number) => {
    const newStatus: WordStatus = wordStatusMap[id] === "saved" ? "studying" : "saved";
    const updatedMap = { ...wordStatusMap, [id]: newStatus };
    setWordStatusMap(updatedMap);
    localStorage.setItem("wordStatusMap", JSON.stringify(updatedMap));
  };

  // تغيير التثبيت
  const togglePin = (id: number) => {
    if (pinnedWordId === id) {
      setPinnedWordId(null);
      localStorage.removeItem("pinnedWordId");
    } else {
      setPinnedWordId(id);
    }
  };

  // إضافة كلمة للمفضلة
  const handleAddFavorite = (word: Word) => {
    const isAlreadyFavorite = favorites.some((f) => f.id === word.id);
    if (!isAlreadyFavorite) {
      addToFavorites(word);
      setFavorites(getFavorites());
    }
  };

  // عد الكلمات حسب الحالة
  const savedCount = Object.values(wordStatusMap).filter((status) => status === "saved").length;
  const studyingCount = Object.values(wordStatusMap).filter((status) => status === "studying").length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-yellow-400">قاموس العروي</h1>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/add-word"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            إضافة كلمة
          </Link>
          <Link
            href="/review"
            className="bg-gray-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            مراجعة الكلمات
          </Link>
          <Link
            href="/saved"
            className="bg-gray-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
          >
            الكلمات المحفوظة
            <span className="bg-gray-100 text-black px-2 py-0.5 rounded-full text-sm">{savedCount}</span>
          </Link>
          <Link
            href="/studying"
            className="bg-gray-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
          >
            قيد الدراسة
            <span className="bg-gray-100 text-black px-2 py-0.5 rounded-full text-sm">{studyingCount}</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      {words.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-gray-400 text-lg m-auto mt-[250px]">جارٍ التحميل...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((w, index) => {
            const isPinned = pinnedWordId === w.id;
            const isFavorite = favorites.some((f) => f.id === w.id);
            const wordStatus = wordStatusMap[w.id] || "studying";

            return (
              <div
                key={w.id}
                ref={(el) => { wordRefs.current[w.id] = el; }} // ✅ void ref
                className={`relative p-5 rounded-xl shadow-lg border border-gray-700 transition
                  ${isPinned ? "bg-green-900" : "bg-gray-800"} hover:shadow-2xl`}
              >
                {/* رقم الكلمة وزر الحالة */}
                <div className="absolute top-2 right-3 flex gap-2 items-center">
                  <button
                    onClick={() => toggleWordStatus(w.id)}
                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold transition ${
                      wordStatus === "saved" ? "bg-green-500 text-black" : "bg-gray-600 text-white"
                    }`}
                  >
                    {wordStatus === "saved" ? "محفوظة" : "قيد الدراسة"}
                  </button>
                </div>

                {/* رمز التثبيت */}
                <div
                  className="absolute top-2 left-3 cursor-pointer text-xl"
                  onClick={() => togglePin(w.id)}
                  title={isPinned ? "إلغاء التثبيت" : "تثبيت الكلمة"}
                >
                  {isPinned ? "📌" : "📍"}
                </div>

                {/* محتوى الكرت */}
                <WordCard
                  id={index + 1}
                  word={w.word}
                  meaning={w.meaning}
                  example={w.example}
                  exampleTranslation={w.exampleTranslation}
                />

                {/* زر إضافة إلى المفضلة */}
                <button
                  onClick={() => handleAddFavorite(w)}
                  disabled={isFavorite}
                  className={`mt-3 w-full py-2 rounded transition ${
                    isFavorite
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-green-900"
                  }`}
                >
                  {isFavorite ? "❤️ أضيفت للمفضلة" : "🤍 أضف للمفضلة"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
