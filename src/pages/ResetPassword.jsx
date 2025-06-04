import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { tryResetPassword, tryCheckToken } from "../api/auth";
import { useNavigate, useSearchParams } from "react-router";
import { useSetAtom } from "jotai";
import { fetchUser } from "../store/userAtom";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const [messageInfo, setMessageInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({
    passwordConfirm: false,
    pass7: false,
    passAZ: false,
    passN: false,
    passC: false,
  });

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

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const mutation = useMutation({
    mutationFn: async (data) => {
      const reponse = await tryResetPassword({ data, token });
      if (reponse.message === "Contraseña actualizada correctamente") {
        reset();
        navigate("/login");
        refetchUser();
      }

      if (reponse.message !== "Server error") {
        setMessageInfo(reponse.message);
      }
    },
  });

  const mutationCheckToken = useMutation({
    mutationFn: async (data) => {
      const reponse = await tryCheckToken( data );
      if (reponse.message !== "Token valido") {
        navigate("/login");
        refetchUser();
      }
    },
  });

  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");

  useEffect(() => {
    if (password) {
      setValue("password", password.trim());
      setValue("passwordConfirm", passwordConfirm.trim());
    }

    const pass7 = /^.{7,}$/;
    const passAZ = /(?=.*[A-Z])/;
    const passN = /(?=.*\d)/;
    const passC = /(?=.*[^A-Za-z\d])/;

    setValidation((prev) => ({
      ...prev,
      pass7: pass7.test(password),
      passAZ: passAZ.test(password),
      passN: passN.test(password),
      passC: passC.test(password),
      passwordConfirm: password === passwordConfirm,
    }));
  }, [password, passwordConfirm]);

  useEffect(() => {
    if (!token) {
      console.log("no hay")
      navigate("/login")
    }
    mutationCheckToken.mutate(token)

  }, []);

  const onSubmit = (data) => {
    if (!validation.passwordConfirm) {
      setMessageInfo("La contraseña no es la misma");
      return;
    }
    mutation.mutate(data);
  };
  return (
    <>
      <div className="max-w-80 mx-auto items-center min-h-screen flex flex-col">
        <div className="flex flex-grow container w-auto gap-8 items-center">
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Restablecer contraseña
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col justify-center"
            >
              {messageInfo && (
                <div className={`text-center bg-red-400 px-4 py-2 rounded-md`}>
                  <p className=" text-white font-medium ">{messageInfo}</p>
                </div>
              )}
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
                    },
                  })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-xs absolute top-[-18px] left-0">
                    Campo obligatorio
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
              <div>
                <h4>La contraseña debe contener lo siguiente:</h4>
                <ul>
                  <li
                    className={` ${
                      validation.pass7 ? "text-green-500" : "text-red-500"
                    } text-sm`}
                  >
                    Tener al menos 7 caracteres
                  </li>
                  <li
                    className={` ${
                      validation.passAZ ? "text-green-500" : "text-red-500"
                    } text-sm`}
                  >
                    Incluir una letra mayúscula
                  </li>
                  <li
                    className={` ${
                      validation.passN ? "text-green-500" : "text-red-500"
                    } text-sm`}
                  >
                    Incluir al menos un número
                  </li>
                  <li
                    className={` ${
                      validation.passC ? "text-green-500" : "text-red-500"
                    } text-sm`}
                  >
                    Incluir al menos un carácter especial
                  </li>
                </ul>
              </div>
              <div className=" relative">
                <InputGeneral
                  placeholder="Confirmación de Contraseña"
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  autoComplete="new-password"
                  {...register("passwordConfirm", {
                    required: true,
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{7,}$/gm,
                    },
                  })}
                />
                {errors.passwordConfirm?.type === "required" && (
                  <p className="text-red-500 text-xs absolute top-[-18px] left-0">
                    Campo obligatorio
                  </p>
                )}
              </div>
              <a
                className="text cursor-pointer hover:text-[color:var(--color-primary)] hover:scale-102 no-underline"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Volver al login
              </a>

              <ButtonGeneral
                children={"Cambiar contraseña"}
                type="submit"
                className="text-white"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
