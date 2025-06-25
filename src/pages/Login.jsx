import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { tryForgotPassword, tryLogin } from "../api/auth";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { fetchUser } from "../store/userAtom";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useEffect, useState } from "react";

export default function Login() {
  const [messageInfo, setMessageInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const refetchUser = useSetAtom(fetchUser);

  const mutation = useMutation({
    mutationFn: tryLogin,
    onSuccess: (reponse) => {
      setLoadingAnimation(false);
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
  const mutationForgotPassword = useMutation({
    mutationFn: tryForgotPassword,
    onSuccess: (reponse) => {
      setLoadingAnimation(false);
      if (reponse.message === "Correo de recuperación enviado") {
        reset();
        setMessageInfo(reponse.message);
      }

      if (reponse.message !== "Server error") {
        setMessageInfo(reponse.message);
      }
    },
  });

  const onSubmitLogin = (data) => {
    setLoadingAnimation(true);
    mutation.mutate(data);
  };
  const onSubmitForgotPassword = (data) => {
    setLoadingAnimation(true);
    mutationForgotPassword.mutate(data);
  };

  const password = watch("password");

  useEffect(() => {
    if (password) {
      setValue("password", password.trim());
    }
  }, [password]);

  return (
    <>
      <div className="max-w-80 mx-auto items-center min-h-screen flex flex-col">
        <div className="flex flex-grow w-full gap-8 items-center">
          {!forgotPassword ? (
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Inicio de sesión
              </h2>
              <form
                onSubmit={handleSubmit(onSubmitLogin)}
                className="space-y-6 flex flex-col justify-center"
              >
                {messageInfo && (
                  <div
                    className={`text-center ${
                      messageInfo === "Credenciales correctas"
                        ? "bg-green-400 "
                        : "bg-red-400"
                    } px-4 py-2 rounded-md`}
                  >
                    <p className=" text-white font-medium ">{messageInfo}</p>
                  </div>
                )}

                <div className=" relative">
                  <InputGeneral
                    placeholder="Email"
                    type="email"
                    id="email"
                    name="email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs absolute top-[-18px] left-0">
                      Campo obligatorio
                    </p>
                  )}
                </div>

                <div className=" relative">
                  <InputGeneral
                    placeholder="Contraseña"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    {...register("password", {
                      required: true,
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{7,}$/gm,
                        message:
                          "La contraseña no cumple los parametros minimos",
                      },
                    })}
                  />
                  {errors.password?.type === "required" && (
                    <p className="text-red-500 text-xs absolute top-[-18px] left-0">
                      Campo obligatorio
                    </p>
                  )}
                  {errors.password?.type === "pattern" && (
                    <p className="text-red-500 text-xs absolute top-[-18px] left-0">
                      {errors.password.message}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-105"
                  >
                    {showPassword ? "🙊" : "🙈"}
                  </button>
                </div>
                <a
                  className="text cursor-pointer hover:text-[color:var(--color-primary)] hover:scale-102 no-underline"
                  onClick={() => {
                    setForgotPassword(true);
                  }}
                >
                  ¿Has olvidado la contraseña?
                </a>

                <ButtonGeneral
                  loading={loadingAnimation}
                  children={"Ingresar"}
                  type="submit"
                  className="text-white"
                />
              </form>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Escribe tu correo
              </h2>
              <form
                onSubmit={handleSubmit(onSubmitForgotPassword)}
                className="space-y-6 flex flex-col justify-center"
              >
                {messageInfo && (
                  <div
                    className={`text-center ${
                      messageInfo === "Correo de recuperación enviado"
                        ? "bg-green-400 "
                        : "bg-red-400"
                    } px-4 py-2 rounded-md`}
                  >
                    <p className=" text-white font-medium ">{messageInfo}</p>
                  </div>
                )}

                <div className=" relative">
                  <InputGeneral
                    placeholder="Email"
                    type="email"
                    id="email"
                    name="email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs absolute top-[-18px] left-0">
                      Campo obligatorio
                    </p>
                  )}
                </div>
                <a
                  className="text cursor-pointer hover:text-[color:var(--color-primary)] hover:scale-102 no-underline"
                  onClick={() => {
                    setForgotPassword(false);
                  }}
                >
                  Volver al login
                </a>

                <ButtonGeneral
                  loading={loadingAnimation}
                  children={"Recuperar cuenta"}
                  type="submit"
                  className="text-white"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
