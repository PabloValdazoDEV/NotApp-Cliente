import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addHomeFavorite,
  getAllHomesUser,
  removeHomeFavorite,
} from "../api/home";
import { user } from "../store/userAtom";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router";
import { IoMdArrowForward } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdAddHome } from "react-icons/md";
import ModalCreateHogar from "../components/Modal/ModalCreateHogar";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PageSkeleton } from "../components/Skeleton/Skeleton";

export default function Home() {
  const user_value = useAtomValue(user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewModalCreateHogar, setViewModalCreateHogar] = useState(false);
  import.meta.env.VITE_NAME_CLOUDINARY;

  const { data, isLoading, error } = useQuery({
    queryKey: ["homes", user_value.id],
    queryFn: () => {
      return getAllHomesUser(user_value.id);
    },
  });
  // console.log(data);

  const mutationFavoriteHome = useMutation({
    mutationFn: ({ homeId, isFavorite }) =>
      isFavorite ? removeHomeFavorite(homeId) : addHomeFavorite(homeId),
    onMutate: async ({ homeId, isFavorite }) => {
      const queryKey = ["homes", user_value.id];
      await queryClient.cancelQueries({ queryKey });
      const previousHomes = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (currentHomes) => {
        if (!Array.isArray(currentHomes)) return currentHomes;

        return currentHomes.map((home) =>
          home.id === homeId ? { ...home, is_favorite: !isFavorite } : home
        );
      });

      return { previousHomes };
    },
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message);
      }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousHomes) {
        queryClient.setQueryData(["homes", user_value.id], context.previousHomes);
      }
      toast.error("No se ha podido actualizar el favorito");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["homes", user_value.id] });
    },
  });

  const sortedHomes = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return [...data].sort((a, b) => {
      const aFavorite = a.is_favorite;
      const bFavorite = b.is_favorite;

      if (aFavorite !== bFavorite) return aFavorite ? -1 : 1;

      return a.name.localeCompare(b.name);
    });
  }, [data]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <main className="relative h-full flex flex-col justify-center items-center gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-7 md:gap-15 w-full">
          {error && (
            <p className="col-span-4 text-center">
              Ha habido un error recarga la página
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 col-span-1 md:col-span-2 xl:col-span-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-black  text-3xl font-black leading-tight tracking-[-0.033em]">
                Mis hogares
              </h2>
              <p className="text-[#616f89]  text-base font-normal">
                Gestiona y accede a tus espacios compartidos.
              </p>
            </div>
            <button
              data-tour="home-create"
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-(--color-primary) text-white text-sm font-bold leading-normal transition-colors shadow-sm hover:shadow-md"
              onClick={() => {
                setViewModalCreateHogar(true);
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v12M6 12h12"
                />
              </svg>
              <span className="truncate">Crear hogar</span>
            </button>
          </div>
          {sortedHomes.length > 0 && (
            <>
              {sortedHomes.map((home, index) => {
                const isFavorite = Boolean(home.is_favorite);

                return (
                <div
                  key={home.id}
                  data-tour={index === 0 ? "home-card" : undefined}
                  className={`group flex flex-col bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                  onClick={() => {
                    navigate(`/hogar/${home.id}`);
                  }}
                >
                  <div className="relative w-full max-h-40 aspect-auto bg-gray-200">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        mutationFavoriteHome.mutate({
                          homeId: home.id,
                          isFavorite,
                        });
                      }}
                      className={`absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur-sm transition hover:scale-105 ${
                        isFavorite ? "text-yellow-500" : "text-gray-400"
                      } ${
                        mutationFavoriteHome.isPending
                          ? "pointer-events-none opacity-70"
                          : ""
                      }`}
                      disabled={mutationFavoriteHome.isPending}
                      title={
                        isFavorite
                          ? "Quitar de favoritos"
                          : "Marcar como favorito"
                      }
                      aria-label={
                        isFavorite
                          ? "Quitar de favoritos"
                          : "Marcar como favorito"
                      }
                    >
                      {isFavorite ? <FaStar /> : <FaRegStar />}
                    </button>
                    {home.image && (
                      <img
                        className="w-full h-full object-cover"
                        src={`https://res.cloudinary.com/${
                          import.meta.env.VITE_NAME_CLOUDINARY
                        }/image/upload/f_auto,q_auto,w_500/${home.image}`}
                        alt={home.name}
                      />
                    )}

                    {home.members.map((member, i) => {
                      if (member.user_id == user_value.id) {
                        if (member.role == "OWNER") {
                          return (
                            <div
                              key={i}
                              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-(--color-primary) uppercase tracking-wide shadow-sm border border-(--color-primary)/10"
                            >
                              PROPIETARIO
                            </div>
                          );
                        } else if (member.role == "ADMIN") {
                          return (
                            <div
                              key={i}
                              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border border-(--color-primary)/10 text-purple-600"
                            >
                              ADMIN
                            </div>
                          );
                        }
                      }
                    })}
                  </div>
                  <div
                    className={`flex flex-col p-5 gap-4  ${
                      !home.image && "mt-40"
                    }`}
                  >
                    <div>
                      <h3 className="text-[#111318] text-xl font-bold leading-tight mb-1">
                        {home.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-[#616f89] ">
                        <span className="material-symbols-outlined text-[20px]">
                          <FaUserGroup />
                        </span>
                        <span className="text-sm font-medium">
                          {home.members.length} miembros
                        </span>
                      </div>
                      <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-(--color-primary) group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                          <IoMdArrowForward />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </>
          )}
          {!data?.length && !isLoading && !error && (
            <p className="col-span-4 text-center">
              No hemos encontrado ningun hogar <br />
              ¡Empieza por crear uno 😉!
            </p>
          )}
          <button
            className="group flex flex-col items-center justify-center min-h-[300px] bg-transparent border-2 border-dashed border-gray-300  rounded-xl hover:border-(--color-primary) over:bg-(--color-primary)/5 transition-all cursor-pointer gap-4"
            onClick={() => {
              setViewModalCreateHogar(true);
            }}
          >
            <div className="size-14 rounded-full bg-gray-100  flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-(--color-primary) transition-colors shadow-sm">
              <span className="material-symbols-outlined text-3xl">
                <MdAddHome />
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 font-medium group-hover:text-(--color-primary) transition-colors">
              Crear otro hogar
            </span>
          </button>
        </div>
        {viewModalCreateHogar && (
          <ModalCreateHogar
            clickClose={() => {
              setViewModalCreateHogar(false);
            }}
          />
        )}
      </main>
    </>
  );
}
