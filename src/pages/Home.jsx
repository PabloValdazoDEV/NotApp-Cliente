import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useQuery } from "@tanstack/react-query";
import { getAllHomesUser } from "../api/home";
import { user } from "../store/userAtom";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router";

export default function Home() {
  const user_value = useAtomValue(user)
  const navigate = useNavigate()
  import.meta.env.VITE_NAME_CLOUDINARY

  const {data, isLoading, error} = useQuery({
    queryKey: ["homes", user_value.id],
    queryFn: ()=>{return getAllHomesUser(user_value.id)}
  })

  return (
    <main className="relative h-full flex flex-col justify-center items-center gap-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 md:gap-15 w-full">
        {isLoading && (<p className="col-span-4 text-center">Cargando...</p>)}
        {error && (<p className="col-span-4 text-center">Ha habido un error recarga la página</p>)}
        {data && ( <>{data.map((home) => (
          <div
            key={home.id}
            onClick={() => {
              navigate(`/hogar/${home.id}`)
            }}
            className="col-span-1 flex flex-col justify-center items-center gap-3 text-center"
          >
            <img
              src={home.image ? `https://res.cloudinary.com/${import.meta.env.VITE_NAME_CLOUDINARY
              }/image/upload/f_auto,q_auto,w_500/${home.image}` : "/IMG.jpg"}
              alt={home.name}
              className="bg-[color:var(--color-background)] w-full max-w-[100px] sm:max-w-[140px] md:max-w-[180px] rounded-full shadow-lg aspect-square object-cover"
            />
            <p className="text-base sm:text-lg md:text-xl font-medium text-[color:var(--color-text)]">
              {home.name}
            </p>
          </div>
        ))}</>)}
        {(!data?.length && !isLoading && !error) && (<p className="col-span-4 text-center">No hemos encontrado ningun hogar <br />¡Empieza por crear uno 😉!</p>)}
       
      </div>
        <div className={`bottom-5 right-5 z-40 ${data?.length < 5 ? "static" : "fixed"} ${data?.length < 9 ? "md:static" : "md:fixed"} ${data?.length < 12 ? "lg:static" : "lg:fixed"}`}>
          <ButtonGeneral
            className="flex items-center gap-2 bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"
            onClick={()=>{navigate("/hogar/crear-hogar")}}
            children={
              <>
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
                <span>Crear un HOGAR</span>
              </>
            }
          />
        </div>
    </main>
  );
}
