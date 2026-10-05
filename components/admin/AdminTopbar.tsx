"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

import LanguageToggle from "../LanguageToggle";
import ThemeToggle from "../ThemeToggle";

type User = {
  name: string;
  email: string;
  role?: string;
  avatar?: string | null;
  profileImage?: string | null;
  image?: string | null;
  photo?: string | null;
};

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export default function AdminTopbar({
  onMenuClick,
}: AdminTopbarProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const isDark = theme === "dark";
  const isBangla = language === "bn";

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingVerificationEmail");
    localStorage.removeItem("pendingResetEmail");

    router.push("/");
    router.refresh();
  };

  const getInitials = (name?: string) => {
    if (!name) return "A";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const userImage =
    user?.avatar ||
    user?.profileImage ||
    user?.image ||
    user?.photo ||
    null;

  return (
    <header
      className={`sticky top-0 z-30 h-20 border-b backdrop-blur-2xl ${
        isDark
          ? "border-white/10 bg-[#0B0F19]/80"
          : "border-slate-200 bg-white/80"
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}

        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden ${
              isDark
                ? "border-white/10 bg-white/5 text-white"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>

          <div>
            <h2
              className={`text-lg font-bold sm:text-xl ${
                isDark
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              {isBangla
                ? "অ্যাডমিন ড্যাশবোর্ড"
                : "Admin Dashboard"}
            </h2>

            <p
              className={`hidden text-xs sm:block ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {isBangla
                ? "আপনার প্ল্যাটফর্ম পরিচালনা করুন"
                : "Manage your learning platform"}
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-2 sm:gap-3">

          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          <ThemeToggle />

          {/* Profile */}

          <div className="relative ml-1">
            <button
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
              className={`flex items-center gap-2 rounded-xl border p-1.5 pr-2.5 transition ${
                isDark
                  ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="h-8 w-8 overflow-hidden rounded-lg">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={user?.name || "Admin"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-500 to-amber-400 text-xs font-bold text-white">
                    {getInitials(user?.name)}
                  </div>
                )}
              </div>

              <div className="hidden text-left md:block">
                <p
                  className={`max-w-[130px] truncate text-xs font-semibold ${
                    isDark
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  {user?.name || "Administrator"}
                </p>

                <p className="text-[10px] text-red-400">
                  ADMIN
                </p>
              </div>

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {profileOpen && (
              <div
                className={`absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border shadow-2xl ${
                  isDark
                    ? "border-white/10 bg-[#111827]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="p-4">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isDark
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {user?.name}
                  </p>

                  <p
                    className={`truncate text-xs ${
                      isDark
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    {user?.email}
                  </p>
                </div>

                <div
                  className={`border-t p-2 ${
                    isDark
                      ? "border-white/10"
                      : "border-slate-200"
                  }`}
                >
                  <Link
                    href="/"
                    className={`block rounded-xl px-3 py-2.5 text-sm ${
                      isDark
                        ? "text-slate-300 hover:bg-white/5"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {isBangla
                      ? "ওয়েবসাইট দেখুন"
                      : "View Website"}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
                  >
                    {isBangla
                      ? "লগআউট"
                      : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
