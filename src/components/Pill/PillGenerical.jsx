import { CATEGORY_COLORS, CATEGORY_LABELS } from "../../constants/categories";

export default function PillGenerical({ category }) {
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
