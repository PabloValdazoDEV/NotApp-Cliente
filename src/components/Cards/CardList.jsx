import ButtonGeneral from "../Buttons/ButtonGeneral";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createListFromNotFound } from "../../api/list";

const getItemStatus = (itemList) => {
  if (itemList.status) return itemList.status;
  return itemList.check_take ? "FOUND" : "PENDING";
};

const getPercent = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

export default function CardList({ data, onListCreated }) {
  const navigate = useNavigate();

  const iso = data.createdAt;
  const d = new Date(iso);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  const outDate = `${dd}-${mm}-${yy}`;
  const itemsList = data.itemsList || [];
  const totalItems = itemsList.reduce(
    (total, itemList) => total + (itemList.quantity || 1),
    0
  );
  const foundItems = itemsList.reduce((total, itemList) => {
    const quantity = itemList.quantity || 1;
    const purchasedQuantity = Math.min(
      itemList.purchased_quantity || 0,
      quantity
    );
    const status = getItemStatus(itemList);

    if (status === "FOUND") return total + quantity;
    if (status === "NOT_FOUND") return total + purchasedQuantity;
    return total + purchasedQuantity;
  }, 0);
  const pendingItems = itemsList.reduce((total, itemList) => {
    const quantity = itemList.quantity || 1;
    const purchasedQuantity = Math.min(
      itemList.purchased_quantity || 0,
      quantity
    );

    if (getItemStatus(itemList) !== "PENDING") return total;
    return total + Math.max(quantity - purchasedQuantity, 0);
  }, 0);
  const notFoundItems = itemsList.reduce((total, itemList) => {
    const quantity = itemList.quantity || 1;
    const purchasedQuantity = Math.min(
      itemList.purchased_quantity || 0,
      quantity
    );

    if (getItemStatus(itemList) !== "NOT_FOUND") return total;
    return total + Math.max(quantity - purchasedQuantity, 0);
  }, 0);
  const foundPercent = getPercent(foundItems, totalItems);
  const pendingPercent = getPercent(pendingItems, totalItems);
  const notFoundPercent = getPercent(notFoundItems, totalItems);
  const canCreateFromNotFound = notFoundItems > 0 && pendingItems === 0;

  const mutationCreateFromNotFound = useMutation({
    mutationFn: createListFromNotFound,
    onSuccess: (response) => {
      if (response.success === false) {
        toast.error(response.message);
      } else {
        toast.success(response.message || "Lista creada correctamente");
        onListCreated?.();
      }
    },
  });

  return (
    <>
      <div className="grid grid-cols-10 gap-3 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]">
        <div className="col-span-6">
          <p>{data.title}</p>
          <p className="text-xs mt-1 font-thin">Creado el {outDate}</p>
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-3">
          <ButtonGeneral
          className="flex justify-center items-center"
            type="button"
            title="Editar lista"
            ariaLabel="Editar lista"
            children={<MdEditNote className="text-2xl text-white" />}
            onClick={() => {
              navigate(`/hogar/${data.home_id}/${data.id}/add`);
            }}
          />
          <ButtonGeneral
            type="button"
            className="flex justify-center items-center"
            title="Hacer la compra"
            ariaLabel="Hacer la compra"
            children={
              <MdOutlineShoppingCartCheckout className="text-xl text-white" />
            }
            onClick={() => {
              navigate(`/hogar/${data.home_id}/${data.id}/do`);
            }}
          />
        </div>

        <div className="col-span-full flex flex-col gap-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            {totalItems > 0 && (
              <div className="flex h-full w-full">
                <div
                  className="bg-green-500"
                  style={{ width: `${foundPercent}%` }}
                />
                <div
                  className="bg-amber-400"
                  style={{ width: `${pendingPercent}%` }}
                />
                <div
                  className="bg-red-500"
                  style={{ width: `${notFoundPercent}%` }}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-3">
            <span className="rounded-md bg-green-50 px-2 py-1 text-green-700">
              Comprados: {foundItems}/{totalItems} ({foundPercent}%)
            </span>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-amber-700">
              Faltan: {pendingItems}/{totalItems} ({pendingPercent}%)
            </span>
            <span className="rounded-md bg-red-50 px-2 py-1 text-red-700">
              No encontrados: {notFoundItems}/{totalItems} ({notFoundPercent}%)
            </span>
          </div>
          {totalItems === 0 && (
            <p className="text-xs text-gray-500">Esta lista no tiene productos.</p>
          )}
        </div>

        <div className="col-span-full">
          {canCreateFromNotFound && (
            <ButtonGeneral
              className="w-full bg-red-600 hover:bg-red-600"
              loading={mutationCreateFromNotFound.isPending}
              children="Nueva lista con no encontrados"
              onClick={() => {
                mutationCreateFromNotFound.mutate({
                  list_id: data.id,
                  title: `No encontrados - ${data.title}`,
                });
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
