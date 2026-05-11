import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import InputForm from "../Input/InputFind";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import PillGenerical from "../Pill/PillGenerical";
import Pagination from "../Pagination/Pagination";
import { addItemToList } from "../../api/list";
import { filterParamsItems } from "../../api/item";
import { IoMdClose } from "react-icons/io";
import ModalItem from "./ModalItem";
import { getPaginatedRows } from "../../utils/pagination";

export default function ModalItemAdd({
  onClickClosed,
  hogar_id,
  list_id,
  onItemAdded,
  existingItemIds = [],
}) {
  const [itemParams, setItemParams] = useState({
    page: 1,
    name: "",
    category: "",
    supermarket: "",
    element: "productos",
  });
  const [quantities, setQuantities] = useState({});
  const [modalCreateProduct, setModalCreateProduct] = useState(false);

  const { handleSubmit, register, reset } = useForm();

  const onSubmitClearParams = () => {
    setItemParams({
      page: 1,
      name: "",
      category: "",
      supermarket: "",
      element: "productos",
    });
    reset();
  };

  const onSubmiFindItems = (data) => {
    setItemParams((prev) => ({
      ...prev,
      page: 1,
      name: data.nameFindItem || "",
    }));
  };

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["itemsToAddList", hogar_id, itemParams],
    queryFn: () => filterParamsItems({ ...itemParams, id_home: hogar_id }),
  });

  const mutationAddItem = useMutation({
    mutationFn: addItemToList,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message || "Producto añadido correctamente");
        onItemAdded?.();
      }
    },
  });

  useEffect(() => {
    if (error) toast.error("Error al cargar productos");
  }, [error]);

  const itemRows = getPaginatedRows(items);

  const availableItems = itemRows.filter(
    (item) => !existingItemIds.includes(item.id)
  );
  const searchName = itemParams.name.trim();
  const canCreateSearchedProduct = !isLoading && searchName.length > 0;

  const addCreatedProductToList = (item) => {
    if (!item?.id) return;

    mutationAddItem.mutate({
      list_id,
      item_id: item.id,
      quantity: 1,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity p-4">
        <div className="relative w-full max-w-[720px] flex flex-col bg-white rounded-2xl shadow-2xl max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              Añadir producto
            </h1>
            <button
              type="button"
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={onClickClosed}
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            <InputForm
              submitPrimary={handleSubmit(onSubmiFindItems)}
              submitSecondary={onSubmitClearParams}
              placeholder="Nombre del Pro..."
              id="nameFindItem"
              {...register("nameFindItem")}
            />

            <div className="mt-6 flex flex-col gap-4">
              {isLoading && <p className="text-center">Cargando...</p>}
              {items?.success === false && (
                <p className="text-center">
                  No se han podido cargar productos.
                </p>
              )}
              {itemRows.length > 0 && availableItems.length === 0 && (
                <p className="text-center">
                  Todos los productos encontrados ya están en la lista.
                </p>
              )}
              {itemRows.length === 0 && !isLoading && (
                <p className="text-center">No hay productos disponibles.</p>
              )}
              {availableItems.map((item) => {
                const quantity = quantities[item.id] || 1;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-10 gap-3 border-b last:border-0 border-gray-100 pb-4"
                  >
                    {item.image && (
                      <img
                        src={`https://res.cloudinary.com/${
                          import.meta.env.VITE_NAME_CLOUDINARY
                        }/image/upload/f_auto,q_auto,w_500/${item.image}`}
                        alt={item.name}
                        className="col-span-3 md:col-span-2 aspect-square object-cover rounded-xl"
                      />
                    )}
                    <div
                      className={`${
                        item.image
                          ? "col-span-7 md:col-span-5"
                          : "col-span-10 md:col-span-7"
                      } flex flex-col gap-2`}
                    >
                      <h2 className="font-semibold text-gray-900">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {item.description || "Sin descripción."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.price && (
                          <PillGenerical
                            category={`${item.price?.replace(".", ",")}€`}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-span-10 md:col-span-3 flex items-center justify-end gap-3">
                      <div className="flex items-center gap-2">
                        <ButtonGeneral
                          children="-"
                          className={quantity <= 1 ? "opacity-50" : ""}
                          onClick={() => {
                            if (quantity > 1) {
                              setQuantities((prev) => ({
                                ...prev,
                                [item.id]: quantity - 1,
                              }));
                            }
                          }}
                        />
                        <p className="min-w-8 text-center font-semibold">
                          {quantity}
                        </p>
                        <ButtonGeneral
                          children="+"
                          onClick={() => {
                            setQuantities((prev) => ({
                              ...prev,
                              [item.id]: quantity + 1,
                            }));
                          }}
                        />
                      </div>
                      <ButtonGeneral
                        children="Añadir"
                        loading={mutationAddItem.isPending}
                        onClick={() => {
                          mutationAddItem.mutate({
                            list_id,
                            item_id: item.id,
                            quantity,
                          });
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <Pagination
                elementParams={itemParams}
                setElementParams={setItemParams}
                dataParamsMutate={items}
              />
            </div>
          </div>
          {canCreateSearchedProduct && (
            <div className="sticky bottom-0 border-t border-gray-100 bg-white px-6 py-4">
              <ButtonGeneral
                className="w-full"
                onClick={() => setModalCreateProduct(true)}
              >
                Crear &quot;{searchName}&quot; y añadirlo
              </ButtonGeneral>
            </div>
          )}
        </div>
      </div>
      {modalCreateProduct && (
        <ModalItem
          initialName={searchName}
          onCreated={addCreatedProductToList}
          onClickClosed={() => setModalCreateProduct(false)}
        />
      )}
    </>
  );
}
