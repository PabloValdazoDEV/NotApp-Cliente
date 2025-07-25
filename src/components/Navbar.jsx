import { useNavigate, Link } from "react-router";
import { tryLogout } from "../api/auth";
import { fetchUser, user } from "../store/userAtom";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useAtomValue } from "jotai";

export default function () {
  const navigate = useNavigate();
  const fetchUserContext = useSetAtom(fetchUser);
  const userContext = useAtomValue(user);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="bg-[color:var(--color-background-object)] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center ">
          <Link
            to="/profile"
            className="text-2xl font-bold text-[color:var(--color-primary)] "
          >
            <img
              src={`${
                userContext.image
                  ? `https://res.cloudinary.com/${
                      import.meta.env.VITE_NAME_CLOUDINARY
                    }/image/upload/f_auto,q_auto,w_500/${userContext.image}`
                  : "/Avatar.png"
              }`}
              alt="Avatar"
              className="w-15 rounded-full aspect-square object-cover"
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              to="/home"
              className="text-[color:var(--color-text)] hover:text-[color:var(--color-primary)] no-underline"
            >
              Hogares
            </Link>
            <Link
              to="/profile#invitations"
              className="text-[color:var(--color-text)] hover:text-[color:var(--color-primary)] no-underline relative"
            >
             Invitaciones
                {userContext?.invitations.length !== 0 && (
                  <span className=" top-[-5px] right-[-20px] absolute bg-[color:var(--color-primary)] rounded-full aspect-square w-5 h-5 text-xs flex flex-col justify-center items-center text-white">
                    {userContext?.invitations.length}
                  </span>
                )}
            </Link>
            <button
              onClick={() => {
                tryLogout();
                navigate("/login");
                fetchUserContext();
              }}
              className="text-sm bg-[color:var(--color-primary)] text-white px-3 py-2 rounded hover:bg-blue-500"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-[color:var(--color-text)] focus:outline-none relative"
          >
            {userContext?.invitations.length !== 0 && (
                  <span className="top-0 right-[-5px] absolute bg-[color:var(--color-primary)] rounded-full aspect-square w-5 h-5 text-xs flex flex-col justify-center items-center text-white">
                    {userContext?.invitations.length}
                  </span>
                )}
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="fixed inset-0 bg-[color:var(--color-primary)]/10 backdrop-blur-sm z-40 flex items-center justify-center px-4">
            <div className="w-full max-w-xs bg-[color:var(--color-background-object)] rounded-lg shadow-lg p-6 flex flex-col gap-5 items-center relative">
              <Link
                to="/home"
                className="block text-[color:var(--color-text)] text-lg hover:text-[color:var(--color-primary)] no-underline"
              >
                Hogares
              </Link>
              <hr className="border-1 w-1/3" />
              <Link
                to="/profile#invitations"
                onClick={() => setIsOpen(false)}
                className="block text-[color:var(--color-text)] text-lg hover:text-[color:var(--color-primary)] no-underline relative"
              >
                Invitaciones
                {userContext?.invitations.length !== 0 && (
                  <span className="top-[-5px] right-[-20px] absolute bg-[color:var(--color-primary)] rounded-full aspect-square w-5 h-5 text-xs flex flex-col justify-center items-center text-white">
                    {userContext?.invitations.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  tryLogout();
                  navigate("/login");
                  fetchUserContext();
                }}
                className="text-sm bg-[color:var(--color-primary)] text-white mt-3 px-3 py-3 rounded hover:bg-blue-500 w-full"
              >
                Cerrar sesión
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="text-sm bg-red-600 text-white px-2 py-2 rounded-3xl w-auto absolute top-[-20px] right-[-20px]"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
