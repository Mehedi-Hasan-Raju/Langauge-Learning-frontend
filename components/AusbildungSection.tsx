"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const opportunities = [
  {
    title: "IT Ausbildung",
    titleBn: "IT Ausbildung",
    subtitle: "IT Specialist",
    subtitleBn: "আইটি স্পেশালিস্ট",
    description:
      "Explore IT Ausbildung opportunities in Germany and learn about different career paths, requirements, and application processes.",
    descriptionBn:
      "জার্মানিতে IT Ausbildung-এর সুযোগ সম্পর্কে জানুন এবং বিভিন্ন career path, requirements ও application process সম্পর্কে ধারণা নিন।",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Dual Studium",
    titleBn: "Dual Studium",
    subtitle: "Study & Work",
    subtitleBn: "পড়াশোনা ও কাজ",
    description:
      "Discover how Dual Studium combines university education with practical work experience and prepares you for a professional career.",
    descriptionBn:
      "Dual Studium কীভাবে university education-এর সাথে practical work experience যুক্ত করে এবং professional career-এর জন্য প্রস্তুত করে তা জানুন।",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Career Guide",
    titleBn: "ক্যারিয়ার গাইড",
    subtitle: "Find Your Opportunity",
    subtitleBn: "আপনার সুযোগ খুঁজুন",
    description:
      "Get useful information about applications, qualifications, career planning, and opportunities for international students in Germany.",
    descriptionBn:
      "জার্মানিতে international students-এর জন্য applications, qualifications, career planning এবং বিভিন্ন career opportunity সম্পর্কে দরকারি তথ্য পান।",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function AusbildungSection() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <section id="ausbildung" className="relative overflow-hidden py-24">
      {/* Glows */}
      <div className="absolute left-1/4 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-red-500/5 blur-[130px]" />

      <div className="absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-amber-400/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60" />

            <span className="text-sm text-slate-300">
              {isBangla
                ? "জার্মানিতে আপনার ভবিষ্যৎ"
                : "Your Future in Germany"}
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            {isBangla ? (
              <>
                Ausbildung ও{" "}
                <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                  ক্যারিয়ার
                </span>
              </>
            ) : (
              <>
                Ausbildung &{" "}
                <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                  Career
                </span>
              </>
            )}
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            {isBangla
              ? "জার্মানিতে পড়াশোনা, Ausbildung এবং IT career-এর জন্য দরকারি তথ্য ও সুযোগগুলো আবিষ্কার করুন।"
              : "Explore useful information and opportunities for studying, Ausbildung, and building an IT career in Germany."}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {opportunities.map((item) => (
            <Link
              key={item.title}
              href="/ausbildung"
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-amber-400/30 hover:bg-white/[0.05]"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt={isBangla ? item.titleBn : item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-7 md:p-8">
                <span className="text-sm font-medium text-amber-300">
                  {isBangla ? item.subtitleBn : item.subtitle}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-white">
                  {isBangla ? item.titleBn : item.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  {isBangla ? item.descriptionBn : item.description}
                </p>

                <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-sm font-medium text-slate-400 transition group-hover:text-amber-300">
                    {isBangla ? "আরও জানুন" : "Learn More"}
                  </span>

                  <span className="text-lg text-slate-500 transition duration-300 group-hover:translate-x-1 group-hover:text-amber-300">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}