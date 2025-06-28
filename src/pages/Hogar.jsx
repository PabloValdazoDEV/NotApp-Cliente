import { useNavigate, useParams, useSearchParams } from "react-router";
import ButtonGeneral from "../components/Buttons/ButtonGeneral";
import { useEffect, useState } from "react";
import InputGeneral from "../components/Input/InputGeneral";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHome, updateHome, deleteHome } from "../api/home";
import useFilePreview from "../hooks/useFilePreview";
import { IoSyncOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import ModalGeneral from "../components/Modal/ModalGeneral";
import CardItem from "../components/Cards/CardItem";
import ModalItem from "../components/Modal/ModalItem";
import toast from "react-hot-toast";
import { deleteMember, postInvite, updateMember } from "../api/member";
import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";
import ModalMember from "../components/Modal/ModalMember";

export default function () {
  const queryClient = useQueryClient();
  //   const [searchParams, setSearchParams] = useSearchParams();
  //   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const { hogar_id } = useParams();
  const [modalDeleteHogar, setModalDeleteHogar] = useState(false);
  const [modalCreateItem, setModalCreateItem] = useState(false);
  const [modalEditItem, setModalEditItem] = useState(false);
  const [modalMember, setModalMember] = useState(false);
  const [modalEditMember, setModalEditMember] = useState(null);
  const [dataEdit, setDataEdit] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const userContext = useAtomValue(user);

  const [active, setActive] = useState({
    hogar: false,
    productos: true,
    listas: false,
  });
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch } = useForm();

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

  useEffect(() => {
    if (dataHogar?.members) {
      const isOwner = dataHogar.members.filter(
        (member) => member.user_id === userContext.id
      );
      setIsOwner(isOwner[0].role === "OWNER" || isOwner[0].role === "ADMIN");
    }
  }, [dataHogar, userContext]);

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

  const onSubmit = (data) => {
    console.log(data);
  };

  const onSubmitUpdateHogar = (data) => {
    if (data.name.trim().length === 0) {
      setValue("name", dataHogar.name);
    }
    setLoading(true);
    mutationUpdateHogar.mutate({ ...data, id: hogar_id, file: data.file[0] });
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
                  active.hogar &&
                  "border-b-2 border-[color:var(--color-primary)] "
                } `}
                onClick={() => {
                  setActive({ hogar: true, productos: false, listas: false });
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
            }}
          >
            📝 Listas
          </p>
          <div
            className={` flex-row gap-3 hidden md:flex ml-10 ${
              active.hogar && "md:hidden"
            }`}
          >
            <InputGeneral />
            <ButtonGeneral
              children={<FaMagnifyingGlass className="text-xl text-white" />}
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-row gap-3 md:hidden w-full ${
            active.hogar && "hidden"
          }`}
        >
          <InputGeneral
            placeholder={`Nombre ${
              active.listas ? "de la Lista" : "del Producto"
            }`}
            type="text"
            id="nameFind"
            name="nameFind"
            {...register("nameFind")}
          />
          <ButtonGeneral
            type="submit"
            children={<FaMagnifyingGlass className="text-xl text-white" />}
          />
        </form>

        {isLoading && <p className="col-span-4 text-center">Cargando...</p>}
        {error && (
          <div className="col-span-4 text-center">
            Ha habido un error recarga la página
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
                    filePreview
                      ? filePreview
                      : dataHogar?.image
                      ? `https://res.cloudinary.com/${
                          import.meta.env.VITE_NAME_CLOUDINARY
                        }/image/upload/f_auto,q_auto,w_500/${dataHogar.image}`
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
            <div className="grid md:grid-cols-2 md:gap-10">
              {dataHogar?.items.map((item, i) => {
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
                dataHogar?.items?.length < 3 ? "static" : "fixed"
              } ${dataHogar?.items?.length < 6 ? "md:static" : "md:fixed"} ${
                dataHogar?.items?.length < 9 ? "lg:static" : "lg:fixed"
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
                    <span>Crear un Producto</span>
                  </>
                }
              />
            </div>
          </>
        )}
        {active.listas && (
          <div
            className={`bottom-5 right-5 z-40 ${
              dataHogar?.listas?.length < 5 ? "static" : "fixed"
            } ${dataHogar?.listas?.length < 9 ? "md:static" : "md:fixed"} ${
              dataHogar?.listas?.length < 12 ? "lg:static" : "lg:fixed"
            }`}
          >
            <ButtonGeneral
              className="flex items-center gap-2 bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"
              onClick={() => {
                // navigate("/hogar/crear-hogar");
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
                  <span>Crear un Lista</span>
                </>
              }
            />
          </div>
        )}
        {modalCreateItem && (
          <ModalItem
            onClickClosed={() => {
              setModalCreateItem(false);
            }}
          />
        )}
        {modalEditItem && (
          <ModalItem
            onClickClosed={() => {
              setModalEditItem(false);
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
