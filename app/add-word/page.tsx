"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import WordForm, { Word } from "@/app/components/WordForm";
import { addWord as storeWord } from "@/app/lib/storage";

export default function AddWordPage() {
  const router = useRouter();

  // دالة لإضافة الكلمة وتخزينها في LocalStorage
  const handleAdd = (newWord: Word) => {
    storeWord(newWord);
    alert("✅ Word added successfully!");
    router.push("/review"); // الانتقال لصفحة المراجعة بعد الإضافة
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Add New Word</h1>

      {/* نموذج إضافة الكلمة */}
      <div className="w-full max-w-md">
        <WordForm onAdd={handleAdd} />
      </div>

      {/* زر العودة إلى الرئيسية */}
      <Link
        href="/"
        className="mt-6 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
