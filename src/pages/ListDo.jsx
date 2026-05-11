import { useNavigate, useParams } from "react-router";
import CardItemList from "../components/Cards/CardItemList";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { getList, updateItemList } from "../api/list";
import { getSocketUrl } from "../api/socket";
import InputGeneral from "../components/Input/InputGeneral";
import ButtonSecondary from "../components/Buttons/ButtonSecondary";
import { IoArrowBack } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import SelectSupermarket from "../components/Input/SelectSupermarket";
import { CATEGORY_LABELS } from "../constants/categories";

const PENDING_ACTIONS_KEY = "notapp:listdo:pending-actions";
const ITEM_STATUSES = {
  PENDING: "PENDING",
  FOUND: "FOUND",
  NOT_FOUND: "NOT_FOUND",
};

const getItemsCacheKey = (listId) => `notapp:listdo:items:${listId}`;

const readPendingActions = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_ACTIONS_KEY)) || [];
  } catch {
    return [];
  }
};

const savePendingActionsForList = (listId, actions) => {
  const otherActions = readPendingActions().filter(
    (action) => action.list_id !== listId
  );

  localStorage.setItem(
    PENDING_ACTIONS_KEY,
    JSON.stringify([...otherActions, ...actions])
  );
};

const readCachedItems = (listId) => {
  try {
    return JSON.parse(localStorage.getItem(getItemsCacheKey(listId))) || [];
  } catch {
    return [];
  }
};

const saveCachedItems = (listId, items) => {
  localStorage.setItem(getItemsCacheKey(listId), JSON.stringify(items));
};

const createMutationId = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const upsertItemList = (items, itemList) => {
  const exists = items.some((item) => item.id === itemList.id);
  const nextItems = exists
    ? items.map((item) => (item.id === itemList.id ? { ...item, ...itemList } : item))
    : [...items, itemList];

  return nextItems.sort((a, b) => a.item.name.localeCompare(b.item.name));
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

const getItemSupermarket = (itemList) =>
  itemList.item.supermarket || "CUALQUIERA";

const getItemStatus = (item) =>
  item.status || (item.check_take ? ITEM_STATUSES.FOUND : ITEM_STATUSES.PENDING);

const getPrimaryCategoryIndex = (itemList) => {
  const category = itemList.item.categories?.[0] || "OTROS";
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
};

const sortItemsForShopping = (items, sortMode) =>
  [...items].sort((a, b) => {
    if (sortMode === "category") {
      return (
        getPrimaryCategoryIndex(a) - getPrimaryCategoryIndex(b) ||
        a.item.name.localeCompare(b.item.name)
      );
    }

    const result = a.item.name.localeCompare(b.item.name);
    return sortMode === "asc" ? result : -result;
  });

const getPurchasedState = (purchasedQuantity, quantity, statusOverride) => {
  if (purchasedQuantity >= quantity) {
    return {
      status: ITEM_STATUSES.FOUND,
      check_take: true,
    };
  }

  if (statusOverride === ITEM_STATUSES.NOT_FOUND) {
    return {
      status: ITEM_STATUSES.NOT_FOUND,
      check_take: false,
    };
  }

  return {
    status: ITEM_STATUSES.PENDING,
    check_take: false,
  };
};

export default function ListDo() {
  const { hogar_id, list_id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState(() => readCachedItems(list_id));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [socketConnected, setSocketConnected] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [supermarket, setSupermarket] = useState("");
  const [sortMode, setSortMode] = useState("category");
  const [showFilters, setShowFilters] = useState(false);
  const [pendingActions, setPendingActions] = useState(() =>
    readPendingActions().filter((action) => action.list_id === list_id)
  );

  const {
    data: dataList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getList", list_id],
    queryFn: () => {
      return getList({ hogar_id, list_id });
    },
  });

  const pendingActionIds = useMemo(
    () => new Set(pendingActions.map((action) => action.item_list_id)),
    [pendingActions]
  );

  useEffect(() => {
    if (Array.isArray(dataList)) {
      setItems(dataList);
    }
  }, [dataList]);

  useEffect(() => {
    saveCachedItems(list_id, items);
  }, [items, list_id]);

  useEffect(() => {
    savePendingActionsForList(list_id, pendingActions);
  }, [list_id, pendingActions]);

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  useEffect(() => {
    const socket = io(getSocketUrl(), {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("list:join", { list_id });
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("list:sync", (payload) => {
      if (payload.list_id === list_id && Array.isArray(payload.items)) {
        setItems(payload.items);
      }
    });

    socket.on("itemlist:created", (itemList) => {
      if (itemList.list_id === list_id) {
        setItems((prev) => upsertItemList(prev, itemList));
      }
    });

    socket.on("itemlist:updated", (itemList) => {
      if (itemList.list_id === list_id) {
        setItems((prev) => upsertItemList(prev, itemList));
        if (itemList.clientMutationId) {
          setPendingActions((prev) =>
            prev.filter(
              (action) => action.clientMutationId !== itemList.clientMutationId
            )
          );
        }
      }
    });

    socket.on("itemlist:deleted", (itemList) => {
      if (itemList.list_id === list_id) {
        setItems((prev) => prev.filter((item) => item.id !== itemList.id));
      }
    });

    return () => {
      socket.emit("list:leave", { list_id });
      socket.disconnect();
    };
  }, [list_id]);

  const flushPendingActions = useCallback(async () => {
    if (!navigator.onLine || pendingActions.length === 0) return;

    for (const action of pendingActions) {
      const response = await updateItemList({
        item_list_id: action.item_list_id,
        purchased_quantity: action.purchased_quantity,
        status:
          action.status ||
          (action.check_take ? ITEM_STATUSES.FOUND : ITEM_STATUSES.PENDING),
        clientMutationId: action.clientMutationId,
      });

      if (response.success === false) {
        toast.error(response.message);
        return;
      }

      if (response.itemList) {
        setItems((prev) => upsertItemList(prev, response.itemList));
      }

      setPendingActions((prev) =>
        prev.filter(
          (pendingAction) =>
            pendingAction.clientMutationId !== action.clientMutationId
        )
      );
    }
  }, [pendingActions]);

  useEffect(() => {
    if (isOnline) {
      flushPendingActions();
    }
  }, [flushPendingActions, isOnline]);

  useEffect(() => {
    if (socketConnected) {
      flushPendingActions();
    }
  }, [flushPendingActions, socketConnected]);

  const handleStatusChange = (itemList, status) => {
    const quantity = itemList.quantity || 1;
    const purchasedQuantity =
      status === ITEM_STATUSES.FOUND ? quantity : 0;
    const action = {
      type: "update-status",
      list_id,
      item_list_id: itemList.id,
      status,
      purchased_quantity: purchasedQuantity,
      clientMutationId: createMutationId(),
      createdAt: Date.now(),
    };

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemList.id
          ? {
              ...item,
              status,
              purchased_quantity: purchasedQuantity,
              check_take: status === ITEM_STATUSES.FOUND,
            }
          : item
      )
    );

    setPendingActions((prev) => [
      ...prev.filter((pendingAction) => pendingAction.item_list_id !== itemList.id),
      action,
    ]);
  };

  const handlePurchasedQuantityChange = (
    itemList,
    purchasedQuantity,
    statusOverride
  ) => {
    const quantity = itemList.quantity || 1;
    const nextPurchasedQuantity = Math.max(
      0,
      Math.min(quantity, purchasedQuantity)
    );
    const nextState = getPurchasedState(
      nextPurchasedQuantity,
      quantity,
      statusOverride
    );
    const action = {
      type: "update-purchased-quantity",
      list_id,
      item_list_id: itemList.id,
      purchased_quantity: nextPurchasedQuantity,
      status: nextState.status,
      clientMutationId: createMutationId(),
      createdAt: Date.now(),
    };

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemList.id
          ? {
              ...item,
              purchased_quantity: nextPurchasedQuantity,
              status: nextState.status,
              check_take: nextState.check_take,
            }
          : item
      )
    );

    setPendingActions((prev) => [
      ...prev.filter(
        (pendingAction) => pendingAction.item_list_id !== itemList.id
      ),
      action,
    ]);
  };

  const handleItemUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((itemList) =>
        itemList.item_id === updatedItem.id
          ? { ...itemList, item: { ...itemList.item, ...updatedItem } }
          : itemList
      )
    );
  };

  const filteredItems = useMemo(() => {
    const searchNormalized = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch = item.item.name
          .toLowerCase()
          .includes(searchNormalized);
        const matchesCategory =
          !category || category === "0" || item.item.categories?.includes(category);
        const matchesSupermarket =
          !supermarket || getItemSupermarket(item) === supermarket;

        return matchesSearch && matchesCategory && matchesSupermarket;
      })
      .sort((a, b) => {
        if (sortMode === "category") {
          return (
            getPrimaryCategoryIndex(a) - getPrimaryCategoryIndex(b) ||
            a.item.name.localeCompare(b.item.name)
          );
        }

        const result = a.item.name.localeCompare(b.item.name);
        return sortMode === "asc" ? result : -result;
      });
  }, [category, items, search, sortMode, supermarket]);

  const pendingItems = filteredItems.filter(
    (item) => getItemStatus(item) === ITEM_STATUSES.PENDING
  );
  const checkedItems = filteredItems.filter(
    (item) => getItemStatus(item) === ITEM_STATUSES.FOUND
  );
  const notFoundItems = filteredItems.filter(
    (item) => getItemStatus(item) === ITEM_STATUSES.NOT_FOUND
  );
  const renderCards = (sectionItems) =>
    sortItemsForShopping(sectionItems, sortMode).map((item) => (
      <CardItemList
        dataProv={item}
        type="do"
        key={item.id}
        pending={pendingActionIds.has(item.id)}
        onStatusChange={handleStatusChange}
        onPurchasedQuantityChange={handlePurchasedQuantityChange}
        onItemUpdated={handleItemUpdated}
      />
    ));

  const renderStatusBlock = (title, sectionItems, titleTag = "h2") => {
    if (sectionItems.length === 0) return null;
    const Title = titleTag;

    return (
      <section className="flex flex-col gap-3">
        <Title className="font-semibold text-gray-900">{title}</Title>
        {renderCards(sectionItems)}
      </section>
    );
  };

  if (isLoading && items.length === 0) {
    return <p className="text-center">Cargando...</p>;
  }
  if ((error || dataList?.success === false) && items.length === 0) {
   return <p className="text-center">Ha habido un error, recarga la página.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ButtonSecondary
            className="w-fit"
            onClick={() => navigate(`/hogar/${hogar_id}`)}
            children={
              <span className="flex items-center gap-2">
                <IoArrowBack /> Volver
              </span>
            }
          />
          <h1 className="text-2xl font-bold text-gray-900">Hacer la compra</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span
            className={`px-3 py-1 rounded-md ${
              isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isOnline ? "Online" : "Sin conexión"}
          </span>
          <span
            className={`px-3 py-1 rounded-md ${
              socketConnected
                ? "bg-blue-100 text-blue-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {socketConnected ? "Tiempo real activo" : "Reconectando tiempo real"}
          </span>
          {pendingActions.length > 0 && (
            <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-700">
              {pendingActions.length} cambio pendiente
            </span>
          )}
          {(error || dataList?.success === false) && items.length > 0 && (
            <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-700">
              Mostrando copia local
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <InputGeneral
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar producto..."
        />
        <ButtonSecondary
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          children={
            <span className="flex items-center gap-2">
              <FaSlidersH /> Filtros
            </span>
          }
        />
      </div>

      {showFilters && (
        <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors outline-none text-base"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <SelectSupermarket
            value={supermarket}
            onChange={setSupermarket}
            includeAll
          />
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors outline-none text-base"
          >
            <option value="category">Categorías</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-center">Esta lista todavía no tiene productos.</p>
      )}

      {items.length > 0 && filteredItems.length === 0 && (
        <p className="text-center">No hay productos con esos filtros.</p>
      )}

      {renderStatusBlock("Faltan", pendingItems)}
      {renderStatusBlock("Productos no encontrados", notFoundItems)}
      {renderStatusBlock("Comprados", checkedItems)}
    </div>
  );
}
