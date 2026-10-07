"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

interface Level {
  id: string;
  name: string;
  order: number;
  _count?: {
    books: number;
  };
}

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; order: number }) => Promise<void>;
  editingLevel: Level | null;
  isBangla: boolean;
  loading: boolean;
}

export default function LevelModal({
  isOpen,
  onClose,
  onSubmit,
  editingLevel,
  isBangla,
  loading,
}: LevelModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [order, setOrder] = useState("");

  useEffect(() => {
    if (editingLevel) {
      setName(editingLevel.name);
      setOrder(String(editingLevel.order));
    } else {
      setName("");
      setOrder("");
    }
  }, [editingLevel, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert(
        isBangla
          ? "Level name দিন"
          : "Please enter level name"
      );
      return;
    }

    if (!order || Number(order) <= 0) {
      alert(
        isBangla
          ? "Valid order দিন"
          : "Please enter a valid order"
      );
      return;
    }

    await onSubmit({
      name: name.trim(),
      order: Number(order),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          isDark
            ? "border-white/10 bg-[#111827]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {editingLevel
                ? isBangla
                  ? "Level Edit করুন"
                  : "Edit Level"
                : isBangla
                ? "নতুন Level"
                : "Create Level"}
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {editingLevel
                ? isBangla
                  ? "Level-এর তথ্য পরিবর্তন করুন"
                  : "Update level information"
                : isBangla
                ? "নতুন learning level তৈরি করুন"
                : "Create a new learning level"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
              isDark
                ? "bg-white/5 text-slate-300 hover:bg-white/10"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              onChange={(e) => setName(e.target.value)}
              placeholder="A1"
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                isDark
                  ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-rose-500/50"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-rose-400"
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
              {isBangla ? "ক্রম (Order)" : "Order"}
            </label>

            <input
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="1"
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                isDark
                  ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-rose-500/50"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-rose-400"
              }`}
            />

            <p
              className={`mt-2 text-xs ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {isBangla
                ? "যেমন: A1 = 1, A2 = 2, B1 = 3"
                : "Example: A1 = 1, A2 = 2, B1 = 3"}
            </p>
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
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? isBangla
                  ? "Saving..."
                  : "Saving..."
                : editingLevel
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