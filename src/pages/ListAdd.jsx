import { useNavigate, useParams, useSearchParams } from "react-router";
import CardItemList from "../components/Cards/CardItemList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteItemList,
  deleteList,
  getAllItemList,
  getListHome,
  updateItemList,
  updateList,
} from "../api/list";
import Pagination from "../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import ModalItem from "../components/Modal/ModalItem";
import ModalItemAdd from "../components/Modal/ModalItemAdd";
import InputForm from "../components/Input/InputFind";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ButtonSecondary from "../components/Buttons/ButtonSecondary";
import { IoArrowBack } from "react-icons/io5";
import InputGeneral from "../components/Input/InputGeneral";
import ModalGeneral from "../components/Modal/ModalGeneral";

export default function ListAdd() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { hogar_id, list_id } = useParams();
  const [modalCreateItem, setModalCreateItem] = useState(false);
  const [modalDeleteList, setModalDeleteList] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [elementParams, setElementParams] = useState({
    page: Number(searchParams.get("page")) || 1,
    name: searchParams.get("name") || "",
    category: searchParams.get("category") || "",
  });

  // console.log(hogar_id, list_id);

  const { handleSubmit, register, reset } = useForm();
  const {
    handleSubmit: handleSubmitList,
    register: registerList,
    reset: resetList,
    formState: { errors: errorsList },
  } = useForm();

  const { data: dataHomeLists } = useQuery({
    queryKey: ["getListHome", hogar_id],
    queryFn: () => getListHome(hogar_id),
  });

  const {
    data: dataList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getListAdd", list_id],
    queryFn: () => {
      return getAllItemList({ ...elementParams, id_list: list_id });
    },
  });

  const {
    mutate: mutateFilterParamsList,
    data: dataParamsMutateList,
    // isLoading: isLoadingParamsMutate,
    // error: errorParamsMutate,
  } = useMutation({
    mutationFn: (params) => getAllItemList({ ...params, id_list: list_id }),
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      }
      queryClient.invalidateQueries();
    },
  });

  const mutationUpdateItemList = useMutation({
    mutationFn: updateItemList,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message || "Producto actualizado correctamente");
        mutateFilterParamsList(elementParams);
      }
    },
  });

  const mutationDeleteItemList = useMutation({
    mutationFn: deleteItemList,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message || "Producto eliminado correctamente");
        mutateFilterParamsList(elementParams);
      }
    },
  });

  const mutationUpdateList = useMutation({
    mutationFn: updateList,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message || "Lista actualizada correctamente");
        queryClient.invalidateQueries();
      }
    },
  });

  const mutationDeleteList = useMutation({
    mutationFn: deleteList,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message || "Lista eliminada correctamente");
        navigate(`/hogar/${hogar_id}`);
      }
    },
  });

  useEffect(() => {
    setSearchParams(elementParams, { replace: true });
    mutateFilterParamsList(elementParams);
    // console.log(elementParams);
  }, [elementParams]);

  useEffect(() => {
    setSearchParams(elementParams, { replace: true });
  }, []);

  const onSubmiFindItems = (data) => {
    setElementParams((prev) => ({
      ...prev,
      page: 1,
      name: data.name,
    }));
  };

  const onSubmitClearParams = () => {
    setElementParams({
      page: 1,
      name: "",
      category: "",
    });
    reset();
  };

  const currentList = dataHomeLists?.data?.lists?.find(
    (list) => list.id === list_id
  );

  useEffect(() => {
    if (currentList?.title) {
      resetList({ title: currentList.title });
    }
  }, [currentList?.title, resetList]);

  const onSubmitUpdateList = (data) => {
    mutationUpdateList.mutate({
      list_id,
      title: data.title,
    });
  };

  if (isLoading) {
    return <p className="text-center">Cargando...</p>;
  }
  if (error || dataList.success === false) {
    return (
      <p className="text-center">Ha habido un error, recarga la página.</p>
    );
  }

  // console.log(dataParamsMutateList)
  const currentItems = dataParamsMutateList || dataList;

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ButtonSecondary
          className="w-fit"
          onClick={() => navigate(`/hogar/${hogar_id}`)}
          children={
            <span className="flex items-center gap-2">
              <IoArrowBack /> Volver
            </span>
          }
        />
        <h1 className="text-2xl font-bold text-gray-900">Editar lista</h1>
      </div>

      <form
        className="grid w-full gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_auto_auto]"
        onSubmit={handleSubmitList(onSubmitUpdateList)}
      >
        <div>
          <InputGeneral
            placeholder="Nombre de la lista"
            {...registerList("title", { required: true })}
          />
          {errorsList.title && (
            <p className="mt-1 text-xs text-red-500">
              El nombre de la lista es obligatorio
            </p>
          )}
        </div>
        <ButtonGeneral
          type="submit"
          loading={mutationUpdateList.isPending}
          children="Guardar nombre"
        />
        <ButtonSecondary
          type="button"
          className="text-red-500"
          children="Eliminar lista"
          onClick={() => setModalDeleteList(true)}
        />
      </form>

      <InputForm
        submitPrimary={handleSubmit(onSubmiFindItems)}
        submitSecondary={onSubmitClearParams}
        placeholder="Nombre del Pro..."
        id="name"
        {...register("name")}
      />

      {currentItems?.length === 0 && (
        <p className="text-center">Esta lista todavía no tiene productos.</p>
      )}

      <div className="grid w-full gap-5 md:grid-cols-2">
        {currentItems?.map((data) => (
          <CardItemList
            dataProv={data}
            type="add"
            key={data.id}
            loading={
              mutationUpdateItemList.isPending || mutationDeleteItemList.isPending
            }
            onDelete={(itemList) => {
              mutationDeleteItemList.mutate(itemList.id);
            }}
            onQuantityChange={(itemList, quantity) => {
              mutationUpdateItemList.mutate({
                item_list_id: itemList.id,
                quantity,
              });
            }}
          />
        ))}
      </div>

      <div
        className={`bottom-5 right-5 z-40 ${
          dataParamsMutateList?.length || dataList?.length < 3
            ? "static"
            : "fixed"
        } ${
          dataParamsMutateList?.length || dataList?.length < 6
            ? "md:static"
            : "md:fixed"
        } ${
          dataParamsMutateList?.length || dataList?.length < 9
            ? "lg:static"
            : "lg:fixed"
        }`}
      >
        <ButtonGeneral
          className="flex items-center gap-2 bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"
          onClick={() => {
            setModalCreateItem(true);
          }}
          children={
            <>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v12M6 12h12"
                />
              </svg>
              <span>Añadir un Producto</span>
            </>
          }
        />
      </div>

      <Pagination
        elementParams={elementParams}
        setElementParams={setElementParams}
        dataParamsMutate={dataParamsMutateList}
      />
      {modalCreateItem && (
        <ModalItemAdd
          hogar_id={hogar_id}
          list_id={list_id}
          existingItemIds={currentItems?.map((itemList) => itemList.item_id)}
          onItemAdded={() => {
            mutateFilterParamsList(elementParams);
          }}
          onClickClosed={() => {
            setModalCreateItem(false);
          }}
        />
      )}
      {modalDeleteList && (
        <ModalGeneral
          titulo={`Eliminar ${currentList?.title || "esta lista"}`}
          text="Se eliminarán todos los productos de esta lista. Esta acción no se puede deshacer."
          textBtnGreen="Cancelar"
          textBtnRed="Eliminar"
          onClickGreen={() => setModalDeleteList(false)}
          onClickRed={() => {
            mutationDeleteList.mutate(list_id);
          }}
        />
      )}
    </div>
  );
}
