import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { tryRegister } from "../api/auth";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { fetchUser } from "../store/userAtom";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useEffect, useState } from "react";

export default function Register() {
  const [messageInfo, setMessageInfo] = useState("");
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
  } = useForm();
  const navigate = useNavigate();
  const refetchUser = useSetAtom(fetchUser);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const reponse = await tryRegister(data);
      if (reponse.message === "Usuario registrado correctamente" && reponse.token) {
        reset();
        navigate("/");
        refetchUser();
      }

      if (reponse.message !== "Server error") {
        setMessageInfo(reponse.message);
      }
    },
  });

  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");
  const email = watch("email");
  const emailConfirm = watch("emailConfirm");

  useEffect(() => {
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

  useEffect(()=>{
    setValidation((prev) => ({
      ...prev,
      emailConfirm: email === emailConfirm,
    }));
  },[email, emailConfirm])

  const onSubmit = (data) => {
    if(!validation.emailConfirm && !validation.passwordConfirm){
      setMessageInfo("El email no es el mismo, la contraseña no es la misma");
      return
    }
    
    if(!validation.emailConfirm){
      setMessageInfo("El email no es el mismo");
      return
    }

    if(!validation.passwordConfirm){
      setMessageInfo("La contraseña no es la misma");
      return
    }
    mutation.mutate(data);
  };
  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">Registro</h2>

        <div className="w-1/2 gap-8 items-center jus">
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col justify-center"
            >
              {messageInfo && (
                <div
                  className={`text-center bg-red-400 px-4 py-2 rounded-md`}
                >
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
                  <p className="text-red-500 text-xs absolute top-1/3 right-4">
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
                  <p className="text-red-500 text-xs absolute top-1/3 right-4">
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
                  <p className="text-red-500 text-xs absolute top-1/3 right-4">
                    Campo obligatorio
                  </p>
                )}
              </div>
              <div className=" relative">
                <InputGeneral
                  placeholder="Contraseña"
                  type="password"
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
                  <p className="text-red-500 text-xs absolute top-1/3 right-4">
                    Campo obligatorio
                  </p>
                )}
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
                  <p className="text-red-500 text-xs absolute top-1/3 right-4">
                    Campo obligatorio
                  </p>
                )}
              </div>

              <ButtonGeneral
                children={"Registrar"}
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
