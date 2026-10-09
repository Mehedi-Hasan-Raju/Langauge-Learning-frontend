import LearningLevels from "../../components/LearningLevels";

export default function LearningLevelsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <section className="px-6 pb-2 pt-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
          German learning
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Choose your learning level
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Browse the levels available in our learning library, then open a book
          and study its chapters and vocabulary.
        </p>
      </section>
      <LearningLevels />
    </main>
  );
}
