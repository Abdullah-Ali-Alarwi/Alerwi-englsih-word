import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
  title: "Al-arwi English words",
  description: "A comprehensive vocabulary app for learning English words",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       
      >
        {children}
      </body>
    </html>
  );
}
