import { useEffect } from "react";
import { Outlet } from "react-router-dom"; 

export default function Layout() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // ejecutar al montar
    updateTheme();

    // escuchar cambios
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] transition-colors">
      <p>Navbar</p>
      <Outlet />
      <p>Footer</p>
    </div>
  );
}
