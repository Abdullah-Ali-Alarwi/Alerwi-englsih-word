"use client";

import { useEffect, useState } from "react";
import { getWords, addToFavorites, Word } from "@/app/lib/storage";
import Link from "next/link";

export default function ReviewPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    setWords(getWords());
  }, []);

  const nextWord = () => setIndex((prev) => (prev + 1) % words.length);
  const prevWord = () => setIndex((prev) => (prev - 1 + words.length) % words.length);

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <p className="text-xl mb-4">No words yet! Add words to start reviewing.</p>
        <Link href="/" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition">
          Back to Home
        </Link>
      </div>
    );
  }

  const currentWord = words[index];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Daily Review</h1>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-md text-center">
        <p className="text-gray-400 mb-2">
          Word {index + 1} of {words.length}
        </p>
        <h2 className="text-2xl font-semibold mb-3">{currentWord.word}</h2>
        <p className="text-lg text-green-400 mb-4">{currentWord.meaning}</p>
        <p className="italic mb-2">"{currentWord.example}"</p>
        <p className="text-gray-300 mb-4">{currentWord.exampleTranslation}</p>

        <button
          onClick={() => addToFavorites(currentWord)}
          className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded transition"
        >
          ❤️ Add to Favorites
        </button>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={prevWord}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Previous
        </button>

        <button
          onClick={nextWord}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
        >
          Next
        </button>
      </div>

      <div className="flex gap-4 mt-6">
        <Link href="/" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
          Back to Home
        </Link>

        <Link href="/favorites" className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500 transition">
          View Favorites
        </Link>
      </div>
    </div>
  );
}
