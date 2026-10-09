"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

import VocabularyModal from "./VocabularyModal";

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

interface VocabularyManagementProps {
  token: string;
  levels: Level[];
  books?: Book[];
  selectedBookId?: string;
  selectedChapterId?: string;

  onSelectedBookChange?: (bookId: string) => void;
  onSelectedChapterChange?: (chapterId: string) => void;

  onVocabularyChange?: () => void;
}

export default function VocabularyManagement({
  token,
  levels,
  books = [],
  selectedBookId = "",
  selectedChapterId = "",
  onSelectedBookChange,
  onSelectedChapterChange,
  onVocabularyChange,
}: VocabularyManagementProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [vocabularies, setVocabularies] = useState<
    Vocabulary[]
  >([]);

  const [loadingChapters, setLoadingChapters] =
    useState(false);

  const [loadingVocabulary, setLoadingVocabulary] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingVocabulary, setEditingVocabulary] =
    useState<Vocabulary | null>(null);

  /* =====================================================
     FETCH CHAPTERS FOR SELECTED BOOK
  ===================================================== */

  const fetchChapters = async (bookId: string) => {
    if (!bookId) {
      setChapters([]);
      onSelectedChapterChange?.("");
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
       * IMPORTANT:
       * Don't call parent state setter from inside
       * another setState updater.
       */
      const selectedExists = fetchedChapters.some(
        (chapter) => chapter.id === selectedChapterId
      );

      if (!selectedExists) {
        const firstChapterId =
          fetchedChapters[0]?.id || "";

        onSelectedChapterChange?.(firstChapterId);
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
    fetchChapters(selectedBookId);
  }, [selectedBookId]);

  /* =====================================================
     FETCH VOCABULARY
  ===================================================== */

  const fetchVocabulary = async (
    chapterId: string
  ) => {
    if (!chapterId) {
      setVocabularies([]);
      return;
    }

    try {
      setLoadingVocabulary(true);
      setError("");

      const response = await fetch(
        `${API_URL}/learning/vocabulary/chapter/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch vocabulary"
        );
      }

      setVocabularies(data.vocabularies || []);
    } catch (error) {
      console.error(
        "Fetch vocabulary error:",
        error
      );

      setVocabularies([]);

      setError(
        error instanceof Error
          ? error.message
          : isBangla
          ? "Vocabulary লোড করতে সমস্যা হয়েছে।"
          : "Failed to load vocabulary."
      );
    } finally {
      setLoadingVocabulary(false);
    }
  };

  useEffect(() => {
    fetchVocabulary(selectedChapterId);
  }, [selectedChapterId]);

  /* =====================================================
     SELECTED CHAPTER
  ===================================================== */

  const selectedChapter = chapters.find(
    (chapter) =>
      chapter.id === selectedChapterId
  );

  const selectedBook = books.find(
    (book) => book.id === selectedBookId
  );

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
     SEARCH
  ===================================================== */

  const filteredVocabulary = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return vocabularies;
    }

    return vocabularies.filter((vocabulary) => {
      return (
        vocabulary.germanWord
          .toLowerCase()
          .includes(query) ||
        vocabulary.englishMeaning
          .toLowerCase()
          .includes(query) ||
        vocabulary.article
          ?.toLowerCase()
          .includes(query) ||
        vocabulary.plural
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [vocabularies, search]);

  /* =====================================================
     CREATE
  ===================================================== */

  const handleCreate = () => {
    if (!selectedChapterId) {
      setError(
        isBangla
          ? "প্রথমে একটি Chapter নির্বাচন করুন।"
          : "Please select a chapter first."
      );

      return;
    }

    setEditingVocabulary(null);
    setModalOpen(true);
    setError("");
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (
    vocabulary: Vocabulary
  ) => {
    setEditingVocabulary(vocabulary);
    setModalOpen(true);
    setError("");
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleCloseModal = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setEditingVocabulary(null);
  };

  /* =====================================================
     CREATE / UPDATE
  ===================================================== */

  const handleSubmit = async (data: {
    germanWord: string;
    englishMeaning: string;
    article?: string;
    plural?: string;
    chapterId: string;
  }) => {
    try {
      setActionLoading(true);
      setError("");

      const isEditing = Boolean(
        editingVocabulary
      );

      const url = isEditing
        ? `${API_URL}/learning/vocabulary/${editingVocabulary?.id}`
        : `${API_URL}/learning/vocabulary`;

      const method = isEditing
        ? "PATCH"
        : "POST";

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
              ? "Failed to update vocabulary"
              : "Failed to create vocabulary")
        );
      }

      setModalOpen(false);
      setEditingVocabulary(null);

      /*
       * If chapter changed during edit/create,
       * update selected chapter.
       */
      if (data.chapterId !== selectedChapterId) {
        onSelectedChapterChange?.(
          data.chapterId
        );
      }

      await fetchVocabulary(data.chapterId);

      onVocabularyChange?.();
    } catch (error) {
      console.error(
        "Vocabulary submit error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : isBangla
          ? "Vocabulary save করতে সমস্যা হয়েছে।"
          : "Failed to save vocabulary."
      );

      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (
    vocabulary: Vocabulary
  ) => {
    const confirmed = window.confirm(
      isBangla
        ? `আপনি কি "${vocabulary.germanWord}" delete করতে চান?`
        : `Are you sure you want to delete "${vocabulary.germanWord}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/learning/vocabulary/${vocabulary.id}`,
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
          data.message ||
            "Failed to delete vocabulary"
        );
      }

      await fetchVocabulary(
        selectedChapterId
      );

      onVocabularyChange?.();
    } catch (error) {
      console.error(
        "Delete vocabulary error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : isBangla
          ? "Vocabulary delete করতে সমস্যা হয়েছে।"
          : "Failed to delete vocabulary."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     STATS
  ===================================================== */

  const totalVocabulary =
    vocabularies.length;

  const audioCount = vocabularies.filter(
    (vocabulary) =>
      Boolean(vocabulary.audioUrl)
  ).length;

  const articleCount = vocabularies.filter(
    (vocabulary) =>
      Boolean(vocabulary.article)
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
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              🗣️
            </div>

            <div>
              <h2
                className={`text-xl font-bold sm:text-2xl ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                Vocabulary Management
              </h2>

              <p
                className={`text-sm ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {isBangla
                  ? "Selected Chapter-এর vocabulary manage করুন"
                  : "Manage vocabulary for the selected chapter"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              !selectedChapterId ||
              actionLoading
            }
            className="rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            +{" "}
            {isBangla
              ? "নতুন Vocabulary"
              : "Add Vocabulary"}
          </button>
        </div>

        {/* SELECTED BOOK */}

        <div
          className={`mb-4 rounded-2xl border p-4 ${
            isDark
              ? "border-white/10 bg-black/10"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              📚
            </span>

            <div>
              <p className="text-xs text-slate-500">
                Selected Book
              </p>

              <p
                className={`font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {selectedBook?.name ||
                  "No book selected"}
              </p>
            </div>
          </div>
        </div>

        {/* CHAPTER SELECT */}

        <div
          className={`mb-6 rounded-2xl border p-4 ${
            isDark
              ? "border-white/10 bg-black/10"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <label
            className={`mb-2 block text-sm font-semibold ${
              isDark
                ? "text-slate-200"
                : "text-slate-700"
            }`}
          >
            {isBangla
              ? "Chapter নির্বাচন করুন"
              : "Select Chapter"}
          </label>

          <select
            value={selectedChapterId}
            onChange={(e) =>
              onSelectedChapterChange?.(
                e.target.value
              )
            }
            disabled={
              loadingChapters ||
              chapters.length === 0
            }
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
              isDark
                ? "border-white/10 bg-[#0B0F19] text-white focus:border-rose-500"
                : "border-slate-200 bg-white text-slate-900 focus:border-rose-500"
            }`}
          >
            <option value="">
              {loadingChapters
                ? "Loading chapters..."
                : chapters.length === 0
                ? "No chapters available"
                : "Select a chapter"}
            </option>

            {sortedChapters.map(
              (chapter) => (
                <option
                  key={chapter.id}
                  value={chapter.id}
                >
                  {getChapterNumber(
                    chapter
                  )}{" "}
                  — {chapter.title}
                </option>
              )
            )}
          </select>
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
              Total Vocabulary
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                isDark
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              {totalVocabulary}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              isDark
                ? "border-blue-500/10 bg-blue-500/[0.03]"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <p className="text-xs text-blue-500">
              Audio
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-500">
              {audioCount}
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
              Articles
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-500">
              {articleCount}
            </p>
          </div>
        </div>

        {/* SEARCH */}

        {selectedChapterId &&
          vocabularies.length > 0 && (
            <div className="mb-5">
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder={
                  isBangla
                    ? "German বা English word search করুন..."
                    : "Search German or English word..."
                }
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  isDark
                    ? "border-white/10 bg-[#0B0F19] text-white placeholder:text-slate-600 focus:border-rose-500"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-rose-500"
                }`}
              />
            </div>
          )}

        {/* CONTENT */}

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
                ? "প্রথমে Book Management থেকে একটি Book নির্বাচন করুন"
                : "Select a book from Book Management first"}
            </p>
          </div>
        ) : !selectedChapterId ? (
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

            <p className="font-medium">
              {isBangla
                ? "একটি Chapter নির্বাচন করুন"
                : "Select a chapter"}
            </p>
          </div>
        ) : loadingVocabulary ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-rose-500" />
          </div>
        ) : filteredVocabulary.length === 0 ? (
          <div
            className={`rounded-2xl border border-dashed p-10 text-center ${
              isDark
                ? "border-white/10 text-slate-500"
                : "border-slate-300 text-slate-500"
            }`}
          >
            <div className="mb-3 text-4xl">
              🗣️
            </div>

            <p
              className={`font-medium ${
                isDark
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              {search
                ? isBangla
                  ? "কোনো Vocabulary পাওয়া যায়নি"
                  : "No vocabulary found"
                : isBangla
                ? "এই Chapter-এ এখনো কোনো Vocabulary নেই"
                : "No vocabulary found for this chapter"}
            </p>

            {!search && (
              <p className="mt-1 text-sm">
                {isBangla
                  ? "উপরের Add Vocabulary button ব্যবহার করুন।"
                  : "Use the Add Vocabulary button above."}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVocabulary.map(
              (vocabulary) => (
                <div
                  key={vocabulary.id}
                  className={`rounded-2xl border p-4 transition ${
                    isDark
                      ? "border-white/10 bg-white/[0.02] hover:border-white/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* WORD INFO */}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {vocabulary.article && (
                          <span
                            className={`rounded-lg px-2 py-1 text-xs font-bold ${
                              isDark
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {vocabulary.article}
                          </span>
                        )}

                        <h3
                          className={`text-lg font-bold ${
                            isDark
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          {vocabulary.germanWord}
                        </h3>
                      </div>

                      <p
                        className={`mt-1 text-sm ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        {vocabulary.englishMeaning}
                      </p>

                      {vocabulary.plural && (
                        <p
                          className={`mt-1 text-xs ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-500"
                          }`}
                        >
                          Plural:{" "}
                          <span className="font-medium">
                            {vocabulary.plural}
                          </span>
                        </p>
                      )}

                      {/* AUDIO */}

                      {vocabulary.audioUrl && (
                        <div className="mt-3">
                          <audio
                            controls
                            preload="none"
                            className="h-9 max-w-full"
                          >
                            <source
                              src={
                                vocabulary.audioUrl
                              }
                              type="audio/mpeg"
                            />
                          </audio>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 lg:shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            vocabulary
                          )
                        }
                        disabled={
                          actionLoading
                        }
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
                          handleDelete(
                            vocabulary
                          )
                        }
                        disabled={
                          actionLoading
                        }
                        className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* VOCABULARY MODAL */}

      <VocabularyModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingVocabulary={
          editingVocabulary
        }
        chapters={chapters}
        defaultChapterId={
          selectedChapterId
        }
        isBangla={isBangla}
        loading={actionLoading}
      />
    </>
  );
}