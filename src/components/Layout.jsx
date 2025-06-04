import { useEffect } from "react";
import { Outlet } from "react-router-dom"; 
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  //   const updateTheme = () => {
  //     if (mediaQuery.matches) {
  //       document.documentElement.classList.add("dark");
  //     } else {
  //       document.documentElement.classList.remove("dark");
  //     }
  //   };

  //   updateTheme();

  //   mediaQuery.addEventListener("change", updateTheme);

  //   return () => mediaQuery.removeEventListener("change", updateTheme);
  // }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-background)] text-[color:var(--color-text)] transition-colors">
      <Navbar />
      <main className="flex-grow container mx-5 my-5 lg:mx-auto px-6 py-8 w-auto lg:w-full lg:max-w-6xl bg-[color:var(--color-background-object)] rounded-lg shadow-md ">
      <Outlet />
      </main>
      <Footer />
    </div>
  );
}
