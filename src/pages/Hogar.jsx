import { useNavigate, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FiFilter, FiDelete } from "react-icons/fi";
import { VscClearAll } from "react-icons/vsc";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHome, updateHome, deleteHome } from "../api/home";
import { IoSyncOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteMember, postInvite, updateMember } from "../api/member";
import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import InputGeneral from "../components/Input/InputGeneral";
import useFilePreview from "../hooks/useFilePreview";
import ModalGeneral from "../components/Modal/ModalGeneral";
import CardItem from "../components/Cards/CardItem";
import ModalItem from "../components/Modal/ModalItem";
import toast from "react-hot-toast";
import ModalMember from "../components/Modal/ModalMember";
import { filterParamsItems } from "../api/item";
import { filterParamsList } from "../api/list";
import CardItemList from "../components/Cards/CardItemList";
import CardList from "../components/Cards/CardList";
import ModalList from "../components/Modal/ModalList";
import InputForm from "../components/Input/InputFind";
import Pagination from "../components/Pagination/Pagination";

export default function () {
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
  const [modalEditMember, setModalEditMember] = useState(null);
  const [modalCreateList, setModalCreateList] = useState(null);
  const [dataEdit, setDataEdit] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [active, setActive] = useState({
    hogar: false,
    productos: elementParams.element === "productos" ? true : false,
    listas: elementParams.element === "lista" ? true : false,
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const [file] = watch(["file"]);
  const [filePreview] = useFilePreview(file);

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

  const mutationUpdateHogar = useMutation({
    mutationFn: updateHome,
    onSuccess: () => {
      setLoading(false);
      toast.success("Hogar actualizado correctamente!");
      queryClient.invalidateQueries();
    },
  });
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
  const mutationInivteHogar = useMutation({
    mutationFn: postInvite,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      queryClient.invalidateQueries();
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
  const mutationUpdateMember = useMutation({
    mutationFn: updateMember,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      queryClient.invalidateQueries();
    },
  });

  // UseEfects

  useEffect(() => {
    if (dataHogar?.members) {
      const isOwner = dataHogar.members.filter(
        (member) => member.user_id === userContext.id
      );
      setIsOwner(isOwner[0].role === "OWNER" || isOwner[0].role === "ADMIN");
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

  useEffect(() => {
    setImageRemoved(false);
  }, [watch("file")]);

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
    console.log(data);
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
  const onSubmitUpdateHogar = (data) => {
    if (data.name.trim().length === 0) {
      setValue("name", dataHogar.name);
    }
    setLoading(true);
    mutationUpdateHogar.mutate({
      ...data,
      id: hogar_id,
      file: imageRemoved ? null : data?.file[0],
      imageDelete: imageRemoved,
    });
    setImageRemoved(false);
  };
  const onSubmitDteleteHogar = () => {
    mutationDeleteHogar.mutate(hogar_id);
  };
  const onSubmitInviteHogar = (data) => {
    mutationInivteHogar.mutate({ ...data, id: hogar_id });
  };

  return (
    <>
      <main className="relative h-full flex flex-col justify-center items-center gap-5">
        <div className="flex flex-row justify-center gap-3 items-center">
          <p
            className={`hover:scale-105 cursor-pointer ${
              active.hogar && "border-b-2 border-[color:var(--color-primary)] "
            } `}
            onClick={() => {
              setActive({ hogar: true, productos: false, listas: false });
              setElementParams({
                element: "",
                page: 1,
                name: "",
                category: "",
              });
            }}
          >
            🏡 Hogar
          </p>
          <span className="border-r-2 h-5 inline-block"></span>

          <p
            className={`hover:scale-105 cursor-pointer ${
              active.productos &&
              "border-b-2 border-[color:var(--color-primary)] "
            } `}
            onClick={() => {
              setActive({ hogar: false, productos: true, listas: false });
              setElementParams({
                element: "productos",
                page: 1,
                name: "",
                category: "",
              });
            }}
          >
            🧺 Productos
          </p>
          <span className="border-r-2 h-5 inline-block"></span>

          <p
            className={`hover:scale-105 cursor-pointer ${
              active.listas && "border-b-2 border-[color:var(--color-primary)] "
            } `}
            onClick={() => {
              setActive({ hogar: false, productos: false, listas: true });
              setElementParams({
                element: "lista",
                page: 1,
                name: "",
                category: "",
              });
            }}
          >
            📝 Listas
          </p>
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
        </div>
        {isLoading && <p className="col-span-4 text-center">Cargando...</p>}
        {error && (
          <div className="col-span-4 text-center">
            Ha habido un error, recarga la página.
          </div>
        )}

        {active.hogar && !isOwner && (
          <ButtonGeneral
            children="Salir del hogar"
            onClick={() => {
              setModalMember(true);
            }}
          />
        )}
        {active.hogar && isOwner && (
          <>
            <form
              onSubmit={handleSubmit(onSubmitUpdateHogar)}
              className="flex flex-col w-full md:w-80 justify-center items-center gap-5"
            >
              <div
                className="w-40 h-40 bg-cover bg-center rounded-full relative"
                style={{
                  backgroundImage: `url(${
                    !imageRemoved
                      ? filePreview
                        ? filePreview
                        : dataHogar?.image
                        ? `https://res.cloudinary.com/${
                            import.meta.env.VITE_NAME_CLOUDINARY
                          }/image/upload/f_auto,q_auto,w_500/${dataHogar.image}`
                        : "/IMG.jpg"
                      : "/IMG.jpg"
                  })`,
                }}
              >
                <input
                  type="file"
                  id="file"
                  className="w-full h-full rounded-full hidden"
                  name="file"
                  {...register("file")}
                />
                <label
                  htmlFor="file"
                  className="w-full h-full bg-white/30 hover:bg-[color:var(--color-primary)]/50 transition-all duration-300 absolute rounded-full flex justify-center items-center text-6xl"
                >
                  {filePreview || dataHogar?.image ? (
                    <IoSyncOutline className="w-10" />
                  ) : (
                    "+"
                  )}
                </label>
                <button
                  onClick={() => {
                    setImageRemoved(true);
                  }}
                  type="button"
                  children={<FaRegTrashAlt />}
                  className="text-md bg-red-600 text-white px-3 py-3 rounded-full aspect-square w-auto absolute top-[-12px] right-[-12px]"
                />
              </div>
              <InputGeneral
                defaultValue={dataHogar?.name}
                type="text"
                id="name"
                name="name"
                {...register("name")}
              />
              <div className="flex flex-row justify-between w-full">
                <ButtonGeneral
                  onClick={() => {
                    setModalDeleteHogar(true);
                  }}
                  className="top-0 right-0 bg-red-500 hover:bg-red-600"
                  children={<FaRegTrashAlt className="text-2xl" />}
                />
                <ButtonGeneral
                  loading={loading}
                  type="submit"
                  children="Guardar los cambios"
                  className="text-white"
                />
              </div>
            </form>
            <h2 className="border-t-1 text-center pt-5 mt-2">
              Invitar al hogar
            </h2>
            <form
              onSubmit={handleSubmit(onSubmitInviteHogar)}
              className="flex flex-row w-full md:w-80 justify-center items-center gap-5"
            >
              <InputGeneral
                type="email"
                id="email"
                name="email"
                {...register("email")}
              />
              <ButtonGeneral
                type="submit"
                children="Invitar"
                className="text-white"
              />
            </form>
            <div className="w-full md:w-80 space-y-5">
              {/* {console.log(dataHogar.members)} */}
              {dataHogar.members.map((member, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-row items-center justify-between w-full"
                  >
                    <p>
                      {member.user.name}
                      {member.role === "OWNER" && " (Dueños del hogar)"}
                      {member.user_id === userContext.id && " (Tú)"}
                    </p>{" "}
                    {member.user_id === userContext.id ||
                      (member.role !== "OWNER" && (
                        <ButtonGeneral
                          children="Editar"
                          onClick={() => {
                            setModalEditMember(member);
                          }}
                        />
                      ))}
                  </div>
                );
              })}
            </div>
          </>
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
              {dataParamsMutateList?.map((item, i) => {
                return (
                  <CardList
                    key={i}
                    data={item}
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
        {modalEditMember && (
          <ModalMember
            onClickClosed={() => {
              setModalEditMember(null);
            }}
            data={modalEditMember}
            onClickX={() => {
              setModalEditMember(null);
            }}
            btnDelete={() => {
              mutationDeleteMember.mutate(modalEditMember.id);
              setModalEditMember(null);
            }}
            btnRol={() => {
              mutationUpdateMember.mutate({
                id: modalEditMember.id,
                role: modalEditMember.role !== "ADMIN" ? "ADMIN" : "MEMBER",
              });

              setModalEditMember(null);
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
      </main>
    </>
  );
}
