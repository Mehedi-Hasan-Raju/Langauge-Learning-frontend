"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isBangla = language === "bn";
  const isLight = theme === "light";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isBangla
              ? "লগইন করা যায়নি। আবার চেষ্টা করুন।"
              : "Login failed. Please try again.")
        );
      }

      if (!data.token) {
        throw new Error(
          isBangla
            ? "Authentication token পাওয়া যায়নি।"
            : "Authentication token was not received."
        );
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBangla
          ? "কিছু ভুল হয়েছে।"
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
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
        {/* Glass Card */}
        <div
          className={`rounded-3xl border backdrop-blur-2xl p-8 sm:p-10 shadow-2xl ${
            isLight
              ? "bg-white/80 border-slate-200"
              : "bg-white/[0.04] border-white/10"
          }`}
        >
          {/* Logo / Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-amber-400 shadow-lg shadow-red-500/20 mb-5">
              <span className="text-2xl font-black text-white">DE</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isBangla ? "আবার স্বাগতম" : "Welcome Back"}
            </h1>

            <p
              className={`mt-2 text-sm ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla
                ? "আপনার GermanLearn account-এ লগইন করুন"
                : "Sign in to your GermanLearn account"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`w-full h-12 rounded-xl border flex items-center justify-center gap-3 font-medium transition-all duration-200 ${
              isLight
                ? "border-slate-300 bg-white hover:bg-slate-50"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
            }`}
          >
            <span className="text-lg font-bold">G</span>

            {isBangla
              ? "Google দিয়ে চালিয়ে যান"
              : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div
              className={`h-px flex-1 ${
                isLight ? "bg-slate-200" : "bg-white/10"
              }`}
            />

            <span
              className={`text-xs ${
                isLight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {isBangla ? "অথবা" : "OR"}
            </span>

            <div
              className={`h-px flex-1 ${
                isLight ? "bg-slate-200" : "bg-white/10"
              }`}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                {isBangla ? "ইমেইল" : "Email Address"}
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isBangla ? "আপনার ইমেইল লিখুন" : "Enter your email"
                }
                className={`w-full h-12 rounded-xl px-4 outline-none border transition-all ${
                  isLight
                    ? "bg-white border-slate-300 focus:border-red-400 text-slate-900"
                    : "bg-white/[0.04] border-white/10 focus:border-red-400/60 text-white placeholder:text-slate-500"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  {isBangla ? "পাসওয়ার্ড" : "Password"}
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  {isBangla ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
                </Link>
              </div>

              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isBangla ? "আপনার পাসওয়ার্ড লিখুন" : "Enter your password"
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
                  ? "লগইন হচ্ছে..."
                  : "Signing in..."
                : isBangla
                ? "লগইন করুন"
                : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <p
            className={`text-center text-sm mt-7 ${
              isLight ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {isBangla ? "নতুন এখানে?" : "Don't have an account?"}{" "}
            <Link
              href="/register"
              className="text-red-400 hover:text-red-300 font-semibold transition"
            >
              {isBangla ? "Register করুন" : "Create account"}
            </Link>
          </p>

          {/* Home */}
          <div className="text-center mt-5">
            <Link
              href="/"
              className={`text-xs transition ${
                isLight
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              ← {isBangla ? "হোমে ফিরে যান" : "Back to home"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}