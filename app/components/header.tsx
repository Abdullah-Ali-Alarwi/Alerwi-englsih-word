"use client";


import Link from "next/link";
import { useWordStore } from "@/app/lib/storage";
import logo from "@/public/dictionaryLogo.png"
import Image from "next/image"



export default function Header() {
  const { wordStatusMap, favorites, words } = useWordStore();

  const savedCount = Object.values(wordStatusMap || {}).filter(status => status === "saved").length;

  // عدد قيد الدراسة = مجموع الكلمات الكلي - عدد المحفوظة
  const studyingCount = (words?.length || 0) - savedCount;

  return (
    <header className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-50 bg-gray-600/80 backdrop-blur-md shadow flex flex-col md:flex-row justify-between items-center p-1 md:p-4 gap-1 md:gap-4">

    <Image src={logo} alt="Dictionary" width={100} height={100} className="md:block hidden   " />

      <div className="flex flex-wrap justify-center gap-1 w-full  ">
        <Link href="/add-word" className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-[12px]">كلمة جديدة</Link>
        <Link href="/review" className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-[12px]">مراجعة</Link>
        <Link href="/saved" className="relative flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-[12px]">
          محفوظات
          <span className="absolute -top-1 -right-1 bg-white text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full">{savedCount}</span>
        </Link>
        <Link href="/studying" className="relative flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-[12px]">
          قيد الدراسة
          <span className="absolute -top-1 -right-1 bg-white text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full">{studyingCount}</span>
        </Link>
        <Link href="/favorites" className="relative flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-[12px]">
          المفضلة
          <span className="absolute -top-1 -right-1 bg-white text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full">{favorites.length}</span>
        </Link>
        <Link href="/" className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-[12px]">الرئيسية</Link>
      </div>
    </header>
  );
}
