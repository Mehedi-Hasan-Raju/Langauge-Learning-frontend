const blogs = [
  {
    title: "How to Start Learning German from A1",
    description:
      "Learn how to build a strong foundation in German vocabulary, grammar, and communication.",
    category: "German Learning",
  },
  {
    title: "German B1: What Should You Know?",
    description:
      "Understand the important skills you need to develop before moving from B1 to B2.",
    category: "German Levels",
  },
  {
    title: "How to Prepare for German Exams",
    description:
      "Useful strategies and resources to prepare yourself for German language examinations.",
    category: "Exam Preparation",
  },
];

export default function BlogSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider">
            Our Blog
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Learn More About German
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            Explore useful articles, learning tips, exam preparation,
            and information about learning German.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.title}
              className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-sm font-medium text-gray-500">
                {blog.category}
              </span>

              <h3 className="mt-4 text-xl font-semibold">
                {blog.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {blog.description}
              </p>

              <button className="mt-6 text-sm font-semibold underline">
                Read More
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}