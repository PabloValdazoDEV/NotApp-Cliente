import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { getAllHomesUser, getHome } from "../../api/home";
import { importItemsFromHome } from "../../api/item";
import { user } from "../../store/userAtom";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import ButtonSecondary from "../Buttons/ButtonSecondary";

export default function ModalImportItems({
  currentHomeId,
  currentHomeName,
  onClickClosed,
  onImported,
}) {
  const userContext = useAtomValue(user);
  const [sourceHomeId, setSourceHomeId] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const { data: homesData, isLoading: isLoadingHomes } = useQuery({
    queryKey: ["getAllHomesUser", userContext?.id],
    queryFn: () => getAllHomesUser(userContext.id),
    enabled: Boolean(userContext?.id),
  });

  const sourceHomes = useMemo(() => {
    if (!Array.isArray(homesData)) return [];
    return homesData.filter((home) => home.id !== currentHomeId);
  }, [currentHomeId, homesData]);

  const { data: sourceHome, isLoading: isLoadingSourceHome } = useQuery({
    queryKey: ["getHome", sourceHomeId],
    queryFn: () => getHome(sourceHomeId),
    enabled: Boolean(sourceHomeId),
  });

  const sourceItems = useMemo(() => {
    if (!Array.isArray(sourceHome?.items)) return [];
    return sourceHome.items;
  }, [sourceHome?.items]);

  useEffect(() => {
    if (sourceHomes.length > 0 && !sourceHomeId) {
      setSourceHomeId(sourceHomes[0].id);
    }
  }, [sourceHomeId, sourceHomes]);

  useEffect(() => {
    setSelectedItemIds(sourceItems.map((item) => item.id));
  }, [sourceItems]);

  const mutationImportItems = useMutation({
    mutationFn: importItemsFromHome,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message || "Productos importados correctamente");
      onImported?.();
      onClickClosed();
    },
    onError: () => {
      toast.error("Error al importar productos");
    },
  });

  const toggleItem = (itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((selectedItemId) => selectedItemId !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAllItems = () => {
    if (selectedItemIds.length === sourceItems.length) {
      setSelectedItemIds([]);
      return;
    }

    setSelectedItemIds(sourceItems.map((item) => item.id));
  };

  const handleImport = () => {
    if (!sourceHomeId) {
      toast.error("Selecciona un hogar de origen");
      return;
    }

    if (selectedItemIds.length === 0) {
      toast.error("Selecciona al menos un producto");
      return;
    }

    mutationImportItems.mutate({
      source_home_id: sourceHomeId,
      target_home_id: currentHomeId,
      item_ids: selectedItemIds,
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-[680px] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Importar productos
            </h2>
            <p className="text-sm text-gray-500">
              Se copiarán como productos nuevos en {currentHomeName}.
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Hogar de origen
            </label>
            <select
              value={sourceHomeId}
              onChange={(event) => setSourceHomeId(event.target.value)}
              className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-base text-gray-900 outline-none transition-colors focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary)"
              disabled={isLoadingHomes || sourceHomes.length === 0}
            >
              {sourceHomes.length === 0 && (
                <option value="">No hay otros hogares disponibles</option>
              )}
              {sourceHomes.map((home) => (
                <option key={home.id} value={home.id}>
                  {home.name}
                </option>
              ))}
            </select>
          </div>

          {isLoadingSourceHome && (
            <p className="text-center text-sm text-gray-500">
              Cargando productos...
            </p>
          )}

          {!isLoadingSourceHome && sourceHomeId && sourceItems.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              Este hogar no tiene productos para importar.
            </p>
          )}

          {sourceItems.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-700">
                  {selectedItemIds.length} de {sourceItems.length} productos
                  seleccionados
                </p>
                <ButtonSecondary
                  type="button"
                  onClick={toggleAllItems}
                  className="h-9 px-3"
                >
                  {selectedItemIds.length === sourceItems.length
                    ? "Quitar todos"
                    : "Seleccionar todos"}
                </ButtonSecondary>
              </div>

              <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {sourceItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-(--color-primary) hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 h-4 w-4 accent-(--color-primary)"
                    />
                    {item.image && (
                      <img
                        src={`https://res.cloudinary.com/${
                          import.meta.env.VITE_NAME_CLOUDINARY
                        }/image/upload/f_auto,q_auto,w_200/${item.image}`}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-gray-900">
                        {item.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {item.description || "Sin descripción"}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 p-5">
          <ButtonSecondary type="button" onClick={onClickClosed}>
            Cancelar
          </ButtonSecondary>
          <ButtonGeneral
            type="button"
            loading={mutationImportItems.isPending}
            onClick={handleImport}
          >
            Importar
          </ButtonGeneral>
        </div>
      </div>
    </div>
  );
}
