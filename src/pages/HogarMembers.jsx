import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelInvitation,
  deleteMember,
  getPendingInvitations,
  postInvite,
} from "../api/member";
import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import ModalGeneral from "../components/Modal/ModalGeneral";
import toast from "react-hot-toast";
import CardMember from "../components/Cards/CardMember";
import ButtonSecondary from "../components/Buttons/ButtonSecondary";
import InputGeneral from "../components/Input/InputGeneral";
import { MAX_HOME_MEMBERS } from "../constants/home";

const getPendingInvitationRows = (response, dataHogar) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.pendingInvitations)) return response.pendingInvitations;
  if (Array.isArray(response?.invitations)) return response.invitations;
  if (Array.isArray(dataHogar?.pendingInvitations)) return dataHogar.pendingInvitations;
  if (Array.isArray(dataHogar?.invitations)) {
    return dataHogar.invitations.filter((invitation) => {
      const status = invitation.status || invitation.state;
      return !status || status === "PENDING";
    });
  }

  return [];
};

const getInvitationName = (invitation) =>
  invitation.email ||
  invitation.user?.email ||
  invitation.invitedUser?.email ||
  invitation.name ||
  "Invitación pendiente";

const formatInvitationDate = (dateString) => {
  if (!dateString) return null;

  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateString));
};

export default function HogarMembers({dataHogar}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hogar_id } = useParams();
  const userContext = useAtomValue(user);


  const [modalMember, setModalMember] = useState(false);


  const { register, handleSubmit, reset } = useForm();

  const { data: pendingInvitationsData, isLoading: pendingInvitationsLoading } =
    useQuery({
      queryKey: ["pendingInvitations", hogar_id],
      queryFn: () => getPendingInvitations(hogar_id),
      enabled: Boolean(hogar_id),
    });

  const pendingInvitations = getPendingInvitationRows(
    pendingInvitationsData,
    dataHogar
  );
  const membersCount = dataHogar?.members?.length || 0;
  const occupiedPlaces = membersCount + pendingInvitations.length;
  const hasReachedMemberLimit = occupiedPlaces >= MAX_HOME_MEMBERS;

  const mutationInivteHogar = useMutation({
    mutationFn: postInvite,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        reset();
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

  const mutationCancelInvitation = useMutation({
    mutationFn: cancelInvitation,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message || "Invitación cancelada");
      }
      queryClient.invalidateQueries();
    },
  });

  const onSubmitInviteHogar = (data) => {
    if (hasReachedMemberLimit) {
      toast.error(`Un hogar puede tener como máximo ${MAX_HOME_MEMBERS} miembros`);
      return;
    }

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
                    {membersCount}/{MAX_HOME_MEMBERS}
                  </span>
                </h3>
              </div>
              <div className="flex-1 flex flex-col">
                <ul className="divide-y divide-slate-100 ">
                  {dataHogar.members.map((member, i) => {
                    return <CardMember data={member} key={i} />;
                  })}
                </ul>
                <div className="border-t border-slate-100 px-6 py-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      Pendientes
                    </h4>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      {pendingInvitations.length}
                    </span>
                  </div>
                  {pendingInvitationsLoading && (
                    <p className="text-sm text-slate-500">Cargando...</p>
                  )}
                  {!pendingInvitationsLoading &&
                    pendingInvitationsData?.success === false && (
                      <p className="text-sm text-slate-500">
                        Pendientes no disponible hasta actualizar el backend.
                      </p>
                    )}
                  {!pendingInvitationsLoading &&
                    pendingInvitationsData?.success !== false &&
                    pendingInvitations.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No hay invitaciones pendientes.
                      </p>
                    )}
                  {pendingInvitations.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {pendingInvitations.map((invitation) => (
                        <li
                          key={invitation.id}
                          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {getInvitationName(invitation)}
                            </p>
                            {formatInvitationDate(invitation.createdAt) && (
                              <p className="text-xs text-slate-500">
                                Enviada el{" "}
                                {formatInvitationDate(invitation.createdAt)}
                              </p>
                            )}
                          </div>
                          <ButtonSecondary
                            loading={mutationCancelInvitation.isPending}
                            className="h-9 px-3 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              mutationCancelInvitation.mutate(invitation.id);
                            }}
                          >
                            Cancelar
                          </ButtonSecondary>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 ">
                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>
                    Plazas ocupadas: {occupiedPlaces}/{MAX_HOME_MEMBERS}
                  </span>
                  {hasReachedMemberLimit && (
                    <span className="font-semibold text-red-600">
                      Límite alcanzado
                    </span>
                  )}
                </div>
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
                    disabled={hasReachedMemberLimit}
                    loading={mutationInivteHogar.isPending}
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
