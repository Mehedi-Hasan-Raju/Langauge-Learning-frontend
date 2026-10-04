import type { Metadata } from "next";
import "./globals.css";
import CursorGlow from "../components/CursorGlow";
import Footer from "../components/Footer";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";

export const metadata: Metadata = {
  title: "GermanLearn",
  description: "Learn German from A1 to B2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
        <LanguageProvider>
          <CursorGlow />

          {children}

          <Footer />
        </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}