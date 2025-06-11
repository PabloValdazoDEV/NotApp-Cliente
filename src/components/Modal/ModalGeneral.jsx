import ButtonGeneral from "../Buttons/ButtonGeneral";

export default function ModalGeneral({
  titulo = "Titulo",
  text = "Escibre algo",
  textBtnGreen = "Aceptar",
  textBtnRed = "Cancelar",
  onClickGreen,
  onClickRed,
}) {
  return (
    <div className="fixed inset-0 bg-[color:var(--color-primary)]/10 backdrop-blur-sm z-60 flex items-center justify-center px-4">
      <div className="w-full max-w-xs bg-[color:var(--color-background-object)] rounded-lg shadow-lg p-6 flex flex-col gap-5 items-center relative">
        <h2 className="text-center">{titulo}</h2>
        <p className="text-center">{text}</p>
        <div className="flex flex-row gap-5 ">
          <ButtonGeneral
            onClick={onClickRed}
            children={textBtnRed}
            className="bg-red-500 hover:bg-red-600"
          />
          <ButtonGeneral onClick={onClickGreen} children={textBtnGreen} />
        </div>
        <button
          onClick={onClickGreen}
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
