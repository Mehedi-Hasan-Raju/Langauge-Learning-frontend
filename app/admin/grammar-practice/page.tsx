"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import GrammarManagement from "../../../components/admin/learning/GrammarManagement";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

interface Level {
  id: string;
  name: string;
}

interface Book {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  title: string;
  chapterNo: number;
  sectionNo: number;
}

interface ApiResponse<T> {
  message?: string;
  [key: string]: T | string | undefined;
}

async function fetchList<T>(
  endpoint: string,
  key: string,
  fallbackMessage: string
): Promise<T[]> {
  const response = await fetch(`${API_URL}${endpoint}`);
  const result = (await response.json()) as ApiResponse<unknown>;

  if (!response.ok) {
    throw new Error(
      typeof result.message === "string" ? result.message : fallbackMessage
    );
  }

  const items = result[key];
  if (!Array.isArray(items)) {
    throw new Error(fallbackMessage);
  }

  return items as T[];
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function GrammarPracticePage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [token, setToken] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Read the browser token after hydration to keep server and client markup aligned.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(localStorage.getItem("token") ?? "");
  }, []);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const loadLevels = async () => {
      try {
        setLoading(true);
        setError("");
        const fetchedLevels = await fetchList<Level>(
          "/learning/levels",
          "levels",
          isBangla ? "Level লোড করা যায়নি।" : "Failed to load levels."
        );

        if (!cancelled) {
          setLevels(fetchedLevels);
          setSelectedLevelId((currentId) =>
            fetchedLevels.some((level) => level.id === currentId)
              ? currentId
              : fetchedLevels[0]?.id ?? ""
          );
        }
      } catch (loadError) {
        console.error("Grammar practice levels fetch error:", loadError);
        if (!cancelled) {
          setLevels([]);
          setSelectedLevelId("");
          setBooks([]);
          setSelectedBookId("");
          setChapters([]);
          setSelectedChapterId("");
          setError(
            getErrorMessage(
              loadError,
              isBangla ? "Level লোড করা যায়নি।" : "Failed to load levels."
            )
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadLevels();
    return () => {
      cancelled = true;
    };
  }, [token, isBangla]);

  useEffect(() => {
    if (!selectedLevelId || !token) return;

    let cancelled = false;
    const loadBooks = async () => {
      try {
        setLoadingBooks(true);
        setError("");
        const fetchedBooks = await fetchList<Book>(
          `/learning/books/level/${encodeURIComponent(selectedLevelId)}`,
          "books",
          isBangla ? "Book লোড করা যায়নি।" : "Failed to load books."
        );

        if (!cancelled) {
          setBooks(fetchedBooks);
          setSelectedBookId(fetchedBooks[0]?.id ?? "");
        }
      } catch (loadError) {
        console.error("Grammar practice books fetch error:", loadError);
        if (!cancelled) {
          setBooks([]);
          setSelectedBookId("");
          setError(
            getErrorMessage(
              loadError,
              isBangla ? "Book লোড করা যায়নি।" : "Failed to load books."
            )
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
  }, [selectedLevelId, token, isBangla]);

  useEffect(() => {
    if (!selectedBookId || !token) return;

    let cancelled = false;
    const loadChapters = async () => {
      try {
        setLoadingChapters(true);
        setError("");
        const fetchedChapters = await fetchList<Chapter>(
          `/learning/chapters/book/${encodeURIComponent(selectedBookId)}`,
          "chapters",
          isBangla ? "Chapter লোড করা যায়নি।" : "Failed to load chapters."
        );

        if (!cancelled) {
          const sortedChapters = fetchedChapters
            .filter((chapter) => chapter.sectionNo > 0)
            .sort(
              (first, second) =>
                first.chapterNo - second.chapterNo ||
                first.sectionNo - second.sectionNo
            );
          setChapters(sortedChapters);
          setSelectedChapterId(sortedChapters[0]?.id ?? "");
        }
      } catch (loadError) {
        console.error("Grammar practice chapters fetch error:", loadError);
        if (!cancelled) {
          setChapters([]);
          setError(
            getErrorMessage(
              loadError,
              isBangla
                ? "Chapter লোড করা যায়নি।"
                : "Failed to load chapters."
            )
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
  }, [selectedBookId, token, isBangla]);

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none ${
    isDark
      ? "border-white/10 bg-[#0B0F19] text-white"
      : "border-slate-200 bg-white text-slate-900"
  }`;

  const handleLevelChange = (levelId: string) => {
    setSelectedLevelId(levelId);
    setSelectedBookId("");
    setSelectedChapterId("");
    setBooks([]);
    setChapters([]);
    setError("");
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterId("");
    setChapters([]);
    setError("");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="lg:pl-[270px]">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {isBangla ? "Grammar Practice Management" : "Grammar Practice"}
            </h1>
            <p
              className={`mt-2 text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {isBangla
                ? "Practice subchapter নির্বাচন করুন। তার parent chapter-এর Grammar topic বেছে নিয়ে learner-দের জন্য question ও সঠিক উত্তর যোগ করুন।"
                : "Choose a practice subchapter, then select a Grammar topic from its parent chapter to add questions and correct answers for learners."}
            </p>
          </div>

          {!token ? (
            <div
              role="alert"
              className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-500"
            >
              {isBangla
                ? "এই পেজ ব্যবহার করতে admin হিসেবে login করুন।"
                : "Please log in as an admin to use grammar practice management."}
            </div>
          ) : loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-violet-500" />
            </div>
          ) : (
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              <section
                className={`grid gap-4 rounded-2xl border p-5 sm:grid-cols-3 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <label className="block text-sm font-medium">
                  {isBangla ? "Level" : "Level"}
                  <select
                    value={selectedLevelId}
                    onChange={(event) => handleLevelChange(event.target.value)}
                    className={`${inputClass} mt-2`}
                  >
                    <option value="">
                      {isBangla ? "Level নির্বাচন করুন" : "Select a level"}
                    </option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium">
                  {isBangla ? "Book" : "Book"}
                  <select
                    value={selectedBookId}
                    onChange={(event) => handleBookChange(event.target.value)}
                    disabled={!selectedLevelId || loadingBooks}
                    className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">
                      {loadingBooks
                        ? isBangla
                          ? "Book লোড হচ্ছে..."
                          : "Loading books..."
                        : isBangla
                          ? "Book নির্বাচন করুন"
                          : "Select a book"}
                    </option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium">
                  {isBangla ? "Chapter" : "Chapter"}
                  <select
                    value={selectedChapterId}
                    onChange={(event) =>
                      setSelectedChapterId(event.target.value)
                    }
                    disabled={!selectedBookId || loadingChapters}
                    className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">
                      {loadingChapters
                        ? isBangla
                          ? "Chapter লোড হচ্ছে..."
                          : "Loading chapters..."
                        : isBangla
                          ? "Chapter নির্বাচন করুন"
                          : "Select a chapter"}
                    </option>
                    {chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.sectionNo === 0
                          ? chapter.chapterNo
                          : `${chapter.chapterNo}.${chapter.sectionNo}`}{" "}
                        — {chapter.title}
                      </option>
                    ))}
                  </select>
                </label>
              </section>

              {!levels.length && !error && (
                <p
                  className={`mt-5 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {isBangla
                    ? "প্রথমে Learning Management-এ level, book এবং chapter তৈরি করুন।"
                    : "Create a level, book, and chapter in Learning Management first."}
                </p>
              )}

              {selectedBookId && !loadingChapters && chapters.length === 0 && (
                <p
                  className={`mt-5 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {isBangla
                    ? "এই Book-এ practice subchapter নেই। Learning Management-এ 1.1-এর মতো section chapter যোগ করুন।"
                    : "This book has no practice subchapters. Add a section chapter such as 1.1 in Learning Management."}
                </p>
              )}

              {selectedChapterId && (
                <GrammarManagement
                  key={selectedChapterId}
                  token={token}
                  selectedChapterId={selectedChapterId}
                  practiceOnly
                  chapterTitle={
                    chapters.find(
                      (chapter) => chapter.id === selectedChapterId
                    )?.title
                  }
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
