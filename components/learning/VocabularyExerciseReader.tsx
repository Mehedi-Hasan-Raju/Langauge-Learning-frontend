"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, LockKeyhole, XCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL = "http://localhost:5000/api/learning/vocabulary";

type ExerciseType =
  | "GERMAN_TO_ENGLISH"
  | "ENGLISH_TO_GERMAN"
  | "MULTIPLE_CHOICE";

interface VocabularyExercise {
  id: string;
  question: string;
  type: ExerciseType;
  options?: unknown;
  explanation?: string | null;
}

interface ExerciseResult {
  correct: boolean;
  score?: number;
  correctAnswer?: string;
  explanation?: string | null;
  feedback?: string | null;
}

async function readResponse(response: Response) {
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message || `Request failed with status ${response.status}`
    );
  }
  return result;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export default function VocabularyExerciseReader({
  chapterId,
  token,
  loginHref,
}: {
  chapterId: string;
  token: string;
  loginHref: string;
}) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [exercises, setExercises] = useState<VocabularyExercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ExerciseResult>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${API_URL}/exercise/chapter/${encodeURIComponent(chapterId)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            cache: "no-store",
          }
        );
        const result = await readResponse(response);
        if (!Array.isArray(result.exercises)) {
          throw new Error("Invalid vocabulary exercises response.");
        }
        if (!cancelled) {
          setExercises(result.exercises as VocabularyExercise[]);
          setAnswers({});
          setResults({});
        }
      } catch (loadError) {
        console.error("Vocabulary exercises fetch error:", loadError);
        if (!cancelled) {
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
  }, [chapterId, token, retry, isBangla]);

  const submitAnswer = async (
    event: FormEvent<HTMLFormElement>,
    exerciseId: string
  ) => {
    event.preventDefault();
    const userAnswer = answers[exerciseId]?.trim();
    if (!userAnswer) return;

    try {
      setSubmitting((current) => ({ ...current, [exerciseId]: true }));
      setError("");
      const response = await fetch(`${API_URL}/exercise/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exerciseId, userAnswer }),
      });
      const result = await readResponse(response);
      const answerResult = result.result ?? result;
      const correct =
        typeof answerResult.correct === "boolean"
          ? answerResult.correct
          : Boolean(answerResult.isCorrect);
      setResults((current) => ({
        ...current,
        [exerciseId]: {
          correct,
          score:
            typeof result.score === "number"
              ? result.score
              : typeof result.submission?.score === "number"
                ? result.submission.score
                : undefined,
          correctAnswer:
            typeof answerResult.correctAnswer === "string"
              ? answerResult.correctAnswer
              : undefined,
          explanation:
            typeof answerResult.explanation === "string"
              ? answerResult.explanation
              : null,
          feedback:
            typeof answerResult.feedback === "string"
              ? answerResult.feedback
              : null,
        },
      }));
    } catch (submitError) {
      console.error("Vocabulary exercise answer submit error:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : isBangla
            ? "উত্তর জমা দেওয়া যায়নি।"
            : "Failed to submit your answer."
      );
    } finally {
      setSubmitting((current) => ({ ...current, [exerciseId]: false }));
    }
  };

  const surfaceClass = isDark
    ? "border-white/10 bg-white/[0.035]"
    : "border-slate-200 bg-white shadow-sm";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const headingClass = isDark ? "text-white" : "text-slate-900";

  if (!token) {
    return (
      <div className={`rounded-3xl border p-8 text-center ${surfaceClass}`}>
        <LockKeyhole className="mx-auto text-amber-300" size={26} />
        <h3 className={`mt-4 text-xl font-bold ${headingClass}`}>
          {isBangla ? "অনুশীলন করতে লগইন করুন" : "Sign in to practice"}
        </h3>
        <p className={`mx-auto mt-2 max-w-lg text-sm ${mutedClass}`}>
          {isBangla
            ? "Vocabulary practice করতে আপনার account-এ লগইন করুন।"
            : "Sign in to your account to answer vocabulary practice questions."}
        </p>
        <Link
          href={loginHref}
          className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-bold text-white"
        >
          {isBangla ? "লগইন করুন" : "Sign in"}
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex min-h-56 items-center justify-center gap-3 rounded-3xl border ${surfaceClass} ${mutedClass}`}>
        <LoaderCircle className="animate-spin text-amber-300" />
        {isBangla ? "Vocabulary practice লোড হচ্ছে..." : "Loading vocabulary practice..."}
      </div>
    );
  }

  if (error && exercises.length === 0) {
    return (
      <div role="alert" className="rounded-3xl border border-red-400/20 bg-red-400/5 p-7 text-center">
        <p className="text-sm text-red-300">{error}</p>
        <button
          type="button"
          onClick={() => setRetry((current) => current + 1)}
          className="mt-4 rounded-xl border border-red-400/20 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-400/10"
        >
          {isBangla ? "আবার চেষ্টা করুন" : "Retry"}
        </button>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className={`rounded-3xl border p-8 text-center ${surfaceClass}`}>
        <h3 className={`text-lg font-bold ${headingClass}`}>
          {isBangla
            ? "এই অধ্যায়ে এখনো কোনো vocabulary exercise নেই"
            : "No vocabulary exercises in this chapter yet"}
        </h3>
        <p className={`mt-2 text-sm ${mutedClass}`}>
          {isBangla
            ? "Admin exercise যোগ করলে এখানে অনুশীলন করতে পারবেন।"
            : "Exercises will appear here when an admin adds them."}
        </p>
      </div>
    );
  }

  return (
    <section className={`rounded-3xl border p-5 sm:p-7 ${surfaceClass}`}>
      <div className="mb-5">
        <h2 className={`text-xl font-bold sm:text-2xl ${headingClass}`}>
          {isBangla ? "Vocabulary Practice" : "Vocabulary Practice"}
        </h2>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          {isBangla
            ? "প্রতিটি প্রশ্নের উত্তর দিন, তারপর উত্তর যাচাই করুন।"
            : "Answer each question and submit it to check your answer."}
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {exercises.map((exercise, index) => {
          const options = stringList(exercise.options);
          const result = results[exercise.id];
          const feedback = result?.feedback || result?.explanation || exercise.explanation;

          return (
            <form
              key={exercise.id}
              onSubmit={(event) => void submitAnswer(event, exercise.id)}
              className={`rounded-2xl border p-4 sm:p-5 ${isDark ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-500">
                  {isBangla ? "প্রশ্ন" : "Question"} {index + 1}
                </p>
                <span className={`text-xs ${mutedClass}`}>
                  {exercise.type.replaceAll("_", " ")}
                </span>
              </div>
              <p className={`mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 ${headingClass}`}>
                {exercise.question}
              </p>

              {exercise.type === "MULTIPLE_CHOICE" && options.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {options.map((option, optionIndex) => (
                    <label
                      key={`${exercise.id}-option-${optionIndex}`}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                        answers[exercise.id] === option
                          ? "border-amber-400/40 bg-amber-400/10"
                          : isDark
                            ? "border-white/10 hover:bg-white/[0.04]"
                            : "border-slate-200 bg-white hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`vocabulary-answer-${exercise.id}`}
                        value={option}
                        checked={answers[exercise.id] === option}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [exercise.id]: option,
                          }))
                        }
                        disabled={Boolean(result) || submitting[exercise.id]}
                        className="accent-amber-500"
                      />
                      <span className={headingClass}>
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  value={answers[exercise.id] ?? ""}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [exercise.id]: event.target.value,
                    }))
                  }
                  disabled={Boolean(result) || submitting[exercise.id]}
                  className={`mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                    isDark
                      ? "border-white/10 bg-[#0B0F19] text-white placeholder:text-slate-500"
                      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                  }`}
                  placeholder={
                    exercise.type === "GERMAN_TO_ENGLISH"
                      ? isBangla
                        ? "ইংরেজি অর্থ লিখুন"
                        : "Type the English meaning"
                      : isBangla
                        ? "জার্মান শব্দ লিখুন"
                        : "Type the German word"
                  }
                />
              )}

              {!result && (
                <button
                  type="submit"
                  disabled={!answers[exercise.id]?.trim() || submitting[exercise.id]}
                  className="mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting[exercise.id]
                    ? isBangla
                      ? "জমা হচ্ছে..."
                      : "Submitting..."
                    : isBangla
                      ? "উত্তর যাচাই করুন"
                      : "Check answer"}
                </button>
              )}

              {result && (
                <div
                  role="status"
                  className={`mt-4 rounded-xl border p-3 text-sm ${
                    result.correct
                      ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                      : "border-rose-400/20 bg-rose-400/[0.07] text-rose-300"
                  }`}
                >
                  <p className="flex items-center gap-2 font-semibold">
                    {result.correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                    {result.correct
                      ? isBangla
                        ? "সঠিক উত্তর!"
                        : "Correct!"
                      : isBangla
                        ? "এবার সঠিক হয়নি"
                        : "Not quite"}
                    {result.score !== undefined && (
                      <span className="ml-auto">
                        {isBangla ? "স্কোর" : "Score"}: {result.score}
                      </span>
                    )}
                  </p>
                  {!result.correct && result.correctAnswer && (
                    <p className="mt-2">
                      {isBangla ? "সঠিক উত্তর" : "Correct answer"}:{" "}
                      <strong>{result.correctAnswer}</strong>
                    </p>
                  )}
                  {feedback && (
                    <p className="mt-2 whitespace-pre-wrap leading-6">{feedback}</p>
                  )}
                </div>
              )}
            </form>
          );
        })}
      </div>
    </section>
  );
}
