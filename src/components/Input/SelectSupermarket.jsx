import { SUPERMARKET_LABELS } from "../../constants/supermarkets";

export default function SelectSupermarket({
  value = "CUALQUIERA",
  onChange,
  includeAll = false,
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors outline-none text-base"
    >
      {includeAll && <option value="">Todos los supermercados</option>}
      {Object.entries(SUPERMARKET_LABELS).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}
