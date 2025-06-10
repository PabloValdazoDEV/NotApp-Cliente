export default function ButtonGeneral({
  children = "Click aquí",
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)] transition-transform duration-200 ease-in-out transform hover:scale-105 font-medium px-4 py-2 rounded-md ${className}`.trim()}
    >
      {children}
    </button>
  );
}
