const opportunities = [
  {
    title: "IT Specialist",
    description:
      "Explore IT Ausbildung opportunities in application development, system integration, and other technical fields.",
    type: "IT Ausbildung",
  },
  {
    title: "Dual Study",
    description:
      "Combine university education with practical work experience through dual study programs in Germany.",
    type: "Dual Studium",
  },
  {
    title: "Find Your Opportunity",
    description:
      "Discover useful information about requirements, application process, documents, and career opportunities.",
    type: "Career Guide",
  },
];

export default function AusbildungSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider">
            Ausbildung & Career
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Build Your Future in Germany
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Explore Ausbildung, dual study programs, and useful
            career information for starting your journey in Germany.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {opportunities.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-sm font-medium text-gray-500">
                {item.type}
              </span>

              <h3 className="mt-4 text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.description}
              </p>

              <button className="mt-6 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                Explore More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
