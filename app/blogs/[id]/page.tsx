"use client";

import Link from "next/link";
import { use } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

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
    content: [
      {
        heading: "Start with the Basics",
        headingBn: "বেসিক বিষয় দিয়ে শুরু করুন",
        text: "Learning German becomes easier when you build a strong foundation first. Start with pronunciation, greetings, numbers, basic verbs, and simple everyday expressions.",
        textBn:
          "জার্মান শেখা সহজ হয় যখন শুরুতেই একটি ভালো foundation তৈরি করা যায়। প্রথমে pronunciation, greetings, numbers, basic verbs এবং দৈনন্দিন ব্যবহারের সহজ expression শিখুন।",
      },
      {
        heading: "Build a Daily Routine",
        headingBn: "দৈনিক একটি Routine তৈরি করুন",
        text: "Consistency is more important than studying for many hours once a week. Try to spend some time every day on vocabulary, grammar, listening, and speaking.",
        textBn:
          "সপ্তাহে একদিন অনেকক্ষণ পড়ার চেয়ে প্রতিদিন নিয়মিত পড়া বেশি গুরুত্বপূর্ণ। প্রতিদিন vocabulary, grammar, listening এবং speaking-এর জন্য কিছু সময় রাখুন।",
      },
      {
        heading: "Practice What You Learn",
        headingBn: "যা শিখছেন তা Practice করুন",
        text: "Do not only memorize German words. Use them in sentences and try to speak about your daily life using simple German.",
        textBn:
          "শুধু German word মুখস্থ করবেন না। এগুলো sentence-এ ব্যবহার করুন এবং সহজ German দিয়ে আপনার দৈনন্দিন জীবন সম্পর্কে বলার চেষ্টা করুন।",
      },
    ],
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
    content: [
      {
        heading: "What Are German Cases?",
        headingBn: "German Cases কী?",
        text: "German uses cases to show the role of a noun or pronoun in a sentence. The most important cases for beginners are Nominativ, Akkusativ, and Dativ.",
        textBn:
          "German language-এ noun বা pronoun sentence-এর মধ্যে কী ভূমিকা পালন করছে তা বোঝাতে cases ব্যবহার করা হয়। Beginnerদের জন্য Nominativ, Akkusativ এবং Dativ সবচেয়ে গুরুত্বপূর্ণ।",
      },
      {
        heading: "Nominativ",
        headingBn: "Nominativ",
        text: "Nominativ is usually used for the subject of a sentence. For example: Der Mann ist hier. The man is here.",
        textBn:
          "Nominativ সাধারণত sentence-এর subject-এর জন্য ব্যবহৃত হয়। যেমন: Der Mann ist hier। অর্থাৎ লোকটি এখানে আছে।",
      },
      {
        heading: "Akkusativ and Dativ",
        headingBn: "Akkusativ এবং Dativ",
        text: "Akkusativ is commonly used for the direct object, while Dativ is commonly used for the indirect object. Understanding these patterns will make German sentences much easier.",
        textBn:
          "Akkusativ সাধারণত direct object-এর জন্য এবং Dativ সাধারণত indirect object-এর জন্য ব্যবহৃত হয়। এই patternগুলো বুঝতে পারলে German sentence তৈরি করা অনেক সহজ হবে।",
      },
    ],
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
    content: [
      {
        heading: "Learn Useful Words First",
        headingBn: "প্রথমে দরকারি শব্দ শিখুন",
        text: "As a beginner, focus on words that you can actually use in everyday conversations. Greetings, numbers, family, food, time, and common verbs are excellent starting points.",
        textBn:
          "Beginner হিসেবে এমন শব্দ শেখার চেষ্টা করুন যেগুলো আপনি বাস্তব জীবনে ব্যবহার করতে পারবেন। Greetings, numbers, family, food, time এবং common verbs দিয়ে শুরু করা ভালো।",
      },
      {
        heading: "Learn Words in Context",
        headingBn: "Context-এর মাধ্যমে শব্দ শিখুন",
        text: "Instead of memorizing isolated words, learn them inside short sentences. This helps you remember both the meaning and the correct usage.",
        textBn:
          "আলাদা আলাদা word মুখস্থ না করে ছোট sentence-এর মধ্যে word শিখুন। এতে word-এর meaning এবং correct usage দুটোই মনে রাখা সহজ হয়।",
      },
    ],
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
    content: [
      {
        heading: "Do Not Wait for Perfect German",
        headingBn: "Perfect German-এর জন্য অপেক্ষা করবেন না",
        text: "One of the biggest barriers to speaking German is waiting until your grammar becomes perfect. Start speaking with the German you already know.",
        textBn:
          "German speaking-এর সবচেয়ে বড় বাধাগুলোর একটি হলো grammar perfect হওয়ার জন্য অপেক্ষা করা। আপনি যতটুকু German জানেন, সেটুকু দিয়েই speaking শুরু করুন।",
      },
      {
        heading: "Speak Every Day",
        headingBn: "প্রতিদিন কথা বলুন",
        text: "Even ten to fifteen minutes of speaking practice every day can make a significant difference over time.",
        textBn:
          "প্রতিদিন মাত্র ১০ থেকে ১৫ মিনিট speaking practice করলেও সময়ের সাথে আপনার speaking skill-এ অনেক উন্নতি হবে।",
      },
      {
        heading: "Record Yourself",
        headingBn: "নিজের Voice Record করুন",
        text: "Record yourself speaking German and listen to it later. This helps you identify pronunciation problems and repeated mistakes.",
        textBn:
          "German বলার সময় নিজের voice record করুন এবং পরে শুনুন। এতে pronunciation problem এবং repeated mistakes সহজে খুঁজে বের করতে পারবেন।",
      },
    ],
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
    content: [
      {
        heading: "What Is Ausbildung?",
        headingBn: "Ausbildung কী?",
        text: "Ausbildung is a vocational training pathway in Germany that combines practical workplace training with theoretical education.",
        textBn:
          "Ausbildung হলো জার্মানির একটি vocational training pathway যেখানে practical workplace training-এর সাথে theoretical education যুক্ত থাকে।",
      },
      {
        heading: "Why German Matters",
        headingBn: "German Language কেন গুরুত্বপূর্ণ",
        text: "German language skills are important because much of the training, workplace communication, and daily life in Germany happens in German.",
        textBn:
          "German language জানা গুরুত্বপূর্ণ কারণ training, workplace communication এবং Germany-র দৈনন্দিন জীবনের বড় একটি অংশ German ভাষায় হয়।",
      },
      {
        heading: "Prepare Before Applying",
        headingBn: "Apply করার আগে প্রস্তুতি নিন",
        text: "Build your German language skills, prepare a strong CV, collect your academic documents, and research suitable Ausbildung opportunities.",
        textBn:
          "German language skill উন্নত করুন, ভালো CV তৈরি করুন, academic documents প্রস্তুত করুন এবং আপনার জন্য suitable Ausbildung opportunities খুঁজে বের করুন।",
      },
    ],
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
    content: [
      {
        heading: "Create a Realistic Schedule",
        headingBn: "বাস্তবসম্মত Schedule তৈরি করুন",
        text: "A good German learning routine does not have to be complicated. Divide your study time into small focused sessions.",
        textBn:
          "একটি ভালো German learning routine খুব complicated হতে হবে এমন নয়। আপনার study time-কে ছোট ছোট focused session-এ ভাগ করুন।",
      },
      {
        heading: "Balance Different Skills",
        headingBn: "সবগুলো Skill-এর Balance রাখুন",
        text: "Try to practice vocabulary, grammar, listening, reading, writing, and speaking throughout the week.",
        textBn:
          "সপ্তাহজুড়ে vocabulary, grammar, listening, reading, writing এবং speaking practice করার চেষ্টা করুন।",
      },
      {
        heading: "Track Your Progress",
        headingBn: "আপনার Progress Track করুন",
        text: "Keep track of what you have learned and regularly review older topics. This makes your learning more consistent and effective.",
        textBn:
          "আপনি কী শিখেছেন তার হিসাব রাখুন এবং পুরোনো topic নিয়মিত review করুন। এতে learning আরও consistent এবং effective হবে।",
      },
    ],
  },
];

export default function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const { id } = use(params);

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const blog = blogs.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center px-6 ${
          isDark ? "bg-[#0b0f19]" : "bg-[#f8fafc]"
        }`}
      >
        <div className="text-center">
          <div className="text-6xl">404</div>

          <h1
            className={`mt-5 text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {isBangla ? "ব্লগ পাওয়া যায়নি" : "Blog not found"}
          </h1>

          <Link
            href="/blogs"
            className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-red-600 to-amber-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/20"
          >
            {isBangla ? "সব ব্লগ দেখুন" : "Back to Blogs"}
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = blogs.findIndex((item) => item.id === blog.id);
  const previousBlog = blogs[currentIndex - 1];
  const nextBlog = blogs[currentIndex + 1];

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0b0f19]" : "bg-[#f8fafc]"
      }`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32">
        <div
          className={`pointer-events-none absolute left-[10%] top-[10%] h-[400px] w-[400px] rounded-full blur-[150px] ${
            isDark ? "bg-red-600/10" : "bg-red-400/10"
          }`}
        />

        <div
          className={`pointer-events-none absolute right-[10%] top-[20%] h-[350px] w-[350px] rounded-full blur-[140px] ${
            isDark ? "bg-amber-500/10" : "bg-amber-400/10"
          }`}
        />

        <div className="relative mx-auto max-w-4xl">
          <Link
            href="/blogs"
            className={`mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors ${
              isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>←</span>
            {isBangla ? "সব ব্লগে ফিরে যান" : "Back to all blogs"}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/20">
              {blog.level}
            </span>

            <span
              className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                isDark
                  ? "border-white/10 bg-white/[0.04] text-slate-300"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {isBangla ? blog.categoryBn : blog.category}
            </span>

            <span
              className={`text-sm ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla ? blog.dateBn : blog.date}
            </span>

            <span
              className={`text-sm ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              •
            </span>

            <span
              className={`text-sm ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla ? blog.readTimeBn : blog.readTime}
            </span>
          </div>

          <h1
            className={`mt-7 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {isBangla ? blog.titleBn : blog.title}
          </h1>

          <p
            className={`mt-7 max-w-3xl text-lg leading-8 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {isBangla ? blog.excerptBn : blog.excerpt}
          </p>
        </div>
      </section>

      {/* ARTICLE */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div
            className={`mb-10 flex h-64 items-center justify-center overflow-hidden rounded-3xl border sm:h-80 ${
              isDark
                ? "border-white/10 bg-gradient-to-br from-red-950/50 via-slate-900 to-amber-950/30"
                : "border-slate-200 bg-gradient-to-br from-red-50 via-white to-amber-50"
            }`}
          >
            <div className="relative">
              <div
                className={`absolute -inset-16 rounded-full blur-3xl ${
                  isDark ? "bg-red-500/15" : "bg-red-400/10"
                }`}
              />

              <span
                className={`relative text-8xl font-black sm:text-9xl ${
                  isDark ? "text-white/10" : "text-slate-900/10"
                }`}
              >
                DE
              </span>
            </div>
          </div>

          <article
            className={`rounded-3xl border p-7 backdrop-blur-xl sm:p-10 md:p-14 ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            {blog.content.map((section, index) => (
              <div
                key={section.heading}
                className={index === 0 ? "" : "mt-12"}
              >
                <h2
                  className={`text-2xl font-bold sm:text-3xl ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {isBangla ? section.headingBn : section.heading}
                </h2>

                <p
                  className={`mt-5 text-base leading-8 sm:text-lg ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {isBangla ? section.textBn : section.text}
                </p>
              </div>
            ))}
          </article>
        </div>
      </section>

      {/* PREVIOUS / NEXT */}
      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
          {previousBlog ? (
            <Link
              href={`/blogs/${previousBlog.id}`}
              className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? "border-white/10 bg-white/[0.03] hover:border-red-500/30"
                  : "border-slate-200 bg-white hover:border-red-200 hover:shadow-lg"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {isBangla ? "আগের ব্লগ" : "Previous Article"}
              </p>

              <h3
                className={`mt-3 font-bold transition-colors ${
                  isDark
                    ? "text-white group-hover:text-red-400"
                    : "text-slate-900 group-hover:text-red-600"
                }`}
              >
                {isBangla ? previousBlog.titleBn : previousBlog.title}
              </h3>

              <span
                className={`mt-4 inline-block text-sm ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                ← {isBangla ? "পড়ুন" : "Read"}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextBlog ? (
            <Link
              href={`/blogs/${nextBlog.id}`}
              className={`group rounded-2xl border p-6 text-right transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? "border-white/10 bg-white/[0.03] hover:border-amber-500/30"
                  : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-lg"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {isBangla ? "পরের ব্লগ" : "Next Article"}
              </p>

              <h3
                className={`mt-3 font-bold transition-colors ${
                  isDark
                    ? "text-white group-hover:text-amber-400"
                    : "text-slate-900 group-hover:text-amber-600"
                }`}
              >
                {isBangla ? nextBlog.titleBn : nextBlog.title}
              </h3>

              <span
                className={`mt-4 inline-block text-sm ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {isBangla ? "পড়ুন →" : "Read →"}
              </span>
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}