import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "云知通工程骨架",
  description: "阶段 A-03 初始化的前端工程骨架"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

