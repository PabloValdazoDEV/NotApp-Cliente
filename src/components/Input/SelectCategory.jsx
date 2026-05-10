import { CATEGORY_LABELS } from "../../constants/categories";

export default function SelectCategory({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-100 border border-[color:var(--color-text)] rounded-lg py-3 px-1 focus:outline-none focus:ring-2 focus:ring-neutral-700  text-neutral-700"
      >
        <option value="" hidden>
          Selecciona
        </option>
        <option value="0">
          Vacio
        </option>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
