"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const germanBackground =
  "https://res.cloudinary.com/diguqxumc/image/upload/v1791534216/Screenshot_2026-10-09_142158_zptd6d.png";

export default function HeroSection() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  return (
    <section
      className={`hero-germany relative isolate min-h-screen overflow-hidden ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Germany architecture background */}
      <div
        className="hero-germany-background absolute inset-0 -z-30"
        style={{ backgroundImage: `url("${germanBackground}")` }}
        aria-hidden="true"
      />

      {/* Background overlay */}
      <div
        className={`absolute inset-0 -z-20 ${
          isDark ? "bg-[#080b13]/80" : "bg-slate-50/80"
        }`}
        aria-hidden="true"
      />

      {/* Animated lighting */}
      <div
        className="hero-ambient-light pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />

      {/* Ambient glow */}
      <div
        className={`hero-orb hero-orb-red pointer-events-none absolute left-[3%] top-[20%] h-64 w-64 rounded-full blur-[100px] ${
          isDark ? "bg-red-600/20" : "bg-red-400/15"
        }`}
      />

      <div
        className={`hero-orb hero-orb-amber pointer-events-none absolute right-[5%] top-[28%] h-72 w-72 rounded-full blur-[110px] ${
          isDark ? "bg-amber-500/15" : "bg-amber-400/20"
        }`}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-24 sm:px-8 sm:pt-28 lg:px-10 lg:pt-28">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* LEFT CONTENT */}
          <div className="hero-content max-w-3xl">
            {/* Badge */}
            <div
              className={`glass-panel mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2.5 ${
                isDark
                  ? "border-white/15 bg-white/[0.06]"
                  : "border-white/80 bg-white/65"
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/60" />
              </span>

              <span
                className={`text-sm font-medium ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {isBangla
                  ? "জার্মান ভাষা শেখার প্ল্যাটফর্ম"
                  : "German Learning Platform"}
              </span>
            </div>

            {/* Heading */}
            <h1
              className={`text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              {isBangla ? (
                <>
                  জার্মান ভাষা শিখুন
                  <br />
                  <span className="hero-gradient-text">
                    A1 থেকে B2 পর্যন্ত
                  </span>
                </>
              ) : (
                <>
                  Learn German
                  <br />
                  <span className="hero-gradient-text">
                    from A1 to B2
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p
              className={`mt-7 max-w-2xl text-base leading-8 sm:text-lg ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {isBangla
                ? "গোছানো লেসন, শব্দভাণ্ডার, ব্যাকরণ, লিসেনিং, রাইটিং, স্পিকিং প্র্যাকটিস এবং বাস্তব জীবনের রিসোর্সের মাধ্যমে জার্মান ভাষা শিখুন।"
                : "Master German with structured lessons, vocabulary, grammar, listening, writing, speaking practice, and real-world resources."}
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/learning-levels"
                className="hero-primary-button inline-flex items-center justify-center rounded-xl px-7 py-4 font-semibold text-white"
              >
                {isBangla ? "শেখা শুরু করুন →" : "Start Learning →"}
              </Link>

              <Link
                href="/learning-levels"
                className={`glass-card inline-flex items-center justify-center rounded-xl px-7 py-4 font-semibold ${
                  isDark
                    ? "border-white/15 bg-white/[0.055] text-white"
                    : "border-white/80 bg-white/65 text-slate-800"
                }`}
              >
                {isBangla ? "লেভেল দেখুন" : "Explore Levels"}
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`mt-12 grid max-w-2xl grid-cols-3 gap-3 border-t pt-7 sm:gap-5 ${
                isDark ? "border-white/15" : "border-slate-300/70"
              }`}
            >
              <div className="glass-card rounded-2xl p-3 sm:p-4">
                <p
                  className={`text-xl font-bold sm:text-2xl ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  A1–B2
                </p>
                <p
                  className={`mt-2 text-xs leading-5 sm:text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {isBangla ? "লার্নিং লেভেল" : "Learning Levels"}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-3 sm:p-4">
                <p
                  className={`text-xl font-bold sm:text-2xl ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  German
                </p>
                <p
                  className={`mt-2 text-xs leading-5 sm:text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {isBangla ? "গোছানো শিক্ষা" : "Structured Learning"}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-3 sm:p-4">
                <p
                  className={`text-xl font-bold sm:text-2xl ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Practice
                </p>
                <p
                  className={`mt-2 text-xs leading-5 sm:text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {isBangla ? "বাস্তব দক্ষতা" : "Real Skills"}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="hero-visual relative flex items-center justify-center py-8 lg:py-0">
            <div
              className={`absolute h-[300px] w-[300px] rounded-full blur-[80px] sm:h-[430px] sm:w-[430px] ${
                isDark ? "bg-red-500/20" : "bg-red-400/20"
              }`}
            />

            <div className="hero-orbit absolute h-[340px] w-[340px] rounded-full border border-white/15 sm:h-[490px] sm:w-[490px]" />

            {/* Main glass shell */}
            <div
              className={`hero-image-shell glass-panel relative w-full max-w-[430px] rounded-[2rem] p-3 sm:rounded-[2.5rem] sm:p-4 ${
                isDark
                  ? "border-white/20 bg-white/[0.07]"
                  : "border-white/80 bg-white/55"
              }`}
            >
              <div className="hero-image-frame relative aspect-[4/4.5] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <Image
                  src="/hero-german.png"
                  alt="German language learning"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 430px"
                  className={`object-cover ${
                    isDark ? "saturate-[0.85]" : "saturate-100"
                  }`}
                />

                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? "bg-gradient-to-t from-[#080b13]/80 via-transparent to-[#080b13]/10"
                      : "bg-gradient-to-t from-slate-900/35 via-transparent to-white/10"
                  }`}
                />

                {/* Glossy shine */}
                <div className="hero-image-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg]" />

                {/* German flag-inspired reflection */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-red-500/15 via-transparent to-amber-400/20" />

                {/* Image caption */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                  <div className="glass-panel rounded-2xl border-white/20 bg-black/35 p-4 sm:p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
                      Deutsch lernen
                    </p>

                    <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                      {isBangla
                        ? "তোমার জার্মান যাত্রা"
                        : "Your German Journey"}
                    </p>

                    <p className="mt-1 text-sm text-white/75">
                      {isBangla
                        ? "একটি লেভেল, এক ধাপ করে"
                        : "One level at a time"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating A1 badge */}
            <div className="hero-float absolute -left-1 top-[15%] z-10 sm:left-0">
              <div className="glass-panel rounded-2xl border-white/20 bg-slate-950/55 px-4 py-3 shadow-xl backdrop-blur-xl">
                <span className="text-xs text-slate-300">Start here</span>
                <p className="mt-1 text-lg font-bold text-amber-300">A1</p>
              </div>
            </div>

            {/* Floating Germany badge */}
            <div className="hero-float-delayed absolute -right-1 bottom-[17%] z-10 sm:right-0">
              <div className="glass-panel flex items-center gap-3 rounded-2xl border-white/20 bg-slate-950/55 px-4 py-3 shadow-xl backdrop-blur-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-400 font-bold text-white">
                  DE
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Deutschland
                  </p>
                  <p className="text-xs text-slate-300">
                    {isBangla ? "নতুন সম্ভাবনা" : "New possibilities"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom transition */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-36 ${
          isDark
            ? "bg-gradient-to-t from-[#0b0f19] to-transparent"
            : "bg-gradient-to-t from-[#f1f5f9] to-transparent"
        }`}
      />

      <style jsx>{`
        .hero-germany-background {
          background-position: center 45%;
          background-size: cover;
          transform: scale(1.04);
          animation: germanyZoom 35s ease-in-out infinite alternate;
        }

        .hero-ambient-light {
          background:
            radial-gradient(
              ellipse at 12% 35%,
              rgba(225, 29, 72, 0.16),
              transparent 38%
            ),
            radial-gradient(
              ellipse at 85% 28%,
              rgba(245, 158, 11, 0.13),
              transparent 34%
            ),
            linear-gradient(
              120deg,
              transparent 25%,
              rgba(255, 255, 255, 0.025) 48%,
              transparent 68%
            );
          background-size: 150% 150%;
          animation: ambientMove 18s ease-in-out infinite alternate;
        }

        .hero-gradient-text {
          background: linear-gradient(
            100deg,
            #fb7185 0%,
            #ef4444 38%,
            #fbbf24 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: gradientFlow 7s ease-in-out infinite alternate;
        }

        .hero-primary-button {
          background: linear-gradient(110deg, #e11d48, #f59e0b, #e11d48);
          background-size: 200% 100%;
          box-shadow:
            0 12px 35px rgba(225, 29, 72, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            background-position 0.5s ease;
        }

        .hero-primary-button:hover {
          transform: translateY(-4px);
          background-position: 100% 0;
          box-shadow:
            0 18px 40px rgba(225, 29, 72, 0.3),
            0 0 24px rgba(245, 158, 11, 0.12);
        }

        .hero-image-shell {
          animation: shellFloat 8s ease-in-out infinite;
          box-shadow:
            0 30px 100px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .hero-image-shine {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.24),
            rgba(255, 255, 255, 0.04),
            transparent
          );
          animation: imageShine 8s ease-in-out infinite;
        }

        .hero-orbit {
          animation: orbitSpin 45s linear infinite;
          border-style: dashed;
          opacity: 0.6;
        }

        .hero-float {
          animation: badgeFloat 6s ease-in-out infinite;
        }

        .hero-float-delayed {
          animation: badgeFloat 7s ease-in-out infinite reverse;
        }

        .hero-orb-red {
          animation: orbDrift 15s ease-in-out infinite alternate;
        }

        .hero-orb-amber {
          animation: orbDrift 19s ease-in-out infinite alternate-reverse;
        }

        @keyframes germanyZoom {
          from {
            transform: scale(1.04);
            background-position: center 42%;
          }
          to {
            transform: scale(1.13);
            background-position: center 58%;
          }
        }

        @keyframes ambientMove {
          from {
            background-position: 0% 20%;
          }
          to {
            background-position: 100% 80%;
          }
        }

        @keyframes gradientFlow {
          from {
            background-position: 0% 50%;
          }
          to {
            background-position: 100% 50%;
          }
        }

        @keyframes imageShine {
          0%,
          35% {
            left: -50%;
          }
          70%,
          100% {
            left: 140%;
          }
        }

        @keyframes shellFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(0.5deg);
          }
        }

        @keyframes orbitSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes badgeFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes orbDrift {
          from {
            transform: translate3d(-10px, 0, 0) scale(0.95);
          }
          to {
            transform: translate3d(18px, -18px, 0) scale(1.08);
          }
        }

        @media (max-width: 640px) {
          .hero-germany-background {
            background-position: center;
          }

          .hero-orbit {
            width: 85vw;
            height: 85vw;
            max-width: 350px;
            max-height: 350px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-germany-background,
          .hero-ambient-light,
          .hero-gradient-text,
          .hero-image-shell,
          .hero-image-shine,
          .hero-orbit,
          .hero-float,
          .hero-float-delayed,
          .hero-orb-red,
          .hero-orb-amber {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}