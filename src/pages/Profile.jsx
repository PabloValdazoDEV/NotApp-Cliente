import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";
import { useNavigate } from "react-router";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useEffect, useState } from "react";
import CardInvitation from "../components/Cards/CardInvitation";
import { useLocation } from "react-router";
import ModalEditProfile from "../components/Modal/ModalEditProfile";
import { ProfileSkeleton } from "../components/Skeleton/Skeleton";

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const userContext = useAtomValue(user);
  const [modalEdit, setModalEdit] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["getProfile", userContext.id],
    queryFn: () => {
      return getProfile(userContext.id);
    },
  });

  useEffect(() => {
    if (location.hash === "#invitations") {
      const element = document.getElementById("invitations");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 250);
      }
    }
  }, [location]);


  if (isLoading) {
    return <ProfileSkeleton />;
  }
  if (error) {
    navigate(-1);
  }

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center gap-5">
        <div className="mt-2 w-40 h-40 mx-auto rounded-full overflow-hidden">
          <img
            src={`${
                userContext.image
                  ? `https://res.cloudinary.com/${
                      import.meta.env.VITE_NAME_CLOUDINARY
                    }/image/upload/f_auto,q_auto,w_500/${data.user.image}`
                  : "/Avatar.png"
              }`}
            alt="Preview imagen perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-124 grid md:grid-cols-2 gap-5">
          <h2 className="col-span-1 md:col-span-2 text-center">
            Datos Personales
          </h2>
          <div className="w-full flex flex-col gap-1 col-span-1">
            <p>Nombre completo: </p>
            <p className="h-12 px-4 flex items-center rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
              {data?.user.name}
            </p>
          </div>
          <div className="w-full flex flex-col gap-1 col-span-1">
            <p>Correo electronico: </p>
            <p className="h-12 px-4 flex items-center rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
              {data?.user.email}
            </p>
          </div>
        </div>
        <ButtonGeneral
          type="button"
          children={"Editar perfil"}
          className="text-white"
          onClick={() => {
            setModalEdit(true);
          }}
        />
      </div>
      <hr id="invitaciones" className="border-1 w-2/3 my-7 mx-auto" />
      <h2 className="text-center mb-3" id="invitations">
        Invitaciones
      </h2>

      <div className="flex flex-col gap-5">
        {data.user?.invitations.length === 0 ? (
          <p className="text-center">No tienes invitaciones</p>
        ) : (
          data?.user?.invitations.map((invitation, i) => {
            return <CardInvitation key={i} data={invitation} />;
          })
        )}
        {}
      </div>
      {modalEdit && (
        <ModalEditProfile
          clickClose={() => {
            setModalEdit(false);
          }}
        />
      )}
    </>
  );
}
