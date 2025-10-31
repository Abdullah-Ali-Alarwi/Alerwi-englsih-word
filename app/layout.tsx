import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/header";

export const metadata: Metadata = {
  title: "قاموس العروي",
  description: "تطبيق شامل لتعلم الكلمات الإنجليزية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col mt-10">
        
        {/* ✅ الهيدر الآن يستخدم Zustand لتحديث البيانات مباشرة */}
        <Header />

        {/* ✅ محتوى الصفحات مع مسافة لتجنب تغطية الهيدر */}
        <main className="lg:mt-12 flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}
