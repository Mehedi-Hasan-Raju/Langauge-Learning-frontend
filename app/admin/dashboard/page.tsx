"use client";

import { useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import AdminStatCard from "../../../components/admin/AdminStatCard";

import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

export default function AdminDashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const { language } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isBangla = language === "bn";

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-[#080C14]"
          : "bg-slate-50"
      }`}
    >
      {/* Sidebar */}

      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main */}

      <div className="lg:pl-[270px]">
        <AdminTopbar
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">

            {/* Welcome */}

            <div className="mb-8">
              <div
                className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
                  isDark
                    ? "border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-red-500/[0.04]"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Background Glow */}

                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-red-500/10 blur-3xl" />

                <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

                <div className="relative">
                  <p className="text-sm font-medium text-red-400">
                    {isBangla
                      ? "স্বাগতম 👋"
                      : "Welcome back 👋"}
                  </p>

                  <h1
                    className={`mt-2 text-2xl font-bold sm:text-3xl ${
                      isDark
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {isBangla
                      ? "আপনার প্ল্যাটফর্ম পরিচালনা করুন"
                      : "Manage your GermanLearn platform"}
                  </h1>

                  <p
                    className={`mt-2 max-w-2xl text-sm leading-6 ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "ইউজার, লার্নিং কনটেন্ট, ব্লগ এবং অন্যান্য প্ল্যাটফর্ম কনটেন্ট এখান থেকে পরিচালনা করুন।"
                      : "Manage users, learning content, blogs, subscriptions and other platform content from one place."}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}

            <section>
              <div className="mb-4">
                <h2
                  className={`text-lg font-bold ${
                    isDark
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  {isBangla
                    ? "ওভারভিউ"
                    : "Overview"}
                </h2>

                <p
                  className={`mt-1 text-xs ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {isBangla
                    ? "আপনার প্ল্যাটফর্মের বর্তমান অবস্থা"
                    : "Current platform statistics"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard
                  title={
                    isBangla
                      ? "মোট ইউজার"
                      : "Total Users"
                  }
                  value="0"
                  description={
                    isBangla
                      ? "বর্তমান ইউজার"
                      : "Registered users"
                  }
                  icon="👥"
                  trend="+0%"
                />

                <AdminStatCard
                  title={
                    isBangla
                      ? "মোট ব্লগ"
                      : "Total Blogs"
                  }
                  value="0"
                  description={
                    isBangla
                      ? "প্রকাশিত ও ড্রাফট"
                      : "Published & drafts"
                  }
                  icon="📝"
                  trend="+0%"
                />

                <AdminStatCard
                  title={
                    isBangla
                      ? "লার্নিং কনটেন্ট"
                      : "Learning Content"
                  }
                  value="0"
                  description={
                    isBangla
                      ? "মোট কনটেন্ট"
                      : "Total content"
                  }
                  icon="📚"
                  trend="+0%"
                />

                <AdminStatCard
                  title={
                    isBangla
                      ? "প্রিমিয়াম ইউজার"
                      : "Premium Users"
                  }
                  value="0"
                  description={
                    isBangla
                      ? "অ্যাক্টিভ সাবস্ক্রিপশন"
                      : "Active subscriptions"
                  }
                  icon="💎"
                  trend="+0%"
                />
              </div>
            </section>

            {/* Bottom Cards */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              {/* Recent Users */}

              <section
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className={`font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {isBangla
                        ? "সাম্প্রতিক ইউজার"
                        : "Recent Users"}
                    </h2>

                    <p
                      className={`mt-1 text-xs ${
                        isDark
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {isBangla
                        ? "নতুন রেজিস্টার করা ইউজার"
                        : "Recently registered users"}
                    </p>
                  </div>

                  <span className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
                    {isBangla
                      ? "সব দেখুন"
                      : "View All"}
                  </span>
                </div>

                <div
                  className={`mt-6 flex min-h-[180px] items-center justify-center rounded-xl border border-dashed ${
                    isDark
                      ? "border-white/10"
                      : "border-slate-200"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl">👥</div>

                    <p
                      className={`mt-2 text-sm ${
                        isDark
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {isBangla
                        ? "API কানেক্ট হলে এখানে ইউজার দেখাবে"
                        : "Users will appear here after API integration"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Recent Blogs */}

              <section
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className={`font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {isBangla
                        ? "সাম্প্রতিক ব্লগ"
                        : "Recent Blogs"}
                    </h2>

                    <p
                      className={`mt-1 text-xs ${
                        isDark
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {isBangla
                        ? "সাম্প্রতিক প্রকাশিত ব্লগ"
                        : "Recently published blogs"}
                    </p>
                  </div>

                  <span className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
                    {isBangla
                      ? "সব দেখুন"
                      : "View All"}
                  </span>
                </div>

                <div
                  className={`mt-6 flex min-h-[180px] items-center justify-center rounded-xl border border-dashed ${
                    isDark
                      ? "border-white/10"
                      : "border-slate-200"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl">📝</div>

                    <p
                      className={`mt-2 text-sm ${
                        isDark
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {isBangla
                        ? "API কানেক্ট হলে এখানে ব্লগ দেখাবে"
                        : "Blogs will appear here after API integration"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}