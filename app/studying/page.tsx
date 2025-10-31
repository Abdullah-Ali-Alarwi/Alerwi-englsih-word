"use client";

import { useWordStore } from "@/app/lib/storage";
import WordCard from "@/app/components/WordCard";

export default function StudyingPage() {
  const { words, wordStatusMap, toggleWordStatus } = useWordStore();

  // فلتر الكلمات التي حالتها "studying"
  const studyingWords = words.filter((w) => wordStatusMap[w.id] === "studying");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">كلمات قيد الدراسة</h1>
          <p className="text-gray-300 mt-1">
            عدد الكلمات قيد الدراسة: <span className="font-semibold">{studyingWords.length}</span>
          </p>
        </div>
      </header>

      {studyingWords.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-gray-400 text-lg m-auto mt-[250px]">لا توجد كلمات قيد الدراسة حاليًا.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyingWords.map((w, index) => (
            <div key={w.id} className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
              <WordCard
                id={index + 1}
                word={w.word}
                meaning={w.meaning}
                example={w.example}
                exampleTranslation={w.exampleTranslation}
              />

              {/* زر تغيير الحالة */}
              <button
                onClick={() => toggleWordStatus(w.id)}
                className="mt-3 w-full py-2 rounded bg-blue-600 hover:bg-blue-500 transition"
              >
                {wordStatusMap[w.id] === "studying" ? "قيد الدراسة" : "محفوظة"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
