import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { IoMdClose } from "react-icons/io";
import ButtonSecondary from "../Buttons/ButtonSecondary";
import { deleteMember, updateMember } from "../../api/member";
import InputSelect from "../Input/InputSelect";

export default function ModalEditMember({ data, clickClose }) {
  const queryClient = useQueryClient();
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
  } = useForm();

  const mutationUpdateMember = useMutation({
    mutationFn: updateMember,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      queryClient.invalidateQueries();
      setLoadingAnimation(false)
      clickClose()
    },
    onSettled: () => {
      setLoadingAnimation(false);
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
      setLoadingAnimation(false)
       clickClose()
    },
    onSettled: () => {
      setLoadingAnimation(false);
    },
  });

  const onSubmit = (dataForm) => {
    if (loadingAnimation) return;

    setLoadingAnimation(true);
    mutationUpdateMember.mutate({
      id: data.id,
      role: dataForm.role === "ADMIN" ? "ADMIN" : "MEMBER",
    });
  };

  useEffect(() => {
    setValue("role", data.role);
  }, [data, setValue]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40  backdrop-blur-sm transition-opacity p-4">
      <form
        className="relative w-full max-w-[600px] flex flex-col bg-white  rounded-2xl shadow-2xl transform transition-all max-h-[90vh]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100  shrink-0">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 ">
            Editar miembro
          </h1>
          <button
            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100  transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50"
            onClick={() => {
              clickClose();
            }}
          >
            <span className="material-symbols-outlined text-[24px]">
              <IoMdClose />
            </span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 ">
                Rol de {data.user.name} <span className="text-red-500">*</span>
              </label>
              <InputSelect
                register={register}
                nameRegister="role"
                required={true}
                options={{
                  ADMIN: "Admin",
                  MEMBER: "Miembro",
                }}
                className={"max-w-64"}
              />
              <p className="text-md">
                Los <b>Admin</b> pueden invitar y eliminar miembros, editar
                la información del hogar y gestionar sus permisos.
              </p>
            </div>
            <ButtonSecondary
              type="button"
              children="Eliminar miembro"
              className="text-red-500 w-42"
              onClick={() => {
                if (loadingAnimation) return;
                setLoadingAnimation(true);
                mutationDeleteMember.mutate(data.id);
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100   bg-gray-50/50   shrink-0 rounded-b-2xl">
          <ButtonSecondary
            children="Cancelar"
            onClick={() => {
              clickClose();
            }}
          />
          <ButtonGeneral
            children="Actualizar"
            type="submit"
            loading={loadingAnimation}
          />
        </div>
      </form>
    </div>
  );
}
