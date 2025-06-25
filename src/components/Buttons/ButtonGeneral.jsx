export default function ButtonGeneral({
  children = "Click aquí",
  onClick,
  type = "button",
  className = "",
  loading = false,
}) {
  return (
    <button
      disabled={loading ? true : false}
      type={type}
      onClick={onClick}
      className={`bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)] transition-transform duration-200 ease-in-out transform hover:scale-105 font-medium px-4 py-2 rounded-md ${className}`.trim()}
    >
      {loading ? (
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
