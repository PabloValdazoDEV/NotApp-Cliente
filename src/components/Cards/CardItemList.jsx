import { BiCartDownload } from "react-icons/bi";
import PillGenerical from "../Pill/PillGenerical";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { LuSearchX } from "react-icons/lu";
import { BsCartCheckFill } from "react-icons/bs";
import { SUPERMARKET_LABELS } from "../../constants/supermarkets";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCamera, FaExpand } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateItem } from "../../api/item";


export default function CardItemList({
  dataProv,
  type,
  onDelete,
  onQuantityChange,
  onPurchasedQuantityChange,
  onItemUpdated,
  loading = false,
  pending = false,
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const quantity = dataProv?.quantity || 1;
  const purchasedQuantity = dataProv?.purchased_quantity || 0;
  const status = dataProv?.status || (dataProv?.check_take ? "FOUND" : "PENDING");
  const checked = status === "FOUND";
  const notFound = status === "NOT_FOUND";
  const partial = purchasedQuantity > 0 && purchasedQuantity < quantity;
  const product = dataProv?.item;
  const productImageUrl = product?.image
    ? `https://res.cloudinary.com/${
        import.meta.env.VITE_NAME_CLOUDINARY
      }/image/upload/f_auto,q_auto,w_900/${product.image}`
    : "";

  const mutationUploadImage = useMutation({
    mutationFn: updateItem,
    onSuccess: (response) => {
      if (response.success === false) {
        toast.error(response.message);
        return;
      }

      toast.success("Foto del producto actualizada");
      setSelectedFile(null);
      setShowImageModal(false);
      onItemUpdated?.(response.item);
    },
    onError: () => {
      toast.error("Error al subir la foto");
    },
  });

  const handleUploadImage = () => {
    if (!selectedFile || !product) {
      toast.error("Selecciona una foto");
      return;
    }

    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isBadConnection =
      !navigator.onLine ||
      connection?.saveData ||
      ["slow-2g", "2g"].includes(connection?.effectiveType);

    if (isBadConnection) {
      toast.error(
        "La conexión parece mala. No recomendamos subir imágenes ahora mismo."
      );
      return;
    }

    mutationUploadImage.mutate({
      item_id: product.id,
      name: product.name,
      price: product.price || "",
      description: product.description || "",
      categories: product.categories || [],
      supermarket: product.supermarket || "CUALQUIERA",
      file: selectedFile,
      imageDelete: false,
    });
  };

  if(type === "do"){
return (
    <>
      {" "}
      <div
        className={`grid grid-cols-10 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)] ${
          status !== "PENDING" ? "opacity-60" : ""
        } ${
          dataProv.item.image ? "grid-rows-4 " : "grid-rows-4 "
        }`}
      >
        <div
          className={`grid grid-cols-8  col-span-8  gap-3 ${
            "grid-rows-3 row-span-4"
          }`}
        >
          {dataProv.item.image && (
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="group relative col-span-3 row-span-4 overflow-hidden rounded-2xl"
              title="Ver foto"
              aria-label="Ver foto del producto"
            >
              <img
                src={productImageUrl}
                alt={dataProv.item.name}
                className="h-auto aspect-square object-cover rounded-2xl"
              />
              <span className="absolute inset-0 hidden items-center justify-center bg-black/30 text-white group-hover:flex">
                <FaExpand />
              </span>
            </button>
          )}
          {!dataProv.item.image && (
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="col-span-3 row-span-4 flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-(--color-primary) hover:text-(--color-primary)"
              title="Añadir foto"
              aria-label="Añadir foto del producto"
            >
              <FaCamera className="text-2xl" />
            </button>
          )}
          <h2
            className={` text-lg font-semibold leading-tight text-gray-900  ${
              "col-span-5 row-span-1"
            } `}
          >
            {dataProv.item.name}
          </h2>
          <p
            className={` text-sm leading-snug text-gray-600 row-span-1 ${
              "col-span-5"
            } `}
          >
            {dataProv.item.description
              ? dataProv.item.description
              : "No hay descripción."}
          </p>
          <p
            className={` text-sm font-medium text-gray-700 row-span-1 ${
              "col-span-5"
            } `}
          >
            Comprado: {purchasedQuantity}/{quantity}
          </p>
          {partial && (
            <p className="col-span-5 text-xs font-semibold text-amber-600">
              No encontrado: {quantity - purchasedQuantity}
            </p>
          )}
          {pending && (
            <p className="text-xs text-amber-600 row-span-1 col-span-8">
              Pendiente de sincronizar
            </p>
          )}
        </div>
        <div className="col-span-2 row-span-4 my-auto flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowPartialModal(true)}
            className={`flex min-h-20 flex-col items-center justify-center rounded-md px-2 py-3 text-white transition-transform hover:scale-105 ${
              checked
                ? "bg-green-600"
                : notFound
                  ? "bg-red-500"
                  : "bg-[color:var(--color-primary)]"
            }`}
          >
            {checked ? (
              <BsCartCheckFill className="text-2xl" />
            ) : notFound ? (
              <LuSearchX className="text-2xl" />
            ) : (
              <BiCartDownload className="text-2xl" />
            )}
            <span className="mt-1 text-xs font-bold">
              {checked || notFound || partial ? `${purchasedQuantity}/${quantity}` : "Registrar"}
            </span>
          </button>
        </div>
        <div
          className={`flex flex-row gap-3 col-span-10 justify-center ${
            !dataProv.item.categories && "hidden"
          } `}
        >
          {dataProv.item.price && (
            <PillGenerical category={`${dataProv.item.price?.replace(".", ",")}€`} />
          )}
          {dataProv.item.supermarket && dataProv.item.supermarket !== "CUALQUIERA" && (
            <PillGenerical
              category={SUPERMARKET_LABELS[dataProv.item.supermarket] || dataProv.item.supermarket}
            />
          )}
          {dataProv.item.categories.map((category, index) => {
            return <PillGenerical key={index} category={category} />;
          })}
        </div>
      </div>
      {showPartialModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-gray-900">
                  {dataProv.item.name}
                </h2>
                <p className="text-sm text-gray-500">
                  El resto quedará como no encontrado.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPartialModal(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Cerrar"
              >
                <IoMdClose size={22} />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: quantity + 1 }, (_, amount) => {
                  const label =
                    amount === 0
                      ? "Nada"
                      : amount === quantity
                        ? "Todo"
                        : `${amount} de ${quantity}`;

                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        onPurchasedQuantityChange?.(
                          dataProv,
                          amount,
                          amount < quantity ? "NOT_FOUND" : "FOUND"
                        );
                        setShowPartialModal(false);
                      }}
                      className={`rounded-lg border px-3 py-3 text-base font-bold transition ${
                        purchasedQuantity === amount
                          ? "border-(--color-primary) bg-(--color-primary) text-white"
                          : "border-gray-200 bg-white text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-3">
                <ButtonGeneral
                  type="button"
                  className="bg-amber-500 hover:bg-amber-500"
                  onClick={() => {
                    onPurchasedQuantityChange?.(dataProv, 0, "PENDING");
                    setShowPartialModal(false);
                  }}
                >
                  Marcar como pendiente
                </ButtonGeneral>
                <ButtonGeneral
                  type="button"
                  className="bg-gray-500 hover:bg-gray-500"
                  onClick={() => setShowPartialModal(false)}
                >
                  Cancelar
                </ButtonGeneral>
              </div>
            </div>
          </div>
        </div>
      )}
      {showImageModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/70 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-gray-900">
                  {dataProv.item.name}
                </h2>
                <p className="text-sm text-gray-500">Foto del producto</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setShowImageModal(false);
                }}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Cerrar"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto p-4">
              {productImageUrl && (
                <img
                  src={productImageUrl}
                  alt={dataProv.item.name}
                  className="max-h-[65vh] w-full rounded-xl object-contain"
                />
              )}
              {!productImageUrl && (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 text-center">
                  <FaCamera className="mb-3 text-4xl text-gray-500" />
                  <span className="text-sm font-semibold text-gray-800">
                    Añade una foto del producto
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-700">
                  {productImageUrl ? "Cambiar foto" : "Subir foto"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <label
                    htmlFor={`product-camera-${dataProv.item.id}`}
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Hacer foto
                  </label>
                  <label
                    htmlFor={`product-gallery-${dataProv.item.id}`}
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Galería
                  </label>
                </div>
                {selectedFile && (
                  <span className="w-fit rounded-md bg-green-50 px-3 py-1 text-sm text-green-700">
                    {selectedFile.name}
                  </span>
                )}
                <input
                  id={`product-camera-${dataProv.item.id}`}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] || null);
                  }}
                />
                <input
                  id={`product-gallery-${dataProv.item.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] || null);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 p-4">
              <ButtonGeneral
                type="button"
                className="bg-gray-500 hover:bg-gray-500"
                onClick={() => {
                  setSelectedFile(null);
                  setShowImageModal(false);
                }}
              >
                Cancelar
              </ButtonGeneral>
              <ButtonGeneral
                type="button"
                loading={mutationUploadImage.isPending}
                onClick={handleUploadImage}
              >
                Guardar foto
              </ButtonGeneral>
            </div>
          </div>
        </div>
      )}
    </>
  );
  }

  
if(type === "add"){


  return (
    <>
      <div className="grid grid-cols-10 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]">
        {dataProv.item.image && (
          <div className="col-span-3 row-span-2 ">
            <img
              src={`https://res.cloudinary.com/${
                import.meta.env.VITE_NAME_CLOUDINARY
              }/image/upload/f_auto,q_auto,w_500/${dataProv.item.image}`}
              className="h-auto aspect-square object-cover rounded-2xl"
            />
          </div>
        )}

        <div
          className={`row-span-2  ${
            dataProv.item.image ? "col-span-5" : "col-span-7"
          }`}
        >
          <h2>{dataProv.item.name}</h2>
          <p>{dataProv.item.description}</p>
        </div>
        <div
          className={`row-span-2 flex flex-col gap-2 items-end ${
            dataProv.item.image ? "col-span-2" : "col-span-3"
          }`}
        >
          {dataProv.item.categories.map((category, index) => {
            return <PillGenerical key={index} category={category} />;
          })}
           {dataProv.item.price && (
            <PillGenerical category={`${dataProv.item.price?.replace(".", ",")}€`} />
          )}
          {dataProv.item.supermarket && dataProv.item.supermarket !== "CUALQUIERA" && (
            <PillGenerical
              category={SUPERMARKET_LABELS[dataProv.item.supermarket] || dataProv.item.supermarket}
            />
          )}
        </div>
        <div className="col-span-10 row-span-1 flex justify-between items-center gap-3">
          <ButtonGeneral
            children="Borrar"
            className="bg-red-600 hover:bg-red-600"
            loading={loading}
            onClick={() => onDelete?.(dataProv)}
          />
          <div className="flex flex-row gap-3 justify-center items-center">
            <ButtonGeneral
              children="-"
              className={quantity <= 1 ? "opacity-50" : ""}
              loading={loading}
              onClick={() => {
                if (quantity > 1) onQuantityChange?.(dataProv, quantity - 1);
              }}
            />
            <p className="min-w-8 text-center font-semibold">{quantity}</p>
            <ButtonGeneral
              children="+"
              loading={loading}
              onClick={() => onQuantityChange?.(dataProv, quantity + 1)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
}
