import { useForm } from "react-hook-form";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import useFilePreview from "../hooks/useFilePreview";
import { postHome } from "../api/home";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import { useNavigate } from "react-router";

export default function () {
  const userData = useAtomValue(user);
  const navegate = useNavigate()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const mutation = useMutation({
    mutationFn: postHome,
    onSuccess:()=>{navegate("/")}
  });

  const onSubmit = (data) => {
    const formData = {
      user_id: userData.id,
      name: data.name,
      file: data.file[0],
    };

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
          <input
            type="file"
            id="file"
            className="w-full h-full rounded-full hidden"
            name="file"
            {...register("file")}
          />
          <label
            htmlFor="file"
            className="w-full h-full bg-white/30 hover:bg-[color:var(--color-primary)]/50 transition-all duration-300 absolute rounded-full flex justify-center items-center text-6xl"
          >
            +
          </label>
        </div>
        {errors.name && (
            <p className="text-red-500 text-xs">
              El nombre es obligatorio
            </p>
          )}
        <InputGeneral
        placeholder="Nombre del hogar..."
          className="md:w-80"
          type="text"
          id="name"
          name="name"
          {...register("name", {required: true})}
        />
        <ButtonGeneral
          type="submit"
          children="Crear hogar"
          className="text-white"
        />
      </form>
    </>
  );
}
