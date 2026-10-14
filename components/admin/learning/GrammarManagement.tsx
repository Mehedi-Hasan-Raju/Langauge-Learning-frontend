"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api/learning/grammar";

type GrammarQuestionType = "MULTIPLE_CHOICE" | "FILL_IN_THE_GAP";

interface GrammarQuestion {
  id: string;
  taskNo: number;
  question: string;
  type: GrammarQuestionType;
  answer: string;
  options: unknown;
  explanation?: string | null;
  grammarId: string;
}

interface GrammarTopic {
  id: string;
  title: string;
  explanation: string;
  examples: unknown;
  rules: unknown;
  commonMistakes: unknown;
  videoUrl?: string | null;
  chapterId: string;
  questions: GrammarQuestion[];
}

interface TopicFields {
  title: string;
  explanation: string;
  examples: string;
  rules: string;
  commonMistakes: string;
  videoUrl: string;
}

interface QuestionFields {
  taskNo: string;
  question: string;
  type: GrammarQuestionType;
  answer: string;
  options: string;
  explanation: string;
}

interface GrammarManagementProps {
  token: string;
  selectedChapterId: string;
  chapterTitle?: string;
}

function jsonArrayToLines(value: unknown): string {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").join("\n")
    : "";
}

function jsonOptionsToLines(value: unknown): string {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .join("\n")
    : "";
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

export default function GrammarManagement({
  token,
  selectedChapterId,
  chapterTitle,
}: GrammarManagementProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [topicFormOpen, setTopicFormOpen] = useState(false);
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<GrammarTopic | null>(null);
  const [editingQuestion, setEditingQuestion] =
    useState<GrammarQuestion | null>(null);

  const selectedTopic = selectedChapterId
    ? topics.find((topic) => topic.id === selectedTopicId)
    : undefined;

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return topics;
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.explanation.toLowerCase().includes(query)
    );
  }, [search, topics]);

  useEffect(() => {
    if (!selectedChapterId) {
      return;
    }

    let cancelled = false;
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${API_URL}/chapter/${encodeURIComponent(selectedChapterId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await readResponse(response);

        if (!Array.isArray(result.topics)) {
          throw new Error("Invalid grammar topics response.");
        }

        if (!cancelled) {
          const fetchedTopics = result.topics as GrammarTopic[];
          setTopics(fetchedTopics);
          setSelectedTopicId((currentId) =>
            fetchedTopics.some((topic) => topic.id === currentId)
              ? currentId
              : fetchedTopics[0]?.id ?? ""
          );
        }
      } catch (fetchError) {
        console.error("Grammar topics fetch error:", fetchError);
        if (!cancelled) {
          setTopics([]);
          setSelectedTopicId("");
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : isBangla
                ? "Grammar topic লোড করা যায়নি।"
                : "Failed to load grammar topics."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchTopics();
    return () => {
      cancelled = true;
    };
  }, [selectedChapterId, token, isBangla]);

  const openTopicForm = (topic: GrammarTopic | null = null) => {
    setEditingTopic(topic);
    setTopicFormOpen(true);
    setError("");
  };

  const openQuestionForm = (question: GrammarQuestion | null = null) => {
    if (!selectedTopic) {
      setError(
        isBangla
          ? "প্রথমে একটি Grammar topic নির্বাচন করুন।"
          : "Select a grammar topic first."
      );
      return;
    }
    setEditingQuestion(question);
    setQuestionFormOpen(true);
    setError("");
  };

  const handleTopicSubmit = async (fields: TopicFields) => {
    if (!selectedChapterId) {
      throw new Error(
        isBangla ? "একটি chapter নির্বাচন করুন।" : "Select a chapter first."
      );
    }

    const isEditing = Boolean(editingTopic);
    const response = await fetch(
      isEditing
        ? `${API_URL}/topic/${encodeURIComponent(editingTopic!.id)}`
        : `${API_URL}/topic`,
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: fields.title.trim(),
          explanation: fields.explanation.trim(),
          examples: fields.examples
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
          rules: fields.rules
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
          commonMistakes: fields.commonMistakes
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
          videoUrl: fields.videoUrl.trim() || null,
          ...(!isEditing && { chapterId: selectedChapterId }),
        }),
      }
    );
    const result = await readResponse(response);
    const savedTopic = result.topic as GrammarTopic | undefined;
    if (!savedTopic?.id) {
      throw new Error("The server did not return the saved grammar topic.");
    }

    setTopics((current) =>
      isEditing
        ? current.map((topic) =>
            topic.id === savedTopic.id
              ? {
                  ...topic,
                  ...savedTopic,
                  questions: savedTopic.questions ?? topic.questions,
                }
              : topic
          )
        : [...current, { ...savedTopic, questions: savedTopic.questions ?? [] }]
    );
    setSelectedTopicId(savedTopic.id);
    setTopicFormOpen(false);
    setEditingTopic(null);
  };

  const handleQuestionSubmit = async (fields: QuestionFields) => {
    if (!selectedTopic) {
      throw new Error(
        isBangla ? "একটি Grammar topic নির্বাচন করুন।" : "Select a grammar topic."
      );
    }

    const isEditing = Boolean(editingQuestion);
    const options = fields.options
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const response = await fetch(
      isEditing
        ? `${API_URL}/question/${encodeURIComponent(editingQuestion!.id)}`
        : `${API_URL}/question`,
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskNo: Number(fields.taskNo),
          question: fields.question.trim(),
          type: fields.type,
          answer: fields.answer.trim(),
          options: fields.type === "MULTIPLE_CHOICE" ? options : null,
          explanation: fields.explanation.trim() || null,
          ...(!isEditing && { grammarId: selectedTopic.id }),
        }),
      }
    );
    const result = await readResponse(response);
    const savedQuestion = result.question as GrammarQuestion | undefined;
    if (!savedQuestion?.id) {
      throw new Error("The server did not return the saved question.");
    }

    setTopics((current) =>
      current.map((topic) => {
        if (topic.id !== selectedTopic.id) return topic;
        const exists = topic.questions.some(
          (question) => question.id === savedQuestion.id
        );
        return {
          ...topic,
          questions: exists
            ? topic.questions.map((question) =>
                question.id === savedQuestion.id
                  ? savedQuestion
                  : question
              )
            : [...topic.questions, savedQuestion].sort(
                (a, b) => a.taskNo - b.taskNo
              ),
        };
      })
    );
    setQuestionFormOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteTopic = async (topic: GrammarTopic) => {
    const confirmed = window.confirm(
      isBangla
        ? `“${topic.title}” এবং এর সব প্রশ্ন delete করবেন?`
        : `Delete “${topic.title}” and all of its questions?`
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      const response = await fetch(
        `${API_URL}/topic/${encodeURIComponent(topic.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await readResponse(response);
      setTopics((current) => current.filter((item) => item.id !== topic.id));
      setSelectedTopicId((current) =>
        current === topic.id
          ? topics.find((item) => item.id !== topic.id)?.id ?? ""
          : current
      );
    } catch (deleteError) {
      console.error("Grammar topic delete error:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete grammar topic."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (question: GrammarQuestion) => {
    const confirmed = window.confirm(
      isBangla
        ? `Task ${question.taskNo} delete করবেন?`
        : `Delete task ${question.taskNo}?`
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      const response = await fetch(
        `${API_URL}/question/${encodeURIComponent(question.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await readResponse(response);
      setTopics((current) =>
        current.map((topic) => ({
          ...topic,
          questions: topic.questions.filter(
            (item) => item.id !== question.id
          ),
        }))
      );
    } catch (deleteError) {
      console.error("Grammar question delete error:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete grammar question."
      );
    } finally {
      setSaving(false);
    }
  };

  const cardClass = isDark
    ? "border-white/10 bg-white/[0.03]"
    : "border-slate-200 bg-white";
  const textClass = isDark ? "text-white" : "text-slate-900";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <>
      <section className={`mt-8 rounded-3xl border p-5 shadow-xl sm:p-6 ${cardClass}`}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-xl text-violet-400">
              A
            </div>
            <div>
              <h2 className={`text-xl font-bold sm:text-2xl ${textClass}`}>
                {isBangla ? "Grammar Management" : "Grammar Management"}
              </h2>
              <p className={`text-sm ${mutedClass}`}>
                {chapterTitle
                  ? `${chapterTitle} · `
                  : ""}
                {isBangla
                  ? "নির্বাচিত chapter-এর topics ও exercises পরিচালনা করুন"
                  : "Manage topics and exercises for the selected chapter"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openTopicForm()}
            disabled={!selectedChapterId || saving}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            + {isBangla ? "নতুন Grammar Topic" : "Add Grammar Topic"}
          </button>
        </div>

        {selectedChapterId && (
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isBangla ? "Topic খুঁজুন..." : "Search grammar topics..."
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none sm:max-w-sm ${
                isDark
                  ? "border-white/10 bg-[#0B0F19] text-white placeholder:text-slate-600"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <p className={`self-center text-sm ${mutedClass}`}>
              {topics.length} {isBangla ? "টি topic" : "topics"} ·{" "}
              {topics.reduce((total, topic) => total + topic.questions.length, 0)}{" "}
              {isBangla ? "টি প্রশ্ন" : "questions"}
            </p>
          </div>
        )}

        {selectedChapterId && error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        {!selectedChapterId ? (
          <div className={`rounded-2xl border border-dashed p-10 text-center ${mutedClass} ${isDark ? "border-white/10" : "border-slate-300"}`}>
            {isBangla
              ? "প্রথমে Chapter Management থেকে একটি chapter নির্বাচন করুন।"
              : "Select a chapter in Chapter Management to manage its grammar."}
          </div>
        ) : loading ? (
          <div className={`flex justify-center py-12 ${mutedClass}`}>
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-violet-500" />
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className={`rounded-2xl border border-dashed p-10 text-center ${mutedClass} ${isDark ? "border-white/10" : "border-slate-300"}`}>
            <p className={`font-medium ${textClass}`}>
              {search
                ? isBangla
                  ? "কোনো topic পাওয়া যায়নি।"
                  : "No matching topics found."
                : isBangla
                  ? "এই chapter-এ এখনো grammar topic নেই।"
                  : "No grammar topics have been added to this chapter yet."}
            </p>
            {!search && (
              <p className="mt-1 text-sm">
                {isBangla
                  ? "নতুন topic যোগ করতে উপরের button ব্যবহার করুন।"
                  : "Use Add Grammar Topic to create the first one."}
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const active = topic.id === selectedTopicId;
                return (
                  <article
                    key={topic.id}
                    className={`rounded-2xl border p-4 transition ${
                      active
                        ? "border-violet-400/30 bg-violet-500/[0.07]"
                        : isDark
                          ? "border-white/10 bg-white/[0.02]"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTopicId(topic.id)}
                      className="w-full text-left"
                    >
                      <span className={`block font-semibold ${textClass}`}>
                        {topic.title}
                      </span>
                      <span className={`mt-1 block line-clamp-2 text-sm ${mutedClass}`}>
                        {topic.explanation}
                      </span>
                      <span className="mt-3 inline-flex rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">
                        {topic.questions.length}{" "}
                        {isBangla ? "টি প্রশ্ন" : "questions"}
                      </span>
                    </button>
                    <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => openTopicForm(topic)}
                        disabled={saving}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                          isDark
                            ? "border-white/10 text-slate-200 hover:bg-white/5"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {isBangla ? "Edit" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteTopic(topic)}
                        disabled={saving}
                        className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {isBangla ? "Delete" : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {selectedTopic ? (
              <div className={`rounded-2xl border p-5 ${cardClass}`}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-400">
                      {isBangla ? "Grammar Topic" : "Grammar Topic"}
                    </p>
                    <h3 className={`mt-1 text-xl font-bold ${textClass}`}>
                      {selectedTopic.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuestionForm()}
                    disabled={saving}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    + {isBangla ? "প্রশ্ন যোগ করুন" : "Add Question"}
                  </button>
                </div>

                <p className={`mt-4 whitespace-pre-wrap text-sm leading-7 ${mutedClass}`}>
                  {selectedTopic.explanation}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      title: isBangla ? "Rules" : "Rules",
                      values: selectedTopic.rules,
                    },
                    {
                      title: isBangla ? "Examples" : "Examples",
                      values: selectedTopic.examples,
                    },
                    {
                      title: isBangla ? "Common mistakes" : "Common mistakes",
                      values: selectedTopic.commonMistakes,
                    },
                  ].map(({ title, values }) => {
                    const lines = Array.isArray(values)
                      ? values.filter(
                          (item): item is string => typeof item === "string"
                        )
                      : [];
                    if (lines.length === 0) return null;
                    return (
                      <div
                        key={title}
                        className={`rounded-xl border p-3 ${isDark ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50"}`}
                      >
                        <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${mutedClass}`}>
                          {title}
                        </p>
                        <ul className={`space-y-1 text-sm ${textClass}`}>
                          {lines.map((line, index) => (
                            <li key={`${title}-${index}`} className="whitespace-pre-wrap">
                              • {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {selectedTopic.videoUrl && (
                  <a
                    href={selectedTopic.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-violet-400 hover:text-violet-300"
                  >
                    {isBangla ? "ভিডিও খুলুন ↗" : "Open lesson video ↗"}
                  </a>
                )}

                <div className={`mt-6 border-t pt-5 ${isDark ? "border-white/10" : "border-slate-200"}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className={`font-semibold ${textClass}`}>
                      {isBangla ? "Practice Questions" : "Practice Questions"}
                    </h4>
                    <span className={`text-xs ${mutedClass}`}>
                      {selectedTopic.questions.length}{" "}
                      {isBangla ? "টি প্রশ্ন" : "questions"}
                    </span>
                  </div>

                  {selectedTopic.questions.length === 0 ? (
                    <p className={`rounded-xl border border-dashed p-5 text-center text-sm ${mutedClass} ${isDark ? "border-white/10" : "border-slate-300"}`}>
                      {isBangla
                        ? "এই topic-এ এখনো কোনো প্রশ্ন নেই।"
                        : "No questions have been added to this topic yet."}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {[...selectedTopic.questions]
                        .sort((a, b) => a.taskNo - b.taskNo)
                        .map((question) => (
                          <article
                            key={question.id}
                            className={`rounded-xl border p-4 ${isDark ? "border-white/10 bg-black/10" : "border-slate-200 bg-white"}`}
                          >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-violet-400">
                                  Task {question.taskNo} ·{" "}
                                  {question.type === "MULTIPLE_CHOICE"
                                    ? "Multiple choice"
                                    : "Fill in the gap"}
                                </p>
                                <p className={`mt-2 whitespace-pre-wrap text-sm font-medium ${textClass}`}>
                                  {question.question}
                                </p>
                                {question.type === "MULTIPLE_CHOICE" &&
                                  Array.isArray(question.options) && (
                                    <ul className={`mt-2 space-y-1 text-xs ${mutedClass}`}>
                                      {question.options
                                        .filter(
                                          (option): option is string =>
                                            typeof option === "string"
                                        )
                                        .map((option, index) => (
                                          <li key={`${question.id}-option-${index}`}>
                                            {String.fromCharCode(65 + index)}. {option}
                                          </li>
                                        ))}
                                    </ul>
                                  )}
                                <p className={`mt-2 text-xs ${mutedClass}`}>
                                  {isBangla ? "উত্তর" : "Answer"}:{" "}
                                  <span className="font-semibold text-emerald-400">
                                    {question.answer}
                                  </span>
                                </p>
                                {question.explanation && (
                                  <p className={`mt-1 text-xs ${mutedClass}`}>
                                    {question.explanation}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 gap-2">
                                <button
                                  type="button"
                                  onClick={() => openQuestionForm(question)}
                                  disabled={saving}
                                  className={`rounded-lg border px-3 py-1.5 text-xs ${
                                    isDark
                                      ? "border-white/10 text-slate-200 hover:bg-white/5"
                                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteQuestion(question)}
                                  disabled={saving}
                                  className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`rounded-2xl border border-dashed p-8 text-center ${mutedClass} ${isDark ? "border-white/10" : "border-slate-300"}`}>
                {isBangla
                  ? "বিস্তারিত দেখতে একটি topic নির্বাচন করুন।"
                  : "Select a topic to view its details and questions."}
              </div>
            )}
          </div>
        )}
      </section>

      {topicFormOpen && (
        <TopicForm
          key={editingTopic?.id ?? "new-topic"}
          isDark={isDark}
          isBangla={isBangla}
          initialTopic={editingTopic}
          loading={saving}
          onClose={() => {
            if (!saving) {
              setTopicFormOpen(false);
              setEditingTopic(null);
            }
          }}
          onSubmit={async (fields) => {
            try {
              setSaving(true);
              setError("");
              await handleTopicSubmit(fields);
            } catch (submitError) {
              console.error("Grammar topic save error:", submitError);
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : "Failed to save grammar topic."
              );
              throw submitError;
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {questionFormOpen && selectedTopic && (
        <QuestionForm
          key={editingQuestion?.id ?? `new-question-${selectedTopic.id}`}
          isDark={isDark}
          isBangla={isBangla}
          initialQuestion={editingQuestion}
          nextTaskNo={
            Math.max(0, ...selectedTopic.questions.map((item) => item.taskNo)) + 1
          }
          loading={saving}
          onClose={() => {
            if (!saving) {
              setQuestionFormOpen(false);
              setEditingQuestion(null);
            }
          }}
          onSubmit={async (fields) => {
            try {
              setSaving(true);
              setError("");
              await handleQuestionSubmit(fields);
            } catch (submitError) {
              console.error("Grammar question save error:", submitError);
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : "Failed to save grammar question."
              );
              throw submitError;
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
    </>
  );
}

function TopicForm({
  isDark,
  isBangla,
  initialTopic,
  loading,
  onClose,
  onSubmit,
}: {
  isDark: boolean;
  isBangla: boolean;
  initialTopic: GrammarTopic | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (fields: TopicFields) => Promise<void>;
}) {
  const [fields, setFields] = useState<TopicFields>(() => ({
    title: initialTopic?.title ?? "",
    explanation: initialTopic?.explanation ?? "",
    examples: jsonArrayToLines(initialTopic?.examples),
    rules: jsonArrayToLines(initialTopic?.rules),
    commonMistakes: jsonArrayToLines(initialTopic?.commonMistakes),
    videoUrl: initialTopic?.videoUrl ?? "",
  }));
  const [error, setError] = useState("");
  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none ${
    isDark
      ? "border-white/10 bg-[#0B0F19] text-white placeholder:text-slate-500"
      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
  }`;
  const updateField = (key: keyof TopicFields, value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      await onSubmit(fields);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save grammar topic."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close grammar topic form"
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className={`relative z-10 max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border p-6 shadow-2xl ${
          isDark
            ? "border-white/10 bg-[#111827] text-white"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              {initialTopic
                ? isBangla
                  ? "Grammar Topic সম্পাদনা"
                  : "Edit Grammar Topic"
                : isBangla
                  ? "নতুন Grammar Topic"
                  : "Add Grammar Topic"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {isBangla
                ? "প্রতিটি list item আলাদা লাইনে লিখুন।"
                : "Enter each rule, example, or mistake on a separate line."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-white/5 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium">
          {isBangla ? "শিরোনাম" : "Title"} *
          <input
            required
            value={fields.title}
            onChange={(event) => updateField("title", event.target.value)}
            className={`${inputClass} mt-2`}
            maxLength={160}
          />
        </label>
        <label className="block text-sm font-medium">
          {isBangla ? "ব্যাখ্যা" : "Explanation"} *
          <textarea
            required
            rows={4}
            value={fields.explanation}
            onChange={(event) => updateField("explanation", event.target.value)}
            className={`${inputClass} mt-2 resize-y`}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["rules", isBangla ? "Rules" : "Rules"],
              ["examples", isBangla ? "Examples" : "Examples"],
              [
                "commonMistakes",
                isBangla ? "Common mistakes" : "Common mistakes",
              ],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm font-medium">
              {label}
              <textarea
                rows={3}
                value={fields[key]}
                onChange={(event) => updateField(key, event.target.value)}
                className={`${inputClass} mt-2 resize-y`}
                placeholder={isBangla ? "প্রতিটি item নতুন লাইনে" : "One item per line"}
              />
            </label>
          ))}
          <label className="block text-sm font-medium">
            Video URL
            <input
              type="url"
              value={fields.videoUrl}
              onChange={(event) => updateField("videoUrl", event.target.value)}
              className={`${inputClass} mt-2`}
              placeholder="https://..."
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 disabled:opacity-50"
          >
            {isBangla ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? isBangla
                ? "সংরক্ষণ হচ্ছে..."
                : "Saving..."
              : isBangla
                ? "সংরক্ষণ"
                : "Save Topic"}
          </button>
        </div>
      </form>
    </div>
  );
}

function QuestionForm({
  isDark,
  isBangla,
  initialQuestion,
  nextTaskNo,
  loading,
  onClose,
  onSubmit,
}: {
  isDark: boolean;
  isBangla: boolean;
  initialQuestion: GrammarQuestion | null;
  nextTaskNo: number;
  loading: boolean;
  onClose: () => void;
  onSubmit: (fields: QuestionFields) => Promise<void>;
}) {
  const [fields, setFields] = useState<QuestionFields>(() => ({
    taskNo: String(initialQuestion?.taskNo ?? nextTaskNo),
    question: initialQuestion?.question ?? "",
    type: initialQuestion?.type ?? "MULTIPLE_CHOICE",
    answer: initialQuestion?.answer ?? "",
    options: jsonOptionsToLines(initialQuestion?.options),
    explanation: initialQuestion?.explanation ?? "",
  }));
  const [error, setError] = useState("");
  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none ${
    isDark
      ? "border-white/10 bg-[#0B0F19] text-white placeholder:text-slate-500"
      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
  }`;
  const updateField = <K extends keyof QuestionFields>(
    key: K,
    value: QuestionFields[K]
  ) => setFields((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const taskNo = Number(fields.taskNo);
    if (!Number.isInteger(taskNo) || taskNo < 0) {
      setError(isBangla ? "সঠিক task number দিন।" : "Enter a valid task number.");
      return;
    }
    if (
      fields.type === "MULTIPLE_CHOICE" &&
      fields.options.split("\n").filter((line) => line.trim()).length < 2
    ) {
      setError(
        isBangla
          ? "Multiple choice-এর জন্য কমপক্ষে ২টি option দিন।"
          : "Add at least two options for multiple-choice questions."
      );
      return;
    }
    try {
      await onSubmit(fields);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save grammar question."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close question form"
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className={`relative z-10 max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-2xl border p-6 shadow-2xl ${
          isDark
            ? "border-white/10 bg-[#111827] text-white"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              {initialQuestion
                ? isBangla
                  ? "প্রশ্ন সম্পাদনা"
                  : "Edit Question"
                : isBangla
                  ? "নতুন Grammar Question"
                  : "Add Grammar Question"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {isBangla
                ? "প্রশ্নের ধরন, উত্তর এবং explanation নির্ধারণ করুন।"
                : "Set the question type, answer, and explanation."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-white/5 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Task number *
            <input
              type="number"
              min="0"
              required
              value={fields.taskNo}
              onChange={(event) => updateField("taskNo", event.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label className="block text-sm font-medium">
            Question type *
            <select
              value={fields.type}
              onChange={(event) =>
                updateField(
                  "type",
                  event.target.value as GrammarQuestionType
                )
              }
              className={`${inputClass} mt-2`}
            >
              <option value="MULTIPLE_CHOICE">Multiple choice</option>
              <option value="FILL_IN_THE_GAP">Fill in the gap</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Question *
          <textarea
            required
            rows={3}
            value={fields.question}
            onChange={(event) => updateField("question", event.target.value)}
            className={`${inputClass} mt-2 resize-y`}
          />
        </label>
        {fields.type === "MULTIPLE_CHOICE" && (
          <label className="block text-sm font-medium">
            Options * (one per line)
            <textarea
              required
              rows={4}
              value={fields.options}
              onChange={(event) => updateField("options", event.target.value)}
              className={`${inputClass} mt-2 resize-y`}
              placeholder={"Option 1\nOption 2"}
            />
          </label>
        )}
        <label className="block text-sm font-medium">
          Correct answer *
          <input
            required
            value={fields.answer}
            onChange={(event) => updateField("answer", event.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block text-sm font-medium">
          Explanation
          <textarea
            rows={2}
            value={fields.explanation}
            onChange={(event) => updateField("explanation", event.target.value)}
            className={`${inputClass} mt-2 resize-y`}
          />
        </label>
        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 disabled:opacity-50"
          >
            {isBangla ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? isBangla
                ? "সংরক্ষণ হচ্ছে..."
                : "Saving..."
              : isBangla
                ? "সংরক্ষণ"
                : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
