import { useAtomValue, useSetAtom } from "jotai";
import { fetchUser, user } from "../store/userAtom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../api/profile";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useFilePreview from "../hooks/useFilePreview";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useEffect, useState } from "react";
import CardInvitation from "../components/Cards/CardInvitation";
import toast from "react-hot-toast";
import { useLocation } from "react-router";

export default function Profile() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const userContext = useAtomValue(user);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const fetchUserContext = useSetAtom(fetchUser);

  const { data, error, isLoading } = useQuery({
    queryKey: ["getProfile", userContext.id],
    queryFn: () => {
      return getProfile(userContext.id);
    },
  });

  useEffect(() => {
    if (location.hash === "#invitations") {
      const element = document.getElementById("invitations");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 250);
      }
    }
  }, [location]);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const mutationProfile = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Perfil actualizado!");
      setLoadingAnimation(false);
      console.log(data);
      queryClient.invalidateQueries();
      fetchUserContext();
    },
    onError:()=>{
      toast.error("Error al actualizar")
    }
  });

  const onSubmit = (data) => {
    if (data.name.trim().length === 0) {
      setValue("name", data?.user.name);
    }
    setLoadingAnimation(true);
    mutationProfile.mutate({
      ...data,
      user_id: userContext.id,
      file: data.file[0],
    });
  };

  const [file] = watch(["file"]);
  const [filePreview] = useFilePreview(file);

  useEffect(() => {
    setValue("name", data?.user.name);
    setValue("email", data?.user.email);
  }, [data?.user]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }
  if (error) {
    navigate(-1);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full justify-center items-center gap-8"
      >
        <div
          className="w-40 h-40 bg-cover bg-center rounded-full relative"
          style={{
            backgroundImage: `url(${
              filePreview
                ? filePreview
                : data?.user.image
                ? `https://res.cloudinary.com/${
                    import.meta.env.VITE_NAME_CLOUDINARY
                  }/image/upload/f_auto,q_auto,w_500/${data.user.image}`
                : "/Avatar.png"
            })`,
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
        <div className="relative w-full">
          <InputGeneral
            placeholder="Nombre del hogar..."
            className="md:w-80"
            type="text"
            id="name"
            name="name"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs absolute top-[-20px]">
              El nombre es obligatorio
            </p>
          )}
        </div>
        <div className="relative w-full">
          <InputGeneral
            placeholder="Nombre del hogar..."
            className="md:w-80"
            type="email"
            id="email"
            name="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs absolute top-[-20px]">
              El email es obligatorio
            </p>
          )}
        </div>
        <ButtonGeneral
          loading={loadingAnimation}
          type="submit"
          children={"Actualizar perfil"}
          className="text-white"
        />
      </form>
      <hr id="invitaciones" className="border-1 w-2/3 my-7 mx-auto" />
      <h2 className="text-center mb-3" id="invitations">Invitaciones</h2>
      <div className="flex flex-col gap-5">
        {/* {console.log(data.user?.invitations)} */}
        {data.user?.invitations.length === 0 ? (
          <p className="text-center">No tienes invitaciones</p>
        ) : (
          data?.user?.invitations.map((invitation, i) => {
            return <CardInvitation key={i} data={invitation} />;
          })
        )}
        {}
      </div>
    </>
  );
}
