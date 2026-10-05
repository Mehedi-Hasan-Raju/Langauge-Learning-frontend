"use client";

import { useTheme } from "../../context/ThemeContext";

type AdminStatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: string;
  trend?: string;
};

export default function AdminStatCard({
  title,
  value,
  description,
  icon,
  trend,
}: AdminStatCardProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? "border-white/10 bg-white/[0.035] hover:border-red-500/20 hover:bg-white/[0.05]"
          : "border-slate-200 bg-white hover:border-red-200 hover:shadow-lg hover:shadow-slate-200/50"
      }`}
    >
      {/* Glow */}

      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-500/10 blur-3xl transition group-hover:bg-red-500/20" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p
              className={`text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {title}
            </p>

            <h3
              className={`mt-2 text-3xl font-bold ${
                isDark
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              {value}
            </h3>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 to-amber-400/10 text-xl">
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
              {trend}
            </span>
          )}

          <span
            className={`text-xs ${
              isDark
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}