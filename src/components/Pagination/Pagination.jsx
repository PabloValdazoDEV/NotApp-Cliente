export default function Pagination({
    elementParams,
    setElementParams,
    dataParamsMutate,

}) {

      const paginationHtmlList = [];

  {
    for (let i = 0; i < 5; i++) {
      if (+elementParams.page + i - 2 > 0) {
        paginationHtmlList.push(
          <button
            key={i}
            onClick={() =>
              setElementParams({
                ...elementParams,
                page: +elementParams.page + i - 2,
              })
            }
            disabled={i == 2 || (dataParamsMutate?.length != 10 && i > 2)}
            className={`bg-[color:var(--color-primary)] text-sm text-white px-3 py-2 rounded  ${
              i == 2 || (dataParamsMutate?.length != 10 && i > 2)
                ? "bg-[color:var(--color-primary)]/50"
                : "bg-[color:var(--color-primary)] cursor-pointer transition-transform duration-200 hover:scale-105"
            }`}
          >
            {+elementParams.page + i - 2}
          </button>
        );
      }
    }
  }

  return (
    <div className="flex flex-row justify-center items-center w-full py-5 gap-3">
      <button
        onClick={() =>
          setElementParams({
            ...elementParams,
            page: elementParams.page - 1,
          })
        }
        className={`bg-[color:var(--color-primary)] text-sm text-white px-3 py-2 rounded  ${
          elementParams.page <= 1
            ? "bg-[color:var(--color-primary)]/50"
            : "cursor-pointer transition-transform duration-200 hover:scale-105"
        }`}
        disabled={elementParams.page == 1}
      >
        Anterior
      </button>
      {paginationHtmlList.map((pagination) => pagination)}
      <button
        onClick={() =>
          setElementParams({
            ...elementParams,
            page: +elementParams.page + 1,
          })
        }
        className={`bg-[color:var(--color-primary)] text-sm text-white px-3 py-2 rounded  ${
          dataParamsMutate?.length != 10
            ? "bg-[color:var(--color-primary)]/50"
            : "cursor-pointer transition-transform duration-200 hover:scale-105"
        }`}
        disabled={dataParamsMutate?.length != 10}
      >
        Siguiente
      </button>
    </div>
  );
}
