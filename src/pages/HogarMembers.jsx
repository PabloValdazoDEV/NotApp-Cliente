import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember, postInvite } from "../api/member";
import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import ModalGeneral from "../components/Modal/ModalGeneral";
import toast from "react-hot-toast";
import CardMember from "../components/Cards/CardMember";
import ButtonSecondary from "../components/Buttons/ButtonSecondary";
import InputGeneral from "../components/Input/InputGeneral";

export default function HogarMembers({dataHogar}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hogar_id } = useParams();
  const userContext = useAtomValue(user);


  const [modalMember, setModalMember] = useState(false);


  const { register, handleSubmit } = useForm();

  const mutationInivteHogar = useMutation({
    mutationFn: postInvite,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      queryClient.invalidateQueries();
    },
  });

  const mutationDeleteMember = useMutation({
    mutationFn: deleteMember,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      queryClient.invalidateQueries();
    },
  });

  const onSubmitInviteHogar = (data) => {
    mutationInivteHogar.mutate({ ...data, id: hogar_id });
  };

  return (
    <>
        <>
          <div className="lg:col-span-1 w-full md:w-128">
            <div className="bg-white  rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full  flex flex-col w-full">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="flex items-center font-bold text-slate-900 gap-2">
                  Miembros
                  <span className="ml-3 px-2 py-0.5 rounded-full bg-slate-200  text-xs text-slate-600 ">
                    {dataHogar?.members.length}
                  </span>
                </h3>
              </div>
              <div className="flex-1 flex flex-col">
                <ul className="divide-y divide-slate-100 ">
                  {dataHogar.members.map((member, i) => {
                    return <CardMember data={member} key={i} />;
                  })}
                </ul>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 ">
                <form
                  onSubmit={handleSubmit(onSubmitInviteHogar)}
                  className="flex flex-row w-full justify-center items-center gap-5"
                >
                  <InputGeneral
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ej. juanpablo@gmail.com"
                    {...register("email")}
                  />
                  <ButtonSecondary
                    type="submit"
                    children="Invitar"
                    className="border border-slate-300 h-12"
                  />
                </form>
              </div>
            </div>
          </div>
          {modalMember && (
            <ModalGeneral
              titulo={`Salir de ${dataHogar?.name}`}
              text="No podras acceder a las lista de este hogar."
              textBtnGreen="Cancelar"
              textBtnRed="Salir"
              onClickGreen={() => {
                setModalMember(false);
              }}
              onClickRed={() => {
                const myMember = dataHogar.members.filter(
                  (member) => member.user_id === userContext.id
                );
                if (myMember[0].id) {
                  navigate("/home");
                }
                mutationDeleteMember.mutate(myMember[0].id);
              }}
            />
          )}
        </>
    </>
  );
}
