import Link from "next/link";
import Navbar from "../components/Navbar";
import LearningLevels from "../components/LearningLevels";
import BlogSection from "../components/BlogSection";
import AusbildungSection from "../components/AusbildungSection";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Learn German with confidence
            </p>

            <h1 className="text-5xl font-bold tracking-tight">
              Learn German from A1 to B2
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Build your German skills with structured lessons,
              vocabulary, grammar, practice, and real-world resources.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/learning-levels"
                className="rounded-md bg-black px-6 py-3 text-white"
              >
                Start Learning
              </Link>

              <Link
                href="/learning-levels"
                className="rounded-md border px-6 py-3"
              >
                Explore Levels
              </Link>
            </div>
          </div>
        </section>

        {/* Learning Levels */}
        <LearningLevels />
        <BlogSection />
         <AusbildungSection />

      </main>
    </>
  );
}