import type { Metadata } from "next";
import "./globals.css";

import CursorGlow from "../components/CursorGlow";
import MainLayout from "../components/MainLayout";

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
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <CursorGlow />

            <MainLayout>
              {children}
            </MainLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}