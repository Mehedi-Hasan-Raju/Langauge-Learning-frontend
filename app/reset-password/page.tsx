"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { language } = useLanguage();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isBangla = language === "bn";
  const isLight = theme === "light";

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
      return;
    }

    const pendingEmail = localStorage.getItem("pendingResetEmail");

    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, [searchParams]);

  const handleCodeChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 6);
    setCode(onlyNumbers);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        isBangla
          ? "আপনার email address দিন।"
          : "Please enter your email address."
      );
      return;
    }

    if (code.length !== 6) {
      setError(
        isBangla
          ? "৬ সংখ্যার reset code দিন।"
          : "Please enter the 6-digit reset code."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        isBangla
          ? "Password কমপক্ষে ৬ characters হতে হবে।"
          : "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        isBangla
          ? "দুইটি password একই নয়।"
          : "The passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          code,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isBangla
              ? "Password reset করা যায়নি।"
              : "Password reset failed.")
        );
      }

      setSuccess(
        isBangla
          ? "Password সফলভাবে পরিবর্তন হয়েছে! Login page-এ নেওয়া হচ্ছে..."
          : "Password reset successfully! Redirecting to login..."
      );

      localStorage.removeItem("pendingResetEmail");

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBangla
          ? "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।"
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden transition-colors duration-300 ${
        isLight
          ? "bg-slate-100 text-slate-900"
          : "bg-[#0B0F19] text-white"
      }`}
    >
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div
          className={`rounded-3xl border backdrop-blur-2xl p-8 sm:p-10 shadow-2xl ${
            isLight
              ? "bg-white/80 border-slate-200"
              : "bg-white/[0.04] border-white/10"
          }`}
        >
          {/* Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-amber-400 shadow-lg shadow-red-500/20 mb-6">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isBangla ? "নতুন Password সেট করুন" : "Reset Password"}
            </h1>

            <p
              className={`mt-3 text-sm leading-6 ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla
                ? "আপনার email-এ পাঠানো ৬ সংখ্যার code ব্যবহার করে নতুন password সেট করুন।"
                : "Use the 6-digit code sent to your email to create a new password."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full h-12 rounded-xl px-4 outline-none border transition-all ${
                  isLight
                    ? "bg-white border-slate-300 focus:border-red-400 text-slate-900"
                    : "bg-white/[0.04] border-white/10 focus:border-red-400/60 text-white placeholder:text-slate-500"
                }`}
              />
            </div>

            {/* Code */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium mb-2"
              >
                {isBangla ? "Reset Code" : "Reset Code"}
              </label>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="000000"
                className={`w-full h-14 rounded-xl px-4 text-center text-2xl tracking-[0.5em] font-semibold outline-none border transition-all ${
                  isLight
                    ? "bg-white border-slate-300 focus:border-red-400 text-slate-900"
                    : "bg-white/[0.04] border-white/10 focus:border-red-400/60 text-white placeholder:text-slate-600"
                }`}
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-2"
              >
                {isBangla ? "নতুন Password" : "New Password"}
              </label>

              <input
                id="newPassword"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={
                  isBangla
                    ? "নতুন password লিখুন"
                    : "Enter your new password"
                }
                className={`w-full h-12 rounded-xl px-4 outline-none border transition-all ${
                  isLight
                    ? "bg-white border-slate-300 focus:border-red-400 text-slate-900"
                    : "bg-white/[0.04] border-white/10 focus:border-red-400/60 text-white placeholder:text-slate-500"
                }`}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                {isBangla
                  ? "Password আবার লিখুন"
                  : "Confirm Password"}
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={
                  isBangla
                    ? "Password আবার লিখুন"
                    : "Confirm your new password"
                }
                className={`w-full h-12 rounded-xl px-4 outline-none border transition-all ${
                  isLight
                    ? "bg-white border-slate-300 focus:border-red-400 text-slate-900"
                    : "bg-white/[0.04] border-white/10 focus:border-red-400/60 text-white placeholder:text-slate-500"
                }`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading
                ? isBangla
                  ? "Password পরিবর্তন হচ্ছে..."
                  : "Resetting password..."
                : isBangla
                ? "Password Reset করুন"
                : "Reset Password"}
            </button>
          </form>

          {/* Login */}
          <div className="text-center mt-7">
            <Link
              href="/login"
              className={`text-sm transition ${
                isLight
                  ? "text-slate-500 hover:text-slate-800"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ← {isBangla ? "Login-এ ফিরে যান" : "Back to Login"}
            </Link>
          </div>

          {/* Home */}
          <div className="text-center mt-4">
            <Link
              href="/"
              className={`text-xs transition ${
                isLight
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {isBangla ? "হোমে ফিরে যান" : "Back to home"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}