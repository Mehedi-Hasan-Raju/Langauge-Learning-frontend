"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

interface Level {
  id: string;
  name: string;
  description?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function LearningPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* =========================
     FETCH LEVELS
  ========================= */

  const fetchLevels = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${API_URL}/learning/levels`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch learning levels."
        );
      }

      /*
        Backend response may be:

        {
          success: true,
          levels: [...]
        }

        OR

        {
          success: true,
          data: [...]
        }
      */

      const levelData = result?.levels || result?.data || [];

      setLevels(Array.isArray(levelData) ? levelData : []);
    } catch (err) {
      console.error("Fetch levels error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load learning levels."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  /* =========================
     OPEN CREATE MODAL
  ========================= */

  const openCreateModal = () => {
    setEditingLevel(null);
    setName("");
    setDescription("");
    setOrder("");

    setShowModal(true);
  };

  /* =========================
     OPEN EDIT MODAL
  ========================= */

  const openEditModal = (level: Level) => {
    setEditingLevel(level);

    setName(level.name || "");
    setDescription(level.description || "");
    setOrder(level.order !== undefined ? String(level.order) : "");

    setShowModal(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingLevel(null);
    setName("");
    setDescription("");
    setOrder("");
  };

  /* =========================
     CREATE / UPDATE LEVEL
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert(isBangla ? "Level name দিন।" : "Please enter level name.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        order: order ? Number(order) : 0,
      };

      const url = editingLevel
        ? `${API_URL}/learning/levels/${editingLevel.id}`
        : `${API_URL}/learning/levels`;

      const method = editingLevel ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Failed to ${
              editingLevel ? "update" : "create"
            } level.`
        );
      }

      closeModal();

      await fetchLevels();
    } catch (err) {
      console.error("Save level error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE LEVEL
  ========================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      isBangla
        ? "আপনি কি এই level delete করতে চান?"
        : "Are you sure you want to delete this level?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${API_URL}/learning/levels/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to delete level."
        );
      }

      await fetchLevels();
    } catch (err) {
      console.error("Delete level error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete level."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-[#0B0F19] text-white"
          : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-[270px]">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-8">
            <div
              className={`rounded-3xl border p-6 sm:p-8 ${
                isDark
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className={`mb-2 text-sm font-medium ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {isBangla
                      ? "লার্নিং ম্যানেজমেন্ট"
                      : "Learning Management"}
                  </p>

                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {isBangla
                      ? "Learning Levels"
                      : "Learning Levels"}
                  </h1>

                  <p
                    className={`mt-2 text-sm sm:text-base ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "A1 থেকে B2 পর্যন্ত German learning levels পরিচালনা করুন।"
                      : "Manage German learning levels from A1 to B2."}
                  </p>
                </div>

                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/10 transition hover:scale-[1.02]"
                >
                  <span className="text-lg">+</span>

                  {isBangla ? "নতুন Level" : "Add Level"}
                </button>
              </div>
            </div>
          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div
              className={`mb-6 rounded-2xl border p-5 ${
                isDark
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>

                <div>
                  <p
                    className={`font-semibold ${
                      isDark
                        ? "text-red-400"
                        : "text-red-600"
                    }`}
                  >
                    {isBangla
                      ? "Level load করা যায়নি"
                      : "Failed to load levels"}
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      isDark
                        ? "text-red-300/80"
                        : "text-red-600/80"
                    }`}
                  >
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================
              STATS
          ========================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                {isBangla ? "মোট Level" : "Total Levels"}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {levels.length}
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
                {isBangla ? "Beginner" : "Beginner"}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  levels.filter(
                    (level) =>
                      level.name.toLowerCase() === "a1"
                  ).length
                }
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
                {isBangla ? "Advanced" : "Advanced"}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  levels.filter(
                    (level) =>
                      level.name.toLowerCase() === "b2"
                  ).length
                }
              </p>
            </div>
          </div>

          {/* =========================
              LEVEL TABLE
          ========================= */}

          <div
            className={`overflow-hidden rounded-2xl border ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-5 py-4 ${
                isDark
                  ? "border-white/10"
                  : "border-slate-200"
              }`}
            >
              <div>
                <h2 className="font-semibold">
                  {isBangla
                    ? "সকল Learning Levels"
                    : "All Learning Levels"}
                </h2>

                <p
                  className={`mt-1 text-xs ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {isBangla
                    ? "Level তৈরি, edit এবং delete করুন।"
                    : "Create, edit and delete learning levels."}
                </p>
              </div>

              <button
                onClick={fetchLevels}
                disabled={loading}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  isDark
                    ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                ↻ {isBangla ? "Refresh" : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className={`h-16 animate-pulse rounded-xl ${
                      isDark
                        ? "bg-white/5"
                        : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
            ) : levels.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mb-4 text-4xl">📚</div>

                <h3 className="font-semibold">
                  {isBangla
                    ? "কোনো Level পাওয়া যায়নি"
                    : "No levels found"}
                </h3>

                <p
                  className={`mt-2 text-sm ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {isBangla
                    ? "প্রথম Level তৈরি করুন।"
                    : "Create your first learning level."}
                </p>

                <button
                  onClick={openCreateModal}
                  className="mt-5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  + {isBangla ? "Level তৈরি করুন" : "Create Level"}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr
                      className={`border-b text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? "border-white/10 text-slate-500"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      <th className="px-5 py-4">
                        {isBangla ? "Level" : "Level"}
                      </th>

                      <th className="px-5 py-4">
                        {isBangla
                          ? "Description"
                          : "Description"}
                      </th>

                      <th className="px-5 py-4">
                        {isBangla ? "Order" : "Order"}
                      </th>

                      <th className="px-5 py-4">
                        {isBangla ? "Created" : "Created"}
                      </th>

                      <th className="px-5 py-4 text-right">
                        {isBangla ? "Action" : "Actions"}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {levels.map((level) => (
                      <tr
                        key={level.id}
                        className={`border-b last:border-0 ${
                          isDark
                            ? "border-white/5 hover:bg-white/[0.02]"
                            : "border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${
                                isDark
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {level.name}
                            </div>

                            <div>
                              <p className="font-semibold">
                                {level.name}
                              </p>

                              <p
                                className={`text-xs ${
                                  isDark
                                    ? "text-slate-500"
                                    : "text-slate-400"
                                }`}
                              >
                                German Level
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[350px] px-5 py-4">
                          <p
                            className={`truncate text-sm ${
                              isDark
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            {level.description ||
                              "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                              isDark
                                ? "bg-white/5 text-slate-300"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {level.order ?? 0}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`text-sm ${
                              isDark
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            {level.createdAt
                              ? new Date(
                                  level.createdAt
                                ).toLocaleDateString(
                                  isBangla
                                    ? "bn-BD"
                                    : "en-US"
                                )
                              : "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openEditModal(level)
                              }
                              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                                isDark
                                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              ✏️ {isBangla ? "Edit" : "Edit"}
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(level.id)
                              }
                              disabled={
                                deletingId === level.id
                              }
                              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                                isDark
                                  ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                            >
                              {deletingId === level.id
                                ? "..."
                                : `🗑️ ${
                                    isBangla
                                      ? "Delete"
                                      : "Delete"
                                  }`}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =========================
          CREATE / EDIT MODAL
      ========================= */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? "border-white/10 bg-[#111827]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingLevel
                    ? isBangla
                      ? "Level Edit করুন"
                      : "Edit Level"
                    : isBangla
                    ? "নতুন Level তৈরি করুন"
                    : "Create New Level"}
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {isBangla
                    ? "Learning level-এর তথ্য দিন।"
                    : "Enter learning level information."}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  isDark
                    ? "bg-white/5 text-slate-400 hover:bg-white/10"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {isBangla ? "Level Name" : "Level Name"}
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="A1"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-red-500/50"
                      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-red-400"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {isBangla
                    ? "Description"
                    : "Description"}
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder={
                    isBangla
                      ? "Level সম্পর্কে description লিখুন..."
                      : "Write a short description..."
                  }
                  rows={4}
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-red-500/50"
                      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-red-400"
                  }`}
                />
              </div>

              {/* Order */}
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {isBangla
                    ? "Display Order"
                    : "Display Order"}
                </label>

                <input
                  type="number"
                  min="0"
                  value={order}
                  onChange={(e) =>
                    setOrder(e.target.value)
                  }
                  placeholder="1"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-red-500/50"
                      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-red-400"
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium ${
                    isDark
                      ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {isBangla ? "Cancel" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? isBangla
                      ? "Saving..."
                      : "Saving..."
                    : editingLevel
                    ? isBangla
                      ? "Update Level"
                      : "Update Level"
                    : isBangla
                    ? "Create Level"
                    : "Create Level"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}