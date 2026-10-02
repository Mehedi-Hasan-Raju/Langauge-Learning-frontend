import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          German Learning
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/learning-levels" className="text-sm hover:text-gray-600">
            Learning Levels
          </Link>

          <Link href="/blogs" className="text-sm hover:text-gray-600">
            Blogs
          </Link>

          <Link href="/ausbildung" className="text-sm hover:text-gray-600">
            Ausbildung
          </Link>

          <Link href="/services" className="text-sm hover:text-gray-600">
            Services
          </Link>

          <Link href="/members" className="text-sm hover:text-gray-600">
            Our Members
          </Link>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}