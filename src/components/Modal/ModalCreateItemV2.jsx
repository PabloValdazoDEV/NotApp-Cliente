import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router";
import { user } from "../../store/userAtom";
import toast from "react-hot-toast";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import InputGeneral from "../Input/InputGeneral";
import InputForm from "../Input/InputFind";
import useFilePreview from "../../hooks/useFilePreview";
import { postHome } from "../../api/home";

export default function ModalCreateItemV2() {
  const userData = useAtomValue(user);
  const navegate = useNavigate();
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const mutation = useMutation({
    mutationFn: postHome,
    onSuccess: () => {
      toast.success("Hogar creado correctamente!");
      setLoadingAnimation(false);
      navegate("/");
    },
  });

  const onSubmit = (data) => {
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
    // <div className="fixed inset-0 bg-[color:var(--color-(--color-primary))]/10 backdrop-blur-sm z-60 flex items-center justify-center px-4">
    //    <div className="w-full max-w-xs bg-[color:var(--color-background-object)] rounded-lg shadow-lg p-6 flex flex-col gap-5 items-center relative">
    //    <form
    //      onSubmit={handleSubmit(onSubmit)}
    //      className="flex flex-col w-full justify-center items-center gap-5"
    //    >
    //      <div
    //        className="w-40 h-40 bg-cover bg-center rounded-full relative"
    //        style={{
    //          backgroundImage: `url(${filePreview ? filePreview : "/IMG.jpg"})`,
    //        }}
    //      >
    //        <input
    //          type="file"
    //          id="file"
    //          className="w-full h-full rounded-full hidden"
    //          name="file"
    //          {...register("file")}
    //        />
    //        <label
    //          htmlFor="file"
    //          className="w-full h-full bg-white/30 hover:bg-[color:var(--color-(--color-primary))]/50 transition-all duration-300 absolute rounded-full flex justify-center items-center text-6xl"
    //        >
    //          +
    //        </label>
    //      </div>
    //      {errors.name && (
    //        <p className="text-red-500 text-xs">El nombre es obligatorio</p>
    //      )}
    //      <InputGeneral
    //        placeholder="Nombre del hogar..."
    //        className="md:w-80"
    //        type="text"
    //        id="name"
    //        name="name"
    //        {...register("name", { required: true })}
    //      />
    //      <ButtonGeneral
    //        loading={loadingAnimation}
    //        type="submit"
    //        children={"Crear hogar"}
    //        className="text-white"
    //      />
    //    </form>
    //    </div>
    //  </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40  backdrop-blur-sm transition-opacity p-4">
      <div className="relative w-full max-w-[600px] flex flex-col bg-white  rounded-2xl shadow-2xl transform transition-all max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100  shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 ">
            Crear Producto
          </h1>
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100  transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-gray-700 "
              >
                Nombre del producto <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-gray-200  bg-white  text-gray-900 placeholder:text-gray-400  focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors outline-none text-base"
                id="product-name"
                placeholder="Ej. Leche, Papel higiénico"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label
                className="text-sm font-medium text-gray-700 "
              >
                Categoría <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full h-12 px-4 pr-10 rounded-lg border border-gray-200  bg-white  text-gray-900 focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors outline-none appearance-none text-base cursor-pointer"
                  id="category"
                >
                  <option
                    className="text-gray-400"
                    disabled=""

                  >
                    Seleccionar categoría
                  </option>
                  <option value="comida">Comida y Bebida</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="higiene">Higiene Personal</option>
                  <option value="hogar">Hogar</option>
                  <option value="otros">Otros</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 ">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 ">
                Imagen (opcional)
              </label>
              <div className="group relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300  bg-gray-50  hover:bg-gray-100  hover:border-(--color-primary)/50 transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <span className="material-symbols-outlined text-gray-400 mb-2 group-hover:text-(--color-primary) transition-colors">
                    cloud_upload
                  </span>
                  <p className="mb-1 text-sm text-gray-500 ">
                    <span className="font-semibold text-(--color-primary) group-hover:underline">
                      Haz clic
                    </span>
                    o arrastra
                  </p>
                  <p className="text-xs text-gray-400 ">
                    SVG, PNG, JPG (max. 2MB)
                  </p>
                </div>
                <input className="hidden" id="dropzone-file" type="file" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-gray-700 "
              >
                Notas
              </label>
              <textarea
                className="w-full min-h-[100px] p-4 rounded-lg border border-gray-200   bg-white  text-gray-900   placeholder:text-gray-400   focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors outline-none text-base resize-y"
                id="notes"
                placeholder="Detalles adicionales, marca preferida, etc..."
              ></textarea>
            </div>
          </form>
        </div>
        {/* <!-- Footer Actions --> */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100   bg-gray-50/50   shrink-0 rounded-b-2xl">
          <button
            className="px-5 h-10 text-sm font-medium text-gray-600  bg-transparent hover:bg-gray-100   rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200  "
            type="button"
          >
            Cancelar
          </button>
          <button
            className="px-5 h-10 text-sm font-bold text-white bg-(--color-primary) hover:bg-(--color-primary)-hover active:bg-blue-700 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2"
            type="button"
          >
            Crear producto
          </button>
        </div>
      </div>
    </div>
  );
}
