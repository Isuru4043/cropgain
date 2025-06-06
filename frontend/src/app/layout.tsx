import type { Metadata } from "next";
import { Inter, Fanwood_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";

const inter = Inter({ subsets: ["latin"], preload: true });
const fanwoodText = Fanwood_Text({
  subsets: ["latin"],
  weight: "400",
  preload: true,
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${fanwoodText.className}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
