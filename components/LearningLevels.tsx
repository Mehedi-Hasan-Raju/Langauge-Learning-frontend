"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, LoaderCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const API_URL = "http://localhost:5000/api";

interface Level {
  id: string;
  name: string;
  order: number;
  _count?: {
    books: number;
  };
}

const levelDescriptions: Partial<Record<string, { title: string; titleBn: string; description: string; descriptionBn: string }>> = {
  A1: {
    title: "Beginner",
    titleBn: "শুরুর স্তর",
    description: "Build your foundation with basic German vocabulary, grammar, and everyday communication.",
    descriptionBn: "মৌলিক জার্মান শব্দভাণ্ডার, ব্যাকরণ এবং দৈনন্দিন যোগাযোগের মাধ্যমে আপনার শক্ত ভিত্তি তৈরি করুন।",
  },
  A2: {
    title: "Elementary",
    titleBn: "প্রাথমিক স্তর",
    description: "Improve your communication skills and understand common German situations with more confidence.",
    descriptionBn: "আপনার যোগাযোগের দক্ষতা উন্নত করুন এবং আরও আত্মবিশ্বাসের সাথে সাধারণ জার্মান পরিস্থিতি বুঝতে শিখুন।",
  },
  B1: {
    title: "Intermediate",
    titleBn: "মধ্যবর্তী স্তর",
    description: "Develop stronger speaking, listening, reading, and writing skills for everyday German.",
    descriptionBn: "দৈনন্দিন জার্মান ব্যবহারের জন্য speaking, listening, reading এবং writing দক্ষতা আরও শক্ত করুন।",
  },
  B2: {
    title: "Upper Intermediate",
    titleBn: "উচ্চ-মধ্যবর্তী স্তর",
    description: "Build confident German communication skills for study, work, and everyday life in Germany.",
    descriptionBn: "জার্মানিতে পড়াশোনা, কাজ এবং দৈনন্দিন জীবনের জন্য আত্মবিশ্বাসের সাথে জার্মান যোগাযোগের দক্ষতা তৈরি করুন।",
  },
};

const colors = [
  "emerald",
  "cyan",
  "blue",
  "amber",
  "rose",
  "violet",
] as const;

const colorClasses = {
  emerald: {
    badge:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    glow: "group-hover:shadow-emerald-500/10",
  },
  cyan: {
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    glow: "group-hover:shadow-cyan-500/10",
  },
  blue: {
    badge: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    glow: "group-hover:shadow-blue-500/10",
  },
  amber: {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    glow: "group-hover:shadow-amber-500/10",
  },
  rose: {
    badge: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    glow: "group-hover:shadow-rose-500/10",
  },
  violet: {
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    glow: "group-hover:shadow-violet-500/10",
  },
};

export default function LearningLevels() {
  const { language } = useLanguage();
  const isBangla = language === "bn";
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchLevels = async () => {
      try {
        const response = await fetch(`${API_URL}/learning/levels`);
        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.levels)) {
          throw new Error(result.message || "Failed to load learning levels.");
        }

        if (!cancelled) {
          const sortedLevels = [...result.levels].sort(
            (a: Level, b: Level) => a.order - b.order
          );
          setLevels(sortedLevels);
          setError("");
        }
      } catch (fetchError) {
        console.error("Homepage learning levels error:", fetchError);
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load learning levels."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchLevels();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="learning-levels"
      className="relative overflow-hidden py-24"
    >
      {/* Background Glows */}
      <div className="absolute left-[-150px] top-20 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[130px]" />

      <div className="absolute right-[-150px] bottom-10 h-[400px] w-[400px] rounded-full bg-amber-400/5 blur-[130px]" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60" />

            <span className="text-sm text-slate-300">
              {isBangla
                ? "আপনার শেখার যাত্রা শুরু করুন"
                : "Start Your Learning Journey"}
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            {isBangla ? (
              <>
                আপনার জার্মান{" "}
                <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                  লেভেল বেছে নিন
                </span>
              </>
            ) : (
              <>
                Choose Your German{" "}
                <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                  Level
                </span>
              </>
            )}
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            {isBangla
              ? "A1 থেকে B2 পর্যন্ত ধাপে ধাপে জার্মান ভাষা শিখুন এবং প্রতিটি স্তরে আপনার দক্ষতা উন্নত করুন।"
              : "Learn German step by step from A1 to B2 and develop your skills at every level."}
          </p>
        </div>

        {/* Level Cards */}
        {loading ? (
          <div className="mt-14 flex min-h-48 items-center justify-center gap-3 text-slate-400">
            <LoaderCircle size={20} className="animate-spin text-amber-300" />
            <span>{isBangla ? "লেভেল লোড হচ্ছে..." : "Loading levels..."}</span>
          </div>
        ) : error ? (
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-center">
            <p className="text-sm text-red-300">
              {isBangla
                ? "এখন লেভেলগুলো লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
                : "Levels could not be loaded right now. Please try again shortly."}
            </p>
          </div>
        ) : levels.length === 0 ? (
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <BookOpen className="mx-auto mb-3 text-amber-300" />
            <p className="text-sm text-slate-300">
              {isBangla
                ? "শেখার লেভেলগুলো শীঘ্রই যোগ করা হবে।"
                : "Learning levels will be available soon."}
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {levels.map((level, index) => {
              const color = colors[index % colors.length];
              const colorStyle = colorClasses[color];
              const description =
                levelDescriptions[level.name.toUpperCase()];
              const title = description
                ? isBangla
                  ? description.titleBn
                  : description.title
                : isBangla
                  ? "জার্মান লেভেল"
                  : "German Level";

              return (
                <Link
                  key={level.id}
                  href={`/learning-levels/${encodeURIComponent(level.name.toLowerCase())}`}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-amber-400/30 hover:bg-white/[0.05] hover:shadow-2xl ${colorStyle.glow}`}
                >
                  <div className="absolute right-[-60px] top-[-60px] h-32 w-32 rounded-full bg-red-500/5 blur-[60px] transition duration-500 group-hover:bg-red-500/10" />

                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-xl border text-lg font-black ${colorStyle.badge}`}
                  >
                    {level.name}
                  </div>

                  <div className="relative mt-9">
                    <h3 className="text-xl font-bold text-white">{title}</h3>

                    <p className="mt-5 text-sm leading-7 text-slate-300">
                      {description
                        ? isBangla
                          ? description.descriptionBn
                          : description.description
                        : isBangla
                          ? `${level.name} স্তরের বই, অধ্যায় ও শব্দভাণ্ডার থেকে শিখুন।`
                          : `Explore books, chapters, and vocabulary for ${level.name}.`}
                    </p>
                  </div>

                  <div className="relative mt-9 flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-400 transition group-hover:text-amber-300">
                      <BookOpen size={15} aria-hidden="true" />
                      {isBangla
                        ? `${level._count?.books ?? 0}টি বই · শুরু করুন`
                        : `${level._count?.books ?? 0} books · Start learning`}
                    </span>

                    <span className="text-slate-500 transition duration-300 group-hover:translate-x-1 group-hover:text-amber-300">
                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-500 group-hover:w-full" />
                </Link>
              );
          })}
          </div>
        )}
      </div>
    </section>
  );
}