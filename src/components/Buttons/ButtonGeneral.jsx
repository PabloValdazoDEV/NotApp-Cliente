export default function ButtonGeneral({
  children = "Click aquí",
  onClick,
  type = "button",
  className = "",
  loading = false,
  title,
  ariaLabel,
  ...rest
}) {
  return (
    <button
      {...rest}
      disabled={loading ? true : false}
      type={type}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={`px-5 h-10 text-sm font-bold text-white bg-(--color-primary) hover:bg-(--color-primary)-hover active:bg-blue-700 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2 hover:scale-105 ${className}`.trim()}
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
