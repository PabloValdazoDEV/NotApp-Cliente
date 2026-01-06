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
      className={`w-full h-12 px-4 rounded-lg border border-gray-200  bg-white  text-gray-900 placeholder:text-gray-400  focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors outline-none text-base ${className}`}
    />
  );
}
