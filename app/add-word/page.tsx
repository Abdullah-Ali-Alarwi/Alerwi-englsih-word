"use client";

import { useState, useEffect } from "react";
import { FaDumbbell } from "react-icons/fa";
import { useWordStore } from "@/app/lib/storage";

interface WordCardProps {
  id: number;
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  speakText: (text: string, lang?: string) => void;
}

export default function WordCard({
  id,
  word,
  meaning,
  example,
  exampleTranslation,
  speakText,
}: WordCardProps) {
  const { wordStatusMap, setWordStatus } = useWordStore(); // ✅ نحتاج دالة لتغيير الحالة
  const [isHard, setIsHard] = useState(false);

  useEffect(() => {
    // التحقق إذا كانت الكلمة مصنفة كـ "hard"
    setIsHard(wordStatusMap[id] === "hard");
  }, [wordStatusMap, id]);

  const toggleHard = () => {
    setIsHard(!isHard);
    setWordStatus(id, !isHard ? "hard" : "studying");
  };

  return (
    <div className="relative bg-gray-800 text-gray-100 p-4 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{id}</p>
        <button
          onClick={toggleHard}
          title="إضافة / إزالة من الكلمات الصعبة"
          className={`transition-colors p-1 rounded ${
            isHard ? "text-green-400" : "text-gray-400 hover:text-green-400"
          }`}
        >
          <FaDumbbell size={18} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-yellow-400">{word}</h2>
        <button
          onClick={() => speakText(word, "en-US")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          🔊
        </button>
      </div>

      <p className="text-gray-200">
        <span className="font-semibold text-green-400">Meaning:</span> {meaning}
      </p>

      <div className="flex items-center justify-between">
        <p className="text-gray-300">
          <span className="font-semibold text-blue-400">Example:</span> {example}
        </p>
        <button
          onClick={() => speakText(example, "en-US")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          🔊
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          <span className="font-semibold text-pink-400">Translation:</span>{" "}
          {exampleTranslation}
        </p>
        <button
          onClick={() => speakText(exampleTranslation, "ar-SA")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          🔊
        </button>
      </div>
    </div>
  );
}
