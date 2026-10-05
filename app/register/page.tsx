"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors?.length) {
          throw new Error(
            data.errors
              .map(
                (item: { field?: string; message?: string }) =>
                  item.message || "Validation error"
              )
              .join(", ")
          );
        }

        throw new Error(
          data.message ||
            (isBangla
              ? "Registration ব্যর্থ হয়েছে।"
              : "Registration failed.")
        );
      }

      setSuccess(
        isBangla
          ? "Registration সফল হয়েছে! আপনার email verify করুন।"
          : "Registration successful! Please verify your email."
      );

      localStorage.setItem("pendingVerificationEmail", email);

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 1000);

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
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div
          className={`rounded-3xl border backdrop-blur-2xl p-8 sm:p-10 shadow-2xl ${
            isLight
              ? "bg-white/80 border-slate-200"
              : "bg-white/[0.04] border-white/10"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-amber-400 shadow-lg shadow-red-500/20 mb-5">
              <span className="text-2xl font-black text-white">DE</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isBangla ? "Account তৈরি করুন" : "Create Account"}
            </h1>

            <p
              className={`mt-2 text-sm ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla
                ? "GermanLearn-এর সাথে German শেখা শুরু করুন"
                : "Start your German learning journey with GermanLearn"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
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
              ? "Google দিয়ে শুরু করুন"
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
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
              >
                {isBangla ? "নাম" : "Full Name"}
              </label>

              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  isBangla ? "আপনার নাম লিখুন" : "Enter your full name"
                }
                className={`w-full h-12 rounded-xl px-4 outline-none border transition-all ${
                  isLight
                    ? "bg-white border-slate-300 focus:border-red-400 text-slate-900"
                    : "bg-white/[0.04] border-white/10 focus:border-red-400/60 text-white placeholder:text-slate-500"
                }`}
              />
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                {isBangla ? "পাসওয়ার্ড" : "Password"}
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isBangla ? "একটি শক্তিশালী পাসওয়ার্ড দিন" : "Create a password"
                }
                className={`w-full h-12 rounded-xl px-4 outline-none border transition-all ${
                  isLight
                    ? "bg-white border-slate-300 focus:border-red-400 text-slate-900"
                    : "bg-white/[0.04] border-white/10 focus:border-red-400/60 text-white placeholder:text-slate-500"
                }`}
              />

              <p
                className={`mt-2 text-xs ${
                  isLight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {isBangla
                  ? "কমপক্ষে ৬ characters ব্যবহার করুন।"
                  : "Use at least 6 characters."}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading
                ? isBangla
                  ? "Account তৈরি হচ্ছে..."
                  : "Creating account..."
                : isBangla
                ? "Register করুন"
                : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p
            className={`text-center text-sm mt-7 ${
              isLight ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {isBangla ? "আগেই account আছে?" : "Already have an account?"}{" "}
            <Link
              href="/login"
              className="text-red-400 hover:text-red-300 font-semibold transition"
            >
              {isBangla ? "Login করুন" : "Sign in"}
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