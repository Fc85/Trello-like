import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./_components";

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
        <Header/>
        {children}
      </body>
    </html>
  );
}
