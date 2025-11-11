"use client";

import { useWordStore, Word } from "@/app/lib/storage";
import WordCard from "@/app/components/WordCard";

export default function StudyingPage() {
  const { words, favorites, wordStatusMap, toggleWordStatus, addFavorite } = useWordStore();

  // فلتر الكلمات: كل شيء ما عدا "saved"
  const studyingWords: Word[] = words.filter((w) => wordStatusMap[w.id] !== "saved");

  // دالة قراءة النصوص
  const speakText = (text: string, lang: string = "en-US") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

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
          <p className="text-gray-400 text-lg m-auto mt-[250px]">
            لا توجد كلمات قيد الدراسة حاليًا.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyingWords.map((w) => {
            const isFavorite = favorites.some((f) => f.id === w.id);

            return (
              <div key={w.id} className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
                
                <WordCard
                  id={w.id}
                  word={w.word}
                  meaning={w.meaning}
                  example={w.example}
                  exampleTranslation={w.exampleTranslation}
                  speakText={speakText} // ✅ تمرير الدالة
                />

                {/* زر تغيير الحالة إلى محفوظة */}
                <button
                  onClick={() => toggleWordStatus(w.id)}
                  className="mt-3 w-full py-2 rounded bg-green-600 hover:bg-green-500 transition font-semibold"
                >
                  🎯 نقل إلى المحفوظة
                </button>

                {/* زر إضافة للمفضلة */}
                <button
                  onClick={() => addFavorite(w)}
                  disabled={isFavorite}
                  className={`mt-2 w-full py-2 rounded transition ${
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
