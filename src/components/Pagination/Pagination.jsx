import { getPaginatedRows, getPaginationMeta } from "../../utils/pagination";

export default function Pagination({
  elementParams,
  setElementParams,
  dataParamsMutate,
  pageSize = 10,
  totalPages,
  hasNextPage,
}) {
  const currentPage = Number(elementParams?.page) || 1;
  const rows = getPaginatedRows(dataParamsMutate);
  const pagination = getPaginationMeta(dataParamsMutate);

  const resolvedTotalPages =
    totalPages || pagination?.totalPages || dataParamsMutate?.totalPages;

  const canGoNext =
    typeof hasNextPage === "boolean"
      ? hasNextPage
      : typeof pagination?.hasNextPage === "boolean"
        ? pagination.hasNextPage
        : resolvedTotalPages
          ? currentPage < resolvedTotalPages
          : rows.length >= pageSize;

  const canGoPrevious = currentPage > 1;

  if (!canGoPrevious && !canGoNext) {
    return null;
  }

  return (
    <div className="flex flex-row justify-center items-center w-full py-5 gap-3">
      <button
        onClick={() =>
          setElementParams({
            ...elementParams,
            page: currentPage - 1,
          })
        }
        className={`bg-[color:var(--color-primary)] text-sm text-white px-3 py-2 rounded  ${
          !canGoPrevious
            ? "bg-[color:var(--color-primary)]/50"
            : "cursor-pointer transition-transform duration-200 hover:scale-105"
        }`}
        disabled={!canGoPrevious}
      >
        Anterior
      </button>
      {canGoPrevious && (
        <button
          onClick={() =>
            setElementParams({
              ...elementParams,
              page: currentPage - 1,
            })
          }
          className="bg-[color:var(--color-primary)] text-sm text-white px-3 py-2 rounded cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          {currentPage - 1}
        </button>
      )}
      <button
        disabled
        className="bg-[color:var(--color-primary)]/50 text-sm text-white px-3 py-2 rounded"
      >
        {currentPage}
      </button>
      {canGoNext && (
        <button
          onClick={() =>
            setElementParams({
              ...elementParams,
              page: currentPage + 1,
            })
          }
          className="bg-[color:var(--color-primary)] text-sm text-white px-3 py-2 rounded cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          {currentPage + 1}
        </button>
      )}
      <button
        onClick={() =>
          setElementParams({
            ...elementParams,
            page: currentPage + 1,
          })
        }
        className={`bg-[color:var(--color-primary)] text-sm text-white px-3 py-2 rounded  ${
          !canGoNext
            ? "bg-[color:var(--color-primary)]/50"
            : "cursor-pointer transition-transform duration-200 hover:scale-105"
        }`}
        disabled={!canGoNext}
      >
        Siguiente
      </button>
    </div>
  );
}
