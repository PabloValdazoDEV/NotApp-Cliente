import PillGenerical from "../Pill/PillGenerical";
import { BiCartDownload } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";



export default function CardItem({ data }) {
  //   console.log(data);
  const a = "No hay descripción del producto No hay descripción";
  console.log(a.length);
  return (
    <>
      <div className="grid grid-cols-10 grid-rows-4 h-35 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]">
        <div className="grid grid-cols-8 grid-rows-4 col-span-8 row-span-4">
          <img
            src={
              data.image
                ? `https://res.cloudinary.com/${
                    import.meta.env.VITE_NAME_CLOUDINARY
                  }/image/upload/f_auto,q_auto,w_500/${data.image.image}`
                : "/IMG.jpg"
            }
            className="col-span-3 row-span-4 h-full aspect-square object-cover rounded-full"
          />
          {/* <h2 className="col-span-4 text-lg">{data.name}</h2> */}
          <h2 className="col-span-5 text-sm row-span-2">
            nune fuius dgfwb fuwbf
          </h2>
          <p className="col-span-5 row-span-2 text-xs">
            {data.description
              ? data.description.slice(0, 50) + "..."
              : "No hay descripción del producto."}
          </p>
        </div>
        <div className="col-span-2 row-span-4 aspect-square my-auto w-full">
          <button
            onClick={() => {console.log("Editando")}}
            className="aspect-square bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)] transition-transform duration-200 ease-in-out transform hover:scale-105 font-medium px-2 py-1 rounded-md w-full"
          >
            <MdOutlineEdit className="text-2xl w-full" />
            {/* <BiCartDownload className="text-3xl w-full" /> */}
          </button>
        </div>
        <div className="flex flex-row gap-3 col-span-10 justify-center ">
        <PillGenerical  category={`${data.price?.replace(".", ",")}€`} />
          {data.categories.map((category, index) => {
            if (index === 3) {
              return;
            }
            return <PillGenerical key={index} category={category} />;
          })}
        </div>
      </div>
    </>
  );
}
