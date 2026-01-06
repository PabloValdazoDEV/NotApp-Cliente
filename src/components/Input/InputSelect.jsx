export default function InputSelect({ register, required, nameRegister, options, className }) {
  return (
    <div className="flex flex-col gap-1">
      <select
        {...register(nameRegister, { required })}
        
        className={`w-full bg-gray-100 border border-[color:var(--color-text)] rounded-lg py-3 px-1 focus:outline-none focus:ring-2 focus:ring-neutral-700 text-neutral-700 ${className}`}
      >
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
