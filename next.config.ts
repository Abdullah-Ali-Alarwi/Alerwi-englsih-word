import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // مهم جدًا للتصدير كـ Static
  images: {
    unoptimized: true, // تعطيل تحسين الصور لتجنب مشاكل التصدير
  },
  // إذا لديك أي إعدادات إضافية، ضعها هنا
};

export default nextConfig;
