"use client";

import { useWordStore, Word } from "@/app/lib/storage";
import WordCard from "@/app/components/WordCard";

export default function SavedPage() {
  const { words, wordStatusMap } = useWordStore();

  // فلتر الكلمات التي حالتها "saved"
  const savedWords: Word[] = words.filter((w) => wordStatusMap[w.id] === "saved");

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
          <h1 className="text-3xl font-bold text-yellow-400">الكلمات المحفوظة</h1>
          <p className="text-gray-300 mt-1">
            عدد الكلمات المحفوظة: <span className="font-semibold">{savedWords.length}</span>
          </p>
        </div>
      </header>

      {savedWords.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-gray-400">لا توجد كلمات محفوظة بعد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedWords.slice().reverse().map((w, index) => (
            <div key={w.id} className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
              <WordCard
                id={index + 1} // الترتيب حسب الظهور
                word={w.word}
                meaning={w.meaning}
                example={w.example}
                exampleTranslation={w.exampleTranslation}
                speakText={speakText} // ✅ إضافة الدالة
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
