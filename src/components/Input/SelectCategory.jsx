export default function SelectCategory({ value, onChange }) {
  const CATEGORIES = {
    FRUTAS_VERDURAS: "Frutas y verduras",
    LACTEOS: "Lácteos",
    CARNE: "Carne",
    PESCADO: "Pescado",
    BEBIDAS: "Bebidas",
    PANADERIA: "Panadería",
    DULCES: "Dulces",
    CONGELADOS: "Congelados",
    HIGIENE: "Higiene",
    LIMPIEZA: "Limpieza",
    MASCOTAS: "Mascotas",
    OTROS: "Otros",
  };

  return (
    <div className="flex flex-col gap-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-100 border border-[color:var(--color-text)] rounded-lg py-3 px-1 focus:outline-none focus:ring-2 focus:ring-neutral-700  text-neutral-700"
      >
        <option value="" disabled hidden>
          Selecciona
        </option>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
