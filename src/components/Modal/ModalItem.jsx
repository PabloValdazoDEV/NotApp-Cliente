import { useForm } from "react-hook-form";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFilePreview from "../../hooks/useFilePreview";
import InputGeneral from "../Input/InputGeneral";
import SelectCategory from "../Input/SelectCategory";
import SelectSupermarket from "../Input/SelectSupermarket";
import { useEffect, useState } from "react";
import { deleteItem, postItem, updateItem } from "../../api/item";
import { useParams } from "react-router";
import ModalGeneral from "./ModalGeneral";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FaCloudArrowUp } from "react-icons/fa6";
import ButtonSecondary from "../Buttons/ButtonSecondary";
import ImageSourceInputs from "../Input/ImageSourceInputs";

export default function ModalItem({
  onClickClosed,
  data,
  initialName = "",
  onCreated,
  imageOnly = false,
}) {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState({
    first: data?.categories?.[0] || null,
    second: data?.categories?.[1] || null,
    third: data?.categories?.[2] || null,
  });
  const [supermarket, setSupermarket] = useState(
    data?.supermarket || "CUALQUIERA"
  );

  const { hogar_id } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("name", data?.name || initialName);
    setValue("price", data?.price);
    setValue("description", data?.description);
    setSupermarket(data?.supermarket || "CUALQUIERA");
  }, [
    data?.description,
    data?.name,
    data?.price,
    data?.supermarket,
    initialName,
    setValue,
  ]);

  const mutation = useMutation({
    mutationFn: postItem,
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message || "Error al crear el producto!");
        setLoadingAnimation(false);
        return;
      }

      toast.success(response?.message || "Producto creado correctamente!");
      onCreated?.(response?.item);
      setLoadingAnimation(false);
      onClickClosed();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Error al crear el producto!");
    },
  });
  const mutationUpdate = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      toast.success("Producto actualizado correctamente!");
      setLoadingAnimation(false);
      setImageRemoved(false);
      onClickClosed();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Error al actualizar el producto!");
    },
  });

  const mutationDelete = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      toast("Producto borrado correctamente!", {
        icon: "🗑️",
      });
      onClickClosed();
      setImageRemoved(false);
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Error al borrar el producto!");
    },
  });

  const onSubmitDteleteItem = () => {
    mutationDelete.mutate(data.id);
  };

  const onSubmit = (dataFrom) => {
    if (data) {
      const categoriesToSave = imageOnly
        ? data.categories || []
        : [categories.first, categories.second, categories.third];
      const formData = {
        ...(imageOnly
          ? {
              name: data.name,
              price: data.price || "",
              description: data.description || "",
            }
          : dataFrom),
        item_id: data.id,
        file: dataFrom?.file?.[0] ? dataFrom?.file?.[0] : null,
        categories: categoriesToSave,
        supermarket: imageOnly ? data.supermarket || "CUALQUIERA" : supermarket,
        imageDelete: imageRemoved,
      };
      setLoadingAnimation(true);
      mutationUpdate.mutate(formData);
    } else {
      const formData = {
        ...dataFrom,
        hogar_id: hogar_id,
        file: imageRemoved ? null : dataFrom?.file?.[0],
        categories: [categories.first, categories.second, categories.third],
        supermarket,
      };
      setLoadingAnimation(true);
      mutation.mutate(formData);
    }
  };

  const watchedFile = watch("file");

  useEffect(() => {
    setImageRemoved(false);
  }, [watchedFile]);

  const [file] = watch(["file"]);
  const [filePreview] = useFilePreview(file);
  return (
    <>
      {!modalDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex max-h-[90vh] w-full max-w-[600px] flex-col rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {imageOnly
                    ? `Editar foto de ${data?.name}`
                    : data
                      ? `Editar ${data?.name}`
                      : "Crear producto"}
                </h2>
                <p className="text-sm text-gray-500">
                  {imageOnly
                    ? "Sube, cambia o borra la imagen del producto."
                    : "Imagen, datos básicos, categorías y supermercado."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClickClosed}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Cerrar"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto p-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Imagen del producto
                  </label>
                  {(data?.image || filePreview) && !imageRemoved && (
                    <ButtonSecondary
                      type="button"
                      onClick={() => setImageRemoved(true)}
                      className="h-9 px-3 text-red-600 hover:bg-red-50"
                    >
                      Borrar
                    </ButtonSecondary>
                  )}
                </div>
                <div
                  className="flex min-h-[180px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 bg-cover bg-center transition hover:border-(--color-primary) hover:bg-gray-100"
                  style={{
                    backgroundImage:
                      !imageRemoved && filePreview
                        ? `url(${filePreview})`
                        : !imageRemoved && data?.image
                          ? `url(https://res.cloudinary.com/${import.meta.env.VITE_NAME_CLOUDINARY}/image/upload/f_auto,q_auto,w_700/${data.image})`
                          : "none",
                  }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-white/75 px-4 py-8 text-center">
                    <FaCloudArrowUp className="mb-3 text-4xl text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">
                      Añade o cambia la imagen
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG o WEBP
                    </p>
                  </div>
                </div>
                <ImageSourceInputs
                  id="product-image"
                  register={register}
                  setValue={setValue}
                  className="mt-3"
                />
              </div>

              {!imageOnly && (
                <>
                  <div>
                    {errors.name && (
                      <p className="mb-2 text-xs text-red-500">
                        El nombre es obligatorio
                      </p>
                    )}
                    <div className="grid grid-cols-6 gap-3">
                      <InputGeneral
                        placeholder="Nombre del producto"
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
                  </div>

                  <textarea
                    placeholder="Descripción del producto"
                    className="min-h-24 w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                    name="description"
                    {...register("description")}
                  />

                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Categorías
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Supermercado
                    </h4>
                    <SelectSupermarket
                      value={supermarket}
                      onChange={setSupermarket}
                    />
                  </div>
                </>
              )}
            </div>

            <div
              className={`grid gap-3 border-t border-gray-100 p-5 ${
                imageOnly ? "grid-cols-2" : data ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              {data && !imageOnly ? (
                <ButtonGeneral
                  type="button"
                  onClick={() => {
                    setModalDelete(true);
                  }}
                  className="w-full bg-red-500 px-3 text-white hover:bg-red-600"
                >
                  Borrar
                </ButtonGeneral>
              ) : (
                null
              )}
              <ButtonSecondary
                type="button"
                className="w-full px-3"
                onClick={onClickClosed}
              >
                Cancelar
              </ButtonSecondary>
              <ButtonGeneral
                loading={loadingAnimation}
                type="submit"
                className="w-full px-3 text-white"
              >
                {imageOnly ? "Guardar foto" : data ? "Actualizar" : "Crear producto"}
              </ButtonGeneral>
            </div>
          </form>
        </div>
      )}
      {modalDelete && (
        <ModalGeneral
          titulo={`Borrar ${data?.name}`}
          text="Se eliminará este producto del hogar y dejará de estar disponible para nuevas listas."
          textBtnGreen="Cancelar"
          textBtnRed="Borrar"
          onClickGreen={() => {
            setModalDelete(false);
          }}
          onClickRed={() => {
            onSubmitDteleteItem();
          }}
        />
      )}
    </>
  );
}
