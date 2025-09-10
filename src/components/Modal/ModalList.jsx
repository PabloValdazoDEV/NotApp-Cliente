import { useForm } from "react-hook-form";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import InputGeneral from "../Input/InputGeneral";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postList } from "../../api/list";
import toast from "react-hot-toast";

export default function ModalList({ onClickClosed, id_home }) {
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();



  const mutation = useMutation({
    mutationFn: postList,
    onSuccess: () => {
      toast.success("Lista creada correctamente!");
      setLoadingAnimation(false);
      onClickClosed();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Error al crear la lista!");
    },
  });

  const onSubmit = (data) => {
    // console.log({...data, id_home: id_home});
    setLoadingAnimation(true)
    mutation.mutate({...data, id_home: id_home})
  };

  return (
    <div className="fixed inset-0 bg-[color:var(--color-primary)]/10 backdrop-blur-sm z-60 flex items-center justify-center px-4">
      <div className="w-full max-w-xs bg-[color:var(--color-background-object)] rounded-lg shadow-lg p-6 flex flex-col gap-5 items-center relative">
        <h2 className="text-center">Nombre de la lista</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full justify-center items-center gap-5"
        >
          <InputGeneral
            placeholder="Nombre de la list..."
            className="col-span-4"
            type="text"
            id="title"
            name="title"
            {...register("title", { required: true })}
          />
          <div className="flex flex-row gap-5">
            <ButtonGeneral
              loading={loadingAnimation}
              type="submit"
              children={"Crear lista"}
              className="text-white"
            />
          </div>
        </form>

        <button
          onClick={onClickClosed}
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
  );
}
