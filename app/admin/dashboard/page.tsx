"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import AdminStatCard from "../../../components/admin/AdminStatCard";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

interface DashboardData {
  users: {
    total: number;
    verified: number;
    admins: number;
    normalUsers: number;
  };
  learning: {
    levels: number;
    books: number;
    chapters: number;
  };
  content: {
    blogs: {
      total: number;
      published: number;
    };
    ausbildungen: number;
    services: number;
    members: number;
  };
  subscriptions: {
    active: number;
    expired: number;
    cancelled: number;
  };
  payments: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    refunded: number;
  };
  recentUsers: RecentUser[];
  recentPayments: RecentPayment[];
  recentSubscriptions: RecentSubscription[];
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  userProfile?: {
    currentLevel?: string;
    targetLevel?: string;
    avatar?: string | null;
  } | null;
}

interface RecentPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider?: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string | null;
  createdAt: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  } | null;
}

interface RecentSubscription {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  startDate: string;
  endDate: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  } | null;
}

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isBangla = language === "bn";
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${API_URL}/admin/dashboard`, {
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
            result?.message || "Failed to load dashboard data."
          );
        }

        if (!result.success || !result.data) {
          throw new Error("Invalid dashboard response.");
        }

        setDashboard(result.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      isBangla ? "bn-BD" : "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getStatusClass = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (
      normalizedStatus === "active" ||
      normalizedStatus === "completed" ||
      normalizedStatus === "success" ||
      normalizedStatus === "paid"
    ) {
      return isDark
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-emerald-50 text-emerald-600 border-emerald-200";
    }

    if (
      normalizedStatus === "pending" ||
      normalizedStatus === "processing"
    ) {
      return isDark
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-amber-50 text-amber-600 border-amber-200";
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "failed" ||
      normalizedStatus === "expired"
    ) {
      return isDark
        ? "bg-red-500/10 text-red-400 border-red-500/20"
        : "bg-red-50 text-red-600 border-red-200";
    }

    return isDark
      ? "bg-white/5 text-slate-400 border-white/10"
      : "bg-slate-100 text-slate-600 border-slate-200";
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
          {/* Header */}
          <div className="mb-8">
            <div
              className={`rounded-3xl border p-6 sm:p-8 ${
                isDark
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className={`mb-2 text-sm font-medium ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {isBangla ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {isBangla
                      ? "ড্যাশবোর্ডে স্বাগতম 👋"
                      : "Welcome to your dashboard 👋"}
                  </h1>

                  <p
                    className={`mt-2 max-w-2xl text-sm sm:text-base ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "GermanLearn প্ল্যাটফর্মের সম্পূর্ণ কার্যক্রম এখান থেকে পরিচালনা করুন।"
                      : "Manage and monitor your GermanLearn platform from one place."}
                  </p>
                </div>

                <div
                  className={`hidden h-20 w-20 items-center justify-center rounded-2xl border sm:flex ${
                    isDark
                      ? "border-red-500/20 bg-red-500/10"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <span className="text-4xl">🇩🇪</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className={`h-36 animate-pulse rounded-2xl border ${
                      isDark
                        ? "border-white/10 bg-white/[0.03]"
                        : "border-slate-200 bg-white"
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className={`h-80 animate-pulse rounded-2xl border ${
                      isDark
                        ? "border-white/10 bg-white/[0.03]"
                        : "border-slate-200 bg-white"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              className={`mb-8 rounded-2xl border p-6 ${
                isDark
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">⚠️</div>

                <div>
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {isBangla
                      ? "ড্যাশবোর্ড লোড করা যায়নি"
                      : "Failed to load dashboard"}
                  </h3>

                  <p
                    className={`mt-1 text-sm ${
                      isDark ? "text-red-300/80" : "text-red-600/80"
                    }`}
                  >
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Data */}
          {!loading && !error && dashboard && (
            <>
              {/* Main Stats */}
              <section className="mb-8">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    {isBangla ? "ওভারভিউ" : "Overview"}
                  </h2>

                  <p
                    className={`mt-1 text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {isBangla
                      ? "প্ল্যাটফর্মের বর্তমান পরিসংখ্যান"
                      : "Current platform statistics"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <AdminStatCard
                    title={isBangla ? "মোট ইউজার" : "Total Users"}
                    value={dashboard.users.total}
                    description={
                      isBangla
                        ? `${dashboard.users.verified} জন verified`
                        : `${dashboard.users.verified} verified users`
                    }
                    icon="👥"
                    trend={
                      dashboard.users.total > 0
                        ? `${dashboard.users.verified}/${dashboard.users.total}`
                        : "0"
                    }
                  />

                  <AdminStatCard
                    title={isBangla ? "মোট ব্লগ" : "Total Blogs"}
                    value={dashboard.content.blogs.total}
                    description={
                      isBangla
                        ? `${dashboard.content.blogs.published}টি published`
                        : `${dashboard.content.blogs.published} published`
                    }
                    icon="📝"
                    trend={`${dashboard.content.blogs.published}`}
                  />

                  <AdminStatCard
                    title={isBangla ? "Learning Content" : "Learning Content"}
                    value={
                      dashboard.learning.levels +
                      dashboard.learning.books +
                      dashboard.learning.chapters
                    }
                    description={
                      isBangla
                        ? `${dashboard.learning.levels} Levels • ${dashboard.learning.books} Books • ${dashboard.learning.chapters} Chapters`
                        : `${dashboard.learning.levels} Levels • ${dashboard.learning.books} Books • ${dashboard.learning.chapters} Chapters`
                    }
                    icon="📚"
                    trend={`${dashboard.learning.chapters} chapters`}
                  />

                  <AdminStatCard
                    title={isBangla ? "Active Premium" : "Active Premium"}
                    value={dashboard.subscriptions.active}
                    description={
                      isBangla
                        ? `${dashboard.subscriptions.expired} expired`
                        : `${dashboard.subscriptions.expired} expired`
                    }
                    icon="⭐"
                    trend={`${dashboard.subscriptions.active}`}
                  />
                </div>
              </section>

              {/* Secondary Stats */}
              <section className="mb-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div
                    className={`rounded-2xl border p-5 ${
                      isDark
                        ? "border-white/10 bg-white/[0.03]"
                        : "border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {isBangla ? "Ausbildung" : "Ausbildung"}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {dashboard.content.ausbildungen}
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
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {isBangla ? "Services" : "Services"}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {dashboard.content.services}
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
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {isBangla ? "Members" : "Members"}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {dashboard.content.members}
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
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {isBangla ? "Completed Payments" : "Completed Payments"}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {dashboard.payments.completed}
                    </p>
                  </div>
                </div>
              </section>

              {/* Recent Users + Payments */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Recent Users */}
                <div
                  className={`rounded-2xl border ${
                    isDark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between border-b px-5 py-4 ${
                      isDark ? "border-white/10" : "border-slate-200"
                    }`}
                  >
                    <div>
                      <h2 className="font-semibold">
                        {isBangla ? "সাম্প্রতিক ইউজার" : "Recent Users"}
                      </h2>

                      <p
                        className={`mt-1 text-xs ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {isBangla
                          ? "সর্বশেষ ১০ জন ইউজার"
                          : "Latest 10 registered users"}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg px-3 py-1 text-xs font-medium ${
                        isDark
                          ? "bg-white/5 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {dashboard.users.total}
                    </div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {dashboard.recentUsers?.length > 0 ? (
                      dashboard.recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-3 px-5 py-4 ${
                            isDark
                              ? "hover:bg-white/[0.02]"
                              : "hover:bg-slate-50"
                          } transition`}
                        >
                          {user.userProfile?.avatar ? (
                            <img
                              src={user.userProfile.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                                isDark
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {getInitials(user.name)}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-medium">
                                {user.name}
                              </p>

                              {user.emailVerified && (
                                <span className="text-xs text-emerald-400">
                                  ✓
                                </span>
                              )}
                            </div>

                            <p
                              className={`truncate text-xs ${
                                isDark
                                  ? "text-slate-500"
                                  : "text-slate-400"
                              }`}
                            >
                              {user.email}
                            </p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`rounded-full border px-2 py-1 text-[10px] font-medium uppercase ${getStatusClass(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>

                            <p
                              className={`mt-1 text-[10px] ${
                                isDark
                                  ? "text-slate-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <p
                          className={`text-sm ${
                            isDark ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {isBangla
                            ? "কোনো recent user নেই।"
                            : "No recent users found."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Subscriptions */}
                <div
                  className={`rounded-2xl border ${
                    isDark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between border-b px-5 py-4 ${
                      isDark ? "border-white/10" : "border-slate-200"
                    }`}
                  >
                    <div>
                      <h2 className="font-semibold">
                        {isBangla
                          ? "সাম্প্রতিক সাবস্ক্রিপশন"
                          : "Recent Subscriptions"}
                      </h2>

                      <p
                        className={`mt-1 text-xs ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {isBangla
                          ? "সর্বশেষ premium subscriptions"
                          : "Latest premium subscriptions"}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg px-3 py-1 text-xs font-medium ${
                        isDark
                          ? "bg-white/5 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {dashboard.subscriptions.active}
                    </div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {dashboard.recentSubscriptions?.length > 0 ? (
                      dashboard.recentSubscriptions.map((subscription) => (
                        <div
                          key={subscription.id}
                          className={`flex items-center gap-3 px-5 py-4 ${
                            isDark
                              ? "hover:bg-white/[0.02]"
                              : "hover:bg-slate-50"
                          } transition`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              isDark
                                ? "bg-amber-500/10"
                                : "bg-amber-50"
                            }`}
                          >
                            ⭐
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {subscription.user?.name || "Unknown User"}
                            </p>

                            <p
                              className={`truncate text-xs ${
                                isDark
                                  ? "text-slate-500"
                                  : "text-slate-400"
                              }`}
                            >
                              {subscription.user?.email || "No email"}
                            </p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`rounded-full border px-2 py-1 text-[10px] font-medium uppercase ${getStatusClass(
                                subscription.status
                              )}`}
                            >
                              {subscription.status}
                            </span>

                            <p className="mt-1 text-xs font-semibold">
                              {subscription.amount}{" "}
                              {subscription.currency}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <p
                          className={`text-sm ${
                            isDark ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {isBangla
                            ? "কোনো subscription নেই।"
                            : "No recent subscriptions found."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment Summary */}
              <section className="mt-6">
                <div
                  className={`rounded-2xl border p-5 ${
                    isDark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <div className="mb-5">
                    <h2 className="font-semibold">
                      {isBangla ? "Payment Summary" : "Payment Summary"}
                    </h2>

                    <p
                      className={`mt-1 text-xs ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {isBangla
                        ? "পেমেন্টের বর্তমান অবস্থা"
                        : "Current payment status"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Total
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {dashboard.payments.total}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-emerald-500">Completed</p>
                      <p className="mt-1 text-xl font-bold">
                        {dashboard.payments.completed}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-amber-500">Pending</p>
                      <p className="mt-1 text-xl font-bold">
                        {dashboard.payments.pending}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-red-500">Failed</p>
                      <p className="mt-1 text-xl font-bold">
                        {dashboard.payments.failed}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Refunded
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {dashboard.payments.refunded}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}