import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { IoArrowBack } from "react-icons/io5";

export default function Layout() {
  const navigate = useNavigate();

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
      <main className="flex-grow container mx-5 my-5 lg:mx-auto px-6 py-6 w-auto lg:w-full lg:max-w-6xl bg-[color:var(--color-background-object)] rounded-lg shadow-md ">
        {window.location.pathname !== "/" && (<Link onClick={()=>{ navigate(-1)}} className=" no-underline text-[color:var(--color-text)] inline-flex mb-4 hover:scale-105">
        <IoArrowBack className="text-2xl mr-1" /> Atras
        </Link>)}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
