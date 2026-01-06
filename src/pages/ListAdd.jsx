import { useParams, useSearchParams } from "react-router";
import CardItemList from "../components/Cards/CardItemList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllItemList } from "../api/list";
import Pagination from "../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import ModalItem from "../components/Modal/ModalItem";
import ModalItemAdd from "../components/Modal/ModalItemAdd";
import InputForm from "../components/Input/InputFind";
import { useForm } from "react-hook-form";

export default function ListAdd() {
  const queryClient = useQueryClient();

  const { hogar_id, list_id } = useParams();
  const [modalCreateItem, setModalCreateItem] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [elementParams, setElementParams] = useState({
    page: Number(searchParams.get("page")) || 1,
    name: searchParams.get("name") || "",
    category: searchParams.get("category") || "",
  });

  // console.log(hogar_id, list_id);

    const {
      handleSubmit,
      register,
      reset,
      formState: { errors },
    } = useForm();

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
    // console.log({...data, id_home: id_home});
    // setLoadingAnimation(true);
  };

  const onSubmitClearParams = () => {
    setElementParams({
    page: 1,
    name: "",
    category: "",
  });
    reset();
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

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <p>Page List add</p>

      <InputForm
        submitPrimary={handleSubmit(onSubmiFindItems)}
        submitSecondary={onSubmitClearParams}
        placeholder="Nombre del Pro..."
        id="name"
        {...register("name")}
      />

      {dataParamsMutateList ?
        dataParamsMutateList.map((data, i) => (
          <CardItemList dataProv={data} type={"add"} key={i} />
        )) : dataList.map((data, i) => (
          <CardItemList dataProv={data} type={"add"} key={i} />
        ))}

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
          onClickClosed={() => {
            setModalCreateItem(false);
            // mutateFilterParamsItem(elementParams);
          }}
        />
      )}
    </div>
  );
}
