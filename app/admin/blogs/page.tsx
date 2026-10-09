"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenText,
  Check,
  Eye,
  FileImage,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

interface Blog {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  _count?: {
    likes: number;
  };
}

interface BlogForm {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  category: string;
  tags: string;
  published: boolean;
}

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  category: "",
  tags: "",
  published: false,
};

async function readResponse(response: Response) {
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return result;
}

function slugFromTitle(title: string) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminBlogsPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const imagePreviewUrlRef = useRef("");
  const [slugEdited, setSlugEdited] = useState(false);
  const imagePreview = imagePreviewUrl || editingBlog?.coverImage || "";

  const surfaceClass = isDark
    ? "border-white/10 bg-white/[0.035]"
    : "border-slate-200 bg-white shadow-sm";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const fieldClass = isDark
    ? "border-white/10 bg-[#0b0f19] text-white placeholder:text-slate-600 focus:border-amber-300/50"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-amber-400";

  const fetchBlogs = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        isBangla
          ? "ব্লগ পরিচালনার জন্য অ্যাডমিন হিসেবে লগইন করুন।"
          : "Sign in as an admin to manage blogs."
      );
    }

    const response = await fetch(`${API_URL}/blogs/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const result = await readResponse(response);

    if (!Array.isArray(result.blogs)) {
      throw new Error("Invalid blogs response from server.");
    }

    setBlogs(result.blogs);
  }, [isBangla]);

  useEffect(() => {
    let cancelled = false;

    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchBlogs();
      } catch (loadError) {
        if (!cancelled) {
          console.error("Admin blog fetch error:", loadError);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load blogs."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [fetchBlogs]);

  useEffect(
    () => () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    },
    []
  );

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return blogs;

    return blogs.filter((blog) =>
      [
        blog.title,
        blog.slug,
        blog.category,
        blog.shortDescription,
      ].some((value) => value?.toLowerCase().includes(normalizedSearch))
    );
  }, [blogs, search]);

  const publishedCount = blogs.filter((blog) => blog.published).length;
  const draftCount = blogs.length - publishedCount;

  const resetForm = () => {
    setEditingBlog(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setSlugEdited(false);
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = "";
    }
    setImagePreviewUrl("");
  };

  const editBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      content: blog.content ?? "",
      category: blog.category ?? "",
      tags: (blog.tags ?? []).join(", "),
      published: blog.published,
    });
    setSlugEdited(true);
    setImageFile(null);
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = "";
    }
    setImagePreviewUrl("");
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setForm((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : slugFromTitle(title),
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = "";
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      imagePreviewUrlRef.current = previewUrl;
      setImagePreviewUrl(previewUrl);
    } else {
      setImagePreviewUrl("");
    }

    setImageFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError(
        isBangla
          ? "আপনার লগইন সেশন পাওয়া যায়নি। আবার লগইন করুন।"
          : "Your login session was not found. Please sign in again."
      );
      return;
    }

    const payload = new FormData();
    payload.set("title", form.title.trim());
    payload.set("slug", form.slug.trim() || slugFromTitle(form.title));
    payload.set("shortDescription", form.shortDescription.trim());
    payload.set("content", form.content.trim());
    payload.set("category", form.category.trim());
    payload.set(
      "tags",
      JSON.stringify(
        form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );
    payload.set("published", String(form.published));

    if (imageFile) payload.set("image", imageFile);

    try {
      setSaving(true);
      const response = await fetch(
        editingBlog
          ? `${API_URL}/blogs/${editingBlog.id}`
          : `${API_URL}/blogs`,
        {
          method: editingBlog ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      await readResponse(response);
      await fetchBlogs();
      setNotice(
        editingBlog
          ? isBangla
            ? "ব্লগ আপডেট হয়েছে।"
            : "Blog updated successfully."
          : isBangla
            ? "ব্লগ তৈরি হয়েছে।"
            : "Blog created successfully."
      );
      resetForm();
    } catch (saveError) {
      console.error("Admin blog save error:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save blog."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog: Blog) => {
    const confirmed = window.confirm(
      isBangla
        ? `“${blog.title}” ব্লগটি মুছে ফেলবেন?`
        : `Delete “${blog.title}”? This action cannot be undone.`
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Your login session was not found. Please sign in again.");
      return;
    }

    try {
      setDeletingId(blog.id);
      setError("");
      setNotice("");
      const response = await fetch(`${API_URL}/blogs/${blog.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await readResponse(response);
      setBlogs((current) => current.filter((item) => item.id !== blog.id));

      if (editingBlog?.id === blog.id) resetForm();
      setNotice(isBangla ? "ব্লগ মুছে ফেলা হয়েছে।" : "Blog deleted.");
    } catch (deleteError) {
      console.error("Admin blog delete error:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete blog."
      );
    } finally {
      setDeletingId("");
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return isBangla ? "প্রকাশিত নয়" : "Not published";

    return new Date(date).toLocaleDateString(
      isBangla ? "bn-BD" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-[270px]">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/admin/dashboard"
                className={`mb-5 inline-flex items-center gap-2 text-sm ${mutedTextClass} transition hover:text-amber-300`}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                {isBangla ? "ড্যাশবোর্ডে ফিরুন" : "Back to dashboard"}
              </Link>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                {isBangla ? "কনটেন্ট স্টুডিও" : "Content studio"}
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                {isBangla ? "ব্লগ পরিচালনা" : "Blog management"}
              </h1>
              <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedTextClass}`}>
                {isBangla
                  ? "নতুন আর্টিকেল লিখুন, ছবি যোগ করুন এবং আপনার ব্লগ প্রকাশ করুন।"
                  : "Write articles, add a cover image, and publish your stories."}
              </p>
            </div>

            <div className="flex gap-3">
              <div className={`min-w-24 rounded-2xl border px-4 py-3 ${surfaceClass}`}>
                <p className={`text-xs ${mutedTextClass}`}>
                  {isBangla ? "প্রকাশিত" : "Published"}
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-400">
                  {publishedCount}
                </p>
              </div>
              <div className={`min-w-24 rounded-2xl border px-4 py-3 ${surfaceClass}`}>
                <p className={`text-xs ${mutedTextClass}`}>
                  {isBangla ? "ড্রাফট" : "Drafts"}
                </p>
                <p className="mt-1 text-xl font-bold text-amber-300">
                  {draftCount}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-300"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={18} />
              </button>
            </div>
          )}
          {notice && (
            <div
              role="status"
              className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300"
            >
              <Check size={18} aria-hidden="true" />
              {notice}
            </div>
          )}

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <section className={`rounded-3xl border p-5 sm:p-7 ${surfaceClass}`}>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
                    {editingBlog ? <Pencil size={19} /> : <Plus size={21} />}
                  </div>
                  <h2 className="text-xl font-bold">
                    {editingBlog
                      ? isBangla
                        ? "ব্লগ সম্পাদনা"
                        : "Edit article"
                      : isBangla
                        ? "নতুন ব্লগ লিখুন"
                        : "Write a new article"}
                  </h2>
                  <p className={`mt-1 text-sm ${mutedTextClass}`}>
                    {isBangla
                      ? "শিরোনাম, বিবরণ এবং আর্টিকেল কনটেন্ট যোগ করুন।"
                      : "Add the story details and choose whether to publish now."}
                  </p>
                </div>
                {editingBlog && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-400 hover:text-white" : "border-slate-200 text-slate-500 hover:text-slate-900"}`}
                    aria-label="Cancel editing"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    {isBangla ? "শিরোনাম" : "Title"} *
                  </span>
                  <input
                    required
                    maxLength={180}
                    value={form.title}
                    onChange={handleTitleChange}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${fieldClass}`}
                    placeholder="A practical guide to learning German"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Slug *
                  </span>
                  <input
                    required
                    value={form.slug}
                    onChange={(event) =>
                      {
                        setSlugEdited(true);
                        setForm((current) => ({
                          ...current,
                          slug: slugFromTitle(event.target.value),
                        }));
                      }
                    }
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${fieldClass}`}
                    placeholder="a-practical-guide-to-learning-german"
                  />
                  <span className={`mt-1.5 block text-xs ${mutedTextClass}`}>
                    {isBangla
                      ? "URL-এ ব্যবহারের জন্য ছোট হাতের অক্ষর ও হাইফেন ব্যবহার করুন।"
                      : "Used in the article URL; use lowercase words separated by hyphens."}
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    {isBangla ? "সংক্ষিপ্ত বিবরণ" : "Short description"} *
                  </span>
                  <textarea
                    required
                    rows={3}
                    maxLength={300}
                    value={form.shortDescription}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        shortDescription: event.target.value,
                      }))
                    }
                    className={`w-full resize-y rounded-xl border px-4 py-3 text-sm leading-6 outline-none transition ${fieldClass}`}
                    placeholder={
                      isBangla
                        ? "আর্টিকেলটির সংক্ষিপ্ত পরিচিতি লিখুন..."
                        : "A concise summary shown in blog listings..."
                    }
                  />
                  <span className={`mt-1 block text-right text-xs ${mutedTextClass}`}>
                    {form.shortDescription.length}/300
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    {isBangla ? "আর্টিকেল কনটেন্ট" : "Article content"} *
                  </span>
                  <textarea
                    required
                    rows={10}
                    value={form.content}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        content: event.target.value,
                      }))
                    }
                    className={`w-full resize-y rounded-xl border px-4 py-3 text-sm leading-7 outline-none transition ${fieldClass}`}
                    placeholder={
                      isBangla
                        ? "আপনার আর্টিকেল এখানে লিখুন..."
                        : "Write your article here..."
                    }
                  />
                  <span className={`mt-1 block text-xs ${mutedTextClass}`}>
                    {isBangla
                      ? "প্যারাগ্রাফ আলাদা করতে নতুন লাইন ব্যবহার করুন।"
                      : "Use blank lines to separate paragraphs."}
                  </span>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">
                      {isBangla ? "ক্যাটাগরি" : "Category"}
                    </span>
                    <input
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${fieldClass}`}
                      placeholder="German Learning"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">
                      {isBangla ? "ট্যাগ" : "Tags"}
                    </span>
                    <input
                      value={form.tags}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          tags: event.target.value,
                        }))
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${fieldClass}`}
                      placeholder="German, A1, Study tips"
                    />
                    <span className={`mt-1.5 block text-xs ${mutedTextClass}`}>
                      {isBangla ? "কমা দিয়ে আলাদা করুন" : "Separate with commas"}
                    </span>
                  </label>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium">
                    {isBangla ? "কভার ছবি" : "Cover image"}
                  </span>
                  <label
                    className={`group relative flex min-h-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed transition ${
                      isDark
                        ? "border-white/15 bg-black/10 hover:border-amber-300/40"
                        : "border-slate-300 bg-slate-50 hover:border-amber-400"
                    }`}
                  >
                    {imagePreview ? (
                      <>
                        <div
                          role="img"
                          aria-label="Blog cover preview"
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url("${imagePreview}")`,
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 transition group-hover:opacity-100" />
                        <span className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/50 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                          {isBangla ? "ছবি পরিবর্তন করতে ক্লিক করুন" : "Click to replace image"}
                        </span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-5 text-center">
                        <FileImage size={24} className="text-amber-300" />
                        <span className="text-sm font-medium">
                          {isBangla
                            ? "কভার ছবি নির্বাচন করুন"
                            : "Choose a cover image"}
                        </span>
                        <span className={`text-xs ${mutedTextClass}`}>
                          {isBangla
                            ? "নতুন ছবি দিলে পুরনোটি প্রতিস্থাপন হবে"
                            : "Optional. Uploading a new image replaces the current one."}
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imageFile && (
                    <p className={`mt-2 text-xs ${mutedTextClass}`}>
                      {imageFile.name} ·{" "}
                      {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
                    isDark
                      ? "border-white/10 bg-black/10"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        published: event.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 accent-amber-400"
                  />
                  <span>
                    <span className="block text-sm font-semibold">
                      {isBangla ? "এখনই প্রকাশ করুন" : "Publish this article"}
                    </span>
                    <span className={`mt-1 block text-xs leading-5 ${mutedTextClass}`}>
                      {isBangla
                        ? "বন্ধ রাখলে এটি ড্রাফট হিসেবে সংরক্ষিত হবে।"
                        : "Leave unchecked to save this as a draft."}
                    </span>
                  </span>
                </label>

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                  {editingBlog && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={saving}
                      className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                        isDark
                          ? "border-white/10 text-slate-300 hover:bg-white/5"
                          : "border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {isBangla ? "বাতিল" : "Cancel"}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : form.published ? (
                      <Send size={17} />
                    ) : (
                      <Save size={17} />
                    )}
                    {saving
                      ? isBangla
                        ? "সংরক্ষণ হচ্ছে..."
                        : "Saving..."
                      : editingBlog
                        ? isBangla
                          ? "আপডেট করুন"
                          : "Update article"
                        : form.published
                          ? isBangla
                            ? "প্রকাশ করুন"
                            : "Publish article"
                          : isBangla
                            ? "ড্রাফট সংরক্ষণ"
                            : "Save draft"}
                  </button>
                </div>
              </form>
            </section>

            <section className={`min-w-0 rounded-3xl border p-5 sm:p-7 ${surfaceClass}`}>
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
                    <BookOpenText size={20} />
                  </div>
                  <h2 className="text-xl font-bold">
                    {isBangla ? "আপনার আর্টিকেল" : "Your articles"}
                  </h2>
                  <p className={`mt-1 text-sm ${mutedTextClass}`}>
                    {isBangla
                      ? `${blogs.length}টি ব্লগ মোট`
                      : `${blogs.length} articles in total`}
                  </p>
                </div>

                <label className="relative block sm:w-60">
                  <Search
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextClass}`}
                    aria-hidden="true"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none ${fieldClass}`}
                    placeholder={isBangla ? "ব্লগ খুঁজুন..." : "Search articles..."}
                  />
                </label>
              </div>

              {loading ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3">
                  <LoaderCircle size={28} className="animate-spin text-amber-300" />
                  <p className={`text-sm ${mutedTextClass}`}>
                    {isBangla ? "ব্লগ লোড হচ্ছে..." : "Loading articles..."}
                  </p>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div
                  className={`flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center ${
                    isDark ? "border-white/10" : "border-slate-200"
                  }`}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
                    <BookOpenText size={24} />
                  </div>
                  <h3 className="font-semibold">
                    {search
                      ? isBangla
                        ? "কোনো ব্লগ পাওয়া যায়নি"
                        : "No matching articles"
                      : isBangla
                        ? "এখনো কোনো ব্লগ নেই"
                        : "No articles yet"}
                  </h3>
                  <p className={`mt-2 max-w-sm text-sm leading-6 ${mutedTextClass}`}>
                    {search
                      ? isBangla
                        ? "অন্য শব্দ দিয়ে খুঁজে দেখুন।"
                        : "Try another search term."
                      : isBangla
                        ? "বাম পাশের ফর্ম থেকে আপনার প্রথম ব্লগ তৈরি করুন।"
                        : "Create your first article with the form on the left."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className={`group flex flex-col gap-4 rounded-2xl border p-4 transition hover:border-amber-300/25 sm:flex-row ${
                        isDark
                          ? "border-white/[0.08] bg-black/10 hover:bg-white/[0.025]"
                          : "border-slate-200 bg-slate-50/70 hover:bg-white"
                      }`}
                    >
                      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-amber-400/10 sm:h-28 sm:w-36">
                        {blog.coverImage ? (
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                            style={{
                              backgroundImage: `url("${blog.coverImage}")`,
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-amber-200/70">
                            <FileImage size={26} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              blog.published
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border-amber-300/20 bg-amber-300/10 text-amber-200"
                            }`}
                          >
                            {blog.published
                              ? isBangla
                                ? "প্রকাশিত"
                                : "Published"
                              : isBangla
                                ? "ড্রাফট"
                                : "Draft"}
                          </span>
                          {blog.category && (
                            <span className={`text-xs ${mutedTextClass}`}>
                              {blog.category}
                            </span>
                          )}
                        </div>
                        <h3 className="line-clamp-1 font-semibold">
                          {blog.title}
                        </h3>
                        <p className={`mt-1 line-clamp-2 text-xs leading-5 ${mutedTextClass}`}>
                          {blog.shortDescription}
                        </p>
                        <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] ${mutedTextClass}`}>
                          <span>{formatDate(blog.publishedAt ?? blog.createdAt)}</span>
                          <span>{blog._count?.likes ?? 0} likes</span>
                          <span className="inline-flex items-center gap-1">
                            <span className="max-w-40 truncate">/{blog.slug}</span>
                            <ArrowUpRight size={12} aria-hidden="true" />
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-end gap-2 sm:flex-col">
                        {blog.published && (
                          <Link
                            href={`/blogs/${blog.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                              isDark
                                ? "border-white/10 text-slate-400 hover:text-white"
                                : "border-slate-200 text-slate-500 hover:text-slate-900"
                            }`}
                            aria-label={`View ${blog.title}`}
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => editBlog(blog)}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                            isDark
                              ? "border-white/10 text-slate-400 hover:border-amber-300/30 hover:text-amber-200"
                              : "border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600"
                          }`}
                          aria-label={`Edit ${blog.title}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(blog)}
                          disabled={deletingId === blog.id}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:opacity-50 ${
                            isDark
                              ? "border-white/10 text-slate-500 hover:border-red-400/30 hover:text-red-300"
                              : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600"
                          }`}
                          aria-label={`Delete ${blog.title}`}
                        >
                          {deletingId === blog.id ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
