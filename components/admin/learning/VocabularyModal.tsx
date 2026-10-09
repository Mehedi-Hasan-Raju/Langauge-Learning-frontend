"use client";

import { useEffect, useState } from "react";

import { useTheme } from "../../../context/ThemeContext";

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

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (data: {
    germanWord: string;
    englishMeaning: string;
    article?: string;
    plural?: string;
    chapterId: string;
  }) => Promise<void>;

  editingVocabulary: Vocabulary | null;

  chapters: Chapter[];

  defaultChapterId?: string;

  isBangla: boolean;

  loading?: boolean;
}

export default function VocabularyModal({
  isOpen,
  onClose,
  onSubmit,
  editingVocabulary,
  chapters,
  defaultChapterId = "",
  isBangla,
  loading = false,
}: VocabularyModalProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [germanWord, setGermanWord] = useState("");
  const [englishMeaning, setEnglishMeaning] = useState("");
  const [article, setArticle] = useState("");
  const [plural, setPlural] = useState("");
  const [chapterId, setChapterId] =
    useState(defaultChapterId);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (editingVocabulary) {
      setGermanWord(editingVocabulary.germanWord);
      setEnglishMeaning(
        editingVocabulary.englishMeaning
      );
      setArticle(editingVocabulary.article || "");
      setPlural(editingVocabulary.plural || "");
      setChapterId(editingVocabulary.chapterId);
    } else {
      setGermanWord("");
      setEnglishMeaning("");
      setArticle("");
      setPlural("");

      setChapterId(
        defaultChapterId || chapters[0]?.id || ""
      );
    }

    setError("");
  }, [
    isOpen,
    editingVocabulary,
    defaultChapterId,
    chapters,
  ]);

  if (!isOpen) return null;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const trimmedGermanWord =
      germanWord.trim();

    const trimmedEnglishMeaning =
      englishMeaning.trim();

    const trimmedArticle =
      article.trim();

    const trimmedPlural =
      plural.trim();

    if (!trimmedGermanWord) {
      setError(
        isBangla
          ? "German word দিন"
          : "German word is required"
      );

      return;
    }

    if (!trimmedEnglishMeaning) {
      setError(
        isBangla
          ? "English meaning দিন"
          : "English meaning is required"
      );

      return;
    }

    if (!chapterId) {
      setError(
        isBangla
          ? "একটি Chapter select করুন"
          : "Please select a chapter"
      );

      return;
    }

    await onSubmit({
      germanWord: trimmedGermanWord,
      englishMeaning: trimmedEnglishMeaning,

      ...(trimmedArticle
        ? {
            article: trimmedArticle,
          }
        : {}),

      ...(trimmedPlural
        ? {
            plural: trimmedPlural,
          }
        : {}),

      chapterId,
    });
  };

  const inputClass = `
    w-full rounded-xl border px-4 py-3 text-sm outline-none
    transition
    ${
      isDark
        ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-rose-500/60 focus:bg-white/[0.06]"
        : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:bg-white"
    }
  `;

  const labelClass = `
    mb-2 block text-sm font-medium
    ${
      isDark
        ? "text-slate-300"
        : "text-slate-700"
    }
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10 w-full max-w-2xl overflow-hidden
          rounded-2xl border shadow-2xl
          ${
            isDark
              ? "border-white/10 bg-[#0F172A]"
              : "border-slate-200 bg-white"
          }
        `}
      >
        {/* Header */}
        <div
          className={`
            flex items-center justify-between
            border-b px-6 py-5
            ${
              isDark
                ? "border-white/10"
                : "border-slate-200"
            }
          `}
        >
          <div>
            <h2
              className={`
                text-xl font-semibold
                ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }
              `}
            >
              {editingVocabulary
                ? isBangla
                  ? "Vocabulary Edit করুন"
                  : "Edit Vocabulary"
                : isBangla
                ? "নতুন Vocabulary"
                : "Add Vocabulary"}
            </h2>

            <p
              className={`
                mt-1 text-xs
                ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-500"
                }
              `}
            >
              {editingVocabulary
                ? isBangla
                  ? "Vocabulary information update করুন"
                  : "Update vocabulary information"
                : isBangla
                ? "নতুন German vocabulary যোগ করুন"
                : "Add a new German vocabulary"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-lg text-lg transition
              disabled:cursor-not-allowed disabled:opacity-50
              ${
                isDark
                  ? "text-slate-400 hover:bg-white/10 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }
            `}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Error */}
          {error && (
            <div
              className={`
                rounded-xl border px-4 py-3 text-sm
                ${
                  isDark
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-red-200 bg-red-50 text-red-600"
                }
              `}
            >
              {error}
            </div>
          )}

          {/* Chapter */}
          <div>
            <label className={labelClass}>
              {isBangla
                ? "Chapter"
                : "Chapter"}{" "}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <select
              value={chapterId}
              onChange={(event) =>
                setChapterId(event.target.value)
              }
              disabled={loading}
              className={inputClass}
            >
              <option value="">
                {isBangla
                  ? "Chapter select করুন"
                  : "Select chapter"}
              </option>

              {chapters.map((chapter) => {
                const chapterNumber =
                  chapter.sectionNo === 0
                    ? `${chapter.chapterNo}`
                    : `${chapter.chapterNo}.${chapter.sectionNo}`;

                return (
                  <option
                    key={chapter.id}
                    value={chapter.id}
                  >
                    Chapter {chapterNumber} —{" "}
                    {chapter.title}
                  </option>
                );
              })}
            </select>
          </div>

          {/* German Word */}
          <div>
            <label className={labelClass}>
              {isBangla
                ? "German Word"
                : "German Word"}{" "}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={germanWord}
              onChange={(event) =>
                setGermanWord(event.target.value)
              }
              placeholder="z. B. Haus"
              disabled={loading}
              className={inputClass}
            />

            <p
              className={`
                mt-1.5 text-xs
                ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              `}
            >
              {isBangla
                ? "German word পরিবর্তন করলে নতুন pronunciation audio generate হবে।"
                : "Changing the German word will generate a new pronunciation audio."}
            </p>
          </div>

          {/* English Meaning */}
          <div>
            <label className={labelClass}>
              {isBangla
                ? "English Meaning"
                : "English Meaning"}{" "}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={englishMeaning}
              onChange={(event) =>
                setEnglishMeaning(
                  event.target.value
                )
              }
              placeholder="e.g. House"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Article + Plural */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Article */}
            <div>
              <label className={labelClass}>
                {isBangla
                  ? "Article"
                  : "Article"}
              </label>

              <select
                value={article}
                onChange={(event) =>
                  setArticle(event.target.value)
                }
                disabled={loading}
                className={inputClass}
              >
                <option value="">
                  {isBangla
                    ? "Article select করুন"
                    : "Select article"}
                </option>

                <option value="der">
                  der
                </option>

                <option value="die">
                  die
                </option>

                <option value="das">
                  das
                </option>
              </select>
            </div>

            {/* Plural */}
            <div>
              <label className={labelClass}>
                {isBangla
                  ? "Plural"
                  : "Plural"}
              </label>

              <input
                type="text"
                value={plural}
                onChange={(event) =>
                  setPlural(event.target.value)
                }
                placeholder="e.g. Häuser"
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          {/* Audio info */}
          <div
            className={`
              rounded-xl border px-4 py-3
              ${
                isDark
                  ? "border-amber-500/20 bg-amber-500/5"
                  : "border-amber-200 bg-amber-50"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-lg">
                🔊
              </div>

              <div>
                <p
                  className={`
                    text-sm font-medium
                    ${
                      isDark
                        ? "text-amber-300"
                        : "text-amber-700"
                    }
                  `}
                >
                  {isBangla
                    ? "Automatic Pronunciation"
                    : "Automatic Pronunciation"}
                </p>

                <p
                  className={`
                    mt-1 text-xs leading-5
                    ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-600"
                    }
                  `}
                >
                  {isBangla
                    ? "Vocabulary create করলে German pronunciation automatically generate হয়ে Cloudinary-তে save হবে।"
                    : "German pronunciation is automatically generated and stored on Cloudinary when vocabulary is created."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`
              flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end
              ${
                isDark
                  ? "border-white/10"
                  : "border-slate-200"
              }
            `}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`
                rounded-xl border px-5 py-2.5 text-sm
                font-medium transition
                disabled:cursor-not-allowed disabled:opacity-50
                ${
                  isDark
                    ? "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              {isBangla
                ? "Cancel"
                : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl bg-gradient-to-r
                from-rose-600 to-amber-500
                px-5 py-2.5 text-sm font-semibold
                text-white shadow-lg
                shadow-rose-500/20
                transition
                hover:scale-[1.01]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? isBangla
                  ? "Saving..."
                  : "Saving..."
                : editingVocabulary
                ? isBangla
                  ? "Update Vocabulary"
                  : "Update Vocabulary"
                : isBangla
                ? "Add Vocabulary"
                : "Add Vocabulary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}