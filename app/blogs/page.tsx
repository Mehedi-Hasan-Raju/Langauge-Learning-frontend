"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const blogs = [
  {
    id: 1,
    category: "German Learning",
    categoryBn: "জার্মান শেখা",
    title: "How to Start Learning German from A1",
    titleBn: "A1 থেকে কীভাবে জার্মান শেখা শুরু করবেন",
    excerpt:
      "A simple roadmap to start your German learning journey with the right habits, resources, and practice methods.",
    excerptBn:
      "সঠিক অভ্যাস, রিসোর্স এবং প্র্যাকটিসের মাধ্যমে কীভাবে জার্মান শেখা শুরু করবেন তার একটি সহজ গাইড।",
    level: "A1",
    readTime: "5 min read",
    readTimeBn: "৫ মিনিট পড়া",
    date: "Oct 05, 2026",
    dateBn: "৫ অক্টোবর, ২০২৬",
  },
  {
    id: 2,
    category: "Grammar",
    categoryBn: "ব্যাকরণ",
    title: "German Cases Explained: Nominativ, Akkusativ & Dativ",
    titleBn: "German Cases সহজভাবে বুঝুন: Nominativ, Akkusativ ও Dativ",
    excerpt:
      "Understand the most important German cases with simple examples and practical sentence patterns.",
    excerptBn:
      "সহজ উদাহরণ এবং বাস্তব sentence pattern-এর মাধ্যমে German cases সহজভাবে বুঝুন।",
    level: "A2",
    readTime: "7 min read",
    readTimeBn: "৭ মিনিট পড়া",
    date: "Oct 02, 2026",
    dateBn: "২ অক্টোবর, ২০২৬",
  },
  {
    id: 3,
    category: "Vocabulary",
    categoryBn: "শব্দভাণ্ডার",
    title: "50 German Words You Should Know as a Beginner",
    titleBn: "Beginner হিসেবে যে ৫০টি German Word জানা উচিত",
    excerpt:
      "Build a strong German vocabulary with useful everyday words and expressions.",
    excerptBn:
      "দৈনন্দিন জীবনে ব্যবহৃত গুরুত্বপূর্ণ শব্দ ও expression-এর মাধ্যমে vocabulary শক্ত করুন।",
    level: "A1",
    readTime: "6 min read",
    readTimeBn: "৬ মিনিট পড়া",
    date: "Sep 28, 2026",
    dateBn: "২৮ সেপ্টেম্বর, ২০২৬",
  },
  {
    id: 4,
    category: "Speaking",
    categoryBn: "স্পিকিং",
    title: "How to Improve Your German Speaking Skills",
    titleBn: "কীভাবে German Speaking Skill উন্নত করবেন",
    excerpt:
      "Practical techniques to speak German more confidently without being afraid of mistakes.",
    excerptBn:
      "ভুলের ভয় না পেয়ে কীভাবে আত্মবিশ্বাসের সাথে জার্মান বলা যায় তার কার্যকর কিছু কৌশল।",
    level: "A2-B1",
    readTime: "8 min read",
    readTimeBn: "৮ মিনিট পড়া",
    date: "Sep 24, 2026",
    dateBn: "২৪ সেপ্টেম্বর, ২০২৬",
  },
  {
    id: 5,
    category: "Germany",
    categoryBn: "জার্মানি",
    title: "German Ausbildung: What You Need to Know",
    titleBn: "German Ausbildung: আপনার যা জানা প্রয়োজন",
    excerpt:
      "Learn how Ausbildung works, who can apply, and how German language skills can help.",
    excerptBn:
      "Ausbildung কীভাবে কাজ করে, কারা আবেদন করতে পারে এবং German language কীভাবে সাহায্য করে তা জানুন।",
    level: "B1-B2",
    readTime: "10 min read",
    readTimeBn: "১০ মিনিট পড়া",
    date: "Sep 20, 2026",
    dateBn: "২০ সেপ্টেম্বর, ২০২৬",
  },
  {
    id: 6,
    category: "Study Tips",
    categoryBn: "স্টাডি টিপস",
    title: "How to Build a Daily German Learning Routine",
    titleBn: "দৈনিক German Learning Routine কীভাবে তৈরি করবেন",
    excerpt:
      "Create a realistic daily routine for vocabulary, grammar, listening, writing, and speaking practice.",
    excerptBn:
      "Vocabulary, grammar, listening, writing এবং speaking-এর জন্য একটি বাস্তবসম্মত daily routine তৈরি করুন।",
    level: "All Levels",
    readTime: "6 min read",
    readTimeBn: "৬ মিনিট পড়া",
    date: "Sep 16, 2026",
    dateBn: "১৬ সেপ্টেম্বর, ২০২৬",
  },
];

const categories = [
  {
    en: "All",
    bn: "সব",
  },
  {
    en: "German Learning",
    bn: "জার্মান শেখা",
  },
  {
    en: "Grammar",
    bn: "ব্যাকরণ",
  },
  {
    en: "Vocabulary",
    bn: "শব্দভাণ্ডার",
  },
  {
    en: "Speaking",
    bn: "স্পিকিং",
  },
  {
    en: "Germany",
    bn: "জার্মানি",
  },
  {
    en: "Study Tips",
    bn: "স্টাডি টিপস",
  },
];

export default function BlogsPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredBlogs = blogs.filter((blog) => {
    const categoryMatch =
      activeCategory === "All" || blog.category === activeCategory;

    const searchText = search.toLowerCase();

    const searchMatch =
      blog.title.toLowerCase().includes(searchText) ||
      blog.titleBn.toLowerCase().includes(searchText) ||
      blog.excerpt.toLowerCase().includes(searchText) ||
      blog.excerptBn.toLowerCase().includes(searchText) ||
      blog.category.toLowerCase().includes(searchText);

    return categoryMatch && searchMatch;
  });

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0b0f19]" : "bg-[#f8fafc]"
      }`}
    >
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32">
        {/* Background Glow */}
        <div
          className={`pointer-events-none absolute left-[15%] top-[15%] h-[350px] w-[350px] rounded-full blur-[140px] ${
            isDark ? "bg-red-600/10" : "bg-red-400/10"
          }`}
        />

        <div
          className={`pointer-events-none absolute right-[15%] top-[20%] h-[300px] w-[300px] rounded-full blur-[130px] ${
            isDark ? "bg-amber-500/10" : "bg-amber-400/10"
          }`}
        />

        <div className="relative mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md ${
              isDark
                ? "border-white/10 bg-white/[0.04]"
                : "border-slate-200 bg-white/80 shadow-sm"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60" />

            <span
              className={`text-sm ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {isBangla ? "জার্মান লার্নিং ব্লগ" : "German Learning Blog"}
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`text-4xl font-black tracking-tight sm:text-5xl md:text-6xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {isBangla ? (
              <>
                জার্মান শেখার{" "}
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                  জ্ঞানভাণ্ডার
                </span>
              </>
            ) : (
              <>
                Learn German{" "}
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                  Smarter
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p
            className={`mx-auto mt-6 max-w-2xl text-base leading-7 md:text-lg ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {isBangla
              ? "জার্মান ভাষা শেখা, Grammar, Vocabulary, Speaking এবং Germany নিয়ে দরকারি আর্টিকেল পড়ুন।"
              : "Explore useful articles about German learning, grammar, vocabulary, speaking, and life in Germany."}
          </p>
        </div>
      </section>

      {/* Search + Categories */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-7xl">
          {/* Search */}
          <div className="mx-auto max-w-2xl">
            <div
              className={`flex items-center rounded-2xl border px-5 py-3 backdrop-blur-xl transition-colors ${
                isDark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 shrink-0 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isBangla
                    ? "ব্লগ সার্চ করুন..."
                    : "Search articles..."
                }
                className={`w-full bg-transparent text-sm outline-none ${
                  isDark
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const isActive = activeCategory === category.en;

              return (
                <button
                  key={category.en}
                  type="button"
                  onClick={() => setActiveCategory(category.en)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border-transparent bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/20"
                      : isDark
                        ? "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {isBangla ? category.bn : category.en}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          {filteredBlogs.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className={`group overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
                    isDark
                      ? "border-white/10 bg-white/[0.035] hover:border-red-500/30 hover:bg-white/[0.05]"
                      : "border-slate-200 bg-white shadow-sm hover:-translate-y-2 hover:border-red-200 hover:shadow-xl"
                  }`}
                >
                  {/* Blog Visual */}
                  <div
                    className={`relative h-48 overflow-hidden ${
                      isDark
                        ? "bg-gradient-to-br from-red-950/50 via-slate-900 to-amber-950/30"
                        : "bg-gradient-to-br from-red-50 via-white to-amber-50"
                    }`}
                  >
                    <div
                      className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${
                        isDark ? "bg-red-500/20" : "bg-red-400/15"
                      }`}
                    />

                    <div
                      className={`absolute -bottom-12 -left-12 h-40 w-40 rounded-full blur-3xl ${
                        isDark ? "bg-amber-500/15" : "bg-amber-400/15"
                      }`}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-6xl font-black transition-transform duration-500 group-hover:scale-110 ${
                          isDark ? "text-white/10" : "text-slate-900/10"
                        }`}
                      >
                        DE
                      </span>
                    </div>

                    {/* Level */}
                    <div className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                      {blog.level}
                    </div>

                    {/* Category */}
                    <div
                      className={`absolute right-5 top-5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md ${
                        isDark
                          ? "border-white/10 bg-black/20 text-slate-300"
                          : "border-slate-200 bg-white/80 text-slate-600"
                      }`}
                    >
                      {isBangla ? blog.categoryBn : blog.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <p
                      className={`text-xs ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {isBangla ? blog.dateBn : blog.date}
                      {" • "}
                      {isBangla ? blog.readTimeBn : blog.readTime}
                    </p>

                    <h2
                      className={`mt-3 text-xl font-bold leading-snug transition-colors ${
                        isDark
                          ? "text-white group-hover:text-red-400"
                          : "text-slate-900 group-hover:text-red-600"
                      }`}
                    >
                      {isBangla ? blog.titleBn : blog.title}
                    </h2>

                    <p
                      className={`mt-4 text-sm leading-6 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {isBangla ? blog.excerptBn : blog.excerpt}
                    </p>

                    <Link
                      href={`/blogs/${blog.id}`}
                      className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {isBangla ? "আরও পড়ুন" : "Read Article"}
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              className={`rounded-2xl border py-20 text-center ${
                isDark
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-5xl">🔍</div>

              <h2
                className={`mt-5 text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {isBangla ? "কোনো ব্লগ পাওয়া যায়নি" : "No articles found"}
              </h2>

              <p
                className={`mt-2 text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {isBangla
                  ? "অন্য keyword অথবা category দিয়ে আবার চেষ্টা করুন।"
                  : "Try another keyword or category."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}