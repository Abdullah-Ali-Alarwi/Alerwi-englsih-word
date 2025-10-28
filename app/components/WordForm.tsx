"use client";

import { useState } from "react";

export interface Word {
  id: number;
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

export default function WordForm({ onAdd }: { onAdd: (word: Word) => void }) {
  const [form, setForm] = useState({
    word: "",
    meaning: "",
    example: "",
    exampleTranslation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.word || !form.meaning) {
      alert("Please fill in at least the word and meaning.");
      return;
    }

    const newWord: Word = {
      id: Date.now(),
      ...form,
    };

    onAdd(newWord);

    // تفريغ الحقول بعد الإضافة
    setForm({ word: "", meaning: "", example: "", exampleTranslation: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-xl shadow-md flex flex-col gap-4"
    >
      <input
        name="word"
        value={form.word}
        onChange={handleChange}
        placeholder="Word"
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        name="meaning"
        value={form.meaning}
        onChange={handleChange}
        placeholder="Meaning"
        className="p-2 rounded bg-gray-700 text-white"
      />
      <textarea
        name="example"
        value={form.example}
        onChange={handleChange}
        placeholder="Example sentence"
        className="p-2 rounded bg-gray-700 text-white"
      />
      <textarea
        name="exampleTranslation"
        value={form.exampleTranslation}
        onChange={handleChange}
        placeholder="Example translation"
        className="p-2 rounded bg-gray-700 text-white"
      />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
      >
        Add Word
      </button>
    </form>
  );
}
