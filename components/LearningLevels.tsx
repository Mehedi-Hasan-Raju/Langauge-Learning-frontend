const levels = [
  {
    level: "A1",
    title: "Beginner",
    description: "Start your German journey with basic vocabulary and everyday expressions.",
  },
  {
    level: "A2",
    title: "Elementary",
    description: "Improve your communication skills and understand common German situations.",
  },
  {
    level: "B1",
    title: "Intermediate",
    description: "Build confidence in speaking, writing, grammar, and everyday conversations.",
  },
  {
    level: "B2",
    title: "Upper Intermediate",
    description: "Develop advanced communication skills for study, work, and real-world situations.",
  },
];

export default function LearningLevels() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider">
            Learning Levels
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Choose Your German Level
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Follow a structured learning path from beginner to upper
            intermediate level.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {levels.map((item) => (
            <div
              key={item.level}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                {item.level}
              </div>

              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.description}
              </p>

              <button className="mt-6 text-sm font-semibold underline">
                Explore {item.level}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
