"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

type AdminSidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

const menuItems = [
  {
    label: "Dashboard",
    bn: "ড্যাশবোর্ড",
    href: "/admin/dashboard",
    icon: "dashboard",
  },
  {
    label: "Users",
    bn: "ইউজার",
    href: "/admin/users",
    icon: "users",
  },
  {
    label: "Learning",
    bn: "লার্নিং",
    href: "/admin/learning",
    icon: "book",
  },
  {
    label: "Blogs",
    bn: "ব্লগ",
    href: "/admin/blogs",
    icon: "blog",
  },
  {
    label: "Ausbildung",
    bn: "Ausbildung",
    href: "/admin/ausbildung",
    icon: "briefcase",
  },
  {
    label: "Services",
    bn: "সার্ভিস",
    href: "/admin/services",
    icon: "services",
  },
  {
    label: "Members",
    bn: "মেম্বার",
    href: "/admin/members",
    icon: "members",
  },
  {
    label: "Subscriptions",
    bn: "সাবস্ক্রিপশন",
    href: "/admin/subscriptions",
    icon: "subscription",
  },
];

function MenuIcon({ type }: { type: string }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };

  if (type === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (type === "book") {
    return (
      <svg {...common}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    );
  }

  if (type === "blog") {
    return (
      <svg {...common}>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    );
  }

  if (type === "briefcase") {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  if (type === "services") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.04H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.68 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10c.25.63.86 1.04 1.56 1.04h.84v2.4h-.84A1.7 1.7 0 0 0 19.4 15Z" />
      </svg>
    );
  }

  if (type === "members") {
    return (
      <svg {...common}>
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1" />
        <path d="M15 15a5 5 0 0 1 6 4v1" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10M7 13h6" />
    </svg>
  );
}

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isBangla = language === "bn";

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } ${
          isDark
            ? "border-white/10 bg-[#0B0F19]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Logo */}

        <div
          className={`flex h-20 shrink-0 items-center border-b px-6 ${
            isDark
              ? "border-white/10"
              : "border-slate-200"
          }`}
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-400 text-lg font-black text-white shadow-lg shadow-red-500/20">
              G
            </div>

            <div>
              <h1
                className={`text-lg font-bold ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                German
                <span className="text-red-500">
                  Learn
                </span>
              </h1>

              <p
                className={`text-[10px] uppercase tracking-[0.18em] ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Menu */}

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] ${
              isDark
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            {isBangla ? "মেনু" : "Main Menu"}
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-red-500/15 to-amber-400/5 text-red-400 shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:bg-white/5 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-red-500/10 text-red-400"
                        : isDark
                        ? "bg-white/[0.03] text-slate-500 group-hover:text-slate-300"
                        : "bg-slate-100 text-slate-500 group-hover:text-slate-700"
                    }`}
                  >
                    <MenuIcon type={item.icon} />
                  </span>

                  <span>
                    {isBangla
                      ? item.bn
                      : item.label}
                  </span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}

        <div
          className={`shrink-0 border-t p-4 ${
            isDark
              ? "border-white/10"
              : "border-slate-200"
          }`}
        >
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
              isDark
                ? "text-slate-400 hover:bg-white/5 hover:text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-lg">←</span>

            {isBangla
              ? "ওয়েবসাইটে ফিরে যান"
              : "Back to Website"}
          </Link>
        </div>
      </aside>
    </>
  );
}