"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

import LevelModal from "./LevelModal";

const API_URL = "http://localhost:5000/api";

interface Level {
  id: string;
  name: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    books: number;
  };
}

interface LevelManagementProps {
  token: string;
}

export default function LevelManagement({
  token,
}: LevelManagementProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] =
    useState<Level | null>(null);

  const fetchLevels = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/learning/levels`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch levels"
        );
      }

      setLevels(data.levels || []);
    } catch (error) {
      console.error("Fetch levels error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to fetch levels"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const totalBooks = useMemo(() => {
    return levels.reduce(
      (total, level) =>
        total + (level._count?.books ?? 0),
      0
    );
  }, [levels]);

  const openCreateModal = () => {
    setEditingLevel(null);
    setModalOpen(true);
  };

  const openEditModal = (level: Level) => {
    setEditingLevel(level);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setEditingLevel(null);
  };

  const handleSubmit = async (data: {
    name: string;
    order: number;
  }) => {
    try {
      setActionLoading(true);

      const url = editingLevel
        ? `${API_URL}/learning/levels/${editingLevel.id}`
        : `${API_URL}/learning/levels`;

      const method = editingLevel ? "PATCH" : "POST";

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
              editingLevel ? "update" : "create"
            } level`
        );
      }

      setModalOpen(false);
      setEditingLevel(null);

      await fetchLevels();
    } catch (error) {
      console.error("Level save error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (level: Level) => {
    const confirmed = window.confirm(
      isBangla
        ? `"${level.name}" Level delete করতে চান?`
        : `Are you sure you want to delete "${level.name}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_URL}/learning/levels/${level.id}`,
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
          result.message || "Failed to delete level"
        );
      }

      await fetchLevels();
    } catch (error) {
      console.error("Delete level error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete level"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <section className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isBangla
                ? "Learning Levels"
                : "Learning Levels"}
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {isBangla
                ? "A1 থেকে B2 পর্যন্ত language levels manage করুন"
                : "Manage language levels from A1 to B2"}
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/10 transition hover:scale-[1.02] hover:opacity-95"
          >
            <span className="text-lg">+</span>

            {isBangla
              ? "Add Level"
              : "Add Level"}
          </button>
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
                ? "মোট Levels"
                : "Total Levels"}
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
              {isBangla
                ? "মোট Books"
                : "Total Books"}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalBooks}
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
            <table className="w-full min-w-[650px] text-left">
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
                    {isBangla
                      ? "Level"
                      : "Level"}
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "Order"
                      : "Order"}
                  </th>

                  <th
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "Books"
                      : "Books"}
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
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
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
                ) : levels.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={`px-6 py-12 text-center text-sm ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {isBangla
                        ? "কোনো Level পাওয়া যায়নি"
                        : "No levels found"}
                    </td>
                  </tr>
                ) : (
                  levels.map((level, index) => (
                    <tr
                      key={level.id}
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
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                              isDark
                                ? "bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-300"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {level.name}
                          </div>

                          <span className="font-semibold">
                            {level.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                            isDark
                              ? "bg-white/5 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {level.order}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">
                          {level._count?.books ?? 0}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditModal(level)
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
                              handleDelete(level)
                            }
                            disabled={actionLoading}
                            className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/20"
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

      <LevelModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingLevel={editingLevel}
        isBangla={isBangla}
        loading={actionLoading}
      />
    </>
  );
}