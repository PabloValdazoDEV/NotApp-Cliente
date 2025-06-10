export default function PillGenerical({ category }) {
  const CATEGORY_LABELS = {
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

  const CATEGORY_COLORS = {
    FRUTAS_VERDURAS: "#A3D977",
    LACTEOS: "#FAD390",
    CARNE: "#FC6C6C",
    PESCADO: "#60A3D9",
    BEBIDAS: "#A084E8",
    PANADERIA: "#F5B971",
    DULCES: "#F87D99",
    CONGELADOS: "#92DCE5",
    HIGIENE: "#CED2D2",
    LIMPIEZA: "#5BC0BE",
    MASCOTAS: "#D6A2E8",
    OTROS: "#CCCCCC",
  };

  const label = CATEGORY_LABELS[category] || category;
  const bgColor = CATEGORY_COLORS[category] || "#EEE";

  return (
    <>
      <div className="flex items-center">
        <span
          className="text-sm font-medium px-3 py-1 rounded-md text-black"
          style={{ backgroundColor: bgColor }}
        >
          {label}
        </span>
      </div>
    </>
  );
}
