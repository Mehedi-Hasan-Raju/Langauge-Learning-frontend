"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

export default function GoogleCallbackPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const hash = window.location.hash;

        const params = new URLSearchParams(hash.replace(/^#/, ""));

        const token = params.get("token");

        if (!token) {
          throw new Error("Google authentication token was not found.");
        }

        // Save token
        localStorage.setItem("token", token);

        // Get current user from backend
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
          localStorage.removeItem("token");

          throw new Error(
            data.message || "Could not retrieve user information."
          );
        }

        // Save user
        localStorage.setItem("user", JSON.stringify(data.user));

        // Remove token from browser URL
        window.history.replaceState(
          {},
          document.title,
          "/auth/callback"
        );

        // Redirect based on role
        if (data.user.role?.toUpperCase() === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }

        router.refresh();
      } catch (err) {
        console.error("Google authentication error:", err);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          err instanceof Error
            ? err.message
            : "Google login failed."
        );
      }
    };

    handleGoogleCallback();
  }, [router]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-2xl">!</span>
          </div>

          <h1 className="text-2xl font-bold text-white">
            Google Login Failed
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            {error}
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-7 h-11 px-6 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 text-white font-semibold"
          >
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full border-4 border-white/10 border-t-red-400 animate-spin" />

        <h1 className="text-xl font-semibold text-white">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Please wait while we complete your Google login.
        </p>
      </div>
    </main>
  );
}