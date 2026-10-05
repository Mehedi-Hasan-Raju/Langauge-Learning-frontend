"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

type Blog = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  publishedAt: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  _count: {
    likes: number;
  };
};

type LikeState = {
  liked: boolean;
  count: number;
};

const API_URL = "http://localhost:5000/api";

export default function BlogsPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [likeStates, setLikeStates] = useState<Record<string, LikeState>>({});
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  /*
   * Fetch blogs
   */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/blogs`);

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Failed to fetch blogs");
        }

        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Blog fetch error:", error);

        setError(
          isBangla
            ? "ব্লগ লোড করতে সমস্যা হয়েছে।"
            : "Failed to load blogs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [isBangla]);

  /*
   * Fetch like status for logged-in user
   */
  useEffect(() => {
    if (blogs.length === 0) return;

    const token = localStorage.getItem("accessToken");

    // User is not logged in
    if (!token) return;

    const fetchLikeStatuses = async () => {
      const results: Record<string, LikeState> = {};

      await Promise.all(
        blogs.map(async (blog) => {
          try {
            const response = await fetch(
              `${API_URL}/blogs/${blog.id}/like-status`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) return;

            const data = await response.json();

            /*
             * Backend response may be:
             * { success: true, liked: true }
             *
             * or:
             * { success: true, isLiked: true }
             */
            const liked =
              typeof data.liked === "boolean"
                ? data.liked
                : typeof data.isLiked === "boolean"
                  ? data.isLiked
                  : false;

            results[blog.id] = {
              liked,
              count: blog._count.likes,
            };
          } catch (error) {
            console.error(
              `Like status error for blog ${blog.id}:`,
              error
            );
          }
        })
      );

      setLikeStates((previous) => ({
        ...previous,
        ...results,
      }));
    };

    fetchLikeStatuses();
  }, [blogs]);

  /*
   * Like / Unlike
   */
  const handleLike = async (blog: Blog) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert(
        isBangla
          ? "লাইক দিতে হলে আগে Login করুন।"
          : "Please login to like this article."
      );

      return;
    }

    const currentState = likeStates[blog.id] || {
      liked: false,
      count: blog._count.likes,
    };

    if (likeLoading[blog.id]) return;

    try {
      setLikeLoading((previous) => ({
        ...previous,
        [blog.id]: true,
      }));

      const method = currentState.liked ? "DELETE" : "POST";

      const response = await fetch(
        `${API_URL}/blogs/${blog.id}/like`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to update like"
        );
      }

      /*
       * Optimistic/local update
       */
      setLikeStates((previous) => ({
        ...previous,
        [blog.id]: {
          liked: !currentState.liked,
          count: currentState.liked
            ? Math.max(0, currentState.count - 1)
            : currentState.count + 1,
        },
      }));

      /*
       * If backend returns updated count,
       * use it instead.
       */
      if (
        typeof data.likesCount === "number" ||
        typeof data.likeCount === "number" ||
        typeof data.count === "number"
      ) {
        const updatedCount =
          typeof data.likesCount === "number"
            ? data.likesCount
            : typeof data.likeCount === "number"
              ? data.likeCount
              : data.count;

        setLikeStates((previous) => ({
          ...previous,
          [blog.id]: {
            liked: !currentState.liked,
            count: updatedCount,
          },
        }));
      }
    } catch (error) {
      console.error("Like error:", error);

      alert(
        isBangla
          ? "Like update করা যায়নি।"
          : "Could not update like."
      );
    } finally {
      setLikeLoading((previous) => ({
        ...previous,
        [blog.id]: false,
      }));
    }
  };

  /*
   * Categories
   */
  const categories = [
    "All",
    ...Array.from(
      new Set(blogs.map((blog) => blog.category))
    ),
  ];

  /*
   * Search + category filter
   */
  const filteredBlogs = blogs.filter((blog) => {
    const categoryMatch =
      activeCategory === "All" ||
      blog.category === activeCategory;

    const searchText = search.toLowerCase().trim();

    const searchMatch =
      blog.title.toLowerCase().includes(searchText) ||
      blog.shortDescription
        .toLowerCase()
        .includes(searchText) ||
      blog.category.toLowerCase().includes(searchText) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchText)
      );

    return categoryMatch && searchMatch;
  });

  /*
   * Date formatter
   */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      isBangla ? "bn-BD" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0b0f19]" : "bg-[#f8fafc]"
      }`}
    >
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32">
        <div
          className={`pointer-events-none absolute left-[15%] top-[15%] h-[350px] w-[350px] rounded-full blur-[140px] ${
            isDark ? "bg-red-600/10" : "bg-red-400/10"
          }`}
        />

        <div
          className={`pointer-events-none absolute right-[15%] top-[20%] h-[300px] w-[300px] rounded-full blur-[130px] ${
            isDark ? "bg-amber-500/10" : "bg-amber-400/10"
          }`}
        />

        <div className="relative mx-auto max-w-7xl text-center">
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md ${
              isDark
                ? "border-white/10 bg-white/[0.04]"
                : "border-slate-200 bg-white/80 shadow-sm"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60" />

            <span
              className={`text-sm ${
                isDark
                  ? "text-slate-300"
                  : "text-slate-600"
              }`}
            >
              {isBangla
                ? "জার্মান লার্নিং ব্লগ"
                : "German Learning Blog"}
            </span>
          </div>

          <h1
            className={`text-4xl font-black tracking-tight sm:text-5xl md:text-6xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {isBangla ? (
              <>
                জার্মান শেখার{" "}
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                  জ্ঞানভাণ্ডার
                </span>
              </>
            ) : (
              <>
                Learn German{" "}
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                  Smarter
                </span>
              </>
            )}
          </h1>

          <p
            className={`mx-auto mt-6 max-w-2xl text-base leading-7 md:text-lg ${
              isDark
                ? "text-slate-400"
                : "text-slate-600"
            }`}
          >
            {isBangla
              ? "জার্মান ভাষা শেখা, Grammar, Vocabulary, Speaking এবং Germany নিয়ে দরকারি আর্টিকেল পড়ুন।"
              : "Explore useful articles about German learning, grammar, vocabulary, speaking, and life in Germany."}
          </p>
        </div>
      </section>

      {/* ================= SEARCH + CATEGORY ================= */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl">
            <div
              className={`flex items-center rounded-2xl border px-5 py-3 backdrop-blur-xl ${
                isDark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 shrink-0 ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder={
                  isBangla
                    ? "ব্লগ সার্চ করুন..."
                    : "Search articles..."
                }
                className={`w-full bg-transparent text-sm outline-none ${
                  isDark
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const isActive =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border-transparent bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/20"
                      : isDark
                        ? "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {category === "All"
                    ? isBangla
                      ? "সব"
                      : "All"
                    : category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= BLOG CARDS ================= */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-[430px] animate-pulse rounded-2xl border ${
                    isDark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-slate-200 bg-white"
                  }`}
                />
              ))}
            </div>
          ) : error ? (
            <div
              className={`rounded-2xl border py-20 text-center ${
                isDark
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="text-5xl">⚠️</div>

              <h2
                className={`mt-5 text-xl font-bold ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {error}
              </h2>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-6 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 px-6 py-3 font-semibold text-white"
              >
                {isBangla
                  ? "আবার চেষ্টা করুন"
                  : "Try Again"}
              </button>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => {
                const currentLike =
                  likeStates[blog.id] || {
                    liked: false,
                    count: blog._count.likes,
                  };

                const isLikeLoading =
                  likeLoading[blog.id] || false;

                return (
                  <article
                    key={blog.id}
                    className={`group overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
                      isDark
                        ? "border-white/10 bg-white/[0.035] hover:border-red-500/30 hover:bg-white/[0.05]"
                        : "border-slate-200 bg-white shadow-sm hover:border-red-200 hover:shadow-xl"
                    }`}
                  >
                    {/* COVER */}
                    <div
                      className={`relative h-48 overflow-hidden ${
                        isDark
                          ? "bg-gradient-to-br from-red-950/50 via-slate-900 to-amber-950/30"
                          : "bg-gradient-to-br from-red-50 via-white to-amber-50"
                      }`}
                    >
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div
                            className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${
                              isDark
                                ? "bg-red-500/20"
                                : "bg-red-400/15"
                            }`}
                          />

                          <div
                            className={`absolute -bottom-12 -left-12 h-40 w-40 rounded-full blur-3xl ${
                              isDark
                                ? "bg-amber-500/15"
                                : "bg-amber-400/15"
                            }`}
                          />

                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className={`text-6xl font-black ${
                                isDark
                                  ? "text-white/10"
                                  : "text-slate-900/10"
                              }`}
                            >
                              DE
                            </span>
                          </div>
                        </>
                      )}

                      {/* CATEGORY */}
                      <div className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        {blog.category}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-7">
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          isDark
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        <span>
                          {formatDate(
                            blog.publishedAt
                          )}
                        </span>

                        <span>•</span>

                        <span>
                          {blog.author.name}
                        </span>
                      </div>

                      <h2
                        className={`mt-3 text-xl font-bold leading-snug transition-colors ${
                          isDark
                            ? "text-white group-hover:text-red-400"
                            : "text-slate-900 group-hover:text-red-600"
                        }`}
                      >
                        {blog.title}
                      </h2>

                      <p
                        className={`mt-4 text-sm leading-6 ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        {blog.shortDescription}
                      </p>

                      {/* TAGS */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2.5 py-1 text-xs ${
                              isDark
                                ? "bg-white/[0.05] text-slate-400"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* BOTTOM ACTIONS */}
                      <div
                        className={`mt-6 flex items-center justify-between border-t pt-5 ${
                          isDark
                            ? "border-white/10"
                            : "border-slate-100"
                        }`}
                      >
                        {/* LIKE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleLike(blog)
                          }
                          disabled={isLikeLoading}
                          aria-label={
                            currentLike.liked
                              ? "Unlike article"
                              : "Like article"
                          }
                          className={`group/like inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
                            currentLike.liked
                              ? isDark
                                ? "bg-red-500/10 text-red-400"
                                : "bg-red-50 text-red-600"
                              : isDark
                                ? "text-slate-400 hover:bg-white/[0.05] hover:text-red-400"
                                : "text-slate-500 hover:bg-slate-50 hover:text-red-600"
                          } ${
                            isLikeLoading
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <svg
                            className={`h-5 w-5 transition-transform duration-300 ${
                              currentLike.liked
                                ? "fill-current"
                                : "fill-none"
                            } ${
                              !isLikeLoading
                                ? "group-hover/like:scale-110"
                                : ""
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                            />
                          </svg>

                          <span>
                            {isLikeLoading
                              ? "..."
                              : currentLike.count}
                          </span>

                          <span className="hidden sm:inline">
                            {isBangla
                              ? currentLike.liked
                                ? "লাইক করা হয়েছে"
                                : "লাইক"
                              : currentLike.liked
                                ? "Liked"
                                : "Like"}
                          </span>
                        </button>

                        {/* READ ARTICLE */}
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className={`inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
                            isDark
                              ? "text-red-400"
                              : "text-red-600"
                          }`}
                        >
                          {isBangla
                            ? "আরও পড়ুন"
                            : "Read Article"}
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div
              className={`rounded-2xl border py-20 text-center ${
                isDark
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-5xl">🔍</div>

              <h2
                className={`mt-5 text-xl font-bold ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {isBangla
                  ? "কোনো ব্লগ পাওয়া যায়নি"
                  : "No articles found"}
              </h2>

              <p
                className={`mt-2 text-sm ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {isBangla
                  ? "অন্য keyword অথবা category দিয়ে আবার চেষ্টা করুন।"
                  : "Try another keyword or category."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}