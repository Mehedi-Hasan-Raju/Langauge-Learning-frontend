"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

const API_URL = "http://localhost:5000/api";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  emailVerified?: boolean;
  avatar?: string | null;
  profileImage?: string | null;
  image?: string | null;
  photo?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { language } = useLanguage();
  const { theme } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";
  const isBangla = language === "bn";

  // --------------------------------------------------
  // Get current logged-in user
  // --------------------------------------------------

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setUser(null);
          setLoading(false);
          return;
        }

        setUser(data.user);

        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Failed to load user:", error);

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem("user");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [pathname]);

  // --------------------------------------------------
  // Close profile dropdown when clicking outside
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------------------------------
  // Close mobile menu on route change
  // --------------------------------------------------

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingVerificationEmail");
    localStorage.removeItem("pendingResetEmail");

    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);

    router.push("/");
    router.refresh();
  };

  // --------------------------------------------------
  // Dashboard route
  // --------------------------------------------------

  const dashboardPath =
    user?.role?.toUpperCase() === "ADMIN"
      ? "/admin/dashboard"
      : "/dashboard";

  // --------------------------------------------------
  // User initials
  // --------------------------------------------------

  const getInitials = (name?: string) => {
    if (!name) return "U";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // --------------------------------------------------
  // User photo
  // --------------------------------------------------

  const userImage =
    user?.avatar ||
    user?.profileImage ||
    user?.image ||
    user?.photo ||
    null;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-2xl transition-colors duration-300 ${
        isDark
          ? "border-white/10 bg-[#0B0F19]/80"
          : "border-slate-200 bg-white/80"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =========================================
            LOGO
        ========================================= */}

        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/20 via-transparent to-amber-400/20 shadow-lg shadow-red-500/10">
            <span className="text-lg font-black text-red-500">
              D
            </span>

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="hidden sm:block">
            <h1
              className={`text-lg font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Deutsch
              <span className="text-red-500">Journey</span>
            </h1>

            <p
              className={`text-[10px] font-medium tracking-widest uppercase ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Deutsch lernen
            </p>
          </div>
        </Link>

        {/* =========================================
            DESKTOP NAVIGATION
        ========================================= */}

        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink
            href="/"
            label={isBangla ? "হোম" : "Home"}
            pathname={pathname}
            isDark={isDark}
          />

          <NavLink
            href="/#learning-levels"
            label={isBangla ? "লার্নিং" : "Learning"}
            pathname={pathname}
            isDark={isDark}
          />

          <NavLink
            href="/blogs"
            label={isBangla ? "ব্লগ" : "Blogs"}
            pathname={pathname}
            isDark={isDark}
          />

          <NavLink
            href="/#ausbildung"
            label="Ausbildung"
            pathname={pathname}
            isDark={isDark}
          />

          <NavLink
            href="/#services"
            label={isBangla ? "সার্ভিস" : "Services"}
            pathname={pathname}
            isDark={isDark}
          />

          <NavLink
            href="/#members"
            label={isBangla ? "মেম্বার" : "Members"}
            pathname={pathname}
            isDark={isDark}
          />
        </nav>

        {/* =========================================
            RIGHT SIDE
        ========================================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Language Toggle */}

          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          {/* Theme Toggle */}

          <ThemeToggle />

          {/* =======================================
              USER AVATAR
          ======================================= */}

          {!loading && user ? (
            <div
              ref={profileRef}
              className="relative ml-1"
            >
              {/* Avatar Button */}

              <button
                type="button"
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                className={`group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-300 ${
                  profileOpen
                    ? "border-red-500 shadow-lg shadow-red-500/20"
                    : isDark
                    ? "border-white/20 hover:border-red-400"
                    : "border-slate-300 hover:border-red-400"
                }`}
                aria-label="Open profile menu"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={user.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-red-500 to-amber-400 text-sm font-bold text-white`}
                  >
                    {getInitials(user.name)}
                  </div>
                )}

                {/* Online Indicator */}

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0B0F19] bg-emerald-400" />
              </button>

              {/* ===================================
                  PROFILE DROPDOWN
              =================================== */}

              {profileOpen && (
                <div
                  className={`absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl ${
                    isDark
                      ? "border-white/10 bg-[#111827]/95 shadow-black/40"
                      : "border-slate-200 bg-white/95 shadow-slate-300/40"
                  }`}
                >
                  {/* User Information */}

                  <div
                    className={`border-b p-4 ${
                      isDark
                        ? "border-white/10"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-red-500/40">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-500 to-amber-400 font-bold text-white">
                            {getInitials(user.name)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-semibold ${
                            isDark
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          {user.name}
                        </p>

                        <p
                          className={`truncate text-xs ${
                            isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        >
                          {user.email}
                        </p>

                        {/* Role */}

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            user.role?.toUpperCase() ===
                            "ADMIN"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {user.role?.toUpperCase() ===
                          "ADMIN"
                            ? "ADMIN"
                            : "USER"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}

                  <div className="p-2">

                    {/* Dashboard */}

                    <Link
                      href={dashboardPath}
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                        isDark
                          ? "text-slate-200 hover:bg-white/5 hover:text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isDark
                            ? "bg-white/5"
                            : "bg-slate-100"
                        }`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="7"
                            height="7"
                            rx="1"
                          />
                          <rect
                            x="14"
                            y="3"
                            width="7"
                            height="7"
                            rx="1"
                          />
                          <rect
                            x="3"
                            y="14"
                            width="7"
                            height="7"
                            rx="1"
                          />
                          <rect
                            x="14"
                            y="14"
                            width="7"
                            height="7"
                            rx="1"
                          />
                        </svg>
                      </span>

                      <span>
                        {user.role?.toUpperCase() ===
                        "ADMIN"
                          ? isBangla
                            ? "অ্যাডমিন ড্যাশবোর্ড"
                            : "Admin Dashboard"
                          : isBangla
                          ? "ড্যাশবোর্ড"
                          : "Dashboard"}
                      </span>
                    </Link>

                    {/* Divider */}

                    <div
                      className={`my-1 h-px ${
                        isDark
                          ? "bg-white/10"
                          : "bg-slate-200"
                      }`}
                    />

                    {/* Logout */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M10 17l5-5-5-5" />
                          <path d="M15 12H3" />
                          <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                        </svg>
                      </span>

                      <span>
                        {isBangla
                          ? "লগআউট"
                          : "Logout"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =====================================
               GUEST BUTTONS
            ===================================== */

            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isBangla ? "লগইন" : "Login"}
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/10 transition-all hover:scale-[1.02] hover:shadow-red-500/20"
              >
                {isBangla ? "রেজিস্টার" : "Register"}
              </Link>
            </div>
          )}

          {/* =======================================
              MOBILE MENU BUTTON
          ======================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen((prev) => !prev)
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden ${
              isDark
                ? "border-white/10 bg-white/5 text-white"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
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
            )}
          </button>
        </div>
      </div>

      {/* ===========================================
          MOBILE MENU
      =========================================== */}

      {mobileOpen && (
        <div
          className={`border-t lg:hidden ${
            isDark
              ? "border-white/10 bg-[#0B0F19]/95"
              : "border-slate-200 bg-white/95"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            {/* Mobile Navigation */}

            <nav className="flex flex-col gap-1">
              <MobileNavLink
                href="/"
                label={isBangla ? "হোম" : "Home"}
                pathname={pathname}
                isDark={isDark}
                onClick={() => setMobileOpen(false)}
              />

              <MobileNavLink
                href="/#learning-levels"
                label={
                  isBangla
                    ? "লার্নিং"
                    : "Learning"
                }
                pathname={pathname}
                isDark={isDark}
                onClick={() => setMobileOpen(false)}
              />

              <MobileNavLink
                href="/blogs"
                label={isBangla ? "ব্লগ" : "Blogs"}
                pathname={pathname}
                isDark={isDark}
                onClick={() => setMobileOpen(false)}
              />

              <MobileNavLink
                href="/#ausbildung"
                label="Ausbildung"
                pathname={pathname}
                isDark={isDark}
                onClick={() => setMobileOpen(false)}
              />

              <MobileNavLink
                href="/#services"
                label={
                  isBangla
                    ? "সার্ভিস"
                    : "Services"
                }
                pathname={pathname}
                isDark={isDark}
                onClick={() => setMobileOpen(false)}
              />

              <MobileNavLink
                href="/#members"
                label={
                  isBangla
                    ? "মেম্বার"
                    : "Members"
                }
                pathname={pathname}
                isDark={isDark}
                onClick={() => setMobileOpen(false)}
              />
            </nav>

            {/* Mobile Controls */}

            <div
              className={`mt-4 flex items-center justify-between border-t pt-4 ${
                isDark
                  ? "border-white/10"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {isBangla ? "ভাষা" : "Language"}
                </span>

                <LanguageToggle />
              </div>

              {!user && !loading && (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`rounded-xl px-3 py-2 text-sm font-medium ${
                      isDark
                        ? "text-slate-300"
                        : "text-slate-700"
                    }`}
                  >
                    {isBangla
                      ? "লগইন"
                      : "Login"}
                  </Link>

                  <Link
                    href="/register"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl bg-gradient-to-r from-red-500 to-amber-400 px-3 py-2 text-sm font-semibold text-white"
                  >
                    {isBangla
                      ? "রেজিস্টার"
                      : "Register"}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Logged-in User */}

            {user && !loading && (
              <div
                className={`mt-4 rounded-2xl border p-3 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-500 to-amber-400 text-sm font-bold text-white">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {user.name}
                    </p>

                    <p
                      className={`truncate text-xs ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href={dashboardPath}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl bg-red-500/10 px-3 py-2.5 text-center text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    {user.role?.toUpperCase() ===
                    "ADMIN"
                      ? isBangla
                        ? "অ্যাডমিন"
                        : "Admin"
                      : isBangla
                      ? "ড্যাশবোর্ড"
                      : "Dashboard"}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
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
      )}
    </header>
  );
}

/* =====================================================
   DESKTOP NAV LINK
===================================================== */

function NavLink({
  href,
  label,
  pathname,
  isDark,
}: {
  href: string;
  label: string;
  pathname: string;
  isDark: boolean;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href.split("#")[0]);

  return (
    <Link
      href={href}
      className={`relative py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-red-400"
          : isDark
          ? "text-slate-300 hover:text-white"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}

      {isActive && (
        <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
      )}
    </Link>
  );
}

/* =====================================================
   MOBILE NAV LINK
===================================================== */

function MobileNavLink({
  href,
  label,
  pathname,
  isDark,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  isDark: boolean;
  onClick: () => void;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href.split("#")[0]);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
        isActive
          ? "bg-red-500/10 text-red-400"
          : isDark
          ? "text-slate-300 hover:bg-white/5 hover:text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}