"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const blogs = [
  {
    category: "German Learning",
    categoryBn: "জার্মান শেখা",
    title: "How to Start Learning German from A1",
    titleBn: "A1 থেকে কীভাবে জার্মান শেখা শুরু করবেন",
    description:
      "Learn how to build a strong foundation with essential German vocabulary, grammar, and everyday communication. Discover practical techniques for learning new words, understanding basic sentence structures, and becoming comfortable with everyday German.",
    descriptionBn:
      "প্রয়োজনীয় জার্মান শব্দভাণ্ডার, ব্যাকরণ এবং দৈনন্দিন যোগাযোগের মাধ্যমে কীভাবে একটি শক্ত ভিত্তি তৈরি করবেন তা শিখুন। নতুন শব্দ শেখা, বাক্যের গঠন বোঝা এবং দৈনন্দিন জার্মান ব্যবহারে স্বাচ্ছন্দ্য অর্জনের কার্যকর পদ্ধতি আবিষ্কার করুন।",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    category: "Study Tips",
    categoryBn: "পড়াশোনার টিপস",
    title: "How to Build a Consistent German Study Routine",
    titleBn: "কীভাবে নিয়মিত জার্মান শেখার রুটিন তৈরি করবেন",
    description:
      "Discover practical ways to organize your daily German practice and improve your skills step by step. Learn how to balance vocabulary, grammar, listening, writing, and speaking while creating a realistic study routine that you can follow consistently.",
    descriptionBn:
      "প্রতিদিনের জার্মান অনুশীলন কীভাবে সাজাবেন এবং ধাপে ধাপে দক্ষতা উন্নত করবেন তা জানুন। vocabulary, grammar, listening, writing এবং speaking-এর মধ্যে ভারসাম্য রেখে কীভাবে একটি বাস্তবসম্মত ও নিয়মিত study routine তৈরি করবেন তা শিখুন।",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function BlogSection() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <section id="blogs" className="relative overflow-hidden py-24">
      {/* Background Glows */}
      <div className="absolute left-[-180px] top-20 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[140px]" />

      <div className="absolute right-[-180px] bottom-10 h-[400px] w-[400px] rounded-full bg-amber-400/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/60" />

              <span className="text-sm text-slate-300">
                {isBangla ? "শিখুন ও জানুন" : "Learn & Discover"}
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              {isBangla ? (
                <>
                  জার্মান শেখার{" "}
                  <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                    ব্লগ
                  </span>
                </>
              ) : (
                <>
                  German Learning{" "}
                  <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                    Blog
                  </span>
                </>
              )}
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
              {isBangla
                ? "জার্মান ভাষা শেখা, পড়াশোনা এবং জার্মানিতে ক্যারিয়ার নিয়ে দরকারি টিপস ও গাইড পড়ুন।"
                : "Explore useful tips and guides about learning German, studying, and building your career in Germany."}
            </p>
          </div>

          <Link
            href="/blogs"
            className="w-fit rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 backdrop-blur-md transition hover:border-amber-400/30 hover:bg-white/[0.06] hover:text-white"
          >
            {isBangla ? "সব ব্লগ দেখুন →" : "View All Blogs →"}
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {blogs.map((blog) => (
            <article
              key={blog.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={isBangla ? blog.titleBn : blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/20 to-transparent" />

                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
                  {isBangla ? blog.categoryBn : blog.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 md:p-8">
                <h3 className="text-2xl font-bold leading-tight text-white">
                  {isBangla ? blog.titleBn : blog.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  {isBangla ? blog.descriptionBn : blog.description}
                </p>

                {/* Bottom */}
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-sm font-medium text-slate-400 transition group-hover:text-amber-300">
                    {isBangla ? "আরও পড়ুন" : "Read More"}
                  </span>

                  <span className="text-lg text-slate-500 transition duration-300 group-hover:translate-x-1 group-hover:text-amber-300">
                    →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}