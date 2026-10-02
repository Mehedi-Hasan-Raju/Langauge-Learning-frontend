"use client";

import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { language } = useLanguage();

  const isBangla = language === "bn";

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <nav className="mx-auto mt-4 max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-amber-400 text-sm font-black text-white shadow-lg shadow-red-500/20">
              DE
            </span>

            <span>
              German<span className="text-red-400">Learn</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            <Link
              href="/learning-levels"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {isBangla ? "লার্নিং লেভেল" : "Learning Levels"}
            </Link>

            <Link
              href="/blogs"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {isBangla ? "ব্লগ" : "Blogs"}
            </Link>

            <Link
              href="/ausbildung"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Ausbildung
            </Link>

            <Link
              href="/services"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {isBangla ? "সার্ভিস" : "Services"}
            </Link>

            <Link
              href="#members"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {isBangla ? "আমাদের সদস্য" : "Our Members"}
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LanguageToggle />

            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white sm:block"
            >
              {isBangla ? "লগইন" : "Login"}
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-red-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:scale-105"
            >
              {isBangla ? "শুরু করুন" : "Get Started"}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}