"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleHelp, LoaderCircle, LockKeyhole, PlayCircle, XCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL = "http://localhost:5000/api/learning/grammar";

type QuestionType = "MULTIPLE_CHOICE" | "FILL_IN_THE_GAP";

interface GrammarQuestion {
  id: string;
  taskNo: number;
  question: string;
  type: QuestionType;
  options?: unknown;
  explanation?: string | null;
}

interface GrammarTopic {
  id: string;
  title: string;
  explanation: string;
  examples?: unknown;
  rules?: unknown;
  commonMistakes?: unknown;
  videoUrl?: string | null;
  questions: GrammarQuestion[];
}

interface AnswerResult {
  correct: boolean;
  score: number;
  correctAnswer?: string;
  explanation?: string | null;
  message?: string;
}

interface GrammarReaderProps {
  chapterId: string;
  token: string;
  loginHref: string;
  showPractice?: boolean;
}

class GrammarApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "GrammarApiError";
  }
}

async function parseResponse(response: Response) {
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success === false) {
    throw new GrammarApiError(
      result?.message || `Request failed with status ${response.status}`,
      response.status
    );
  }
  return result;
}

function getStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isYouTubeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      (host === "youtu.be" ||
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtube-nocookie.com" ||
        host.endsWith(".youtube-nocookie.com"))
    );
  } catch {
    return false;
  }
}

function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split("/").filter(Boolean);
    const videoId =
      url.searchParams.get("v") ??
      (host === "youtu.be"
        ? segments[0]
        : url.pathname === "/v" || url.pathname === "/u"
          ? segments[1]
          : /^(?:embed|shorts|live)\/[^/]+$/i.test(segments.join("/"))
            ? segments[1]
            : undefined);

    if (videoId && /^[\w-]{11}$/.test(videoId)) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    const playlistId = url.searchParams.get("list");
    if (playlistId && /^[\w-]+$/.test(playlistId)) {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`;
    }

    return null;
  } catch {
    return null;
  }
}

function getSafeVideoUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function isDirectVideoUrl(value: string): boolean {
  try {
    return /\.(mp4|webm|ogg|mov)(?:$|[?#])/i.test(new URL(value).pathname + new URL(value).search);
  } catch {
    return false;
  }
}

export default function GrammarReader({
  chapterId,
  token,
  loginHref,
  showPractice = true,
}: GrammarReaderProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isBangla = language === "bn";
  const isDark = theme === "dark";
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, AnswerResult>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loadTopics = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${API_URL}/chapter/${encodeURIComponent(chapterId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        const result = await parseResponse(response);
        if (!Array.isArray(result.topics)) {
          throw new Error("Invalid grammar topics response.");
        }
        if (!cancelled) {
          setTopics(result.topics as GrammarTopic[]);
          setAnswers({});
          setResults({});
        }
      } catch (loadError) {
        if (!cancelled) {
          if (
            loadError instanceof GrammarApiError &&
            loadError.status === 401
          ) {
            setError("AUTH_REQUIRED");
          } else if (
            loadError instanceof GrammarApiError &&
            loadError.status === 403
          ) {
            setError("ACCESS_DENIED");
          } else {
            console.error("Grammar topics fetch error:", loadError);
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Failed to load grammar topics."
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadTopics();
    return () => {
      cancelled = true;
    };
  }, [chapterId, token, retryCount]);

  const submitAnswer = async (
    event: FormEvent<HTMLFormElement>,
    questionId: string
  ) => {
    event.preventDefault();
    const answer = answers[questionId]?.trim();
    if (!answer) return;

    try {
      setSubmitting((current) => ({ ...current, [questionId]: true }));
      const response = await fetch(
        `${API_URL}/question/${encodeURIComponent(questionId)}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answer }),
        }
      );
      const result = await parseResponse(response);
      setResults((current) => ({
        ...current,
        [questionId]: {
          correct: Boolean(result.correct),
          score: Number(result.score ?? 0),
          correctAnswer:
            typeof result.correctAnswer === "string"
              ? result.correctAnswer
              : undefined,
          explanation:
            typeof result.explanation === "string"
              ? result.explanation
              : null,
          message:
            typeof result.message === "string" ? result.message : undefined,
        },
      }));
    } catch (submitError) {
      console.error("Grammar answer submit error:", submitError);
      if (
        submitError instanceof GrammarApiError &&
        submitError.status === 401
      ) {
        setError("AUTH_REQUIRED");
      } else if (
        submitError instanceof GrammarApiError &&
        submitError.status === 403
      ) {
        setError("ACCESS_DENIED");
      } else {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Failed to submit answer."
        );
      }
    } finally {
      setSubmitting((current) => ({ ...current, [questionId]: false }));
    }
  };

  const surfaceClass = isDark
    ? "border-white/10 bg-white/[0.035]"
    : "border-slate-200 bg-white shadow-sm";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const headingClass = isDark ? "text-white" : "text-slate-900";

  if (error === "AUTH_REQUIRED") {
    return (
      <div className={`rounded-3xl border p-8 text-center sm:p-10 ${surfaceClass}`}>
        <LockKeyhole className="mx-auto text-amber-300" size={28} />
        <h3 className={`mt-4 text-xl font-bold ${headingClass}`}>
          {isBangla ? "Grammar পড়তে লগইন করুন" : "Sign in to study grammar"}
        </h3>
        <p className={`mx-auto mt-2 max-w-lg text-sm leading-6 ${mutedClass}`}>
          {isBangla
            ? "এই chapter-এর grammar lessons ও practice দেখতে আপনার account-এ লগইন করুন।"
            : "Sign in to read this chapter’s grammar lessons and practice questions."}
        </p>
        <Link
          href={loginHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-5 py-3 text-sm font-bold text-white"
        >
          {isBangla ? "লগইন করুন" : "Sign in"}
        </Link>
      </div>
    );
  }

  if (error === "ACCESS_DENIED") {
    return (
      <div role="alert" className={`rounded-3xl border p-8 text-center ${surfaceClass}`}>
        <LockKeyhole className="mx-auto text-amber-300" size={26} />
        <h3 className={`mt-4 font-bold ${headingClass}`}>
          {isBangla ? "এই Grammar content দেখার অনুমতি নেই" : "You do not have access to this grammar content"}
        </h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex min-h-64 items-center justify-center gap-3 rounded-3xl border ${surfaceClass} ${mutedClass}`}>
        <LoaderCircle className="animate-spin text-amber-300" />
        {isBangla ? "Grammar lessons লোড হচ্ছে..." : "Loading grammar lessons..."}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-3xl border border-red-400/20 bg-red-400/5 p-7 text-center">
        <p className="text-sm text-red-300">{error}</p>
        <button
          type="button"
          onClick={() => setRetryCount((current) => current + 1)}
          className="mt-4 rounded-xl border border-red-400/20 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-400/10"
        >
          {isBangla ? "আবার চেষ্টা করুন" : "Retry"}
        </button>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className={`rounded-3xl border p-8 text-center ${surfaceClass}`}>
        <CircleHelp className="mx-auto text-violet-300" size={28} />
        <h3 className={`mt-4 font-bold ${headingClass}`}>
          {isBangla
            ? "এই chapter-এ এখনো Grammar lesson যোগ করা হয়নি"
            : "No grammar lessons have been added to this chapter yet"}
        </h3>
        <p className={`mt-2 text-sm ${mutedClass}`}>
          {isBangla
            ? "Admin নতুন lesson যোগ করলে এখানে দেখতে পাবেন।"
            : "Lessons will appear here when they are added."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {topics.map((topic, topicIndex) => {
        const rules = getStringList(topic.rules);
        const examples = getStringList(topic.examples);
        const commonMistakes = getStringList(topic.commonMistakes);
        const videoUrl = topic.videoUrl
          ? getSafeVideoUrl(topic.videoUrl)
          : null;
        const youtubeVideo = videoUrl ? isYouTubeUrl(videoUrl) : false;
        const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
        const directVideo = videoUrl && isDirectVideoUrl(videoUrl);

        return (
          <article
            key={topic.id}
            className={`overflow-hidden rounded-3xl border ${surfaceClass}`}
          >
            <div className="border-b border-white/10 bg-gradient-to-r from-violet-500/[0.10] to-indigo-400/[0.04] p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-300">
                {isBangla ? `পাঠ ${topicIndex + 1}` : `Lesson ${topicIndex + 1}`}
              </p>
              <h3 className={`mt-2 text-2xl font-bold sm:text-3xl ${headingClass}`}>
                {topic.title}
              </h3>
              {showPractice && topic.questions.length > 0 && (
                <a
                  href={`#grammar-practice-${topic.id}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
                >
                  {isBangla
                    ? `${topic.questions.length}টি অনুশীলনী প্রশ্নের উত্তর দিন`
                    : `Answer ${topic.questions.length} practice ${
                        topic.questions.length === 1 ? "question" : "questions"
                      }`}
                  <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <p className={`whitespace-pre-wrap break-words text-sm leading-7 sm:text-base ${mutedClass}`}>
                {topic.explanation}
              </p>

              {rules.length > 0 && (
                <section>
                  <h4 className={`mb-3 font-bold ${headingClass}`}>
                    {isBangla ? "নিয়ম" : "Rules"}
                  </h4>
                  <ul className="space-y-2">
                    {rules.map((rule, index) => (
                      <li
                        key={`rule-${index}`}
                        className={`flex gap-3 rounded-xl border p-3 text-sm leading-6 ${isDark ? "border-white/10 bg-black/10 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                      >
                        <span className="font-bold text-violet-400">{index + 1}.</span>
                        <span className="whitespace-pre-wrap break-words">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {examples.length > 0 && (
                <section>
                  <h4 className={`mb-3 font-bold ${headingClass}`}>
                    {isBangla ? "উদাহরণ" : "Examples"}
                  </h4>
                  <ul className="space-y-2">
                    {examples.map((example, index) => (
                      <li
                        key={`example-${index}`}
                        className={`whitespace-pre-wrap break-words rounded-xl border-l-2 border-amber-300 bg-amber-300/[0.06] px-4 py-3 text-sm leading-6 ${isDark ? "text-slate-200" : "text-slate-700"}`}
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {commonMistakes.length > 0 && (
                <section className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.04] p-4">
                  <h4 className="mb-3 font-bold text-rose-300">
                    {isBangla ? "সাধারণ ভুল" : "Common mistakes"}
                  </h4>
                  <ul className={`space-y-2 text-sm leading-6 ${mutedClass}`}>
                    {commonMistakes.map((mistake, index) => (
                      <li
                        key={`mistake-${index}`}
                        className="whitespace-pre-wrap break-words"
                      >
                        • {mistake}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {topic.videoUrl && (
                <section>
                  <h4 className={`mb-3 flex items-center gap-2 font-bold ${headingClass}`}>
                    <PlayCircle size={18} className="text-red-400" />
                    {isBangla ? "ভিডিও লেসন" : "Video lesson"}
                  </h4>
                  {embedUrl ? (
                    <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
                      <iframe
                        src={embedUrl}
                        title={`${topic.title} video lesson`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ) : directVideo && videoUrl ? (
                    <video
                      controls
                      preload="metadata"
                      className="max-h-[70vh] w-full rounded-2xl border border-white/10 bg-black"
                    >
                      <source src={videoUrl} />
                      {isBangla
                        ? "আপনার browser এই video format চালাতে পারছে না।"
                        : "Your browser cannot play this video format."}
                    </video>
                  ) : videoUrl && !youtubeVideo ? (
                    <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50"}`}>
                      <p className={`text-sm ${mutedClass}`}>
                        {isBangla
                          ? "ভিডিওটি নতুন tab-এ খুলুন।"
                          : "Open this lesson video in a new tab."}
                      </p>
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        {isBangla ? "ভিডিও দেখুন ↗" : "Watch video ↗"}
                      </a>
                    </div>
                  ) : (
                    <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">
                      {isBangla
                        ? "এই YouTube link embed করা যাচ্ছে না। Admin-কে video link যাচাই করতে বলুন।"
                        : "This YouTube link could not be embedded. Ask an admin to check the video link."}
                    </p>
                  )}
                </section>
              )}

              {showPractice && topic.questions.length > 0 && (
                <section
                  id={`grammar-practice-${topic.id}`}
                  className="scroll-mt-24 border-t border-white/10 pt-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className={`font-bold ${headingClass}`}>
                      {isBangla ? "অনুশীলন প্রশ্ন" : "Practice questions"}
                    </h4>
                    <span className={`text-xs ${mutedClass}`}>
                      {topic.questions.length}{" "}
                      {isBangla ? "টি প্রশ্ন" : "questions"}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {[...topic.questions]
                      .sort((a, b) => a.taskNo - b.taskNo)
                      .map((question) => {
                        const questionOptions = getStringList(question.options);
                        const result = results[question.id];
                        return (
                          <form
                            key={question.id}
                            onSubmit={(event) =>
                              void submitAnswer(event, question.id)
                            }
                            className={`rounded-2xl border p-4 sm:p-5 ${isDark ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50"}`}
                          >
                            <p className="text-xs font-bold uppercase tracking-wide text-violet-400">
                              {isBangla ? "প্রশ্ন" : "Task"} {question.taskNo}
                            </p>
                            <p className={`mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 ${headingClass}`}>
                              {question.question}
                            </p>

                            {question.type === "MULTIPLE_CHOICE" &&
                            questionOptions.length > 0 ? (
                              <div className="mt-4 space-y-2">
                                {questionOptions.map((option, index) => (
                                  <label
                                    key={`${question.id}-option-${index}`}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                                      answers[question.id] === option
                                        ? "border-violet-400/40 bg-violet-400/10"
                                        : isDark
                                          ? "border-white/10 hover:bg-white/[0.04]"
                                          : "border-slate-200 bg-white hover:bg-slate-100"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`answer-${question.id}`}
                                      value={option}
                                      checked={answers[question.id] === option}
                                      onChange={() =>
                                        setAnswers((current) => ({
                                          ...current,
                                          [question.id]: option,
                                        }))
                                      }
                                      disabled={Boolean(result) || submitting[question.id]}
                                      className="accent-violet-500"
                                    />
                                    <span className={headingClass}>
                                      {String.fromCharCode(65 + index)}. {option}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <input
                                value={answers[question.id] ?? ""}
                                onChange={(event) =>
                                  setAnswers((current) => ({
                                    ...current,
                                    [question.id]: event.target.value,
                                  }))
                                }
                                disabled={Boolean(result) || submitting[question.id]}
                                className={`mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                                  isDark
                                    ? "border-white/10 bg-[#0B0F19] text-white placeholder:text-slate-500"
                                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                                }`}
                                placeholder={
                                  isBangla ? "আপনার উত্তর লিখুন" : "Type your answer"
                                }
                              />
                            )}

                            {!result && (
                              <button
                                type="submit"
                                disabled={
                                  !answers[question.id]?.trim() ||
                                  submitting[question.id]
                                }
                                className="mt-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {submitting[question.id]
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
                                  {result.correct ? (
                                    <CheckCircle2 size={17} />
                                  ) : (
                                    <XCircle size={17} />
                                  )}
                                  {result.correct
                                    ? isBangla
                                      ? "সঠিক উত্তর!"
                                      : "Correct!"
                                    : isBangla
                                      ? "এবার সঠিক হয়নি"
                                      : "Not quite"}
                                  <span className="ml-auto">
                                    {isBangla ? "স্কোর" : "Score"}: {result.score}
                                  </span>
                                </p>
                                {!result.correct && result.correctAnswer && (
                                  <p className="mt-2">
                                    {isBangla ? "সঠিক উত্তর" : "Correct answer"}:{" "}
                                    <strong>{result.correctAnswer}</strong>
                                  </p>
                                )}
                                {result.explanation && (
                                  <p className="mt-2 whitespace-pre-wrap leading-6">
                                    {result.explanation}
                                  </p>
                                )}
                              </div>
                            )}
                          </form>
                        );
                      })}
                  </div>
                </section>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
