"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Headphones,
  LoaderCircle,
  LockKeyhole,
  Search,
  Volume2,
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

interface Level {
  id: string;
  name: string;
  order: number;
  _count?: {
    books: number;
  };
}

interface Book {
  id: string;
  name: string;
  author?: string | null;
  levelId: string;
  _count?: {
    chapters: number;
  };
}

interface Chapter {
  id: string;
  title: string;
  chapterNo: number;
  sectionNo: number;
  accessType: "FREE" | "PREMIUM";
  bookId: string;
}

interface Vocabulary {
  id: string;
  germanWord: string;
  englishMeaning: string;
  article?: string | null;
  plural?: string | null;
  audioUrl?: string | null;
  chapterId: string;
}

class LearningApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "LearningApiError";
  }
}

async function getJson<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    throw new LearningApiError(
      result?.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return result as T;
}

function chapterLabel(chapter: Chapter) {
  const number =
    chapter.sectionNo > 0
      ? `${chapter.chapterNo}.${chapter.sectionNo}`
      : `${chapter.chapterNo}`;
  return `Chapter ${number}`;
}

export default function LearningLevelPage() {
  const params = useParams<{ level: string }>();
  const levelSlug = decodeURIComponent(params.level).toLowerCase();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isBangla = language === "bn";

  const [levels, setLevels] = useState<Level[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [search, setSearch] = useState("");
  const [token] = useState(() =>
    typeof window === "undefined" ? "" : localStorage.getItem("token") ?? ""
  );
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingVocabulary, setLoadingVocabulary] = useState(false);
  const [error, setError] = useState("");
  const [vocabularyError, setVocabularyError] = useState("");
  const [showMeaning, setShowMeaning] = useState<Record<string, boolean>>({});
  const vocabularyRequestId = useRef(0);

  const isDark = theme === "dark";
  const surfaceClass = isDark
    ? "border-white/10 bg-white/[0.035]"
    : "border-slate-200 bg-white shadow-sm";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";

  const selectedLevel = levels.find(
    (level) => level.name.toLowerCase() === levelSlug
  );
  const selectedBook = books.find((book) => book.id === selectedBookId);
  const selectedChapter = chapters.find(
    (chapter) => chapter.id === selectedChapterId
  );
  const loginHref = `/login?returnTo=${encodeURIComponent(
    `/learning-levels/${encodeURIComponent(levelSlug)}`
  )}`;

  useEffect(() => {
    let cancelled = false;

    const loadLevels = async () => {
      try {
        setLoadingLevels(true);
        const result = await getJson<{ levels: Level[] }>(
          `${API_URL}/learning/levels`
        );
        if (!Array.isArray(result.levels)) {
          throw new Error("Invalid learning levels response.");
        }
        if (!cancelled) {
          setLevels(
            [...result.levels].sort((a, b) => a.order - b.order)
          );
          setError("");
        }
      } catch (loadError) {
        console.error("Learning levels fetch error:", loadError);
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load learning levels."
          );
        }
      } finally {
        if (!cancelled) setLoadingLevels(false);
      }
    };

    void loadLevels();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedLevel) {
      return;
    }

    let cancelled = false;

    const loadBooks = async () => {
      try {
        setLoadingBooks(true);
        setError("");
        const result = await getJson<{ books: Book[] }>(
          `${API_URL}/learning/books/level/${selectedLevel.id}`
        );
        if (!Array.isArray(result.books)) {
          throw new Error("Invalid books response.");
        }
        if (!cancelled) {
          setBooks(result.books);
          setSelectedBookId((currentId) =>
            result.books.some((book) => book.id === currentId)
              ? currentId
              : result.books[0]?.id ?? ""
          );
        }
      } catch (loadError) {
        console.error("Learning books fetch error:", loadError);
        if (!cancelled) {
          setBooks([]);
          setSelectedBookId("");
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load books."
          );
        }
      } finally {
        if (!cancelled) setLoadingBooks(false);
      }
    };

    void loadBooks();
    return () => {
      cancelled = true;
    };
  }, [selectedLevel]);

  useEffect(() => {
    if (!selectedBookId) {
      return;
    }

    let cancelled = false;

    const loadChapters = async () => {
      try {
        setLoadingChapters(true);
        setError("");
        const result = await getJson<{ chapters: Chapter[] }>(
          `${API_URL}/learning/chapters/book/${selectedBookId}`
        );
        if (!Array.isArray(result.chapters)) {
          throw new Error("Invalid chapters response.");
        }

        const sortedChapters = [...result.chapters].sort(
          (a, b) =>
            a.chapterNo - b.chapterNo || a.sectionNo - b.sectionNo
        );
        if (!cancelled) {
          setChapters(sortedChapters);
          setSelectedChapterId((currentId) =>
            sortedChapters.some((chapter) => chapter.id === currentId)
              ? currentId
              : sortedChapters[0]?.id ?? ""
          );
        }
      } catch (loadError) {
        console.error("Learning chapters fetch error:", loadError);
        if (!cancelled) {
          setChapters([]);
          setSelectedChapterId("");
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load chapters."
          );
        }
      } finally {
        if (!cancelled) setLoadingChapters(false);
      }
    };

    void loadChapters();
    return () => {
      cancelled = true;
    };
  }, [selectedBookId]);

  const fetchVocabulary = useCallback(async () => {
    const requestId = ++vocabularyRequestId.current;

    if (!selectedChapterId) {
      setVocabulary([]);
      setVocabularyError("");
      setLoadingVocabulary(false);
      return;
    }

    if (!token) {
      setVocabulary([]);
      setVocabularyError("AUTH_REQUIRED");
      setLoadingVocabulary(false);
      return;
    }

    try {
      setLoadingVocabulary(true);
      setVocabularyError("");
      const result = await getJson<{ vocabularies: Vocabulary[] }>(
        `${API_URL}/learning/vocabulary/chapter/${selectedChapterId}`,
        token
      );
      if (!Array.isArray(result.vocabularies)) {
        throw new Error("Invalid vocabulary response.");
      }
      if (requestId !== vocabularyRequestId.current) return;
      setVocabulary(result.vocabularies);
    } catch (loadError) {
      console.error("Learning vocabulary fetch error:", loadError);
      if (requestId !== vocabularyRequestId.current) return;
      setVocabulary([]);
      if (
        loadError instanceof LearningApiError &&
        loadError.status === 401
      ) {
        setVocabularyError("AUTH_REQUIRED");
      } else if (
        loadError instanceof LearningApiError &&
        loadError.status === 403
      ) {
        setVocabularyError("ACCESS_DENIED");
      } else {
        setVocabularyError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load vocabulary."
        );
      }
    } finally {
      if (requestId === vocabularyRequestId.current) {
        setLoadingVocabulary(false);
      }
    }
  }, [selectedChapterId, token]);

  useEffect(() => {
    void Promise.resolve().then(fetchVocabulary);
  }, [fetchVocabulary]);

  const filteredVocabulary = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return vocabulary;

    return vocabulary.filter((item) =>
      [
        item.germanWord,
        item.englishMeaning,
        item.article ?? "",
        item.plural ?? "",
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search, vocabulary]);

  const chapterIndex = chapters.findIndex(
    (chapter) => chapter.id === selectedChapterId
  );
  const previousChapter =
    chapterIndex > 0 ? chapters[chapterIndex - 1] : undefined;
  const nextChapter =
    chapterIndex >= 0 ? chapters[chapterIndex + 1] : undefined;

  if (loadingLevels) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center gap-3 text-slate-400">
        <LoaderCircle className="animate-spin text-amber-300" />
        {isBangla ? "শেখার কনটেন্ট লোড হচ্ছে..." : "Loading learning content..."}
      </main>
    );
  }

  if (error && levels.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">
          <h1 className="text-2xl font-bold">
            {isBangla ? "কনটেন্ট লোড করা যায়নি" : "Could not load learning content"}
          </h1>
          <p className="mt-3 text-sm text-red-300">{error}</p>
          <Link href="/" className="mt-6 inline-flex text-amber-300 hover:text-amber-200">
            {isBangla ? "হোমে ফিরুন" : "Back home"}
          </Link>
        </div>
      </main>
    );
  }

  if (!selectedLevel) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className={`rounded-3xl border p-8 ${surfaceClass}`}>
          <h1 className="text-3xl font-bold">
            {isBangla ? "এই লেভেলটি পাওয়া যায়নি" : "Level not found"}
          </h1>
          <p className={`mt-3 ${mutedTextClass}`}>
            {isBangla
              ? "অন্য একটি লেভেল নির্বাচন করুন।"
              : "Choose another level to continue learning."}
          </p>
          <Link
            href="/learning-levels"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-5 py-3 font-semibold text-white"
          >
            <ArrowLeft size={17} />
            {isBangla ? "সব লেভেল দেখুন" : "Browse all levels"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen pb-20 ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/#learning-levels"
          className={`inline-flex items-center gap-2 text-sm transition hover:text-amber-300 ${mutedTextClass}`}
        >
          <ArrowLeft size={16} />
          {isBangla ? "সব লেভেল" : "All learning levels"}
        </Link>

        <header className="mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-red-500/[0.12] via-white/[0.035] to-amber-400/[0.08] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-9">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                {isBangla ? "জার্মান শেখার পথ" : "German learning path"}
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-red-300 via-orange-200 to-amber-200 bg-clip-text text-transparent">
                  {selectedLevel.name}
                </span>{" "}
                {isBangla ? "শিখুন ধাপে ধাপে" : "Learn step by step"}
              </h1>
              <p className={`mt-3 max-w-2xl text-sm leading-7 sm:text-base ${mutedTextClass}`}>
                {isBangla
                  ? "বই বেছে নিন, অধ্যায় খুলুন এবং শব্দগুলো অর্থ ও উচ্চারণসহ অনুশীলন করুন।"
                  : "Choose a book, open a chapter, and study each word with its meaning and pronunciation."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300">
                <BookOpen size={16} className="text-amber-200" />
                {books.length} {isBangla ? "বই" : "books"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-300" />
                {chapters.length} {isBangla ? "অধ্যায়" : "chapters"}
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`rounded-3xl border p-5 lg:sticky lg:top-24 ${surfaceClass}`}>
            <label className="block">
              <span className={`mb-2 block text-xs font-bold uppercase tracking-[0.16em] ${mutedTextClass}`}>
                {isBangla ? "বই নির্বাচন" : "Choose a book"}
              </span>
              <span className="relative block">
                <select
                  value={selectedBookId}
                  onChange={(event) => {
                    setSelectedBookId(event.target.value);
                    setSelectedChapterId("");
                    setVocabulary([]);
                  }}
                  disabled={loadingBooks || books.length === 0}
                  className={`w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm outline-none transition ${
                    isDark
                      ? "border-white/10 bg-[#111827] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  {books.length === 0 && (
                    <option value="">
                      {loadingBooks
                        ? isBangla
                          ? "বই লোড হচ্ছে..."
                          : "Loading books..."
                        : isBangla
                          ? "কোনো বই নেই"
                          : "No books available"}
                    </option>
                  )}
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.name}
                    </option>
                  ))}
                </select>
                {loadingBooks ? (
                  <LoaderCircle
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-amber-300"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${mutedTextClass}`}
                  />
                )}
              </span>
            </label>

            <div className="mb-3 mt-7 flex items-center justify-between">
              <h2 className="text-sm font-bold">
                {isBangla ? "অধ্যায়সমূহ" : "Chapters"}
              </h2>
              <span className={`text-xs ${mutedTextClass}`}>
                {chapters.length}
              </span>
            </div>

            {loadingChapters ? (
              <div className={`flex items-center gap-2 py-5 text-sm ${mutedTextClass}`}>
                <LoaderCircle size={16} className="animate-spin" />
                {isBangla ? "অধ্যায় লোড হচ্ছে..." : "Loading chapters..."}
              </div>
            ) : chapters.length === 0 ? (
              <p className={`rounded-xl border border-dashed border-white/10 px-4 py-5 text-sm leading-6 ${mutedTextClass}`}>
                {books.length === 0
                  ? isBangla
                    ? "এই লেভেলে এখনো বই যোগ করা হয়নি।"
                    : "No books have been added to this level yet."
                  : isBangla
                    ? "এই বইয়ে এখনো অধ্যায় যোগ করা হয়নি।"
                    : "No chapters have been added to this book yet."}
              </p>
            ) : (
              <nav className="space-y-2" aria-label="Chapters">
                {chapters.map((chapter) => {
                  const active = chapter.id === selectedChapterId;
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => {
                        setSelectedChapterId(chapter.id);
                        setVocabulary([]);
                        setSearch("");
                      }}
                      className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-amber-300/25 bg-gradient-to-r from-red-400/10 to-amber-300/10 text-white"
                          : isDark
                            ? "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.035] hover:text-white"
                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-xs text-amber-200">
                          {chapter.chapterNo}
                          {chapter.sectionNo > 0 && `.${chapter.sectionNo}`}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {chapter.title}
                        </span>
                        {chapter.accessType === "PREMIUM" && (
                          <LockKeyhole
                            size={14}
                            className="shrink-0 text-amber-300"
                            aria-label="Premium chapter"
                          />
                        )}
                      </span>
                      <span className={`ml-9 mt-1 block text-[11px] ${mutedTextClass}`}>
                        {chapter.accessType === "PREMIUM"
                          ? isBangla
                            ? "প্রিমিয়াম অধ্যায়"
                            : "Premium chapter"
                          : isBangla
                            ? "ফ্রি অধ্যায়"
                            : "Free chapter"}
                      </span>
                    </button>
                  );
                })}
              </nav>
            )}
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.17em] text-amber-300`}>
                  {selectedBook?.name ?? (isBangla ? "বই নির্বাচন করুন" : "Select a book")}
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  {selectedChapter
                    ? `${chapterLabel(selectedChapter)} · ${selectedChapter.title}`
                    : isBangla
                      ? "আপনার পাঠ নির্বাচন করুন"
                      : "Choose a lesson"}
                </h2>
                {selectedBook?.author && (
                  <p className={`mt-1 text-sm ${mutedTextClass}`}>
                    {isBangla ? "লেখক" : "By"} {selectedBook.author}
                  </p>
                )}
              </div>

              {selectedChapter && (
                <label className="relative block sm:w-64">
                  <Search
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextClass}`}
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none ${
                      isDark
                        ? "border-white/10 bg-white/[0.035] text-white placeholder:text-slate-500"
                        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                    }`}
                    placeholder={isBangla ? "শব্দ খুঁজুন..." : "Search vocabulary..."}
                  />
                </label>
              )}
            </div>

            {!selectedChapter && !loadingChapters ? (
              <div className={`rounded-3xl border p-9 text-center ${surfaceClass}`}>
                <BookOpen className="mx-auto text-amber-300" size={30} />
                <h3 className="mt-4 text-lg font-bold">
                  {isBangla ? "শুরু করার জন্য একটি অধ্যায় বেছে নিন" : "Choose a chapter to start"}
                </h3>
                <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedTextClass}`}>
                  {isBangla
                    ? "প্রতিটি অধ্যায়ের শব্দ, অর্থ, article, plural এবং উচ্চারণ এখানে পড়তে পারবেন।"
                    : "Study each chapter’s words, meanings, articles, plurals, and audio pronunciation here."}
                </p>
              </div>
            ) : loadingVocabulary ? (
              <div className={`flex min-h-64 items-center justify-center gap-3 rounded-3xl border ${surfaceClass} ${mutedTextClass}`}>
                <LoaderCircle className="animate-spin text-amber-300" />
                {isBangla ? "শব্দভাণ্ডার লোড হচ্ছে..." : "Loading vocabulary..."}
              </div>
            ) : vocabularyError === "AUTH_REQUIRED" ? (
              <div className={`rounded-3xl border p-8 sm:p-10 ${surfaceClass}`}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
                  <LockKeyhole size={24} />
                </div>
                <h3 className="mt-5 text-center text-xl font-bold">
                  {isBangla ? "শব্দভাণ্ডার পড়তে লগইন করুন" : "Sign in to study vocabulary"}
                </h3>
                <p className={`mx-auto mt-2 max-w-lg text-center text-sm leading-6 ${mutedTextClass}`}>
                  {isBangla
                    ? "এই অধ্যায়ের শব্দ ও উচ্চারণ দেখতে আপনার অ্যাকাউন্টে লগইন করুন।"
                    : "Sign in to your account to access this chapter’s vocabulary and audio."}
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    href={loginHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/15 transition hover:-translate-y-0.5"
                  >
                    {isBangla ? "লগইন করুন" : "Sign in"}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : vocabularyError === "ACCESS_DENIED" ? (
              <div role="alert" className={`rounded-3xl border p-8 text-center ${surfaceClass}`}>
                <LockKeyhole className="mx-auto text-amber-300" size={26} />
                <h3 className="mt-4 font-bold">
                  {isBangla
                    ? "এই শব্দভাণ্ডার দেখার অনুমতি নেই"
                    : "You do not have access to this vocabulary"}
                </h3>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  {isBangla
                    ? "আপনার অ্যাকাউন্টে এই কনটেন্ট দেখার অনুমতি নেই।"
                    : "Your account is not permitted to view this content."}
                </p>
              </div>
            ) : vocabularyError ? (
              <div role="alert" className="rounded-3xl border border-red-400/20 bg-red-400/5 p-7 text-center">
                <p className="text-sm text-red-300">{vocabularyError}</p>
                <button
                  type="button"
                  onClick={() => void fetchVocabulary()}
                  className="mt-4 rounded-xl border border-red-400/20 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-400/10"
                >
                  {isBangla ? "আবার চেষ্টা করুন" : "Try again"}
                </button>
              </div>
            ) : vocabulary.length === 0 ? (
              <div className={`rounded-3xl border p-8 text-center ${surfaceClass}`}>
                <Headphones className="mx-auto text-amber-300" size={28} />
                <h3 className="mt-4 font-bold">
                  {isBangla ? "এই অধ্যায়ে এখনো শব্দ যোগ করা হয়নি" : "No vocabulary in this chapter yet"}
                </h3>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  {isBangla ? "নতুন শব্দ যোগ হলে এখানে দেখা যাবে।" : "New words will appear here when they are added."}
                </p>
              </div>
            ) : filteredVocabulary.length === 0 ? (
              <div className={`rounded-3xl border p-8 text-center ${surfaceClass}`}>
                <Search className="mx-auto text-amber-300" size={24} />
                <p className={`mt-3 text-sm ${mutedTextClass}`}>
                  {isBangla ? "এই অনুসন্ধানে কোনো শব্দ মেলেনি।" : "No words match your search."}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className={`text-sm ${mutedTextClass}`}>
                    {isBangla ? "মোট শব্দ" : "Vocabulary"}
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-amber-200">
                    {filteredVocabulary.length} / {vocabulary.length}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredVocabulary.map((item, index) => {
                    const meaningVisible = Boolean(showMeaning[item.id]);
                    return (
                      <article
                        key={item.id}
                        className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/25 ${
                          isDark
                            ? "border-white/10 bg-white/[0.035] hover:bg-white/[0.055]"
                            : "border-slate-200 bg-white shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${mutedTextClass}`}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {item.audioUrl && (
                            <audio
                              controls
                              preload="none"
                              className="h-9 w-32"
                              aria-label={`Pronunciation of ${item.germanWord}`}
                            >
                              <source src={item.audioUrl} />
                            </audio>
                          )}
                          {!item.audioUrl && (
                            <Volume2
                              size={16}
                              className="text-slate-600"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="mt-4 flex items-baseline gap-2">
                          {item.article && (
                            <span className="rounded-md bg-red-400/10 px-2 py-1 text-xs font-bold text-red-300">
                              {item.article}
                            </span>
                          )}
                          <h3 className="text-xl font-bold tracking-tight">
                            {item.germanWord}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setShowMeaning((current) => ({
                              ...current,
                              [item.id]: !current[item.id],
                            }))
                          }
                          className={`mt-3 text-left text-sm transition ${
                            meaningVisible
                              ? isDark
                                ? "text-slate-300"
                                : "text-slate-700"
                              : "text-amber-300 hover:text-amber-200"
                          }`}
                          aria-expanded={meaningVisible}
                        >
                          {meaningVisible
                            ? item.englishMeaning
                            : isBangla
                              ? "অর্থ দেখতে চাপ দিন"
                              : "Tap to reveal meaning"}
                        </button>

                        {item.plural && (
                          <p className={`mt-3 border-t border-white/[0.08] pt-3 text-xs ${mutedTextClass}`}>
                            {isBangla ? "বহুবচন" : "Plural"}:{" "}
                            <span className="font-semibold">{item.plural}</span>
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className={`mt-8 flex flex-col justify-between gap-3 border-t pt-5 sm:flex-row sm:items-center ${
                  isDark ? "border-white/10" : "border-slate-200"
                }`}>
                  <button
                    type="button"
                    disabled={!previousChapter}
                    onClick={() => previousChapter && setSelectedChapterId(previousChapter.id)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      isDark
                        ? "border-white/10 text-slate-300 hover:bg-white/5"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ArrowLeft size={16} />
                    {isBangla ? "আগের অধ্যায়" : "Previous chapter"}
                  </button>
                  <p className={`text-center text-xs ${mutedTextClass}`}>
                    {chapterIndex + 1} / {chapters.length}
                  </p>
                  <button
                    type="button"
                    disabled={!nextChapter}
                    onClick={() => nextChapter && setSelectedChapterId(nextChapter.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isBangla ? "পরের অধ্যায়" : "Next chapter"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        <div className={`mt-10 flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center ${surfaceClass}`}>
          <div>
            <p className="font-semibold">
              {isBangla ? "আরেকটি লেভেল দেখতে চান?" : "Ready for another level?"}
            </p>
            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              {isBangla ? "সব available learning level ঘুরে দেখুন।" : "Explore all available learning levels."}
            </p>
          </div>
          <Link
            href="/learning-levels"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-white/[0.04]"
          >
            {isBangla ? "সব লেভেল" : "All levels"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
