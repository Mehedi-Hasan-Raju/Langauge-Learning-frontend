"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL = "http://localhost:5000/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { language } = useLanguage();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

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

    const pendingEmail = localStorage.getItem("pendingVerificationEmail");

    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, [searchParams]);

  const handleCodeChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 6);
    setCode(onlyNumbers);
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
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
          ? "৬ সংখ্যার verification code দিন।"
          : "Please enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verifyEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isBangla
              ? "Email verification ব্যর্থ হয়েছে।"
              : "Email verification failed.")
        );
      }

      setSuccess(
        isBangla
          ? "Email সফলভাবে verify হয়েছে! এখন Login করুন।"
          : "Email verified successfully! You can now sign in."
      );

      localStorage.removeItem("pendingVerificationEmail");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
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

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        isBangla
          ? "আগে আপনার email address দিন।"
          : "Please enter your email address first."
      );
      return;
    }

    setResending(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isBangla
              ? "Verification code পাঠানো যায়নি।"
              : "Could not resend verification code.")
        );
      }

      setSuccess(
        isBangla
          ? "নতুন verification code আপনার email-এ পাঠানো হয়েছে।"
          : "A new verification code has been sent to your email."
      );

      setCode("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBangla
          ? "কিছু ভুল হয়েছে।"
          : "Something went wrong."
      );
    } finally {
      setResending(false);
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
        {/* Glass Card */}
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
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isBangla ? "Email Verify করুন" : "Verify Your Email"}
            </h1>

            <p
              className={`mt-3 text-sm leading-6 ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla
                ? "আপনার email address-এ পাঠানো ৬ সংখ্যার code দিয়ে account verify করুন।"
                : "Enter the 6-digit verification code sent to your email address."}
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

          {/* Form */}
          <form onSubmit={handleVerify} className="mt-7 space-y-5">
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

            {/* Verification Code */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium mb-2"
              >
                {isBangla
                  ? "Verification Code"
                  : "Verification Code"}
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

              <p
                className={`text-xs mt-2 ${
                  isLight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {isBangla
                  ? "Code ১০ মিনিটের জন্য valid থাকবে।"
                  : "The verification code is valid for 10 minutes."}
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading
                ? isBangla
                  ? "Verify হচ্ছে..."
                  : "Verifying..."
                : isBangla
                ? "Email Verify করুন"
                : "Verify Email"}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <p
              className={`text-sm ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isBangla
                ? "Code পাননি?"
                : "Didn't receive the code?"}
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-2 text-sm font-semibold text-red-400 hover:text-red-300 transition disabled:opacity-50"
            >
              {resending
                ? isBangla
                  ? "Code পাঠানো হচ্ছে..."
                  : "Sending code..."
                : isBangla
                ? "নতুন Code পাঠান"
                : "Resend Verification Code"}
            </button>
          </div>

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