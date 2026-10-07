"use client";

import { useTheme } from "../../context/ThemeContext";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: string;
}

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
      className={`group rounded-2xl border p-5 transition-all duration-300 ${
        isDark
          ? "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
          : "border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`text-sm font-medium ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>

          {description && (
            <p
              className={`mt-2 text-xs ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
              isDark
                ? "bg-white/5"
                : "bg-slate-100"
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4">
          <span
            className={`text-xs font-medium ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}