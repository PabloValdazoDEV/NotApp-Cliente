import { useAtomValue } from "jotai";
import { user } from "../../store/userAtom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember, updateMember } from "../../api/member";
import toast from "react-hot-toast";
import { useState } from "react";
import ModalMember from "../Modal/ModalMember";
import ButtonSecondary from "../Buttons/ButtonSecondary";
import ModalEditMember from "../Modal/ModalEditMember";

export default function CardMember({ data }) {
  const userContext = useAtomValue(user);
  const [modalEditMember, setModalEditMember] = useState(null);
    const queryClient = useQueryClient();


  //   console.log(data);
  return (
    <>
      <li className="flex items-center justify-between p-4 relative ">
        <div className="flex items-center gap-3 ">
          <img
            src={`${
              data?.user.image
                ? `https://res.cloudinary.com/${
                    import.meta.env.VITE_NAME_CLOUDINARY
                  }/image/upload/f_auto,q_auto,w_500/${data?.user.image}`
                : "/Avatar.png"
            }`}
            alt="Avatar"
            className="w-12 rounded-full aspect-square object-cover"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-slate-900flex items-center gap-2">
              {data.user.name}{" "}
              <span className="text-slate-400 font-normal text-xs">
                {data.user_id === userContext.id && " (Tú)"}
              </span>
            </p>
            <div className="flex gap-1 mt-0.5">
              {data.role === "OWNER" && (
                <span className="inline-flex items-center rounded-md bg-yellow-50  px-1.5 py-0.5 text-xs font-medium text-yellow-700  ring-1 ring-inset ring-yellow-600/20">
                  Propietario
                </span>
              )}
              {data.role === "ADMIN" && (
                <span className="inline-flex items-center rounded-md bg-purple-50  px-1.5 py-0.5 text-xs font-medium text-purple-700  ring-1 ring-inset ring-purple-600/20">
                  Admin
                </span>
              )}
              {data.role === "MEMBER" && (
                <p className="text-xs text-slate-500">Miembro</p>
              )}
            </div>
          </div>
          <div className="absolute mx-auto right-5">
            {userContext.id !== data.user.id && data.role !== "OWNER" && (
              <ButtonSecondary
                children="Editar"
                onClick={() => {
                  setModalEditMember(data);
                }}
              />
            )}
          </div>
        </div>
      </li>
      {modalEditMember && (
        <ModalEditMember
          clickClose={() => {
            setModalEditMember(null);
          }}
          data={data}
        />
      )}
    </>
  );
}
