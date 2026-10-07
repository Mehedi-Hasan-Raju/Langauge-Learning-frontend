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
  levelId: string;
}

interface Chapter {
  id: string;
  title: string;
  chapterNo: number;
  sectionNo: number;
  accessType: "FREE" | "PREMIUM";
  bookId: string;
}

interface ChapterManagementProps {
  token: string;
  levels: Level[];
  books?: Book[];
  selectedBookId?: string;
  onChaptersChange?: () => void;
}

const formatChapterNumber = (
  chapterNo: number,
  sectionNo: number
) => {
  if (sectionNo === 0) {
    return String(chapterNo);
  }

  return `${chapterNo}.${sectionNo}`;
};

export default function ChapterManagement({
  token,
  levels,
  books: externalBooks = [],
  selectedBookId = "",
  onChaptersChange,
}: ChapterManagementProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [books, setBooks] =
    useState<Book[]>(externalBooks);

  const [selectedBook, setSelectedBook] =
    useState(selectedBookId);

  const [chapters, setChapters] = useState<Chapter[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [booksLoading, setBooksLoading] =
    useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingChapter, setEditingChapter] =
    useState<Chapter | null>(null);

  /*
   * Keep external books synchronized.
   */
  useEffect(() => {
    setBooks(externalBooks);
  }, [externalBooks]);

  /*
   * Keep selected book synchronized.
   */
  useEffect(() => {
    setSelectedBook(selectedBookId);
  }, [selectedBookId]);

  /*
   * If no books were passed from parent,
   * fetch all books from available levels.
   */
  useEffect(() => {
    if (externalBooks.length > 0) {
      return;
    }

    if (levels.length === 0) {
      setBooks([]);
      return;
    }

    fetchAllBooks();
  }, [levels, externalBooks.length]);

  /*
   * Fetch chapters whenever book changes.
   */
  useEffect(() => {
    if (!selectedBook) {
      setChapters([]);
      return;
    }

    fetchChapters(selectedBook);
  }, [selectedBook]);

  const fetchAllBooks = async () => {
    try {
      setBooksLoading(true);

      const allBooks: Book[] = [];

      for (const level of levels) {
        const response = await fetch(
          `${API_URL}/learning/books/level/${level.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Failed to fetch books for ${level.name}`
          );
        }

        allBooks.push(...(data.books || []));
      }

      setBooks(allBooks);
    } catch (error) {
      console.error("Fetch all books error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to fetch books"
      );
    } finally {
      setBooksLoading(false);
    }
  };

  const fetchChapters = async (bookId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/learning/chapters/book/${bookId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch chapters"
        );
      }

      setChapters(data.chapters || []);
    } catch (error) {
      console.error(
        "Fetch chapters error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to fetch chapters"
      );

      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedBookObject = useMemo(() => {
    return books.find(
      (book) => book.id === selectedBook
    );
  }, [books, selectedBook]);

  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => {
      if (a.chapterNo !== b.chapterNo) {
        return a.chapterNo - b.chapterNo;
      }

      return a.sectionNo - b.sectionNo;
    });
  }, [chapters]);

  const freeChapters = useMemo(() => {
    return chapters.filter(
      (chapter) => chapter.accessType === "FREE"
    ).length;
  }, [chapters]);

  const premiumChapters = useMemo(() => {
    return chapters.filter(
      (chapter) =>
        chapter.accessType === "PREMIUM"
    ).length;
  }, [chapters]);

  const openCreateModal = () => {
    setEditingChapter(null);
    setModalOpen(true);
  };

  const openEditModal = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setEditingChapter(null);
  };

  const handleSubmit = async (data: {
    title: string;
    chapterNo: number;
    sectionNo: number;
    accessType: "FREE" | "PREMIUM";
    bookId: string;
  }) => {
    try {
      setActionLoading(true);

      const url = editingChapter
        ? `${API_URL}/learning/chapters/${editingChapter.id}`
        : `${API_URL}/learning/chapters`;

      const method = editingChapter
        ? "PATCH"
        : "POST";

      const body = editingChapter
        ? {
            title: data.title,
            chapterNo: data.chapterNo,
            sectionNo: data.sectionNo,
            accessType: data.accessType,
          }
        : data;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${
              editingChapter
                ? "update"
                : "create"
            } chapter`
        );
      }

      setModalOpen(false);
      setEditingChapter(null);

      /*
       * Refresh the currently selected book.
       */
      const refreshBookId =
        editingChapter?.bookId || data.bookId;

      setSelectedBook(refreshBookId);

      await fetchChapters(refreshBookId);

      onChaptersChange?.();
    } catch (error) {
      console.error(
        "Chapter save error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (
    chapter: Chapter
  ) => {
    const chapterNumber = formatChapterNumber(
      chapter.chapterNo,
      chapter.sectionNo
    );

    const confirmed = window.confirm(
      isBangla
        ? `Chapter ${chapterNumber} delete করতে চান?`
        : `Are you sure you want to delete Chapter ${chapterNumber}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_URL}/learning/chapters/${chapter.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete chapter"
        );
      }

      await fetchChapters(chapter.bookId);

      onChaptersChange?.();
    } catch (error) {
      console.error(
        "Delete chapter error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete chapter"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <section className="mt-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isBangla
                ? "Chapter Management"
                : "Chapter Management"}
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "Chapter এবং chapter parts manage করুন"
                : "Manage chapters and chapter parts"}
            </p>
          </div>

          <button
            onClick={openCreateModal}
            disabled={
              books.length === 0 ||
              booksLoading
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/10 transition hover:scale-[1.02] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-lg">+</span>

            {isBangla
              ? "Add Chapter"
              : "Add Chapter"}
          </button>
        </div>

        {/* Book Filter */}
        <div
          className={`rounded-2xl border p-5 ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <label
            className={`mb-2 block text-sm font-medium ${
              isDark
                ? "text-slate-300"
                : "text-slate-700"
            }`}
          >
            {isBangla
              ? "Select Book"
              : "Select Book"}
          </label>

          <select
            value={selectedBook}
            onChange={(e) =>
              setSelectedBook(e.target.value)
            }
            disabled={booksLoading}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
              isDark
                ? "border-white/10 bg-[#111827] text-white focus:border-rose-500/50"
                : "border-slate-200 bg-white text-slate-900 focus:border-rose-400"
            }`}
          >
            <option value="">
              {booksLoading
                ? "Loading..."
                : isBangla
                ? "Book select করুন"
                : "Select a book"}
            </option>

            {books.map((book) => (
              <option
                key={book.id}
                value={book.id}
              >
                {book.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Book */}
        {selectedBookObject && (
          <div
            className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <div>
              <p
                className={`text-xs ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                {isBangla
                  ? "Selected Book"
                  : "Selected Book"}
              </p>

              <h3 className="mt-1 text-xl font-bold">
                {selectedBookObject.name}
              </h3>
            </div>

            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                isDark
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-50 text-slate-600"
              }`}
            >
              {chapters.length}{" "}
              {isBangla
                ? "Chapters"
                : "Chapters"}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            className={`rounded-2xl border p-5 ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <p
              className={`text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "মোট Chapters"
                : "Total Chapters"}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {chapters.length}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <p
              className={`text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "Free Chapters"
                : "Free Chapters"}
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-500">
              {freeChapters}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <p
              className={`text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "Premium Chapters"
                : "Premium Chapters"}
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-500">
              {premiumChapters}
            </p>
          </div>
        </div>

        {/* Chapter Table */}
        <div
          className={`overflow-hidden rounded-2xl border ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead
                className={
                  isDark
                    ? "border-b border-white/10 bg-white/[0.02]"
                    : "border-b border-slate-200 bg-slate-50"
                }
              >
                <tr>
                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    #
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "Chapter"
                      : "Chapter"}
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "Title"
                      : "Title"}
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "Access"
                      : "Access"}
                  </th>

                  <th
                    className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "Actions"
                      : "Actions"}
                  </th>
                </tr>
              </thead>

              <tbody
                className={
                  isDark
                    ? "divide-y divide-white/5"
                    : "divide-y divide-slate-100"
                }
              >
                {!selectedBook ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={`px-6 py-12 text-center text-sm ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {isBangla
                        ? "প্রথমে একটি Book select করুন"
                        : "Please select a book first"}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={`px-6 py-12 text-center text-sm ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : sortedChapters.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={`px-6 py-12 text-center text-sm ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      <div className="mx-auto max-w-sm">
                        <div className="mb-3 text-3xl">
                          📚
                        </div>

                        <p className="font-medium">
                          {isBangla
                            ? "এই Book-এ কোনো Chapter নেই"
                            : "No chapters found"}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          {isBangla
                            ? "Add Chapter button ব্যবহার করুন"
                            : "Use the Add Chapter button to create one"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedChapters.map(
                    (chapter, index) => {
                      const number =
                        formatChapterNumber(
                          chapter.chapterNo,
                          chapter.sectionNo
                        );

                      const isMainChapter =
                        chapter.sectionNo === 0;

                      return (
                        <tr
                          key={chapter.id}
                          className={`transition ${
                            isDark
                              ? "hover:bg-white/[0.025]"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-4 text-sm">
                            {index + 1}
                          </td>

                          <td className="px-6 py-4">
                            <div
                              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ${
                                isMainChapter
                                  ? isDark
                                    ? "bg-rose-500/10 text-rose-300"
                                    : "bg-rose-50 text-rose-600"
                                  : isDark
                                  ? "bg-white/5 text-slate-300"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {!isMainChapter && (
                                <span className="text-slate-400">
                                  ↳
                                </span>
                              )}

                              <span className="font-bold">
                                {number}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div
                              className={
                                !isMainChapter
                                  ? "pl-3"
                                  : ""
                              }
                            >
                              <p
                                className={`font-medium ${
                                  !isMainChapter
                                    ? isDark
                                      ? "text-slate-300"
                                      : "text-slate-700"
                                    : ""
                                }`}
                              >
                                {chapter.title}
                              </p>

                              {!isMainChapter && (
                                <p
                                  className={`mt-0.5 text-xs ${
                                    isDark
                                      ? "text-slate-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {isBangla
                                    ? "Chapter Part"
                                    : "Chapter Part"}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {chapter.accessType ===
                            "PREMIUM" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500">
                                🔒 Premium
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
                                🔓 Free
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  openEditModal(
                                    chapter
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                                  isDark
                                    ? "bg-white/5 text-slate-300 hover:bg-white/10"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                {isBangla
                                  ? "Edit"
                                  : "Edit"}
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    chapter
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                              >
                                {isBangla
                                  ? "Delete"
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ChapterModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingChapter={editingChapter}
        books={books}
        defaultBookId={selectedBook}
        isBangla={isBangla}
        loading={actionLoading}
      />
    </>
  );
}