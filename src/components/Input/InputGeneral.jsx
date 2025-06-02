export default function InputGeneral({
  type = "text",
  placeholder = "Escribe aquí...",
  value,
  onChange,
  name,
  required = false,
  className = "",
  id,
  ...rest
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      id={id}
      {...rest}
      className={`w-full bg-gray-100 border border-[color:var(--color-text)] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neutral-700  text-neutral-700 ${className}`}
    />
  );
}
