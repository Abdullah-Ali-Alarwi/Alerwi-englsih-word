"use client";

import React from "react"; // ✅ استيراد React لحل مشكلة JSX
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWordStore } from "@/app/lib/storage";
import logo from "@/public/dictionaryLogo.png";
import Image from "next/image";
import {
  FaPlusCircle,
  FaRedoAlt,
  FaBookmark,
  FaBookOpen,
  FaHeart,
  FaHome,
  FaQuestionCircle,
  FaDumbbell,
} from "react-icons/fa";

export default function Header() {
  const { wordStatusMap, favorites, words } = useWordStore();
  const pathname = usePathname();

  const savedCount = Object.values(wordStatusMap || {}).filter(
    (status) => status === "saved"
  ).length;

  const studyingCount = (words?.length || 0) - savedCount;

  // ✅ عدد الكلمات الصعبة
  const hardCount = Object.values(wordStatusMap || {}).filter(
    (status) => status === "hard"
  ).length;

  return (
    <header className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-50 bg-gray-600/80 backdrop-blur-md shadow flex flex-col md:flex-row justify-between items-center p-1 md:p-4 gap-1 md:gap-4">
      <Image
        src={logo}
        alt="Dictionary"
        width={100}
        height={100}
        className="md:block hidden"
      />

      <div className="flex justify-center gap-1 w-full overflow-x-auto">
        <NavItem
          href="/add-word"
          icon={<FaPlusCircle size={16} />}
          label="كلمة جديدة"
          active={pathname === "/add-word"}
        />
        <NavItem
          href="/review"
          icon={<FaRedoAlt size={16} />}
          label="مراجعة"
          active={pathname === "/review"}
        />
        <NavItem
          href="/saved"
          icon={<FaBookmark size={16} />}
          label="محفوظات"
          badge={savedCount}
          active={pathname === "/saved"}
        />
        <NavItem
          href="/studying"
          icon={<FaBookOpen size={16} />}
          label="قيد الدراسة"
          badge={studyingCount}
          active={pathname === "/studying"}
        />
        <NavItem
          href="/favorites"
          icon={<FaHeart size={16} />}
          label="المفضلة"
          badge={favorites.length}
          active={pathname === "/favorites"}
        />
        <NavItem
          href="/hard"
          icon={<FaDumbbell size={16} />}
          label="صعب"
          badge={hardCount} // ✅ عدد الكلمات الصعبة
          active={pathname === "/hard"}
        />
        <NavItem
          href="/QuizPage"
          icon={<FaQuestionCircle size={16} />}
          label="اختبار"
          active={pathname === "/QuizPage"}
        />
        <NavItem
          href="/"
          icon={<FaHome size={16} />}
          label="الرئيسية"
          active={pathname === "/"}
        />
      </div>
    </header>
  );
}

// ✅ استخدم React.ReactNode بدلاً من JSX.Element
function NavItem({
  href,
  icon,
  label,
  badge,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative flex flex-col items-center justify-center flex-1 py-1 px-2 rounded text-[11px] min-w-[60px] transition-all
        ${active ? "bg-gray-900 text-white" : "bg-gray-800 hover:bg-gray-800 text-white"}`}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <span>{icon}</span>
        <span className="text-[10px] md:text-[11px]">{label}</span>
      </div>

      {badge !== undefined && badge > 0 && (
        <span className="absolute top-0 right-1 bg-white text-gray-700 text-[9px] px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
