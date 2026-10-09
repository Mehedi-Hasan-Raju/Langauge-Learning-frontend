"use client";

import { useState } from "react";

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

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    author?: string;
    levelId: string;
  }) => Promise<void>;
  editingBook: Book | null;
  levels: Level[];
  defaultLevelId: string;
  isBangla: boolean;
  loading: boolean;
}

export default function BookModal({
  isOpen,
  onClose,
  onSubmit,
  editingBook,
  levels,
  defaultLevelId,
  isBangla,
  loading,
}: BookModalProps) {
  const [name, setName] = useState(editingBook?.name ?? "");
  const [author, setAuthor] = useState(editingBook?.author ?? "");
  const [levelId, setLevelId] = useState(
    editingBook?.levelId ?? defaultLevelId
  );

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit({
      name: name.trim(),
      author: author.trim() || undefined,
      levelId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingBook
              ? (isBangla ? "Edit Book" : "Edit Book")
              : (isBangla ? "Add Book" : "Add Book")}
          </h2>
          <button type="button" onClick={onClose} disabled={loading} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            {isBangla ? "Book name" : "Book name"}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            {isBangla ? "Author" : "Author"}
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            {isBangla ? "Level" : "Level"}
            <select
              value={levelId}
              onChange={(event) => setLevelId(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2"
            >
              <option value="" disabled>Select a level</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="rounded-lg px-4 py-2 text-sm text-slate-300">
              {isBangla ? "Cancel" : "Cancel"}
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              {loading ? "Saving..." : editingBook ? "Save changes" : "Create book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
