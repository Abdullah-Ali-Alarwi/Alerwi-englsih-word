"use client";

import { useEffect, useRef } from "react";
import WordCard from "@/app/components/WordCard";
import { useWordStore } from "@/app/lib/storage";
import Image from "next/image";
import logo from "@/public/dictionaryLogo.png"

export default function HomePage() {
  const {
    words,
    favorites,
    wordStatusMap,
    toggleWordStatus,
    addFavorite,
    pinnedWordId,
    setPinnedWordId,
  } = useWordStore();

  const wordRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // تمرير تلقائي عند تغيير pinnedWordId
  useEffect(() => {
    if (pinnedWordId !== null) {
      const element = wordRefs.current[pinnedWordId];
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pinnedWordId]);

  const togglePin = (id: number) => {
    if (pinnedWordId === id) setPinnedWordId(null);
    else setPinnedWordId(id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">

    <Image src={logo} alt="Dictionary" width={120} height={120} className="md:hidden  mb-3  m-auto " />

      {words.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-gray-400 text-lg m-auto mt-[250px]">
            جارٍ التحميل...
          </p>
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
                ref={(el) => { wordRefs.current[w.id] = el; }}
                className={`relative p-5 rounded-xl shadow-lg border border-gray-700 transition
                  ${isPinned ? "bg-green-900" : "bg-gray-800"} hover:shadow-2xl`}
              >
                {/* زر تغيير الحالة */}
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

                {/* زر التثبيت */}
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

                {/* زر إضافة للمفضلة */}
                <button
                  onClick={() => addFavorite(w)}
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
