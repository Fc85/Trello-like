import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        <nav className="layout-nav">
          <p>Trello like</p>
          <ul>
            <li>Accueil</li>
            <li>Projets</li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
