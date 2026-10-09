"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

import ChapterModal from "./ChapterModal";

const API_URL = "http://localhost:5000/api";

interface Level {
  id: string;
  name: string;
  order: number;
}

interface Book {
  id: string;
  name: string;
  author?: string | null;
  levelId: string;
  level?: {
    id: string;
    name: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  chapterNo: number;
  sectionNo: number;
  accessType: "FREE" | "PREMIUM";
  bookId: string;
  book?: Book;
}

interface ChapterManagementProps {
  token: string;
  levels: Level[];
  books?: Book[];
  selectedBookId?: string;
  onSelectedBookChange?: (bookId: string) => void;
  onSelectedChapterChange?: (chapterId: string) => void;
  onChaptersChange?: () => void;
}

export default function ChapterManagement({
  token,
  levels,
  books: parentBooks = [],
  selectedBookId: parentSelectedBookId = "",
  onSelectedBookChange,
  onSelectedChapterChange,
  onChaptersChange,
}: ChapterManagementProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [books, setBooks] = useState<Book[]>(parentBooks);
  const [selectedBookId, setSelectedBookId] = useState(
    parentSelectedBookId
  );

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] =
    useState<Chapter | null>(null);

  /* =====================================================
     SYNC PARENT BOOKS
  ===================================================== */

  useEffect(() => {
    setBooks(parentBooks);
  }, [parentBooks]);

  /* =====================================================
     SYNC SELECTED BOOK FROM PARENT
  ===================================================== */

  useEffect(() => {
    setSelectedBookId(parentSelectedBookId);
  }, [parentSelectedBookId]);

  /* =====================================================
     FETCH BOOKS ONLY IF PARENT DOES NOT PROVIDE THEM
  ===================================================== */

  useEffect(() => {
    if (parentBooks.length > 0 || levels.length === 0) {
      return;
    }

    const fetchAllBooks = async () => {
      try {
        setLoadingBooks(true);
        setError("");

        const allBooks: Book[] = [];

        for (const level of levels) {
          const response = await fetch(
            `${API_URL}/learning/books/level/${level.id}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to fetch books"
            );
          }

          if (Array.isArray(data.books)) {
            allBooks.push(...data.books);
          }
        }

        setBooks(allBooks);
      } catch (error) {
        console.error("Fetch books error:", error);

        setBooks([]);

        setError(
          isBangla
            ? "বই লোড করতে সমস্যা হয়েছে।"
            : "Failed to load books."
        );
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchAllBooks();
  }, [levels, parentBooks.length, isBangla]);

  /* =====================================================
     VALIDATE SELECTED BOOK
  ===================================================== */

  useEffect(() => {
    if (books.length === 0) {
      if (selectedBookId !== "") {
        setSelectedBookId("");
      }

      return;
    }

    const selectedExists = books.some(
      (book) => book.id === selectedBookId
    );

    if (!selectedExists && !parentSelectedBookId) {
      const firstBookId = books[0].id;

      setSelectedBookId(firstBookId);

      onSelectedBookChange?.(firstBookId);
    }
  }, [
    books,
    selectedBookId,
    parentSelectedBookId,
    onSelectedBookChange,
  ]);

  /* =====================================================
     FETCH CHAPTERS
  ===================================================== */

  const fetchChapters = async (bookId: string) => {
    if (!bookId) {
      setChapters([]);
      return;
    }

    try {
      setLoadingChapters(true);
      setError("");

      const response = await fetch(
        `${API_URL}/learning/chapters/book/${bookId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch chapters"
        );
      }

      const fetchedChapters: Chapter[] =
        data.chapters || [];

      setChapters(fetchedChapters);

      /*
       * Automatically select first chapter if current
       * selected chapter no longer exists.
       */
      if (fetchedChapters.length > 0) {
        onSelectedChapterChange?.(
          fetchedChapters[0].id
        );
      } else {
        onSelectedChapterChange?.("");
      }
    } catch (error) {
      console.error("Fetch chapters error:", error);

      setChapters([]);
      onSelectedChapterChange?.("");

      setError(
        isBangla
          ? "Chapter লোড করতে সমস্যা হয়েছে।"
          : "Failed to load chapters."
      );
    } finally {
      setLoadingChapters(false);
    }
  };

  useEffect(() => {
    if (!selectedBookId) {
      setChapters([]);
      onSelectedChapterChange?.("");
      return;
    }

    fetchChapters(selectedBookId);
  }, [selectedBookId]);

  /* =====================================================
     SORT CHAPTERS
  ===================================================== */

  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => {
      if (a.chapterNo !== b.chapterNo) {
        return a.chapterNo - b.chapterNo;
      }

      return a.sectionNo - b.sectionNo;
    });
  }, [chapters]);

  /* =====================================================
     CHAPTER NUMBER
  ===================================================== */

  const getChapterNumber = (chapter: Chapter) => {
    if (chapter.sectionNo === 0) {
      return `${chapter.chapterNo}`;
    }

    return `${chapter.chapterNo}.${chapter.sectionNo}`;
  };

  /* =====================================================
     CREATE
  ===================================================== */

  const handleCreate = () => {
    if (!selectedBookId) {
      setError(
        isBangla
          ? "প্রথমে Book Management থেকে একটি Book নির্বাচন করুন।"
          : "Please select a book from Book Management first."
      );

      return;
    }

    setEditingChapter(null);
    setModalOpen(true);
    setError("");
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setModalOpen(true);
    setError("");
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleCloseModal = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setEditingChapter(null);
  };

  /* =====================================================
     CREATE / UPDATE
  ===================================================== */

  const handleSubmit = async (data: {
    title: string;
    chapterNo: number;
    sectionNo: number;
    accessType: "FREE" | "PREMIUM";
    bookId: string;
  }) => {
    try {
      setActionLoading(true);
      setError("");

      const isEditing = Boolean(editingChapter);

      const url = isEditing
        ? `${API_URL}/learning/chapters/${editingChapter?.id}`
        : `${API_URL}/learning/chapters`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Failed to update chapter"
              : "Failed to create chapter")
        );
      }

      setModalOpen(false);
      setEditingChapter(null);

      /*
       * If chapter is created/updated under another book,
       * update selected book in parent.
       */
      if (data.bookId !== selectedBookId) {
        setSelectedBookId(data.bookId);
        onSelectedBookChange?.(data.bookId);

        await fetchChapters(data.bookId);
      } else {
        await fetchChapters(selectedBookId);
      }

      onChaptersChange?.();
    } catch (error) {
      console.error("Chapter submit error:", error);

      setError(
        error instanceof Error
          ? error.message
          : isBangla
          ? "Chapter save করতে সমস্যা হয়েছে।"
          : "Failed to save chapter."
      );

      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (chapter: Chapter) => {
    const confirmed = window.confirm(
      isBangla
        ? `আপনি কি "${getChapterNumber(
            chapter
          )} ${chapter.title}" delete করতে চান?`
        : `Are you sure you want to delete "${getChapterNumber(
            chapter
          )} ${chapter.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/learning/chapters/${chapter.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete chapter"
        );
      }

      await fetchChapters(selectedBookId);

      onChaptersChange?.();
    } catch (error) {
      console.error("Delete chapter error:", error);

      setError(
        error instanceof Error
          ? error.message
          : isBangla
          ? "Chapter delete করতে সমস্যা হয়েছে।"
          : "Failed to delete chapter."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     STATS
  ===================================================== */

  const totalChapters = chapters.length;

  const freeChapters = chapters.filter(
    (chapter) => chapter.accessType === "FREE"
  ).length;

  const premiumChapters = chapters.filter(
    (chapter) => chapter.accessType === "PREMIUM"
  ).length;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <>
      <section
        className={`rounded-3xl border p-5 shadow-xl transition sm:p-6 ${
          isDark
            ? "border-white/10 bg-white/[0.03]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                isDark
                  ? "bg-rose-500/10 text-rose-400"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              📖
            </div>

            <div>
              <h2
                className={`text-xl font-bold sm:text-2xl ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                Chapter Management
              </h2>

              <p
                className={`text-sm ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {isBangla
                  ? "Selected Book-এর Chapter ও Section manage করুন"
                  : "Manage chapters and sections for the selected book"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!selectedBookId || actionLoading}
            className="rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            + {isBangla ? "নতুন Chapter" : "Add Chapter"}
          </button>
        </div>

        {/* SELECTED BOOK INFO */}

        <div
          className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${
            isDark
              ? "border-white/10 bg-black/10"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="text-xl">📚</div>

          <div>
            <p
              className={`text-xs ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "Selected Book"
                : "Selected Book"}
            </p>

            <p
              className={`font-semibold ${
                isDark
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              {books.find(
                (book) => book.id === selectedBookId
              )?.name || "No book selected"}
            </p>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div
            className={`rounded-2xl border p-4 ${
              isDark
                ? "border-white/10 bg-white/[0.02]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <p className="text-xs text-slate-500">
              Total Chapters
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                isDark
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              {totalChapters}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              isDark
                ? "border-emerald-500/10 bg-emerald-500/[0.03]"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p className="text-xs text-emerald-500">
              Free
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-500">
              {freeChapters}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              isDark
                ? "border-amber-500/10 bg-amber-500/[0.03]"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <p className="text-xs text-amber-500">
              Premium
            </p>

            <p className="mt-1 text-2xl font-bold text-amber-500">
              {premiumChapters}
            </p>
          </div>
        </div>

        {/* NO BOOK */}

        {!selectedBookId ? (
          <div
            className={`rounded-2xl border border-dashed p-10 text-center ${
              isDark
                ? "border-white/10 text-slate-500"
                : "border-slate-300 text-slate-500"
            }`}
          >
            <div className="mb-3 text-4xl">
              📚
            </div>

            <p className="font-medium">
              {isBangla
                ? "Book Management থেকে একটি Book নির্বাচন করুন"
                : "Select a book from Book Management"}
            </p>
          </div>
        ) : loadingChapters ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-rose-500" />
          </div>
        ) : sortedChapters.length === 0 ? (
          <div
            className={`rounded-2xl border border-dashed p-10 text-center ${
              isDark
                ? "border-white/10 text-slate-500"
                : "border-slate-300 text-slate-500"
            }`}
          >
            <div className="mb-3 text-4xl">
              📖
            </div>

            <p
              className={`font-medium ${
                isDark
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              {isBangla
                ? "এই Book-এ এখনো কোনো Chapter নেই"
                : "No chapters found for this book"}
            </p>

            <p className="mt-1 text-sm">
              {isBangla
                ? "উপরের Add Chapter button ব্যবহার করুন।"
                : "Use the Add Chapter button above."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedChapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`rounded-2xl border p-4 transition ${
                  isDark
                    ? "border-white/10 bg-white/[0.02] hover:border-white/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 min-w-12 items-center justify-center rounded-xl px-2 text-sm font-bold ${
                        chapter.accessType === "PREMIUM"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {getChapterNumber(chapter)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-base font-semibold sm:text-lg ${
                            isDark
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          {chapter.title}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            chapter.accessType === "PREMIUM"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {chapter.accessType}
                        </span>
                      </div>

                      <p
                        className={`mt-1 text-xs ${
                          isDark
                            ? "text-slate-500"
                            : "text-slate-500"
                        }`}
                      >
                        Chapter {chapter.chapterNo}
                        {chapter.sectionNo > 0
                          ? ` • Section ${chapter.sectionNo}`
                          : " • Main Chapter"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(chapter)
                      }
                      disabled={actionLoading}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                        isDark
                          ? "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(chapter)
                      }
                      disabled={actionLoading}
                      className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}

      <ChapterModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingChapter={editingChapter}
        books={books}
        defaultBookId={selectedBookId}
        isBangla={isBangla}
        loading={actionLoading}
      />
    </>
  );
}