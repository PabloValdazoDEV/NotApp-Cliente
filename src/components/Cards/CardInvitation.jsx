import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHome } from "../../api/home";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { updateInvitation } from "../../api/member";
import ModalGeneral from "../Modal/ModalGeneral";
import { useSetAtom } from "jotai";
import { fetchUser } from "../../store/userAtom";

export default function CardInvitation({ data }) {
  const [modalDeleteInvitation, setModalDeleteInvitation] = useState(false);
  const queryClient = useQueryClient();
  const fetchUserContext = useSetAtom(fetchUser);
  const {
    data: dataQuery,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getHogar", data.home_id],
    queryFn: () => {
      return getHome(data.home_id);
    },
  });

  const mutation = useMutation({
    mutationFn: updateInvitation,
    onSuccess: () => {
      fetchUserContext()
      setModalDeleteInvitation(false);
      queryClient.invalidateQueries();
    },
  });

  const onSubmit = (valueInvitation) =>{
    mutation.mutate({id_invitation: data.id, accept: valueInvitation })
  }

  if (isLoading) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <p>Error al cargar la invitación</p>;
  }
  return (
    <>
      <div className=" flex flex-row gap-3 justify-center items-center border-b-1 last:border-0 border-[var(--color-primary)] pb-5">
        {dataQuery?.image && (
          <img
            src={`https://res.cloudinary.com/${
              import.meta.env.VITE_NAME_CLOUDINARY
            }/image/upload/f_auto,q_auto,w_500/${dataQuery?.image}`}
            className="w-10 aspect-square object-cover rounded-full"
          />
        )}

        <h2 className="col-span-5 text-sm row-span-2">{dataQuery?.name}</h2>
        <ButtonGeneral
          onClick={() => {
            onSubmit(true);
          }}
          children={"Unirme"}
          className="h-11"
        />
        <ButtonGeneral
          onClick={() => {
            setModalDeleteInvitation(true);
          }}
          className=" h-11 bg-red-500 hover:bg-red-600"
          children={<FaRegTrashAlt className="text-2xl" />}
        />
      </div>
      {modalDeleteInvitation && (
        <ModalGeneral
          titulo={`Borrar la invitacion ${dataQuery?.name}`}
          text=""
          textBtnGreen="Cancelar"
          textBtnRed="Borrar"
          onClickGreen={() => {
            setModalDeleteInvitation(false);
          }}
          onClickRed={() => {
            onSubmit(false);
          }}
        />
      )}
    </>
  );
}
