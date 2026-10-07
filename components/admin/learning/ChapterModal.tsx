"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

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

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    chapterNo: number;
    sectionNo: number;
    accessType: "FREE" | "PREMIUM";
    bookId: string;
  }) => Promise<void>;
  editingChapter: Chapter | null;
  books: Book[];
  defaultBookId: string;
  isBangla: boolean;
  loading: boolean;
}

export default function ChapterModal({
  isOpen,
  onClose,
  onSubmit,
  editingChapter,
  books,
  defaultBookId,
  isBangla,
  loading,
}: ChapterModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [title, setTitle] = useState("");
  const [chapterNo, setChapterNo] = useState("");
  const [sectionNo, setSectionNo] = useState("0");
  const [accessType, setAccessType] = useState<
    "FREE" | "PREMIUM"
  >("FREE");
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (editingChapter) {
      setTitle(editingChapter.title);
      setChapterNo(String(editingChapter.chapterNo));
      setSectionNo(String(editingChapter.sectionNo));
      setAccessType(editingChapter.accessType);
      setBookId(editingChapter.bookId);
    } else {
      setTitle("");
      setChapterNo("");
      setSectionNo("0");
      setAccessType("FREE");
      setBookId(defaultBookId || books[0]?.id || "");
    }
  }, [
    editingChapter,
    isOpen,
    defaultBookId,
    books,
  ]);

  if (!isOpen) return null;

  const displayNumber =
    chapterNo && sectionNo
      ? Number(sectionNo) === 0
        ? chapterNo
        : `${chapterNo}.${sectionNo}`
      : "—";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedChapterNo = Number(chapterNo);
    const parsedSectionNo = Number(sectionNo);

    if (!title.trim()) {
      alert(
        isBangla
          ? "Chapter title দিন"
          : "Please enter chapter title"
      );
      return;
    }

    if (
      !chapterNo ||
      !Number.isInteger(parsedChapterNo) ||
      parsedChapterNo <= 0
    ) {
      alert(
        isBangla
          ? "Valid chapter number দিন"
          : "Please enter a valid chapter number"
      );
      return;
    }

    if (
      sectionNo === "" ||
      !Number.isInteger(parsedSectionNo) ||
      parsedSectionNo < 0
    ) {
      alert(
        isBangla
          ? "Valid section number দিন"
          : "Please enter a valid section number"
      );
      return;
    }

    if (!bookId) {
      alert(
        isBangla
          ? "একটি Book select করুন"
          : "Please select a book"
      );
      return;
    }

    await onSubmit({
      title: title.trim(),
      chapterNo: parsedChapterNo,
      sectionNo: parsedSectionNo,
      accessType,
      bookId,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
          isDark
            ? "border-white/10 bg-[#111827]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {editingChapter
                ? isBangla
                  ? "Chapter Edit করুন"
                  : "Edit Chapter"
                : isBangla
                ? "নতুন Chapter"
                : "Create Chapter"}
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "Chapter এবং section information manage করুন"
                : "Manage chapter and section information"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
              isDark
                ? "bg-white/5 text-slate-300 hover:bg-white/10"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Book */}
          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              {isBangla ? "Book" : "Book"}
            </label>

            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              disabled={loading || books.length === 0}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                isDark
                  ? "border-white/10 bg-[#111827] text-white focus:border-rose-500/50"
                  : "border-slate-200 bg-white text-slate-900 focus:border-rose-400"
              }`}
            >
              <option value="">
                {isBangla
                  ? "Book select করুন"
                  : "Select a book"}
              </option>

              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter + Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${
                  isDark
                    ? "text-slate-300"
                    : "text-slate-700"
                }`}
              >
                {isBangla
                  ? "Chapter Number"
                  : "Chapter Number"}
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={chapterNo}
                onChange={(e) =>
                  setChapterNo(e.target.value)
                }
                placeholder="1"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  isDark
                    ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-rose-500/50"
                    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-rose-400"
                }`}
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-medium ${
                  isDark
                    ? "text-slate-300"
                    : "text-slate-700"
                }`}
              >
                {isBangla
                  ? "Part / Section"
                  : "Part / Section"}
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={sectionNo}
                onChange={(e) =>
                  setSectionNo(e.target.value)
                }
                placeholder="0"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  isDark
                    ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-rose-500/50"
                    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-rose-400"
                }`}
              />
            </div>
          </div>

          {/* Preview */}
          <div
            className={`rounded-xl border p-4 ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {isBangla
                    ? "Chapter Number Preview"
                    : "Chapter Number Preview"}
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {displayNumber}
                </p>
              </div>

              <div
                className={`text-right text-xs ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                <p>
                  {isBangla
                    ? "0 = Main Chapter"
                    : "0 = Main Chapter"}
                </p>
                <p className="mt-1">
                  {isBangla
                    ? "1, 2, 3 = Parts"
                    : "1, 2, 3 = Parts"}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              {isBangla
                ? "Chapter Title"
                : "Chapter Title"}
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Kennenlernen"
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                isDark
                  ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-rose-500/50"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-rose-400"
              }`}
            />
          </div>

          {/* Access Type */}
          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              {isBangla
                ? "Access Type"
                : "Access Type"}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccessType("FREE")}
                disabled={loading}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  accessType === "FREE"
                    ? isDark
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : isDark
                    ? "border-white/10 bg-white/5 text-slate-400"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                🔓{" "}
                {isBangla ? "Free" : "Free"}
              </button>

              <button
                type="button"
                onClick={() => setAccessType("PREMIUM")}
                disabled={loading}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  accessType === "PREMIUM"
                    ? isDark
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-amber-300 bg-amber-50 text-amber-700"
                    : isDark
                    ? "border-white/10 bg-white/5 text-slate-400"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                🔒{" "}
                {isBangla ? "Premium" : "Premium"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                isDark
                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={loading || books.length === 0}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingChapter
                ? isBangla
                  ? "Update"
                  : "Update"
                : isBangla
                ? "Create"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}