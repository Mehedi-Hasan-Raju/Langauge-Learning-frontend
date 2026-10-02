"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const services = [
  {
    number: "01",
    title: "German Exam Preparation",
    titleBn: "জার্মান পরীক্ষার প্রস্তুতি",
    description:
      "Prepare for German language exams with structured practice, useful resources, and exam-focused guidance.",
    descriptionBn:
      "গোছানো practice, দরকারি resources এবং exam-focused guidance-এর মাধ্যমে জার্মান ভাষার পরীক্ষার প্রস্তুতি নিন।",
    tag: "Coming Soon",
    tagBn: "শীঘ্রই আসছে",
  },
  {
    number: "02",
    title: "Visa & Document Guide",
    titleBn: "ভিসা ও ডকুমেন্ট গাইড",
    description:
      "Understand important documents, application steps, and useful information for your journey to Germany.",
    descriptionBn:
      "জার্মানিতে যাওয়ার জন্য গুরুত্বপূর্ণ documents, application steps এবং দরকারি তথ্য সম্পর্কে পরিষ্কার ধারণা নিন।",
    tag: "Guide",
    tagBn: "গাইড",
  },
  {
    number: "03",
    title: "Ausbildung Guidance",
    titleBn: "Ausbildung গাইডেন্স",
    description:
      "Learn about Ausbildung opportunities, requirements, applications, and career paths in Germany.",
    descriptionBn:
      "জার্মানিতে Ausbildung-এর opportunities, requirements, applications এবং career paths সম্পর্কে জানুন।",
    tag: "Career",
    tagBn: "ক্যারিয়ার",
  },
];

export default function ServicesSection() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <section id="services" className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-red-500/5 blur-[140px]" />

      <div className="absolute right-0 top-10 h-[350px] w-[350px] rounded-full bg-amber-400/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/60" />

            <span className="text-sm text-slate-300">
              {isBangla ? "আপনার জন্য আমাদের সেবা" : "Support For Your Journey"}
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            {isBangla ? (
              <>
                আমাদের{" "}
                <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                  সার্ভিস
                </span>
              </>
            ) : (
              <>
                Our{" "}
                <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
                  Services
                </span>
              </>
            )}
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            {isBangla
              ? "জার্মান ভাষা শেখা থেকে শুরু করে জার্মানিতে আপনার ভবিষ্যৎ পরিকল্পনা পর্যন্ত দরকারি সাপোর্ট পান।"
              : "Get useful support for learning German and planning your future in Germany."}
          </p>
        </div>

        {/* Service Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.number}
              href="/services"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-7 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-red-400/30 hover:bg-white/[0.05] md:p-8"
            >
              {/* Number */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-widest text-red-400">
                  {service.number}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400 backdrop-blur-md">
                  {isBangla ? service.tagBn : service.tag}
                </span>
              </div>

              {/* Decorative Icon */}
              <div className="relative mt-9 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 to-amber-400/10 text-2xl shadow-lg">
                {service.number === "01" && "✦"}
                {service.number === "02" && "◇"}
                {service.number === "03" && "→"}
              </div>

              <h3 className="mt-7 text-xl font-bold text-white">
                {isBangla ? service.titleBn : service.title}
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                {isBangla ? service.descriptionBn : service.description}
              </p>

              <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-sm font-medium text-slate-400 transition group-hover:text-amber-300">
                  {isBangla ? "বিস্তারিত দেখুন" : "Explore Service"}
                </span>

                <span className="text-lg text-slate-500 transition duration-300 group-hover:translate-x-1 group-hover:text-amber-300">
                  →
                </span>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}