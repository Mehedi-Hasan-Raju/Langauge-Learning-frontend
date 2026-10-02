"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080b13]">
      {/* Background Glows */}
      <div className="absolute left-[-150px] top-[-100px] h-[350px] w-[350px] rounded-full bg-red-500/5 blur-[130px]" />

      <div className="absolute right-[-150px] bottom-[-100px] h-[350px] w-[350px] rounded-full bg-amber-400/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Main Footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
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

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              {isBangla
                ? "A1 থেকে B2 পর্যন্ত জার্মান শেখার একটি আধুনিক প্ল্যাটফর্ম।"
                : "A modern platform for learning German from A1 to B2."}
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs text-slate-400 transition hover:border-red-400/30 hover:text-white"
              >
                f
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs text-slate-400 transition hover:border-red-400/30 hover:text-white"
              >
                in
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs text-slate-400 transition hover:border-red-400/30 hover:text-white"
              >
                ▶
              </a>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isBangla ? "শেখার সুযোগ" : "Learning"}
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/learning-levels"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {isBangla ? "লার্নিং লেভেল" : "Learning Levels"}
              </Link>

              <Link
                href="/learning-levels/a1"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                A1 German
              </Link>

              <Link
                href="/learning-levels/a2"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                A2 German
              </Link>

              <Link
                href="/learning-levels/b1"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                B1 German
              </Link>

              <Link
                href="/learning-levels/b2"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                B2 German
              </Link>
            </div>
          </div>

          {/* Germany */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isBangla ? "জার্মানি" : "Germany"}
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/ausbildung"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Ausbildung
              </Link>

              <Link
                href="/ausbildung"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Dual Studium
              </Link>

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {isBangla ? "ভিসা গাইড" : "Visa Guide"}
              </Link>

              <Link
                href="/blogs"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {isBangla ? "জার্মানি ব্লগ" : "Germany Blog"}
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isBangla ? "প্ল্যাটফর্ম" : "Platform"}
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/blogs"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {isBangla ? "ব্লগ" : "Blogs"}
              </Link>

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {isBangla ? "সার্ভিস" : "Services"}
              </Link>

              <Link
                href="/login"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {isBangla ? "লগইন" : "Login"}
              </Link>

              <Link
                href="/register"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {isBangla ? "রেজিস্টার" : "Register"}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-slate-500">
            © {new Date().getFullYear()} GermanLearn.{" "}
            {isBangla ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </p>

          <p className="text-slate-600">
            {isBangla
              ? "Learn German. Build Your Future."
              : "Learn German. Build Your Future."}
          </p>
        </div>
      </div>
    </footer>
  );
}