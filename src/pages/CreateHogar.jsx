import { useForm } from "react-hook-form";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import useFilePreview from "../hooks/useFilePreview";
import { postHome } from "../api/home";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import ImageSourceInputs from "../components/Input/ImageSourceInputs";

export default function CreateHogar() {
  const userData = useAtomValue(user);
  const navegate = useNavigate();
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
      navegate("/");
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
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full justify-center items-center gap-5"
      >
        <div
          className="w-40 h-40 bg-cover bg-center rounded-full relative"
          style={{
            backgroundImage: `url(${filePreview ? filePreview : "/IMG.jpg"})`,
          }}
        >
          <div className="w-full h-full bg-white/30 transition-all duration-300 absolute rounded-full flex justify-center items-center text-4xl">
            +
          </div>
        </div>
        <ImageSourceInputs
          id="create-home-page-image"
          register={register}
          setValue={setValue}
          className="justify-center"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">El nombre es obligatorio</p>
        )}
        <InputGeneral
          placeholder="Nombre del hogar..."
          className="md:w-80"
          type="text"
          id="name"
          name="name"
          {...register("name", { required: true })}
        />
        <ButtonGeneral
          loading={loadingAnimation}
          type="submit"
          children={"Crear hogar"}
          className="text-white"
        />
      </form>
    </>
  );
}
