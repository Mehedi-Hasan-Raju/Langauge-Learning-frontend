"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { language } = useLanguage();

  const isBangla = language === "bn";

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="absolute left-[10%] top-[25%] h-[500px] w-[500px] rounded-full bg-red-600/15 blur-[150px]" />

      <div className="absolute right-[15%] top-[30%] h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[150px]" />

      <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-red-500/5 blur-[130px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-32">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60" />

              <span className="text-sm text-slate-300">
                {isBangla
                  ? "জার্মান ভাষা শেখার প্ল্যাটফর্ম"
                  : "German Learning Platform"}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              {isBangla ? (
                <>
                  জার্মান ভাষা শিখুন
                  <br />
                  <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                    A1 থেকে B2 পর্যন্ত
                  </span>
                </>
              ) : (
                <>
                  Learn German
                  <br />
                  <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                    from A1 to B2
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
              {isBangla
                ? "গোছানো লেসন, শব্দভাণ্ডার, ব্যাকরণ, লিসেনিং, রাইটিং, স্পিকিং প্র্যাকটিস এবং বাস্তব জীবনের রিসোর্সের মাধ্যমে জার্মান ভাষা শিখুন।"
                : "Master German with structured lessons, vocabulary, grammar, listening, writing, speaking practice, and real-world resources."}
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/learning-levels"
                className="rounded-xl bg-gradient-to-r from-red-600 to-amber-500 px-7 py-3.5 font-semibold text-white shadow-xl shadow-red-600/20 transition duration-300 hover:-translate-y-1 hover:shadow-red-500/30"
              >
                {isBangla ? "শেখা শুরু করুন →" : "Start Learning →"}
              </Link>

              <Link
                href="/learning-levels"
                className="rounded-xl border border-white/15 bg-white/[0.03] px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                {isBangla ? "লেভেল দেখুন" : "Explore Levels"}
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-7">
              <div>
                <p className="text-2xl font-bold text-white">A1–B2</p>
                <p className="mt-1 text-sm text-slate-500">
                  {isBangla ? "লার্নিং লেভেল" : "Learning Levels"}
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">German</p>
                <p className="mt-1 text-sm text-slate-500">
                  {isBangla ? "গোছানো শিক্ষা" : "Structured Learning"}
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">Practice</p>
                <p className="mt-1 text-sm text-slate-500">
                  {isBangla ? "বাস্তব দক্ষতা" : "Real Skills"}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="absolute h-[520px] w-[520px] rounded-full bg-red-500/10 blur-[110px]" />

            <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-[100px]" />

            <div className="relative h-[450px] w-[450px] rounded-full border border-white/10 bg-white/[0.025] p-2 shadow-2xl shadow-red-500/10 backdrop-blur-xl">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src="/hero-german.png"
                  alt="German language learning"
                  fill
                  priority
                  sizes="450px"
                  className="object-cover opacity-75 saturate-[0.8]"
                />

                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0b0f19]/15 via-transparent to-[#0b0f19]/70" />

                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/10 via-transparent to-amber-400/10" />

                <div className="absolute -left-1/4 top-[-20%] h-[140%] w-1/3 rotate-[25deg] bg-white/[0.08] blur-2xl" />

                <div className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full bg-gradient-to-t from-[#0b0f19]/60 to-transparent" />
              </div>
            </div>

            <div className="absolute right-3 top-16 h-4 w-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/70" />

            <div className="absolute bottom-16 left-3 h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/70" />

            <div className="absolute -right-3 bottom-24 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs text-slate-400 backdrop-blur-xl">
              DE
            </div>

            <div className="absolute -left-3 top-28 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-amber-300 backdrop-blur-xl">
              A1
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0f19] to-transparent" />
    </section>
  );
}