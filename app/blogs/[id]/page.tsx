"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

type Blog = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content?: string | null;
  coverImage: string | null;
  category: string;
  tags: string[];
  publishedAt: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  _count?: {
    likes: number;
  };
};

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params?.id as string;

  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/blogs/slug/${slug}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Blog not found");
        }

        const data = await response.json();

        const fetchedBlog = data?.blog || data?.data || data;

        setBlog(fetchedBlog);

        setLikes(fetchedBlog?._count?.likes || 0);
      } catch (err) {
        console.error(err);
        setError(
          isBangla
            ? "এই আর্টিকেলটি খুঁজে পাওয়া যায়নি।"
            : "This article could not be found."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, isBangla]);

  useEffect(() => {
    if (!blog?.id) return;

    const checkLikeStatus = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

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

        setLiked(Boolean(data?.liked ?? data?.isLiked));
      } catch (error) {
        console.error("Like status error:", error);
      }
    };

    checkLikeStatus();
  }, [blog?.id]);

  const handleLike = async () => {
    if (!blog || likeLoading) return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert(
        isBangla
          ? "Like করতে আগে Login করুন।"
          : "Please login first to like this article."
      );
      return;
    }

    try {
      setLikeLoading(true);

      const endpoint = `${API_URL}/blogs/${blog.id}/like`;

      const response = await fetch(endpoint, {
        method: liked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Like action failed");
      }

      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    } catch (error) {
      console.error(error);

      alert(
        isBangla
          ? "Like update করা যায়নি। আবার চেষ্টা করুন।"
          : "Could not update your like. Please try again."
      );
    } finally {
      setLikeLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      isBangla ? "bn-BD" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <main
        className={`min-h-screen pt-28 pb-20 transition-colors duration-500 ${
          isDark
            ? "bg-[#080b12] text-white"
            : "bg-[#f7f8fc] text-slate-900"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div
            className={`h-5 w-32 animate-pulse rounded ${
              isDark ? "bg-white/10" : "bg-slate-200"
            }`}
          />

          <div
            className={`mt-8 h-[420px] animate-pulse rounded-[32px] ${
              isDark ? "bg-white/5" : "bg-slate-200"
            }`}
          />

          <div className="mx-auto mt-10 max-w-4xl space-y-5">
            <div
              className={`h-6 w-40 animate-pulse rounded ${
                isDark ? "bg-white/10" : "bg-slate-200"
              }`}
            />

            <div
              className={`h-14 w-full animate-pulse rounded-xl ${
                isDark ? "bg-white/10" : "bg-slate-200"
              }`}
            />

            <div
              className={`h-5 w-3/4 animate-pulse rounded ${
                isDark ? "bg-white/10" : "bg-slate-200"
              }`}
            />

            <div className="space-y-3 pt-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`h-4 animate-pulse rounded ${
                    isDark ? "bg-white/10" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center px-6 pt-24 transition-colors duration-500 ${
          isDark
            ? "bg-[#080b12] text-white"
            : "bg-[#f7f8fc] text-slate-900"
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border ${
              isDark
                ? "border-white/10 bg-white/[0.04]"
                : "border-slate-200 bg-white"
            }`}
          >
            <span className="text-3xl">📖</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            {isBangla ? "আর্টিকেল পাওয়া যায়নি" : "Article Not Found"}
          </h1>

          <p
            className={`mt-3 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {error}
          </p>

          <Link
            href="/blogs"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5"
          >
            ← {isBangla ? "সব ব্লগ দেখুন" : "Back to Blogs"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden pt-24 pb-24 transition-colors duration-500 ${
        isDark
          ? "bg-[#080b12] text-white"
          : "bg-[#f7f8fc] text-slate-900"
      }`}
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-[-180px] top-[100px] h-[420px] w-[420px] rounded-full blur-[140px] ${
            isDark ? "bg-red-500/10" : "bg-red-400/10"
          }`}
        />

        <div
          className={`absolute right-[-160px] top-[300px] h-[420px] w-[420px] rounded-full blur-[140px] ${
            isDark ? "bg-amber-500/10" : "bg-amber-400/10"
          }`}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/blogs"
            className={`transition hover:text-red-500 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {isBangla ? "ব্লগ" : "Blogs"}
          </Link>

          <span className={isDark ? "text-slate-600" : "text-slate-300"}>
            /
          </span>

          <span
            className={`max-w-[220px] truncate ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {blog.category}
          </span>
        </div>

        {/* Hero Image */}
        <div
          className={`group relative overflow-hidden rounded-[30px] border ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-slate-200 bg-white"
          } shadow-2xl ${
            isDark ? "shadow-black/30" : "shadow-slate-200/60"
          }`}
        >
          <div className="relative h-[280px] sm:h-[380px] lg:h-[480px]">
            {blog.coverImage ? (
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
              />
            ) : (
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-br from-[#151923] via-[#11151f] to-[#0b0e16]"
                    : "bg-gradient-to-br from-slate-100 via-white to-slate-200"
                }`}
              >
                <div className="text-center">
                  <div className="text-7xl opacity-40">🇩🇪</div>
                  <p
                    className={`mt-3 text-sm ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    GermanLearn
                  </p>
                </div>
              </div>
            )}

            {/* Image Gradient */}
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                  : "bg-gradient-to-t from-black/30 via-transparent to-transparent"
              }`}
            />

            {/* Category Badge */}
            <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
              <span className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-xl">
                {blog.category}
              </span>
            </div>

            {/* Hero Bottom Info */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/75">
                <span>{formatDate(blog.publishedAt)}</span>

                <span className="h-1 w-1 rounded-full bg-white/50" />

                <span>
                  {isBangla ? "লিখেছেন" : "By"} {blog.author?.name}
                </span>

                <span className="h-1 w-1 rounded-full bg-white/50" />

                <span>
                  {likes} {isBangla ? "লাইক" : "likes"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Article */}
        <article className="mx-auto max-w-4xl">
          {/* Title Area */}
          <div className="pt-10 sm:pt-14">
            <h1
              className={`text-3xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-[58px] ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              {blog.title}
            </h1>

            <p
              className={`mt-6 max-w-3xl text-base leading-8 sm:text-lg ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {blog.shortDescription}
            </p>
          </div>

          {/* Author + Like Bar */}
          <div
            className={`mt-8 flex flex-col gap-5 border-y py-5 sm:flex-row sm:items-center sm:justify-between ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-500 text-sm font-bold text-white shadow-lg shadow-red-500/20">
                {blog.author?.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "GL"}
              </div>

              <div>
                <p
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {blog.author?.name}
                </p>

                <p
                  className={`text-xs ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {isBangla ? "GermanLearn লেখক" : "GermanLearn Author"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`group inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                liked
                  ? "border-red-500/40 bg-red-500/10 text-red-500 shadow-lg shadow-red-500/10"
                  : isDark
                  ? "border-white/10 bg-white/[0.04] text-slate-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              } ${likeLoading ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span
                className={`text-lg transition-transform ${
                  liked ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {liked ? "♥" : "♡"}
              </span>

              <span>
                {likes} {isBangla ? "লাইক" : "Like"}
              </span>
            </button>
          </div>

          {/* Article Content */}
          <div
            className={`prose prose-lg mt-10 max-w-none ${
              isDark
                ? "prose-invert prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-a:text-red-400"
                : "prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-a:text-red-600"
            } prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-8 prose-li:leading-8`}
          >
            {blog.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: blog.content,
                }}
              />
            ) : (
              <div
                className={`rounded-3xl border p-8 text-center ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="text-4xl">📝</div>

                <h3 className="mt-4 text-xl font-bold">
                  {isBangla
                    ? "আর্টিকেল কনটেন্ট শীঘ্রই আসছে"
                    : "Article content coming soon"}
                </h3>

                <p
                  className={`mx-auto mt-3 max-w-md text-sm leading-7 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {isBangla
                    ? "এই ব্লগের বিস্তারিত কনটেন্ট এখনো backend-এ যোগ করা হয়নি।"
                    : "The detailed content for this article has not been added to the backend yet."}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div
              className={`mt-12 border-t pt-8 ${
                isDark ? "border-white/10" : "border-slate-200"
              }`}
            >
              <p
                className={`mb-4 text-xs font-bold uppercase tracking-[0.2em] ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {isBangla ? "ট্যাগসমূহ" : "Tags"}
              </p>

              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      isDark
                        ? "border-white/10 bg-white/[0.03] text-slate-400 hover:border-red-500/30 hover:text-red-400"
                        : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:text-red-500"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className={`relative mt-14 overflow-hidden rounded-[28px] border p-7 sm:p-9 ${
              isDark
                ? "border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                GermanLearn
              </p>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                {isBangla
                  ? "আরও German learning content পড়ুন"
                  : "Continue your German learning journey"}
              </h2>

              <p
                className={`mt-3 max-w-2xl text-sm leading-7 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {isBangla
                  ? "আরও useful German learning resources, Ausbildung guides এবং Germany-related articles দেখুন।"
                  : "Explore more German learning resources, Ausbildung guides, and helpful articles about Germany."}
              </p>

              <Link
                href="/blogs"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-0.5 hover:shadow-red-500/30"
              >
                {isBangla ? "আরও ব্লগ দেখুন" : "Explore More Articles"}
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Back */}
          <div className="mt-10 text-center">
            <Link
              href="/blogs"
              className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                isDark
                  ? "text-slate-500 hover:text-white"
                  : "text-slate-400 hover:text-slate-900"
              }`}
            >
              ← {isBangla ? "সব ব্লগে ফিরে যান" : "Back to all blogs"}
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}