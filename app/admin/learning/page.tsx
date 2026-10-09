"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar";

import LevelManagement from "../../../components/admin/learning/LevelManagement";
import BookManagement from "../../../components/admin/learning/BookManagement";
import ChapterManagement from "../../../components/admin/learning/ChapterManagement";
import VocabularyManagement from "../../../components/admin/learning/VocabularyManagement";

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

  /*
   * Global selected learning structure
   *
   * Level
   *   ↓
   * Book
   *   ↓
   * Chapter
   */
  const [selectedLevelId, setSelectedLevelId] =
    useState("");

  const [selectedBookId, setSelectedBookId] =
    useState("");

  const [selectedChapterId, setSelectedChapterId] =
    useState("");

  const [loading, setLoading] = useState(true);

  /*
   * ==========================================
   * GET TOKEN
   * ==========================================
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
   * ==========================================
   * FETCH LEVELS
   * ==========================================
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
       * Keep currently selected level if
       * it still exists.
       *
       * Otherwise select the first level.
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
      setBooks([]);
      setSelectedBookId("");
      setSelectedChapterId("");
    }
  };

  /*
   * ==========================================
   * FETCH BOOKS BY LEVEL
   * ==========================================
   */
  const fetchBooks = async (
    levelId: string
  ) => {
    if (!levelId) {
      setBooks([]);
      setSelectedBookId("");
      setSelectedChapterId("");
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
       * Keep selected book if it belongs
       * to the currently selected level.
       *
       * Otherwise automatically select
       * the first available book.
       */
      setSelectedBookId((currentBookId) => {
        const currentBookStillExists =
          currentBookId &&
          fetchedBooks.some(
            (book) => book.id === currentBookId
          );

        if (currentBookStillExists) {
          return currentBookId;
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
      setSelectedChapterId("");
    }
  };

  /*
   * ==========================================
   * INITIAL LOAD
   * ==========================================
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
   * ==========================================
   * LEVEL CHANGE
   * ==========================================
   *
   * When Level changes:
   *
   * Level
   *   ↓
   * Fetch Books
   *   ↓
   * Select first valid Book
   *   ↓
   * Chapter/Vocabulary automatically
   * use that Book
   */
  useEffect(() => {
    if (!selectedLevelId) {
      setBooks([]);
      setSelectedBookId("");
      setSelectedChapterId("");
      return;
    }

    fetchBooks(selectedLevelId);
  }, [selectedLevelId]);

  /*
   * ==========================================
   * BOOK CHANGE
   * ==========================================
   *
   * When Book changes, previous Chapter
   * selection must be cleared.
   *
   * ChapterManagement will then load
   * chapters for the new Book.
   */
  const handleSelectedBookChange = (
    bookId: string
  ) => {
    setSelectedBookId(bookId);

    setSelectedChapterId("");
  };

  /*
   * ==========================================
   * BOOK CRUD CHANGE
   * ==========================================
   */
  const handleBooksChange = async () => {
    if (!selectedLevelId) {
      return;
    }

    await fetchBooks(selectedLevelId);
  };

  /*
   * ==========================================
   * CHAPTER CRUD CHANGE
   * ==========================================
   *
   * ChapterManagement handles its own
   * data refresh.
   *
   * Kept here for future functionality.
   */
  const handleChaptersChange = () => {
    // Reserved for future use.
  };

  /*
   * ==========================================
   * LOADING SCREEN
   * ==========================================
   */
  if (!token || loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19]">
        <AdminSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="lg:pl-[270px]">
          <AdminTopbar
            onMenuClick={() =>
              setMobileOpen(true)
            }
          />

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

  /*
   * ==========================================
   * MAIN PAGE
   * ==========================================
   */
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      {/* ======================================
          ADMIN SIDEBAR
      ======================================= */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ======================================
          MAIN CONTENT
      ======================================= */}
      <div className="lg:pl-[270px]">
        {/* ====================================
            TOPBAR
        ===================================== */}
        <AdminTopbar
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* ==================================
              PAGE HEADER
          =================================== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Learning Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage levels, books, chapters and
              learning content.
            </p>
          </div>

          {/* ==================================
              LEVEL MANAGEMENT
          =================================== */}
          <LevelManagement token={token} />

          
          <BookManagement
            token={token}
            levels={levels}
            selectedLevelId={selectedLevelId}
            onSelectedLevelChange={
              setSelectedLevelId
            }
            onBooksChange={handleBooksChange}
          />

     
          
          <ChapterManagement
            token={token}
            levels={levels}
            books={books}
            selectedBookId={selectedBookId}
            onSelectedBookChange={
              handleSelectedBookChange
            }
            onSelectedChapterChange={
              setSelectedChapterId
            }
            onChaptersChange={
              handleChaptersChange
            }
          />

          {/* ==================================
              VOCABULARY MANAGEMENT
              
              NO BOOK DROPDOWN HERE.
              It receives selectedBookId
              from parent.
          =================================== */}
          <VocabularyManagement
            token={token}
            levels={levels}
            books={books}
            selectedBookId={selectedBookId}
            selectedChapterId={
              selectedChapterId
            }
            onSelectedBookChange={
              handleSelectedBookChange
            }
            onSelectedChapterChange={
              setSelectedChapterId
            }
          />
        </main>
      </div>
    </div>
  );
    }