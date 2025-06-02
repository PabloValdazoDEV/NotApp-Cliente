import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { tryLogin } from "../api/auth";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { fetchUser } from "../store/userAtom";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useState } from "react";

export default function Login() {
  const [messageInfo, setMessageInfo] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const refetchUser = useSetAtom(fetchUser);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const reponse = await tryLogin(data);
      if (reponse.message === "Credenciales correctas" && reponse.token) {
        reset();
        navigate("/");
        refetchUser();
      }

      if (reponse.message !== "Server error") {
        setMessageInfo(reponse.message);
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">
          Inicio de sesión
        </h2>

        <div className="w-1/2 gap-8 items-center jus">
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col justify-center"
            >
              {messageInfo && (
                <div className={`text-center ${messageInfo === "Credenciales correctas" ? "bg-green-400 ": "bg-red-400" } px-4 py-2 rounded-md`}>
                  <p className=" text-white font-medium ">{messageInfo}</p>
                </div>
              )}

              <InputGeneral
                placeholder="Email"
                type="email"
                id="email"
                name="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">Campo requerido</p>
              )}

              <InputGeneral
                placeholder="Contraseña"
                type="password"
                id="password"
                name="password"
                {...register("password", {
                  required: true,
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{7,}$/gm,
                    message: "La contraseña no cumple los parametros",
                  },
                })}
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 text-xs">Campo requerido</p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}

              <ButtonGeneral
                children={"Ingresar"}
                type="submit"
                // className="text-white"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
