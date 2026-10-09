"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const members = [
  {
    name: "Dr. Anna Schmidt",
    role: "German Language Instructor",
    roleBn: "জার্মান ভাষার প্রশিক্ষক",
    description:
      "Helping learners build confident communication skills, one clear lesson at a time.",
    descriptionBn:
      "সহজ ও গোছানো পাঠের মাধ্যমে শিক্ষার্থীদের আত্মবিশ্বাসের সঙ্গে জার্মান বলতে সহায়তা করেন।",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    focus: "LEARNING",
  },
  {
    name: "Michael Weber",
    role: "German Exam Specialist",
    roleBn: "জার্মান পরীক্ষা বিশেষজ্ঞ",
    description:
      "Making exam preparation feel focused, practical, and a lot more manageable.",
    descriptionBn:
      "পরীক্ষার প্রস্তুতিকে আরও মনোযোগী, ব্যবহারিক এবং সহজবোধ্য করে তোলেন।",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85",
    focus: "EXAM PREP",
  },
  {
    name: "Sarah Müller",
    role: "Career & Ausbildung Guide",
    roleBn: "ক্যারিয়ার ও Ausbildung গাইড",
    description:
      "Turning questions about Germany into clear next steps for study and work.",
    descriptionBn:
      "জার্মানিতে পড়াশোনা ও কাজ নিয়ে প্রশ্নগুলোকে স্পষ্ট পরবর্তী পদক্ষেপে রূপ দেন।",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1000&q=85",
    focus: "CAREER",
  },
];

export default function MembersSection() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <section
      id="members"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -z-10 h-[30rem] w-[42rem] -translate-x-1/2 rounded-full bg-amber-400/[0.06] blur-[150px]"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">
              <span className="h-px w-9 bg-gradient-to-r from-red-400 to-amber-300" />
              <span>{isBangla ? "আপনার পাশে যারা" : "The people beside you"}</span>
            </div>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {isBangla ? (
                <>
                  আপনার যাত্রার{" "}
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                    সঙ্গী
                  </span>
                </>
              ) : (
                <>
                  Meet your{" "}
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                    guides.
                  </span>
                </>
              )}
            </h2>
          </div>

          <div className="max-w-md md:pb-1">
            <p className="text-base leading-7 text-slate-400">
              {isBangla
                ? "ভাষা শেখা থেকে ক্যারিয়ার পরিকল্পনা—প্রতিটি ধাপে অভিজ্ঞ মানুষের কাছ থেকে দিকনির্দেশনা নিন।"
                : "From your first German lesson to your next career move, meet the people here to help you forward."}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member, index) => (
            <article
              key={member.name}
              className="group relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] shadow-[0_28px_90px_rgba(0,0,0,0.24)] transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_36px_100px_rgba(0,0,0,0.34)]"
            >
              <div className="relative aspect-[0.86] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b13] via-[#080b13]/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-amber-300/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-6 sm:top-6">
                  <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white/80 backdrop-blur-xl">
                    {member.focus}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/80 backdrop-blur-xl transition duration-300 group-hover:rotate-45 group-hover:border-amber-200/40 group-hover:text-amber-100">
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </div>

                <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                  <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-xl">
                    {isBangla ? member.roleBn : member.role}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {member.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                    {isBangla ? member.descriptionBn : member.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-4 sm:px-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  GermanLearn
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {String(index + 1).padStart(2, "0")}{" "}
                  <span className="text-slate-600">/ 03</span>
                </span>
              </div>

              <div className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
