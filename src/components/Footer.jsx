import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-neutral-700">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} NotApp
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link to="/privacidad" className="text-gray-600 no-underline hover:text-(--color-primary)">
            Privacidad
          </Link>
          <Link to="/cookies" className="text-gray-600 no-underline hover:text-(--color-primary)">
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
