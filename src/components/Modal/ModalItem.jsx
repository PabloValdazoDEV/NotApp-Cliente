import { useForm } from "react-hook-form";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFilePreview from "../../hooks/useFilePreview";
import InputGeneral from "../Input/InputGeneral";
import SelectCategory from "../Input/SelectCategory";
import SelectSupermarket from "../Input/SelectSupermarket";
import { useEffect, useRef, useState } from "react";
import { deleteItem, postItem, searchItemImages, updateItem } from "../../api/item";
import { useParams } from "react-router";
import ModalGeneral from "./ModalGeneral";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import ButtonSecondary from "../Buttons/ButtonSecondary";
import ImageSourceInputs from "../Input/ImageSourceInputs";

const getImageSearchRows = (response) => {
  const rows = Array.isArray(response)
    ? response
    : response?.images ||
      response?.results ||
      response?.items ||
      response?.data?.images ||
      response?.data?.results ||
      response?.data?.items ||
      response?.value ||
      [];

  return rows
    .map((image) => {
      if (typeof image === "string") {
        return { url: image, thumbnailUrl: image, title: "Imagen sugerida" };
      }

      const url =
        image.url ||
        image.imageUrl ||
        image.originalUrl ||
        image.link ||
        image.contentUrl ||
        image.src;
      const thumbnailUrl =
        image.thumbnailUrl ||
        image.thumbnail ||
        image.thumbnailLink ||
        image.image?.thumbnailLink ||
        image.image?.thumbnailUrl ||
        image.thumbnail?.src ||
        url;

      return {
        ...image,
        url,
        thumbnailUrl,
        title: image.title || image.name || "Imagen sugerida",
      };
    })
    .filter((image) => image.url);
};

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
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [connectionInfo, setConnectionInfo] = useState({
    isOnline: navigator.onLine,
    effectiveType: navigator.connection?.effectiveType || "",
    saveData: Boolean(navigator.connection?.saveData),
  });
  const lastImageSearchCriteriaRef = useRef("");

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

  useEffect(() => {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const updateConnectionInfo = () => {
      setConnectionInfo({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType || "",
        saveData: Boolean(connection?.saveData),
      });
    };

    window.addEventListener("online", updateConnectionInfo);
    window.addEventListener("offline", updateConnectionInfo);
    connection?.addEventListener?.("change", updateConnectionInfo);

    return () => {
      window.removeEventListener("online", updateConnectionInfo);
      window.removeEventListener("offline", updateConnectionInfo);
      connection?.removeEventListener?.("change", updateConnectionInfo);
    };
  }, []);

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
    onSettled: () => {
      setLoadingAnimation(false);
    },
  });
  const mutationUpdate = useMutation({
    mutationFn: updateItem,
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message || "Error al actualizar el producto!");
        return;
      }

      toast.success("Producto actualizado correctamente!");
      setLoadingAnimation(false);
      setImageRemoved(false);
      onClickClosed();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Error al actualizar el producto!");
    },
    onSettled: () => {
      setLoadingAnimation(false);
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

  const {
    data: imageSearchData,
    isPending: isSearchingImages,
    mutate: mutateSearchImages,
    reset: resetImageSearch,
  } = useMutation({
    mutationFn: searchItemImages,
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message);
        return;
      }

      if (getImageSearchRows(response).length === 0) {
        toast("No se han encontrado imágenes para este producto");
      }
    },
    onError: () => {
      toast.error("No se han podido buscar imágenes");
    },
  });

  const onSubmitDteleteItem = () => {
    mutationDelete.mutate(data.id);
  };

  const onSubmit = (dataFrom) => {
    if (loadingAnimation) return;

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
        imageUrl:
          !dataFrom?.file?.[0] && !imageRemoved ? selectedImageUrl : "",
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
        imageUrl:
          !dataFrom?.file?.[0] && !imageRemoved ? selectedImageUrl : "",
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
    if (watchedFile?.length) {
      setSelectedImageUrl("");
    }
  }, [watchedFile]);

  const [file] = watch(["file"]);
  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const [filePreview] = useFilePreview(file);
  const currentImageSearchKey = JSON.stringify({
    name: (watchedName || "").trim(),
    description: (watchedDescription || "").trim(),
    categories: [categories.first, categories.second, categories.third].filter(
      Boolean
    ),
    supermarket,
  });
  const imageSearchRows = getImageSearchRows(imageSearchData);
  const hasSearchedImages = Boolean(imageSearchData);
  const hasPoorConnection =
    !connectionInfo.isOnline ||
    connectionInfo.saveData ||
    ["slow-2g", "2g"].includes(connectionInfo.effectiveType);
  const visibleImageUrl =
    !imageRemoved && filePreview
      ? filePreview
      : !imageRemoved && selectedImageUrl
        ? selectedImageUrl
        : !imageRemoved && data?.image
          ? `https://res.cloudinary.com/${import.meta.env.VITE_NAME_CLOUDINARY}/image/upload/f_auto,q_auto,w_700/${data.image}`
          : "";

  useEffect(() => {
    if (!lastImageSearchCriteriaRef.current) return;
    if (currentImageSearchKey === lastImageSearchCriteriaRef.current) return;

    resetImageSearch();
    lastImageSearchCriteriaRef.current = "";
    setSelectedImageUrl("");
  }, [currentImageSearchKey, resetImageSearch]);

  const onSearchImages = () => {
    const name = (watchedName || "").trim();
    const description = (watchedDescription || "").trim();

    if (!name && !description) {
      toast.error("Escribe un nombre o una descripción para buscar imágenes");
      return;
    }

    lastImageSearchCriteriaRef.current = currentImageSearchKey;
    mutateSearchImages({
      name,
      description,
      supermarket,
      categories: [categories.first, categories.second, categories.third].filter(
        Boolean
      ),
      refresh: Date.now(),
    });
  };

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
                    ? "Sube, busca, cambia o borra la imagen del producto."
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
                  {visibleImageUrl && (
                    <ButtonSecondary
                      type="button"
                      onClick={() => {
                        setImageRemoved(true);
                        setSelectedImageUrl("");
                      }}
                      className="h-9 px-3 text-red-600 hover:bg-red-50"
                    >
                      Borrar
                    </ButtonSecondary>
                  )}
                </div>
                {visibleImageUrl && (
                  <div
                    className="min-h-[180px] rounded-xl border border-gray-200 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${visibleImageUrl})`,
                    }}
                  />
                )}
                <ImageSourceInputs
                  id="product-image"
                  register={register}
                  setValue={setValue}
                  className={visibleImageUrl ? "mt-3" : ""}
                  cameraTour="product-camera"
                  galleryTour="product-gallery"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Imagen opcional. Formato recomendado: JPG, PNG o WEBP. Peso
                  recomendado: máximo 2 MB.
                </p>
                <div
                  data-tour="product-image-search"
                  className="mt-3 rounded-xl border border-gray-200 bg-white p-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Buscar foto en internet
                      </p>
                      <p className="text-xs text-gray-500">
                        Usa el nombre, la descripción y el supermercado.
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          hasPoorConnection ? "font-semibold text-amber-600" : "text-gray-500"
                        }`}
                      >
                        No se recomienda usar con mala conexión
                        {hasPoorConnection
                          ? ". Tu conexión parece lenta o inestable."
                          : "."}
                      </p>
                    </div>
                    <ButtonSecondary
                      type="button"
                      loading={isSearchingImages}
                      loadingText="Buscando..."
                      onClick={onSearchImages}
                      className="h-10 px-4"
                    >
                      {hasSearchedImages ? "Buscar otras fotos" : "Buscar fotos"}
                    </ButtonSecondary>
                  </div>
                  {imageSearchData?.success === false && (
                    <p className="mt-3 text-sm text-gray-500">
                      Búsqueda pendiente de backend.
                    </p>
                  )}
                  {imageSearchRows.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {imageSearchRows.slice(0, 6).map((image) => {
                        const isSelected = selectedImageUrl === image.url;

                        return (
                          <button
                            type="button"
                            key={image.url}
                            onClick={() => {
                              setImageRemoved(false);
                              setSelectedImageUrl(image.url);
                            }}
                            className={`overflow-hidden rounded-lg border bg-white text-left transition hover:scale-[1.02] ${
                              isSelected
                                ? "border-(--color-primary) ring-2 ring-(--color-primary)/20"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={image.thumbnailUrl}
                              alt={image.title}
                              className="aspect-square w-full object-cover"
                            />
                            <span className="block truncate px-2 py-1 text-xs text-gray-600">
                              {isSelected ? "Seleccionada" : image.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
