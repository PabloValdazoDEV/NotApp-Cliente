import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { user } from "../../store/userAtom";
import toast from "react-hot-toast";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import InputGeneral from "../Input/InputGeneral";
import useFilePreview from "../../hooks/useFilePreview";
import { postHome } from "../../api/home";
import { IoMdClose } from "react-icons/io";
import { FaCloudArrowUp } from "react-icons/fa6";
import ButtonSecondary from "../Buttons/ButtonSecondary";
import ImageSourceInputs from "../Input/ImageSourceInputs";

export default function ModalCreateHogar({ clickClose }) {
  const userData = useAtomValue(user);
  const queryClient = useQueryClient();
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const mutation = useMutation({
    mutationFn: postHome,
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message);
        return;
      }

      toast.success("Hogar creado correctamente!");
      queryClient.invalidateQueries();
      clickClose();
    },
    onSettled: () => {
      setLoadingAnimation(false);
    },
  });

  const onSubmit = (data) => {
    if (loadingAnimation) return;

    const formData = {
      user_id: userData.id,
      name: data.name,
      file: data.file[0],
    };
    setLoadingAnimation(true);

    mutation.mutate(formData);
  };

  const [file] = watch(["file"]);
  const [filePreview] = useFilePreview(file);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40  backdrop-blur-sm transition-opacity p-4">
      {/* <!-- Modal Container --> */}
      <form
        className="relative w-full max-w-[600px] flex flex-col bg-white  rounded-2xl shadow-2xl transform transition-all max-h-[90vh]"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* <div className="relative w-full max-w-[600px] flex flex-col bg-white  rounded-2xl shadow-2xl transform transition-all max-h-[90vh]"> */}
        {/* <!-- Header --> */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100  shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 ">
            Crear Hogar
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
        {/* <!-- Scrollable Body --> */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className="flex flex-col gap-6">
            {/* <!-- Product Name Field --> */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 ">
                Nombre del hogar <span className="text-red-500">*</span>
              </label>
              <InputGeneral
                id="hogar-name"
                placeholder="Ej. Casa del pueblo"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">El nombre es obligatorio</p>
              )}
            </div>
            {/* <!-- Image Upload Area --> */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Imagen (opcional)
              </label>

              {/* ZONA CLICABLE */}
               <div
                style={{
                  backgroundImage: `url(${
                    filePreview
                      ? filePreview
                      : ``
                  })`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="group relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-black-300 cursor-pointer overflow-hidden"
              >
                {/* Background opacity layer */}
                <div className="absolute inset-0 bg-white/70 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <span className="material-symbols-outlined text-black-400 mb-2 group-hover:text-(--color-primary) transition-colors">
                    <FaCloudArrowUp />
                  </span>
                  <p className="mb-1 text-sm text-black-500">
                    <span className="font-semibold text-(--color-primary) group-hover:underline pr-1">
                      Usa las opciones de abajo
                    </span>
                  </p>
                  <p className="text-xs text-black-400">
                    SVG, PNG, JPG (max. 2MB)
                  </p>
                </div>
              </div>
              <ImageSourceInputs
                id="create-home-modal-image"
                register={register}
                setValue={setValue}
              />

            </div>
          </div>
        </div>
        {/* <!-- Footer Actions --> */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100   bg-gray-50/50   shrink-0 rounded-b-2xl">
          <ButtonSecondary
            children="Cancelar"
            onClick={() => {
              clickClose();
            }}
          />
          <ButtonGeneral children="Crear hogar" type="submit" loading={loadingAnimation} />
        </div>
        {/* </div> */}
      </form>
    </div>
  );
}
