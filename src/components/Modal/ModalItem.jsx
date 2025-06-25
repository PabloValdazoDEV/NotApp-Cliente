import { useForm } from "react-hook-form";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { useMutation } from "@tanstack/react-query";
import useFilePreview from "../../hooks/useFilePreview";
import InputGeneral from "../Input/InputGeneral";
import SelectCategory from "../Input/SelectCategory";
import { useEffect, useState } from "react";
import { deleteItem, postItem, updateItem } from "../../api/item";
import { useParams } from "react-router";
import ModalGeneral from "./ModalGeneral";
import toast from "react-hot-toast";

export default function ModalItem({ onClickClosed, data }) {
  const [categories, setCategories] = useState({
    first: data?.categories[0] || null,
    second: data?.categories[1] || null,
    third: data?.categories[2] || null,
  });

  const { hogar_id } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm();


  useEffect(() => {
    setValue("name", data?.name);
    setValue("price", data?.price);
    setValue("description", data?.description);
  }, []);

  const mutation = useMutation({
    mutationFn: postItem,
    onSuccess: () => {
      toast.success("Producto creado correctamente!");
      setLoadingAnimation(false)
      onClickClosed();
    },onError:()=>{
      toast.error("Error al crear el producto!")
    }
  });
  const mutationUpdate = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      toast.success("Producto actualizado correctamente!");
      setLoadingAnimation(false)
      onClickClosed();
    },onError:()=>{
      toast.error("Error al actualizar el producto!")
    }
  });

  const mutationDelete = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      toast('Producto borrado correctamente!', {
        icon: '🗑️',
      });
      onClickClosed();
    },onError:()=>{
      toast.error("Error al borrar el producto!")
    }
  });

  const onSubmitDteleteItem = () => {
    mutationDelete.mutate(data.id);
  };

  const onSubmit = (dataFrom) => {
    if (data) {
      const formData = {
        ...dataFrom,
        item_id: data.id,
        file: dataFrom?.file[0] ? dataFrom?.file[0] : null,
        categories: [categories.first, categories.second, categories.third],
      };
      setLoadingAnimation(true)
      mutationUpdate.mutate(formData);
    } else {
      const formData = {
        ...dataFrom,
        hogar_id: hogar_id,
        file: dataFrom?.file[0],
        categories: [categories.first, categories.second, categories.third],
      };
      setLoadingAnimation(true)
      mutation.mutate(formData);
    }
  };

  const [file] = watch(["file"]);
  const [filePreview] = useFilePreview(file);
  return (
    <>
      {!modalDelete && (
        <div className="fixed inset-0 bg-[color:var(--color-primary)]/10 backdrop-blur-sm z-60 flex items-center justify-center px-4">
          <div className="w-full max-w-xs md:max-w-lg bg-[color:var(--color-background-object)] rounded-lg shadow-lg p-6 flex flex-col gap-5 items-center relative">
            {data && <h4>Editando {data?.name} </h4>}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full justify-center items-center gap-5"
            >
              <div
                className="w-40 h-40 bg-cover bg-center rounded-full relative"
                style={{
                  backgroundImage: `url(${
                    filePreview
                      ? filePreview
                      : data?.image
                      ? `https://res.cloudinary.com/${
                          import.meta.env.VITE_NAME_CLOUDINARY
                        }/image/upload/f_auto,q_auto,w_500/${data.image}`
                      : "/IMG.jpg"
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
              {errors.name && (
                <p className="text-red-500 text-xs">El nombre es obligatorio</p>
              )}
              <div className="grid grid-cols-6 gap-5">
                <InputGeneral
                  placeholder="Nombre del prod..."
                  className="col-span-4"
                  type="text"
                  id="name"
                  name="name"
                  {...register("name", { required: true })}
                />
                <InputGeneral
                  placeholder="€"
                  className="col-span-2"
                  type="number"
                  id="price"
                  name="price"
                  {...register("price")}
                  step="0.01"
                />
              </div>

              <textarea
                placeholder="Descripción del producto"
                className={`w-full bg-gray-100 border border-[color:var(--color-text)] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neutral-700  text-neutral-700 `}
                name="description"
                {...register("description")}
              ></textarea>
              <h4>Seleccione las categorias</h4>
              <div className="grid grid-cols-3 gap-3">
                <SelectCategory
                  value={categories.first}
                  onChange={(e) => {
                    setCategories({ ...categories, first: e });
                  }}
                />
                <SelectCategory
                  value={categories.second}
                  onChange={(e) => {
                    setCategories({ ...categories, second: e });
                  }}
                />
                <SelectCategory
                  value={categories.third}
                  onChange={(e) => {
                    setCategories({ ...categories, third: e });
                  }}
                />
              </div>
              <div className="flex flex-row gap-5 justify-between">
                {data && (
                  <ButtonGeneral
                    onClick={() => {
                      setModalDelete(true);
                    }}
                    children="Borrar"
                    className="text-white bg-red-500 hover:bg-red-600"
                  />
                )}

                <ButtonGeneral
                  loading={loadingAnimation}
                  type="submit"
                  children={data ? "Actualizar" : "Crear producto"}
                  className="text-white"
                />
              </div>
            </form>
            <button
              onClick={onClickClosed}
              className="text-sm bg-red-600 text-white px-2 py-2 rounded-3xl w-auto absolute top-[-20px] right-[-20px]"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {modalDelete && (
       <> <ModalGeneral
          titulo={`Borrar el hogar ${data?.name}`}
          text="Se borran todos las listas y los demas miembre no podran acceder nunca mas, se perderan todos los datos."
          textBtnGreen="Cancelar"
          textBtnRed="Borrar"
          onClickGreen={() => {
            setModalDelete(false);
          }}
          onClickRed={() => {
            onSubmitDteleteItem();
          }}
        />
      </>
      )}
      
    </>
  );
}
