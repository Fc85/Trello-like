import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "./_components";

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
    <html lang="en" className="min-h-[100vh] relative">
      <body className="bg-gray-300 min-h-[100vh]">
        <Header/>
        {children}
      </body>
      <Footer/>
    </html>
  );
}
