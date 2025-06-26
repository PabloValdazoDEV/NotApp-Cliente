import ButtonGeneral from "../Buttons/ButtonGeneral";

export default function ModalMember({
  btnDelete,
  btnRol,
  data,
  onClickX,
}) {
  return (
    <div className="fixed inset-0 bg-[color:var(--color-primary)]/10 backdrop-blur-sm z-60 flex items-center justify-center px-4">
      <div className="w-full max-w-xs bg-[color:var(--color-background-object)] rounded-lg shadow-lg p-6 flex flex-col gap-5 items-center relative">
        <h2 className="text-center">Estás editando a {data.user.name}</h2>
        <p className="text-center">
          {data.user.name} tiene el rol de{" "}
          {data.role === "ADMIN" ? "Administrador" : "Miembro"}.
        </p>
        <p className="text-center text-xs">
          Como Administrador, puede invitar y eliminar miembros, editar los
          datos del hogar e incluso eliminarlo.
        </p>

        <ButtonGeneral
          onClick={btnRol}
          children={`Cambiar rol a ${
            data.role !== "ADMIN" ? "Administrador" : "Miembro"
          }`}
        />

        <p className="text-center">
          ¿Seguro que deseas eliminar a {data.user.name} del hogar?
        </p>

        <ButtonGeneral
          onClick={btnDelete}
          children={"Sí, eliminar"}
          className="bg-red-500 hover:bg-red-600"
        />

        <button
          onClick={onClickX}
          className="text-sm bg-red-600 text-white px-2 py-2 rounded-3xl w-auto absolute top-[-20px] right-[-20px]"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
