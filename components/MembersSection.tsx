const members = [
  {
    name: "Dr. Anna Schmidt",
    role: "German Language Instructor",
    description:
      "Experienced German language instructor helping learners build strong communication skills from beginner to advanced levels.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Michael Weber",
    role: "German Exam Specialist",
    description:
      "Specialized in German exam preparation with a focus on grammar, writing, listening, and speaking skills.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sarah Müller",
    role: "Career & Ausbildung Guide",
    description:
      "Helping international learners understand Ausbildung, career opportunities, and the journey toward Germany.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
  },
];

export default function MembersSection() {
  return (
    <section
      id="members"
      className="relative overflow-hidden py-28"
    >
      {/* Ambient Glow */}
      <div className="absolute left-1/4 top-1/3 h-[450px] w-[450px] rounded-full bg-red-600/10 blur-[150px]" />

      <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-red-500" />

            <span className="text-sm font-medium uppercase tracking-[0.2em] text-red-400">
              Our Members
            </span>

            <span className="h-px w-10 bg-amber-400" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Learn with{" "}
            <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
              experienced people.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-slate-400">
            Meet the people behind our learning platform and get
            guidance throughout your German learning journey.
          </p>
        </div>

        {/* Members */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/40 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-red-500/10"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/20 to-transparent" />

                {/* Red glow */}
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-red-500/20 blur-3xl transition duration-500 group-hover:bg-red-500/30" />

                {/* Role badge */}
                <div className="absolute bottom-5 left-5">
                  <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 md:p-8">
                <h3 className="text-2xl font-bold text-white transition duration-300 group-hover:text-amber-300">
                  {member.name}
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  {member.description}
                </p>

                {/* Bottom */}
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-sm text-slate-500">
                    GermanLearn Team
                  </span>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition-all duration-300 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 group-hover:text-amber-300"
                    aria-label={`View ${member.name}`}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}