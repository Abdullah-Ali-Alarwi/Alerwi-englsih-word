"use client";

import { useWordStore } from "@/app/lib/storage";
import WordCard from "./app/components/WordCard"; // تأكد من المسار الصحيح
import Link from "next/link";

export default function HardPage() {
  const { words, wordStatusMap } = useWordStore();

  // تصفية الكلمات التي حالتها "hard"
  const hardWords = words.filter((w) => wordStatusMap[w.id] === "hard");

  const speakText = (text: string, lang: string = "en-US") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("🔊 قراءة النصوص غير مدعومة في هذا الجهاز أو أثناء البناء على السيرفر.");
    }
  };

  if (hardWords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4 text-red-400">الكلمات الصعبة</h1>
        <p className="text-gray-400 text-lg">لا توجد كلمات صعبة بعد!</p>
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
      <h1 className="text-4xl font-bold mb-6 text-red-400">
        الكلمات الصعبة ({hardWords.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...hardWords].reverse().map((word) => (
          <WordCard
            key={word.id}
            id={word.id}
            word={word.word}
            meaning={word.meaning}
            example={word.example}
            exampleTranslation={word.exampleTranslation}
            speakText={speakText}
          />
        ))}
      </div>
    </div>
  );
}
