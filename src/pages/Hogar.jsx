import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHome, deleteHome } from "../api/home";
import { IoArrowBack } from "react-icons/io5";
import { deleteMember } from "../api/member";
import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import ModalGeneral from "../components/Modal/ModalGeneral";
import CardItem from "../components/Cards/CardItem";
import ModalItem from "../components/Modal/ModalItem";
import toast from "react-hot-toast";
import { filterParamsItems } from "../api/item";
import { filterParamsList } from "../api/list";
import CardList from "../components/Cards/CardList";
import ModalList from "../components/Modal/ModalList";
import InputForm from "../components/Input/InputFind";
import Pagination from "../components/Pagination/Pagination";
import ButtonSecondary from "../components/Buttons/ButtonSecondary";
import ModalEditHogar from "../components/Modal/ModalEditHogar";
import HogarMembers from "./HogarMembers";
import ModalImportItems from "../components/Modal/ModalImportItems";

const getListStatus = (list) => {
  const itemsList = list.itemsList || [];
  const pendingItems = itemsList.filter((itemList) => {
    const status = itemList.status || (itemList.check_take ? "FOUND" : "PENDING");
    return status === "PENDING";
  }).length;

  return {
    isComplete: itemsList.length > 0 && pendingItems === 0,
    createdAt: new Date(list.createdAt || 0).getTime(),
  };
};

const sortListsForHome = (lists = []) => {
  return [...lists].sort((a, b) => {
    const aStatus = getListStatus(a);
    const bStatus = getListStatus(b);

    if (aStatus.isComplete !== bStatus.isComplete) {
      return aStatus.isComplete ? 1 : -1;
    }

    return bStatus.createdAt - aStatus.createdAt;
  });
};

export default function Hogar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hogar_id } = useParams();
  const userContext = useAtomValue(user);

  // UseStates
  const [elementParams, setElementParams] = useState({
    element: searchParams.get("element") || "lista",
    page: Number(searchParams.get("page")) || 1,
    name: searchParams.get("name") || "",
    category: searchParams.get("category") || "",
  });
  const [modalDeleteHogar, setModalDeleteHogar] = useState(false);
  const [modalCreateItem, setModalCreateItem] = useState(false);
  const [modalEditItem, setModalEditItem] = useState(false);
  const [modalMember, setModalMember] = useState(false);
  const [modalCreateList, setModalCreateList] = useState(null);
  const [modalEditHogar, setModalEditHogar] = useState(false);
  const [modalImportItems, setModalImportItems] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [active, setActive] = useState({
    hogar: false,
    productos: elementParams.element === "productos" ? true : false,
    listas: elementParams.element === "lista" ? true : false,
  });

  const { register, handleSubmit, reset } = useForm();

  const {
    data: dataHogar,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getHome", hogar_id],
    queryFn: () => {
      return getHome(hogar_id);
    },
  });

  // Mutations
  const mutationDeleteHogar = useMutation({
    mutationFn: deleteHome,
    onSuccess: () => {
      toast("Hogar borrado correctamente!", {
        icon: "🗑️",
      });
      queryClient.invalidateQueries();
      navigate("/");
    },
  });

  const mutationDeleteMember = useMutation({
    mutationFn: deleteMember,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      queryClient.invalidateQueries();
    },
  });

  // const mutationUpdateMember = useMutation({
  //   mutationFn: updateMember,
  //   onSuccess: (data) => {
  //     if (data.success === false) {
  //       toast.error(data.message);
  //     } else {
  //       toast.success(data.message);
  //     }
  //     queryClient.invalidateQueries();
  //   },
  // });

  // UseEfects

  useEffect(() => {
    if (dataHogar?.members) {
      const isOwner = dataHogar.members.filter(
        (member) => member.user_id === userContext.id
      );
      setIsOwner(isOwner[0].role === "OWNER");
      setIsAdmin(isOwner[0].role === "ADMIN");
    }
  }, [dataHogar, userContext]);

  useEffect(() => {
    setSearchParams(elementParams, { replace: true });
    if (elementParams.element == "lista") {
      mutateFilterParamsList(elementParams);
    } else {
      mutateFilterParamsItem(elementParams);
    }
  }, [elementParams]);

  useEffect(() => {
    setSearchParams(elementParams, { replace: true });
  }, []);

  // Mutations with Data

  const {
    mutate: mutateFilterParamsItem,
    data: dataParamsMutateItem,
    // isLoading: isLoadingParamsMutate,
    // error: errorParamsMutate,
  } = useMutation({
    mutationFn: (params) => filterParamsItems({ ...params, id_home: hogar_id }),
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      }
      queryClient.invalidateQueries();
    },
  });

  const {
    mutate: mutateFilterParamsList,
    data: dataParamsMutateList,
    // isLoading: isLoadingParamsMutate,
    // error: errorParamsMutate,
  } = useMutation({
    mutationFn: (params) => filterParamsList({ ...params, id_home: hogar_id }),
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      }
      queryClient.invalidateQueries();
    },
  });

  // OnSubmits

  const onSubmiFindItems = (data) => {
    setElementParams({
      ...elementParams,
      name: data.nameFindItemMobile || data.nameFindItem,
      element: "productos",
    });
  };
  const onSubmiFindList = (data) => {
    setElementParams({
      ...elementParams,
      title: data.titleFindListMobile || data.titleFindList,
      element: "lista",
    });
  };
  const onSubmitClearParams = () => {
    if (elementParams.element == "lista") {
      mutateFilterParamsList({
        element: "lista",
        page: 1,
        title: "",
        category: "",
      });
    } else {
      mutateFilterParamsItem({
        element: "productos",
        page: 1,
        name: "",
        category: "",
      });
    }
    reset();
  };
  const onSubmitDteleteHogar = () => {
    mutationDeleteHogar.mutate(hogar_id);
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }
  if (error) {
    navigate(-1);
  }

  return (
    <>
      <main className="relative h-full flex flex-col justify-center items-center gap-5 ">
        {/* <div className="flex flex-row justify-center gap-3 items-center">
          <div
            className={` flex-row gap-3 hidden md:flex ml-10 ${
              active.hogar && "md:hidden"
            }`}
          >
            {active.productos && (
              <InputForm
                submitPrimary={handleSubmit(onSubmiFindItems)}
                submitSecondary={onSubmitClearParams}
                placeholder="Nombre del Pro..."
                id="nameFindItem"
                {...register("nameFindItem")}
              />
            )}
            {active.listas && (
              <InputForm
                submitPrimary={handleSubmit(onSubmiFindList)}
                submitSecondary={onSubmitClearParams}
                placeholder="Nombre de la List..."
                id="titleFindList"
                {...register("titleFindList")}
              />
            )}
          </div>
        </div> */}

        {/* {console.log(dataHogar)} */}
        <div className="bg-white  rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden w-full relative">
          <Link
            onClick={() => {
              navigate(-1);
            }}
            className=" no-underline text-white inline-flex mb-4 hover:scale-105 absolute top-5 left-5"
          >
            <IoArrowBack className="text-2xl mr-1 " /> Atras
          </Link>
          <img
            src={`https://lh3.googleusercontent.com/aida-public/AB6AXuDKajS7YlhPUhbXXYWyGWxk6uhNY-WyRJ5kwR2vqfgvsAURnue1NXQcLGbtiU_EWMOhI43KfLzse-yuz6TwfT0Kx1Ihk7ga5VqtL36LJzBNf8POmplgpkG66Gcsw5vnLFUAUkn_qMoSJo2pk2KR1t1Jd9yLjeTGmdhGApLG3OrAqQvdeFqhXEauf2HazCalPkH71qBTNbxpkAvRBqWaSg2BimsmA1sVfclQ_gf8G7-6T040ntj2A5BIV0Huef0nABWcqLiaWkH_hp6Y`}
            alt="Preview imagen perfil"
            className="w-full h-28 object-cover"
          />
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-10 mb-4">
              {dataHogar?.image && (
                <img
                  src={`https://res.cloudinary.com/${
                    import.meta.env.VITE_NAME_CLOUDINARY
                  }/image/upload/f_auto,q_auto,w_500/${dataHogar?.image}`}
                  alt="Preview imagen perfil"
                  className="shadow-md h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-xl bg-white border-4 border-white"
                />
              )}

              <div
                className={`flex flex-col flex-1 min-w-0 mb-1 ${
                  !dataHogar.image && "mt-12"
                }`}
              >
                <h1 className="text-[#111318] text-2xl sm:text-3xl font-bold leading-tight truncate">
                  {dataHogar?.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[#616f89] text-sm font-medium flex flex-row gap-2 items-center">
                    <FaUserGroup /> {dataHogar?.members.length} miembros
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                {isOwner && (
                  <>
                    <ButtonSecondary
                      className="rounded-lg "
                      children="Editar hogar"
                      onClick={() => {
                        setModalEditHogar(true);
                      }}
                    />
                    <ButtonSecondary
                      className="text-red-500"
                      children="Eliminar hogar"
                      onClick={() => {
                        setModalDeleteHogar(true);
                      }}
                    />
                  </>
                )}
                {isAdmin && (
                  <>
                    <ButtonSecondary
                      // className="rounded-lg border border-[#dbdfe6]"
                      children="Editar hogar"
                      onClick={() => {
                        setModalEditHogar(true);
                      }}
                    />
                    <ButtonSecondary
                      className="text-red-500"
                      children="Salir del hogar"
                      onClick={() => {
                        setModalMember(true);
                      }}
                    />
                  </>
                )}
                {!isOwner && !isAdmin && (
                  <ButtonSecondary
                    className="text-red-500 "
                    children="Salir del hogar"
                    onClick={() => {
                      setModalMember(true);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-around md:justify-start border-b border-[#dbdfe6] mt-6 overflow-x-auto no-scrollbar">
              {(isOwner || isAdmin) && (
                <p
                  className={`flex items-center justify-center px-3 py-3 border-b-2 transition-colors cursor-pointer ${
                    active.hogar
                      ? "border-[color:var(--color-primary)]  text-(--color-primary) text-sm font-bold whitespace-nowrap"
                      : "border-transparent text-[#616f89]  text-sm font-semibold whitespace-nowrap hover:text-[#111318]"
                  }`}
                  onClick={() => {
                    setActive({
                      hogar: true,
                      productos: false,
                      listas: false,
                    });
                    setElementParams({
                      element: "",
                      page: 1,
                      name: "",
                      category: "",
                    });
                  }}
                >
                  Miembros
                </p>
              )}
              <p
                className={`flex items-center justify-center px-3 py-3 border-b-2 transition-colors cursor-pointer  ${
                  active.listas
                    ? "border-[color:var(--color-primary)]  text-(--color-primary) text-sm font-bold whitespace-nowrap"
                    : "border-transparent text-[#616f89]  text-sm font-semibold whitespace-nowrap hover:text-[#111318]"
                }`}
                onClick={() => {
                  setActive({
                    hogar: false,
                    productos: false,
                    listas: true,
                  });
                  setElementParams({
                    element: "lista",
                    page: 1,
                    name: "",
                    category: "",
                  });
                }}
              >
                Lista
              </p>
              <p
                className={`flex items-center justify-center px-3 py-3 border-b-2 transition-colors cursor-pointer  ${
                  active.productos
                    ? "border-[color:var(--color-primary)]  text-(--color-primary) text-sm font-bold whitespace-nowrap"
                    : "border-transparent text-[#616f89]  text-sm font-semibold whitespace-nowrap hover:text-[#111318]"
                }`}
                onClick={() => {
                  setActive({
                    hogar: false,
                    productos: true,
                    listas: false,
                  });
                  setElementParams({
                    element: "productos",
                    page: 1,
                    name: "",
                    category: "",
                  });
                }}
              >
                Productos
              </p>
            </div>
          </div>
        </div>

        {/* // No Eliminar
        <div className="bg-white  rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden w-full relative">
          {" "}
          <div className="px-6 py-6 flex flex-row justify-center items-center">
            <InputForm />{" "}
          </div>
        </div> */}

        {isLoading && <p className="col-span-4 text-center">Cargando...</p>}
        {error && (
          <div className="col-span-4 text-center">
            Ha habido un error, recarga la página.
          </div>
        )}
        {active.hogar && (isOwner || isAdmin) && (
          <HogarMembers
            dataHogar={dataHogar}
          />
        )}

        {active.productos && (
          <>
            <InputForm
              submitPrimary={handleSubmit(onSubmiFindItems)}
              submitSecondary={onSubmitClearParams}
              placeholder="Nombre del Pro..."
              id="nameFindItemMobile"
              className={`flex flex-row gap-3 md:hidden w-full ${
                active.hogar && "hidden"
              }`}
              {...register("nameFindItemMobile")}
            />
            <div className="grid md:grid-cols-2 md:gap-10">
              {dataParamsMutateItem?.map((item, i) => {
                return (
                  <CardItem
                    key={i}
                    data={item}
                    active={active}
                    editClick={() => {
                      setModalEditItem(true);
                      setDataEdit(item);
                    }}
                  />
                );
              })}
            </div>
            <div
              className={`bottom-5 right-5 z-40 ${
                dataParamsMutateItem?.length < 3 ? "static" : "fixed"
              } ${
                dataParamsMutateItem?.length < 6 ? "md:static" : "md:fixed"
              } ${dataParamsMutateItem?.length < 9 ? "lg:static" : "lg:fixed"}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {(isOwner || isAdmin) && (
                  <ButtonSecondary
                    className="rounded-full bg-white shadow-lg"
                    onClick={() => {
                      setModalImportItems(true);
                    }}
                  >
                    Importar productos
                  </ButtonSecondary>
                )}
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
                      <span>Crear un Producto</span>
                    </>
                  }
                />
              </div>
            </div>
            <Pagination
              elementParams={elementParams}
              setElementParams={setElementParams}
              dataParamsMutate={dataParamsMutateItem}
            />
          </>
        )}

        {active.listas && (
          <>
            <InputForm
              submitPrimary={handleSubmit(onSubmiFindList)}
              submitSecondary={onSubmitClearParams}
              placeholder="Nombre de la List..."
              id="titleFindListMobile"
              className={`flex flex-row gap-3 md:hidden w-full ${
                active.hogar && "hidden"
              }`}
              {...register("titleFindListMobile")}
            />
            <div className="grid md:grid-cols-2 md:gap-10 gap-5">
              {sortListsForHome(dataParamsMutateList)?.map((item) => {
                return (
                  <CardList
                    key={item.id}
                    data={item}
                    onListCreated={() => {
                      mutateFilterParamsList(elementParams);
                    }}
                    // active={active}
                    // editClick={() => {
                    //   setModalEditItem(true);
                    //   setDataEdit(item);
                    // }}
                  />
                );
              })}
            </div>
            <div
              className={`bottom-5 right-5 z-40 ${
                dataParamsMutateList?.length < 3 ? "static" : "fixed"
              } ${
                dataParamsMutateList?.length < 9 ? "md:static" : "md:fixed"
              } ${
                dataParamsMutateList?.length < 12 ? "lg:static" : "lg:fixed"
              }`}
            >
              <ButtonGeneral
                className="flex items-center gap-2 bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"
                onClick={() => {
                  setModalCreateList(true);
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
                    <span>Crear una Lista</span>
                  </>
                }
              />
            </div>
            <Pagination
              elementParams={elementParams}
              setElementParams={setElementParams}
              dataParamsMutate={dataParamsMutateList}
            />
          </>
        )}

        {modalCreateList && (
          <ModalList
            onClickClosed={() => {
              setModalCreateList(false);
              mutateFilterParamsList(elementParams);
            }}
            id_home={hogar_id}
          />
        )}
        {modalCreateItem && (
          <ModalItem
            onClickClosed={() => {
              setModalCreateItem(false);
              mutateFilterParamsItem(elementParams);
            }}
          />
        )}
        {modalEditItem && (
          <ModalItem
            onClickClosed={() => {
              setModalEditItem(false);
              mutateFilterParamsItem(elementParams);
            }}
            data={dataEdit}
          />
        )}
        {modalImportItems && (
          <ModalImportItems
            currentHomeId={hogar_id}
            currentHomeName={dataHogar?.name}
            onClickClosed={() => {
              setModalImportItems(false);
            }}
            onImported={() => {
              mutateFilterParamsItem(elementParams);
            }}
          />
        )}
        {modalDeleteHogar && (
          <ModalGeneral
            titulo={`Borrar el hogar ${dataHogar?.name}`}
            text="Se borran todos las listas y los demas miembre no podran acceder nunca mas, se perderan todos los datos."
            textBtnGreen="Cancelar"
            textBtnRed="Borrar"
            onClickGreen={() => {
              setModalDeleteHogar(false);
            }}
            onClickRed={() => {
              onSubmitDteleteHogar();
            }}
          />
        )}
        {modalMember && (
          <ModalGeneral
            titulo={`Salir de ${dataHogar?.name}`}
            text="No podras acceder a las lista de este hogar."
            textBtnGreen="Cancelar"
            textBtnRed="Salir"
            onClickGreen={() => {
              setModalMember(false);
            }}
            onClickRed={() => {
              const myMember = dataHogar.members.filter(
                (member) => member.user_id === userContext.id
              );
              if (myMember[0].id) {
                navigate("/home");
              }
              mutationDeleteMember.mutate(myMember[0].id);
            }}
          />
        )}
        {modalEditHogar && (
          <ModalEditHogar
            name={dataHogar?.name}
            image={dataHogar?.image}
            hogar_id={dataHogar?.id}
            clickClose={() => {
              setModalEditHogar(false);
            }}
          />
        )}
      </main>
    </>
  );
}
