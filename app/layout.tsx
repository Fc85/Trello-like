import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trello like",
  description: "Application similaire à trello",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-300">
        <nav className="bg-black text-white flex w-full justify-between px-[10%] py-5 items-center">
          <p className="text-2xl">Trello like</p>
          <ul className="flex gap-6 text-lg">
            <li className="hover:text-red-300 cursor-pointer"><Link href="/">Accueil</Link></li>
            <li className="hover:text-red-300 cursor-pointer">Projets</li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
