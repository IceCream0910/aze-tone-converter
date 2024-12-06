import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "아재 말투 변환기",
  description: "문장을,,,입력.하면,,,아재.말투로,,,바꿔준다네;;~~!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
