"use client";

import React, { useEffect, useState } from "react";
import { getFavorites, removeFromFavorites, Word } from "@/app/lib/storage";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Word[]>([]);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);

  // تحميل الكلمات والمفعلين
  useEffect(() => {
    setFavorites(getFavorites());
    const savedHighlighted = localStorage.getItem("highlightedIds");
    if (savedHighlighted) {
      setHighlightedIds(JSON.parse(savedHighlighted));
    }
  }, []);

  const handleRemove = (id: number) => {
    removeFromFavorites(id);
    setFavorites(getFavorites());
    setHighlightedIds((prev) => {
      const updated = prev.filter((hid) => hid !== id);
      localStorage.setItem("highlightedIds", JSON.stringify(updated));
      return updated;
    });
  };

  // 🔊 دالة القراءة
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; 
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis not supported in this browser.");
    }
  };

  // Toggle highlight مع حفظ الحالة في localStorage
  const toggleHighlight = (id: number) => {
    setHighlightedIds((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((hid) => hid !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem("highlightedIds", JSON.stringify(updated));
      return updated;
    });
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
        {favorites.map((word) => {
          const isHighlighted = highlightedIds.includes(word.id);
          return (
            <div
              key={word.id}
              className={`p-4 rounded shadow-md flex flex-col gap-2 cursor-pointer transition ${
                isHighlighted ? "bg-gray-700" : "bg-gray-900"
              }`}
              onClick={() => toggleHighlight(word.id)}
            >
              <p>ID: {word.id}</p>
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

              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(word.word);
                  }}
                  className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition"
                >
                  🔊 Read Word
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(`${word.meaning}. ${word.example}. ${word.exampleTranslation}`);
                  }}
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition"
                >
                  🔊 Read Example
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(word.id);
                  }}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-400 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
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
