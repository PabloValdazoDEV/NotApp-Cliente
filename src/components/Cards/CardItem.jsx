import PillGenerical from "../Pill/PillGenerical";
import { BiCartDownload } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import ModalItem from "../Modal/ModalItem";

export default function CardItem({ data, active, editClick }) {
  //   console.log(data);
  return (
    <>
      <div className="grid grid-cols-10 grid-rows-4 h-35 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]">
        <div className="grid grid-cols-8 grid-rows-4 col-span-8 row-span-4 gap-3">
          <img
            src={
              data.image
                ? `https://res.cloudinary.com/${
                    import.meta.env.VITE_NAME_CLOUDINARY
                  }/image/upload/f_auto,q_auto,w_500/${data.image}`
                : "/IMG.jpg"
            }
            className="col-span-3 row-span-4 h-full aspect-square object-cover rounded-full"
          />
          <h2 className="col-span-5 text-sm row-span-2">{data.name}</h2>

          <p className="col-span-5 row-span-2 text-xs">
            {data.description
              ? data.description.slice(0, 50) + "..."
              : "No hay descripción del producto."}
          </p>
        </div>
        <div className="col-span-2 row-span-4 aspect-square my-auto w-full">
          <button
            onClick={() => {
              active.productos ? (
                editClick()
              ) : (
                console.log("añadir")
              );
            }}
            className="aspect-square bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)] transition-transform duration-200 ease-in-out transform hover:scale-105 font-medium px-2 py-1 rounded-md w-full"
          >
            {active.productos ? (
              <MdOutlineEdit className="text-2xl w-full" />
            ) : (
              <BiCartDownload className="text-3xl w-full" />
            )}
          </button>
        </div>
        <div
          className={`flex flex-row gap-3 col-span-10 justify-center ${
            !data.categories && "hidden"
          } `}
        >
          {data.price && (
            <PillGenerical category={`${data.price?.replace(".", ",")}€`} />
          )}
          {data.categories.map((category, index) => {
            return <PillGenerical key={index} category={category} />;
          })}
        </div>
      </div>
    </>
  );
}
