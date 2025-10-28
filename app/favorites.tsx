"use client";

import { useEffect, useState } from "react";
import { getFavorites, removeFromFavorites, Word } from "@/app/lib/storage";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Word[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id: number) => {
    removeFromFavorites(id);
    setFavorites(getFavorites());
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <p className="text-xl mb-4">No favorite words yet!</p>
        <Link href="/" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">⭐ Favorite Words</h1>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {favorites.map((word) => (
          <div
            key={word.id}
            className="bg-gray-800 p-5 rounded-xl shadow-md flex flex-col gap-2"
          >
            <h2 className="text-2xl font-semibold">{word.word}</h2>
            <p className="text-green-400">{word.meaning}</p>
            <p className="italic text-gray-300">"{word.example}"</p>
            <p className="text-gray-400">{word.exampleTranslation}</p>

            <button
              onClick={() => handleRemove(word.id)}
              className="mt-3 bg-red-600 hover:bg-red-500 px-3 py-2 rounded transition"
            >
              Remove ❌
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
