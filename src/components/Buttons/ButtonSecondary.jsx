export default function ButtonSecondary({
  children = "Click aquí",
  onClick,
  type = "button",
  className = "",
  loading = false,
  loadingText = "",
  disabled = false,
}) {
  const isDisabled = loading || disabled;

  return (
    <button
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      className={`px-5 h-10 text-sm font-medium text-gray-600  bg-transparent hover:bg-gray-100   rounded-lg transition-all  focus:outline-none focus:ring-2 focus:ring-gray-200  hover:scale-105  border border-[#dbdfe6] disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 ${className}`.trim()}
    >
      {loading && loadingText ? (
        loadingText
      ) : loading ? (
        <div className="flex items-center gap-2 h-6">
          <div className="w-2 h-2 bg-white rounded-full animate-ping opacity-100 [animation-delay:0s]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-ping opacity-100 [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-ping opacity-100 [animation-delay:0.4s]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-ping opacity-100 [animation-delay:0.6s]"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
