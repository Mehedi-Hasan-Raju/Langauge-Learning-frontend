"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileCheck2,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const services = [
  {
    number: "01",
    title: "German Exam Preparation",
    titleBn: "জার্মান পরীক্ষার প্রস্তুতি",
    description:
      "Build exam confidence with focused practice, useful resources, and a clear path from preparation to progress.",
    descriptionBn:
      "গোছানো অনুশীলন, দরকারি রিসোর্স এবং স্পষ্ট প্রস্তুতি পরিকল্পনায় পরীক্ষার আত্মবিশ্বাস গড়ে তুলুন।",
    tag: "LEARN",
    tagBn: "শেখা",
    icon: GraduationCap,
    featured: true,
  },
  {
    number: "02",
    title: "Visa & Document Guide",
    titleBn: "ভিসা ও ডকুমেন্ট গাইড",
    description:
      "Make sense of important documents, application steps, and the details behind your move to Germany.",
    descriptionBn:
      "জার্মানিতে যাওয়ার গুরুত্বপূর্ণ কাগজপত্র, আবেদন প্রক্রিয়া এবং প্রয়োজনীয় ধাপগুলো বুঝে নিন।",
    tag: "PLAN",
    tagBn: "পরিকল্পনা",
    icon: FileCheck2,
    featured: false,
  },
  {
    number: "03",
    title: "Ausbildung Guidance",
    titleBn: "Ausbildung গাইডেন্স",
    description:
      "Explore career pathways, understand requirements, and take practical steps toward an Ausbildung.",
    descriptionBn:
      "ক্যারিয়ারের পথ খুঁজুন, প্রয়োজনীয়তা জানুন এবং Ausbildung-এর দিকে বাস্তব পদক্ষেপ নিন।",
    tag: "GROW",
    tagBn: "এগিয়ে চলুন",
    icon: BriefcaseBusiness,
    featured: false,
  },
];

export default function ServicesSection() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden py-24 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-red-500/[0.07] blur-[150px]"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.8)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {isBangla ? "আপনার পরবর্তী ধাপ" : "Your next chapter"}
              </span>
            </div>

            <h2 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              {isBangla ? (
                <>
                  লক্ষ্য ঠিক করুন।
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                    এগিয়ে যান।
                  </span>
                </>
              ) : (
                <>
                  Make your move.
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                    We’ll guide you.
                  </span>
                </>
              )}
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <p className="max-w-xl text-base leading-8 text-slate-400 lg:text-right">
              {isBangla
                ? "জার্মান শেখা থেকে শুরু করে জার্মানিতে ক্যারিয়ার গড়া পর্যন্ত—আপনার লক্ষ্য অনুযায়ী দরকারি গাইড খুঁজে নিন।"
                : "From learning German to building a future in Germany, find practical guidance for the step you’re taking now."}
            </p>
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              <span className="h-px w-10 bg-gradient-to-r from-red-500 to-amber-400" />
              <span>{isBangla ? "৩টি গাইডেড পথ" : "Three guided pathways"}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.number}
                href="/services"
                className={`group relative flex min-h-[350px] flex-col overflow-hidden rounded-[1.75rem] border p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition duration-500 hover:-translate-y-2 md:p-8 ${
                  service.featured
                    ? "border-red-300/20 bg-gradient-to-br from-red-500/[0.13] via-white/[0.055] to-amber-400/[0.08] hover:border-red-300/40 hover:shadow-red-950/30"
                    : "border-white/10 bg-white/[0.035] hover:border-amber-300/30 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-300/[0.07] blur-[70px] transition duration-700 group-hover:scale-125 group-hover:bg-amber-300/[0.12]"
                />

                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-sm tracking-[0.18em] text-slate-500">
                    / {service.number}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-amber-200/80">
                    {isBangla ? service.tagBn : service.tag}
                  </span>
                </div>

                <div className="relative mt-9 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.13] to-white/[0.025] text-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_30px_rgba(0,0,0,0.2)] transition duration-500 group-hover:rotate-[-4deg] group-hover:scale-105 group-hover:border-amber-200/30">
                  <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
                </div>

                <h3 className="relative mt-7 max-w-xs text-2xl font-bold leading-tight text-white">
                  {isBangla ? service.titleBn : service.title}
                </h3>
                <p className="relative mt-4 max-w-sm text-sm leading-7 text-slate-400">
                  {isBangla
                    ? service.descriptionBn
                    : service.description}
                </p>

                <div className="relative mt-auto flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-sm font-semibold text-slate-300 transition-colors group-hover:text-white">
                    {isBangla ? "আরও জানুন" : "Explore this pathway"}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition duration-300 group-hover:border-amber-200/30 group-hover:bg-amber-300/10 group-hover:text-amber-200">
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
