"use client";

import React, { useEffect, useState } from "react";
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
        <h1 className="text-3xl font-bold mb-4">Favorites</h1>
        <p>No favorite words yet!</p>
        <Link
          href="/"
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Favorites</h1>
      <div className="space-y-4">
        {favorites.map((word) => (
          <div
            key={word.id}
            className="bg-gray-800 p-4 rounded shadow-md flex flex-col gap-2"
          >
            <p>{word.id}</p>
            <h2 className="text-xl font-bold">
              {word.word} ({word.meaning})
            </h2>
            <p>
              <span className="font-semibold">Example: </span>
              {word.example}
            </p>
            <p>
              <span className="font-semibold">Translation: </span>
              {word.exampleTranslation}
            </p>
            <button
              onClick={() => handleRemove(word.id)}
              className="mt-2 bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="mt-6 inline-block bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded"
      >
        Back to Home
      </Link>
    </div>
  );
}
