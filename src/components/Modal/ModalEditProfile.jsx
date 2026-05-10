import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { fetchUser, user } from "../../store/userAtom";
import toast from "react-hot-toast";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import InputGeneral from "../Input/InputGeneral";
import useFilePreview from "../../hooks/useFilePreview";
import { IoMdClose } from "react-icons/io";
import { FaCloudArrowUp } from "react-icons/fa6";
import ButtonSecondary from "../Buttons/ButtonSecondary";
import { getProfile, updateProfile } from "../../api/profile";
import ImageSourceInputs from "../Input/ImageSourceInputs";

export default function ModalEditProfile({ clickClose }) {
  const queryClient = useQueryClient();
  const userContext = useAtomValue(user);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const fetchUserContext = useSetAtom(fetchUser);
  const [imageDelete, setImageDelete] = useState(false);

  const { data: profileData, error, isLoading } = useQuery({
    queryKey: ["getProfile", userContext.id],
    queryFn: () => {
      return getProfile(userContext.id);
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const mutationProfile = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Perfil actualizado!");
      setLoadingAnimation(false);
      setImageDelete(false);
      clickClose();
      queryClient.invalidateQueries();
      fetchUserContext();
    },
    onError: () => {
      toast.error("Error al actualizar");
    },
  });

  const onSubmit = (formData) => {
    if (formData.name.trim().length === 0) {
      setValue("name", profileData?.user.name);
    }
    setLoadingAnimation(true);
    mutationProfile.mutate({
      ...formData,
      user_id: userContext.id,
      file: imageDelete ? null : formData?.file[0],
      imageDelete,
    });
    setImageDelete(false);
  };
  const watchedFile = watch("file");
  const [file] = watch(["file"]);
  const [filePreview] = useFilePreview(file);

  useEffect(() => {
    setImageDelete(false);
  }, [watchedFile]);

  useEffect(() => {
    setValue("name", profileData?.user.name);
    setValue("email", profileData?.user.email);
  }, [profileData?.user, setValue]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }
  if (error) {
    clickClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40  backdrop-blur-sm transition-opacity p-4">
      {/* <!-- Modal Container --> */}
      <form
        className="relative w-full max-w-[600px] flex flex-col bg-white  rounded-2xl shadow-2xl transform transition-all max-h-[90vh]"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* <!-- Header --> */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100  shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 ">
            Editando perfil de Nombre
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
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <InputGeneral
                id="name"
                placeholder="Ej. Juan Pablo"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">El nombre es obligatorio</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 ">
                Correo electronico <span className="text-red-500">*</span>
              </label>
              <InputGeneral
                id="email"
                placeholder="Ej. juanpablo@gmail.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">El Email es obligatorio</p>
              )}
            </div>
            {/* <!-- Image Upload Area --> */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
                Cambiar imagen de perfil{" "}
                <ButtonSecondary
                  children="Borrar"
                  className="border border-gray-200"
                  onClick={() => {
                    setImageDelete(true);
                  }}
                />
              </label>

              {/* ZONA CLICABLE */}
              <div
                style={{
                  backgroundImage: `url(${
                    !imageDelete
                      ? filePreview ? filePreview : 
                      profileData.user.image ? `https://res.cloudinary.com/${
                              import.meta.env.VITE_NAME_CLOUDINARY
                            }/image/upload/f_auto,q_auto,w_500/${
                              profileData.user.image
                            }` : ""
                       : ""
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
                id="edit-profile-image"
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
          <ButtonGeneral
            children="Actualizar"
            type="submit"
            loading={loadingAnimation}
          />
        </div>
        {/* </div> */}
      </form>
    </div>
  );
}
