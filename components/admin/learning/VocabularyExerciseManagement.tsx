"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api/learning/vocabulary";
const LEARNING_API_URL = "http://localhost:5000/api/learning";

type ExerciseType =
  | "GERMAN_TO_ENGLISH"
  | "ENGLISH_TO_GERMAN"
  | "MULTIPLE_CHOICE";

interface VocabularyExercise {
  id: string;
  question: string;
  type: ExerciseType;
  answer: string;
  options?: unknown;
  explanation?: string | null;
  chapterId: string;
}

interface Chapter {
  id: string;
  title: string;
  chapterNo: number;
  sectionNo: number;
}

interface ExerciseFields {
  question: string;
  type: ExerciseType;
  answer: string;
  options: string;
  explanation: string;
}

const emptyFields: ExerciseFields = {
  question: "",
  type: "GERMAN_TO_ENGLISH",
  answer: "",
  options: "",
  explanation: "",
};

async function readResponse(response: Response) {
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message || `Request failed with status ${response.status}`
    );
  }
  return result;
}

function optionsToText(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").join("\n")
    : "";
}

export default function VocabularyExerciseManagement({
  token,
  selectedBookId,
  selectedChapterId,
}: {
  token: string;
  selectedBookId: string;
  selectedChapterId: string;
}) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [exercises, setExercises] = useState<VocabularyExercise[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [practiceChapterId, setPracticeChapterId] = useState("");
  const [fields, setFields] = useState<ExerciseFields>(emptyFields);
  const [editing, setEditing] = useState<VocabularyExercise | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!selectedBookId || !token) return;

    let cancelled = false;
    const loadChapters = async () => {
      try {
        setError("");
        const response = await fetch(
          `${LEARNING_API_URL}/chapters/book/${encodeURIComponent(selectedBookId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        const result = await readResponse(response);
        if (!Array.isArray(result.chapters)) {
          throw new Error("Invalid chapters response.");
        }

        if (!cancelled) {
          const fetchedChapters = (result.chapters as Chapter[]).sort(
            (first, second) =>
              first.chapterNo - second.chapterNo ||
              first.sectionNo - second.sectionNo
          );
          setChapters(fetchedChapters);
          setPracticeChapterId((currentId) =>
            fetchedChapters.some((chapter) => chapter.id === currentId)
              ? currentId
              : fetchedChapters.some(
                    (chapter) => chapter.id === selectedChapterId
                  )
                ? selectedChapterId
                : fetchedChapters[0]?.id ?? ""
          );
        }
      } catch (loadError) {
        console.error("Vocabulary exercise chapters fetch error:", loadError);
        if (!cancelled) {
          setChapters([]);
          setPracticeChapterId("");
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load chapters for vocabulary practice."
          );
        }
      }
    };

    void loadChapters();
    return () => {
      cancelled = true;
    };
  }, [selectedBookId, selectedChapterId, token]);

  useEffect(() => {
    if (!practiceChapterId || !token) return;

    let cancelled = false;
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${API_URL}/exercise/chapter/${encodeURIComponent(practiceChapterId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        const result = await readResponse(response);
        if (!Array.isArray(result.exercises)) {
          throw new Error("Invalid vocabulary exercises response.");
        }
        if (!cancelled) setExercises(result.exercises as VocabularyExercise[]);
      } catch (loadError) {
        console.error("Vocabulary exercises fetch error:", loadError);
        if (!cancelled) {
          setExercises([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : isBangla
                ? "Vocabulary exercise লোড করা যায়নি।"
                : "Failed to load vocabulary exercises."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadExercises();
    return () => {
      cancelled = true;
    };
  }, [practiceChapterId, token, isBangla]);

  const updateField = <K extends keyof ExerciseFields>(
    key: K,
    value: ExerciseFields[K]
  ) => setFields((current) => ({ ...current, [key]: value }));

  const startCreate = () => {
    setEditing(null);
    setFields(emptyFields);
    setFormError("");
    setFormOpen(true);
  };

  const startEdit = (exercise: VocabularyExercise) => {
    setEditing(exercise);
    setFields({
      question: exercise.question,
      type: exercise.type,
      answer: exercise.answer,
      options: optionsToText(exercise.options),
      explanation: exercise.explanation ?? "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFields(emptyFields);
    setFormError("");
    setFormOpen(false);
  };

  const saveExercise = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!practiceChapterId) return;

    const options = fields.options
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);

    if (fields.type === "MULTIPLE_CHOICE" && options.length < 2) {
      setFormError(
        isBangla
          ? "Multiple choice-এর জন্য অন্তত ২টি option দিন।"
          : "Add at least two options for multiple-choice exercises."
      );
      return;
    }

    if (
      fields.type === "MULTIPLE_CHOICE" &&
      !options.some(
        (option) => option.toLowerCase() === fields.answer.trim().toLowerCase()
      )
    ) {
      setFormError(
        isBangla
          ? "সঠিক উত্তরটি options-এর একটির সঙ্গে মিলতে হবে।"
          : "The correct answer must match one of the options."
      );
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      setError("");
      const response = await fetch(
        editing
          ? `${API_URL}/exercise/${encodeURIComponent(editing.id)}`
          : `${API_URL}/exercise`,
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: fields.question.trim(),
            type: fields.type,
            answer: fields.answer.trim(),
            options: fields.type === "MULTIPLE_CHOICE" ? options : [],
            explanation: fields.explanation.trim(),
            chapterId: practiceChapterId,
          }),
        }
      );
      const result = await readResponse(response);
      const savedExercise = result.exercise as VocabularyExercise | undefined;
      if (!savedExercise?.id) {
        throw new Error("The server did not return the saved exercise.");
      }

      setExercises((current) =>
        editing
          ? current.map((item) =>
              item.id === savedExercise.id ? savedExercise : item
            )
          : [...current, savedExercise]
      );
      cancelEdit();
    } catch (saveError) {
      console.error("Vocabulary exercise save error:", saveError);
      setFormError(
        saveError instanceof Error
          ? saveError.message
          : isBangla
            ? "Vocabulary exercise সংরক্ষণ করা যায়নি।"
            : "Failed to save vocabulary exercise."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteExercise = async (exercise: VocabularyExercise) => {
    if (
      !window.confirm(
        isBangla
          ? "এই vocabulary exercise মুছে ফেলবেন?"
          : "Delete this vocabulary exercise?"
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      const response = await fetch(
        `${API_URL}/exercise/${encodeURIComponent(exercise.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await readResponse(response);
      setExercises((current) =>
        current.filter((item) => item.id !== exercise.id)
      );
      if (editing?.id === exercise.id) cancelEdit();
    } catch (deleteError) {
      console.error("Vocabulary exercise delete error:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete vocabulary exercise."
      );
    } finally {
      setSaving(false);
    }
  };

  const cardClass = isDark
    ? "border-white/10 bg-white/[0.03]"
    : "border-slate-200 bg-white";
  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none ${
    isDark
      ? "border-white/10 bg-[#0B0F19] text-white placeholder:text-slate-500"
      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
  }`;

  return (
    <section className={`mt-8 rounded-3xl border p-5 shadow-xl sm:p-6 ${cardClass}`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={`text-xl font-bold sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
            {isBangla ? "Vocabulary Practice" : "Vocabulary Practice"}
          </h2>
          <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {isBangla
              ? "নির্বাচিত chapter-এর জন্য অনুশীলনী ও সঠিক উত্তর তৈরি করুন।"
              : "Create and manage practice exercises for the selected chapter."}
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          disabled={!practiceChapterId || saving}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          + {isBangla ? "Exercise যোগ করুন" : "Add Exercise"}
        </button>
      </div>

      <label className={`mb-5 block max-w-xl text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
        {isBangla ? "Practice-এর Chapter নির্বাচন করুন" : "Select practice chapter"}
        <select
          value={practiceChapterId}
          onChange={(event) => {
            setPracticeChapterId(event.target.value);
            cancelEdit();
          }}
          disabled={chapters.length === 0 || saving}
          className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ${
            isDark
              ? "border-white/10 bg-[#0B0F19] text-white"
              : "border-slate-200 bg-slate-50 text-slate-900"
          }`}
        >
          {chapters.length === 0 ? (
            <option value="">
              {isBangla ? "কোনো Chapter পাওয়া যায়নি" : "No chapters available"}
            </option>
          ) : (
            chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.sectionNo > 0
                  ? `${chapter.chapterNo}.${chapter.sectionNo}`
                  : chapter.chapterNo}{" "}
                — {chapter.title}
              </option>
            ))
          )}
        </select>
      </label>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {formOpen && (
        <form onSubmit={saveExercise} className={`mb-6 space-y-4 rounded-2xl border p-4 ${isDark ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {editing
                ? isBangla
                  ? "Exercise সম্পাদনা"
                  : "Edit exercise"
                : isBangla
                  ? "নতুন Vocabulary Exercise"
                  : "New vocabulary exercise"}
            </h3>
            <button type="button" onClick={cancelEdit} className="text-sm text-slate-400 hover:text-white">
              {isBangla ? "বাতিল" : "Cancel"}
            </button>
          </div>
          {formError && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {formError}
            </p>
          )}
          <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
            {isBangla ? "প্রশ্ন" : "Question"} *
            <textarea
              required
              rows={2}
              value={fields.question}
              onChange={(event) => updateField("question", event.target.value)}
              className={`${inputClass} mt-2 resize-y`}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              {isBangla ? "অনুশীলনের ধরন" : "Exercise type"} *
              <select
                value={fields.type}
                onChange={(event) => updateField("type", event.target.value as ExerciseType)}
                className={`${inputClass} mt-2`}
              >
                <option value="GERMAN_TO_ENGLISH">German to English</option>
                <option value="ENGLISH_TO_GERMAN">English to German</option>
                <option value="MULTIPLE_CHOICE">Multiple choice</option>
              </select>
            </label>
            <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              {isBangla ? "সঠিক উত্তর" : "Correct answer"} *
              <input
                required
                value={fields.answer}
                onChange={(event) => updateField("answer", event.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
          </div>
          {fields.type === "MULTIPLE_CHOICE" && (
            <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              {isBangla ? "Options (প্রতি লাইনে একটি) *" : "Options (one per line) *"}
              <textarea
                required
                rows={4}
                value={fields.options}
                onChange={(event) => updateField("options", event.target.value)}
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
          )}
          <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
            {isBangla ? "ব্যাখ্যা / উত্তর-পরবর্তী feedback" : "Explanation / feedback after answering"}
            <textarea
              rows={2}
              value={fields.explanation}
              onChange={(event) => updateField("explanation", event.target.value)}
              className={`${inputClass} mt-2 resize-y`}
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving
              ? isBangla
                ? "সংরক্ষণ হচ্ছে..."
                : "Saving..."
              : isBangla
                ? "সংরক্ষণ করুন"
                : "Save exercise"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-amber-500" />
        </div>
      ) : exercises.length === 0 ? (
        <p className={`rounded-xl border border-dashed p-6 text-center text-sm ${isDark ? "border-white/10 text-slate-400" : "border-slate-300 text-slate-500"}`}>
          {isBangla
            ? "এই chapter-এ এখনো কোনো vocabulary exercise নেই।"
            : "There are no vocabulary exercises for this chapter yet."}
        </p>
      ) : (
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <article key={exercise.id} className={`rounded-xl border p-4 ${isDark ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-semibold text-amber-500">
                    {exercise.type.replaceAll("_", " ")}
                  </p>
                  <p className={`mt-2 whitespace-pre-wrap text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                    {exercise.question}
                  </p>
                  {Array.isArray(exercise.options) && (
                    <ul className={`mt-2 space-y-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {exercise.options.map((option, index) =>
                        typeof option === "string" ? (
                          <li key={`${exercise.id}-${index}`}>
                            {String.fromCharCode(65 + index)}. {option}
                          </li>
                        ) : null
                      )}
                    </ul>
                  )}
                  <p className="mt-2 text-xs text-emerald-500">
                    {isBangla ? "সঠিক উত্তর" : "Correct answer"}: {exercise.answer}
                  </p>
                  {exercise.explanation && (
                    <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {exercise.explanation}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => startEdit(exercise)} disabled={saving} className={`rounded-lg border px-3 py-1.5 text-xs ${isDark ? "border-white/10 text-slate-200" : "border-slate-200 text-slate-700"}`}>
                    {isBangla ? "সম্পাদনা" : "Edit"}
                  </button>
                  <button type="button" onClick={() => void deleteExercise(exercise)} disabled={saving} className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 disabled:opacity-50">
                    {isBangla ? "মুছুন" : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
