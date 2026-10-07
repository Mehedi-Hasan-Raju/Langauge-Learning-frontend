"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

import BookModal from "./BookModal";

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
  level?: {
    id: string;
    name: string;
  };
  _count?: {
    chapters: number;
  };
}

interface BookManagementProps {
  token: string;
  levels: Level[];
  selectedLevelId?: string;
  onBooksChange?: () => void;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    author?: string;
    levelId: string;
  }) => Promise<void>;
  editingBook: Book | null;
  levels: Level[];
  defaultLevelId: string;
  isBangla: boolean;
  loading: boolean;
}

const TypedBookModal =
  BookModal as unknown as React.ComponentType<BookModalProps>;

export default function BookManagement({
  token,
  levels,
  selectedLevelId = "",
  onBooksChange,
}: BookManagementProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedLevel, setSelectedLevel] =
    useState(selectedLevelId);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] =
    useState<Book | null>(null);

  /*
   * Keep selected level synchronized with parent.
   */
  useEffect(() => {
    setSelectedLevel(selectedLevelId);
  }, [selectedLevelId]);

  /*
   * Fetch books whenever selected level changes.
   */
  useEffect(() => {
    if (!selectedLevel) {
      setBooks([]);
      return;
    }

    fetchBooks(selectedLevel);
  }, [selectedLevel]);

  const fetchBooks = async (levelId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/learning/books/level/${levelId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch books"
        );
      }

      setBooks(data.books || []);
    } catch (error) {
      console.error("Fetch books error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to fetch books"
      );

      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const totalChapters = useMemo(() => {
    return books.reduce(
      (total, book) =>
        total + (book._count?.chapters ?? 0),
      0
    );
  }, [books]);

  const selectedLevelObject = useMemo(() => {
    return levels.find(
      (level) => level.id === selectedLevel
    );
  }, [levels, selectedLevel]);

  const openCreateModal = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setEditingBook(null);
  };

  const handleLevelChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLevel(e.target.value);
  };

  const handleSubmit = async (data: {
    name: string;
    author?: string;
    levelId: string;
  }) => {
    try {
      setActionLoading(true);

      const url = editingBook
        ? `${API_URL}/learning/books/${editingBook.id}`
        : `${API_URL}/learning/books`;

      const method = editingBook ? "PATCH" : "POST";

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
            `Failed to ${
              editingBook ? "update" : "create"
            } book`
        );
      }

      setModalOpen(false);
      setEditingBook(null);

      /*
       * If edited book moved to another level,
       * refresh current level only.
       */
      await fetchBooks(selectedLevel);

      onBooksChange?.();
    } catch (error) {
      console.error("Book save error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (book: Book) => {
    const confirmed = window.confirm(
      isBangla
        ? `"${book.name}" Book delete করতে চান?`
        : `Are you sure you want to delete "${book.name}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_URL}/learning/books/${book.id}`,
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
          result.message || "Failed to delete book"
        );
      }

      await fetchBooks(selectedLevel);

      onBooksChange?.();
    } catch (error) {
      console.error("Delete book error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete book"
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
                ? "Book Management"
                : "Book Management"}
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "প্রতিটি Level-এর learning books manage করুন"
                : "Manage learning books for each level"}
            </p>
          </div>

          <button
            onClick={openCreateModal}
            disabled={levels.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/10 transition hover:scale-[1.02] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-lg">+</span>

            {isBangla
              ? "Add Book"
              : "Add Book"}
          </button>
        </div>

        {/* Level Filter */}
        <div
          className={`rounded-2xl border p-5 ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label
                className={`mb-2 block text-sm font-medium ${
                  isDark
                    ? "text-slate-300"
                    : "text-slate-700"
                }`}
              >
                {isBangla
                  ? "Select Level"
                  : "Select Level"}
              </label>

              <select
                value={selectedLevel}
                onChange={handleLevelChange}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  isDark
                    ? "border-white/10 bg-[#111827] text-white focus:border-rose-500/50"
                    : "border-slate-200 bg-white text-slate-900 focus:border-rose-400"
                }`}
              >
                <option value="">
                  {isBangla
                    ? "Level select করুন"
                    : "Select a level"}
                </option>

                {levels.map((level) => (
                  <option
                    key={level.id}
                    value={level.id}
                  >
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedLevelObject && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  isDark
                    ? "bg-white/5 text-slate-300"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                <span className="font-semibold">
                  {selectedLevelObject.name}
                </span>
                <span className="mx-2 opacity-40">
                  •
                </span>
                {books.length}{" "}
                {isBangla ? "Books" : "Books"}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                ? "Selected Level-এর Books"
                : "Books in Selected Level"}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {books.length}
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
                ? "মোট Chapters"
                : "Total Chapters"}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalChapters}
            </p>
          </div>
        </div>

        {/* Table */}
        <div
          className={`overflow-hidden rounded-2xl border ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
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
                    {isBangla ? "Book" : "Book"}
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla ? "Author" : "Author"}
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla ? "Level" : "Level"}
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "Chapters"
                      : "Chapters"}
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
                {!selectedLevel ? (
                  <tr>
                    <td
                      colSpan={6}
                      className={`px-6 py-12 text-center text-sm ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {isBangla
                        ? "প্রথমে একটি Level select করুন"
                        : "Please select a level first"}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className={`px-6 py-12 text-center text-sm ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {isBangla
                        ? "Loading..."
                        : "Loading..."}
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                            ? "এই Level-এ কোনো Book নেই"
                            : "No books found for this level"}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          {isBangla
                            ? "Add Book button ব্যবহার করে নতুন Book তৈরি করুন"
                            : "Use the Add Book button to create one"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  books.map((book, index) => (
                    <tr
                      key={book.id}
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
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                              isDark
                                ? "bg-gradient-to-br from-rose-500/20 to-amber-500/20"
                                : "bg-rose-50"
                            }`}
                          >
                            📖
                          </div>

                          <div>
                            <p className="font-semibold">
                              {book.name}
                            </p>

                            <p
                              className={`mt-0.5 text-xs ${
                                isDark
                                  ? "text-slate-500"
                                  : "text-slate-400"
                              }`}
                            >
                              {book.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm ${
                            book.author
                              ? ""
                              : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          {book.author ||
                            (isBangla
                              ? "Not specified"
                              : "Not specified")}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                            isDark
                              ? "bg-white/5 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {book.level?.name ||
                            selectedLevelObject?.name ||
                            "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">
                          {book._count?.chapters ?? 0}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditModal(book)
                            }
                            disabled={actionLoading}
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
                              handleDelete(book)
                            }
                            disabled={actionLoading}
                            className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                          >
                            {isBangla
                              ? "Delete"
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <TypedBookModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingBook={editingBook}
        levels={levels}
        defaultLevelId={selectedLevel}
        isBangla={isBangla}
        loading={actionLoading}
      />
    </>
  );
}