"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar";

import LevelManagement from "../../../components/admin/learning/LevelManagement";
import BookManagement from "../../../components/admin/learning/BookManagement";
import ChapterManagement from "../../../components/admin/learning/ChapterManagement";

const API_URL = "http://localhost:5000/api";

interface Level {
  id: string;
  name: string;
  order: number;
  _count?: {
    books: number;
  };
}

interface Book {
  id: string;
  name: string;
  author?: string | null;
  levelId: string;
  level?: {
    id: string;
    name: string;
  };
  _count?: {
    chapters: number;
  };
}

export default function LearningPage() {
  const [token, setToken] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [levels, setLevels] = useState<Level[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [selectedLevelId, setSelectedLevelId] =
    useState("");

  const [selectedBookId, setSelectedBookId] =
    useState("");

  const [loading, setLoading] = useState(true);

  /*
   * Get token from localStorage
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  /*
   * Fetch all levels
   */
  const fetchLevels = async () => {
    try {
      const response = await fetch(
        `${API_URL}/learning/levels`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch levels"
        );
      }

      const fetchedLevels: Level[] =
        data.levels || [];

      setLevels(fetchedLevels);

      /*
       * Keep selected level valid after
       * create/update/delete.
       */
      setSelectedLevelId((currentId) => {
        if (
          currentId &&
          fetchedLevels.some(
            (level) => level.id === currentId
          )
        ) {
          return currentId;
        }

        return fetchedLevels[0]?.id || "";
      });
    } catch (error) {
      console.error(
        "Fetch levels error:",
        error
      );

      setLevels([]);
      setSelectedLevelId("");
    }
  };

  /*
   * Fetch books by selected level
   */
  const fetchBooks = async (
    levelId: string
  ) => {
    if (!levelId) {
      setBooks([]);
      setSelectedBookId("");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/learning/books/level/${levelId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch books"
        );
      }

      const fetchedBooks: Book[] =
        data.books || [];

      setBooks(fetchedBooks);

      /*
       * Keep selected book valid after
       * create/update/delete.
       */
      setSelectedBookId((currentId) => {
        if (
          currentId &&
          fetchedBooks.some(
            (book) => book.id === currentId
          )
        ) {
          return currentId;
        }

        return fetchedBooks[0]?.id || "";
      });
    } catch (error) {
      console.error(
        "Fetch books error:",
        error
      );

      setBooks([]);
      setSelectedBookId("");
    }
  };

  /*
   * Initial data
   */
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setLoading(true);

      await fetchLevels();

      setLoading(false);
    };

    loadData();
  }, [token]);

  /*
   * Fetch books whenever selected level changes
   */
  useEffect(() => {
    if (!selectedLevelId) {
      setBooks([]);
      setSelectedBookId("");
      return;
    }

    fetchBooks(selectedLevelId);
  }, [selectedLevelId]);

  /*
   * Called after Book CRUD
   */
  const handleBooksChange = async () => {
    if (!selectedLevelId) return;

    await fetchBooks(selectedLevelId);
  };

  /*
   * Chapter CRUD is handled internally
   * by ChapterManagement.
   */
  const handleChaptersChange = () => {
    // Reserved for future use.
  };

  /*
   * Loading state
   */
  if (!token || loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19]">
        <AdminSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="lg:pl-[270px]">
          <AdminTopbar onMenuClick={() => setMobileOpen(true)} />

          <main className="flex min-h-[calc(100vh-72px)] items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-rose-500" />

              <p className="text-sm text-slate-400">
                Loading learning management...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      {/* Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-[270px]">
        {/* Topbar */}
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Learning Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage levels, books, chapters and
              learning content.
            </p>
          </div>

          {/* =========================
              LEVEL MANAGEMENT
          ========================== */}
          <LevelManagement
            token={token}
          />

          {/* =========================
              BOOK MANAGEMENT
          ========================== */}
          <BookManagement
            token={token}
            levels={levels}
            selectedLevelId={selectedLevelId}
            onBooksChange={handleBooksChange}
          />

          {/* =========================
              CHAPTER MANAGEMENT
          ========================== */}
          <ChapterManagement
            token={token}
            levels={levels}
            books={books}
            selectedBookId={selectedBookId}
            onChaptersChange={
              handleChaptersChange
            }
          />
        </main>
      </div>
    </div>
  );
}