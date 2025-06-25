import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { tryCheckToken, tryRegisterSpecial } from "../api/auth";
import { useNavigate, useSearchParams } from "react-router";
import { useSetAtom } from "jotai";
import { fetchUser } from "../store/userAtom";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useEffect, useState } from "react";

export default function RegisterSpecial() {
  const [messageInfo, setMessageInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [validation, setValidation] = useState({
    emailConfirm: false,
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
    mutationFn: tryRegisterSpecial,
    onSuccess: (response) => {
      setLoadingAnimation(false);
      if (
        response.message === "Usuario registrado correctamente" &&
        response.token
      ) {
        reset();
        navigate("/");
        refetchUser();
      }

      if (response.message !== "Server error") {
        setMessageInfo(response.message);
      }
    },
  });

  const mutationCheckToken = useMutation({
    mutationFn: tryCheckToken,
    onSuccess: (response) => {
      if (response.message !== "Token valido") {
        navigate("/login");
        refetchUser();
      }
    },
  });

  useEffect(() => {
    if (!token) {
      console.log("no hay");
      navigate("/login");
    }
    mutationCheckToken.mutate(token);
  }, []);

  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");
  const email = watch("email");
  const emailConfirm = watch("emailConfirm");

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
    setValidation((prev) => ({
      ...prev,
      emailConfirm: email === emailConfirm,
    }));
  }, [email, emailConfirm]);

  const onSubmit = (data) => {
    if (!validation.emailConfirm && !validation.passwordConfirm) {
      setMessageInfo("El email no es el mismo, la contraseña no es la misma");
      return;
    }

    if (!validation.emailConfirm) {
      setMessageInfo("El email no es el mismo");
      return;
    }

    if (!validation.passwordConfirm) {
      setMessageInfo("La contraseña no es la misma");
      return;
    }
    setLoadingAnimation(true);
    mutation.mutate({ ...data, token: token });
  };
  return (
    <>
      <div className="max-w-80 mx-auto items-center min-h-screen flex flex-col">
        <div className="flex flex-grow container w-auto gap-8 items-center">
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
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
                  placeholder="Nombre"
                  type="text"
                  id="name"
                  name="name"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs absolute top-[-18px] left-0">
                    Campo obligatorio
                  </p>
                )}
              </div>
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
                  placeholder="Confirmación de Email"
                  type="email"
                  id="emailConfirm"
                  name="emailConfirm"
                  autoComplete="new-email"
                  {...register("emailConfirm", { required: true })}
                />
                {errors.emailConfirm && (
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

              <ButtonGeneral
                loading={loadingAnimation}
                children={"Registrar"}
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
