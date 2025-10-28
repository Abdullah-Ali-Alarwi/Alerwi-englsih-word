"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWords, Word } from "@/app/lib/storage";
import WordCard from "@/app/components/WordCard";

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    setWords(getWords());
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-yellow-400">My Vocabulary</h1>
        <div className="flex gap-4">
          <Link
            href="/add-word"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Add Word
          </Link>
          <Link
            href="/review"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Review Words
          </Link>
        </div>
      </header>

      {/* Content */}
      {words.length === 0 ? (
        <p className="text-gray-400 text-lg">
          No words yet! Add new words to start building your vocabulary.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((w, index) => (
            <div
              key={w.id}
              className="relative bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition"
            >
              {/* رقم الكلمة في الأعلى */}
              <div className="absolute top-2 right-3 text-gray-500 text-sm font-semibold">
                #{index + 1}
              </div>

              {/* محتوى الكرت */}
              <WordCard
                id={index + 1}
                word={w.word}
                meaning={w.meaning}
                example={w.example}
                exampleTranslation={w.exampleTranslation}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
