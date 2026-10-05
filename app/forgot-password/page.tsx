"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isBangla = language === "bn";
  const isLight = theme === "light";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isBangla
              ? "Password reset code পাঠানো যায়নি।"
              : "Could not send password reset code.")
        );
      }

      localStorage.setItem("pendingResetEmail", email.trim());

      setSuccess(
        isBangla
          ? "Password reset code আপনার email-এ পাঠানো হয়েছে।"
          : "A password reset code has been sent to your email."
      );
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
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

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
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isBangla ? "Password ভুলে গেছেন?" : "Forgot Password?"}
            </h1>

            <p
              className={`mt-3 text-sm leading-6 ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla
                ? "আপনার account-এর email দিন। আমরা password reset করার জন্য একটি code পাঠাব।"
                : "Enter your account email and we'll send you a password reset code."}
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
                {isBangla ? "Email Address" : "Email Address"}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading
                ? isBangla
                  ? "Code পাঠানো হচ্ছে..."
                  : "Sending code..."
                : isBangla
                ? "Reset Code পাঠান"
                : "Send Reset Code"}
            </button>
          </form>

          {/* Reset Password */}
          {success && (
            <Link
              href="/reset-password"
              className="block w-full mt-4 h-12 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-semibold flex items-center justify-center hover:bg-red-500/15 transition"
            >
              {isBangla
                ? "Reset Password করতে যান"
                : "Continue to Reset Password"}
            </Link>
          )}

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