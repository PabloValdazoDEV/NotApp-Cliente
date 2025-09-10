import { BiCartDownload } from "react-icons/bi";
import PillGenerical from "../Pill/PillGenerical";

export default function CardItemList() {
  const data = {
    name: "Nombre Producto Nombre Producto Nombre Producto",
    description:
      "Descripción del producto Descripción del producto Descripción del producto Descripción del producto ",
    price: "2,7",
    image: "i9aaxc2t2tblmn1u6rjy",
    categories: ["CARNE", "LACTEOS"],
  };

  return (
    <>
      {" "}
      <div
        className={`grid grid-cols-10 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]${
          data.image ? "grid-rows-4 " : "grid-rows-4 "
        }`}
      >
        <div
          className={`grid grid-cols-8  col-span-8  gap-3 ${
            data.image ? "grid-rows-4 row-span-4" : "grid-rows-2 row-span-4"
          }`}
        >
          {data.image && (
            <img
              src={`https://res.cloudinary.com/${
                import.meta.env.VITE_NAME_CLOUDINARY
              }/image/upload/f_auto,q_auto,w_500/${data.image}`}
              className="col-span-3 row-span-4 h-auto aspect-square object-cover rounded-2xl"
            />
          )}

          <h2
            className={` text-sm  ${
              data.image ? "col-span-5 row-span-2" : "col-span-8 row-span-1"
            } `}
          >
            {data.name.slice(0, 20) + (data.name.length >= 20 ? "..." : "")}
          </h2>

          <p
            className={` text-xs row-span-2 ${
              data.image ? "col-span-5" : "col-span-8"
            } `}
          >
            {data.description
              ? data.description.slice(0, 50) +
                (data.description.length >= 50 ? "..." : "")
              : "No hay descripción del producto."}
          </p>
        </div>
        <div className="col-span-2 row-span-4 aspect-square my-auto w-full">
          <button
            //   onClick={() => {
            //     active.productos ? addCart() : console.log("añadir");
            //   }}
            className="aspect-square bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)] transition-transform duration-200 ease-in-out transform hover:scale-105 font-medium px-2 py-1 rounded-md w-full"
          >
            <BiCartDownload className="text-3xl w-full" />
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

  //   return (
  //     <>
  //       <div
  //         className={`grid grid-cols-10 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)] bg-amber-300 grid-rows-4 hidden`}
  //       >
  //         <div
  //           className={`grid grid-cols-10  col-span-10  gap-3 bg-amber-500 ${
  //             data.image ? "grid-rows-4 row-span-4" : "grid-rows-2 row-span-4"
  //           }`}
  //         >
  //           {/* Image */}
  //           {data.image && (
  //             <img
  //               src={`https://res.cloudinary.com/${
  //                 import.meta.env.VITE_NAME_CLOUDINARY
  //               }/image/upload/f_auto,q_auto,w_500/${data.image}`}
  //               className="col-span-3 row-span-4 h-auto aspect-square object-cover rounded-2xl"
  //             />
  //           )}
  //           {/* Nombre del producto */}
  //           <h2
  //             className={` text-sm  ${
  //               data.image ? "col-span-7 row-span-2" : "col-span-10 row-span-1"
  //             } `}
  //           >
  //             {data.name}
  //           </h2>
  //           {/* Descripción del producto */}
  //           <p
  //             className={` text-xs row-span-2 ${
  //               data.image ? "col-span-7" : "col-span-10"
  //             } `}
  //           >
  //             {data.description
  //               ? data.description.slice(0, 50) + "..."
  //               : "No hay descripción del producto."}
  //           </p>
  //           <div className="col-span-2 row-span-4 aspect-square my-auto w-full">
  //             {data.price && (
  //               <PillGenerical category={`${data.price?.replace(".", ",")}€`} />
  //             )}
  //           </div>
  //         </div>

  //         <div
  //           className={`flex flex-row gap-3 col-span-10 justify-center ${
  //             !data.categories && "hidden"
  //           } `}
  //         >
  //           {/* Precio del producto */}
  //           {data.price && (
  //             <PillGenerical category={`${data.price?.replace(".", ",")}€`} />
  //           )}
  //           {/* Categorías del producto */}
  //           {data.categories.map((category, index) => {
  //             return <PillGenerical key={index} category={category} />;
  //           })}
  //         </div>
  //       </div>
  //       <div className="grid grid-cols-10 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)] bg-amber-300 grid-rows-4 hidden">
  //         <div className="grid grid-cols-10  col-span-10 gap-3 bg-amber-500 grid-rows-3 row-span-3">
  //           <div
  //             className={`grid  row-span-3 col-span-3 gap-3 ${
  //               data.image ? "grid-rows-2" : "grid-rows-1"
  //             }`}
  //           >
  //             {data.image && (
  //               <img
  //                 src={`https://res.cloudinary.com/${
  //                   import.meta.env.VITE_NAME_CLOUDINARY
  //                 }/image/upload/f_auto,q_auto,w_500/${data.image}`}
  //                 className=" row-span-2 h-auto aspect-square object-cover rounded-2xl"
  //               />
  //             )}
  //             <div className="row-span-1 flex justify-center">
  //               {data.price && (
  //                 <PillGenerical category={`${data.price?.replace(".", ",")}€`} />
  //               )}
  //             </div>
  //           </div>

  //           <h2 className="text-sm col-span-7 row-span-1">
  //             {data.name.slice(0, 20) + "..."}
  //           </h2>
  //           <p className="text-xs col-span-7 row-span-2">
  //             {data.description
  //               ? data.description.slice(0, 50) + "..."
  //               : "No hay descripción del producto."}
  //           </p>
  //         </div>
  //       </div>
  //       <div className=" grid grid-cols-10 grid-rows-4 gap-3 bg-amber-200 mb-5">
  //         {data.image && (
  //           <div className="col-span-3 row-span-3 bg-amber-500">
  //             <img
  //               src={`https://res.cloudinary.com/${
  //                 import.meta.env.VITE_NAME_CLOUDINARY
  //               }/image/upload/f_auto,q_auto,w_500/${data.image}`}
  //               className="h-auto aspect-square object-cover rounded-2xl"
  //             />
  //           </div>
  //         )}

  //         <div
  //           className={`row-span-3 bg-amber-600 ${
  //             data.image ? "col-span-5" : "col-span-7"
  //           }`}
  //         >
  //           <h2>Titulo</h2>
  //           <p>Descripción</p>
  //         </div>
  //         <div
  //           className={`row-span-3 bg-amber-700 flex flex-col justify-between items-center ${
  //             data.image ? "col-span-2" : "col-span-3"
  //           }`}
  //         >
  //           <p>Pill</p>
  //           <p>Pill</p>
  //           <p>Pill</p>
  //         </div>
  //         <div className="col-span-10 row-span-1 bg-amber-800 flex justify-between items-center">
  //           <p>Delete</p>
  //           <p>Contador</p>
  //           <p>Editar</p>
  //         </div>
  //       </div>

  //       <div
  //         className={`grid grid-cols-10 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)] bg-amber-300 grid-rows-4`}
  //       >
  //         <div
  //           className={`grid grid-cols-10  col-span-10  gap-3 bg-amber-500 ${
  //             data.image ? "grid-rows-4 row-span-4" : "grid-rows-2 row-span-4"
  //           }`}
  //         >
  //           {/* Image */}
  //           {data.image && (
  //             <img
  //               src={`https://res.cloudinary.com/${
  //                 import.meta.env.VITE_NAME_CLOUDINARY
  //               }/image/upload/f_auto,q_auto,w_500/${data.image}`}
  //               className="col-span-3 row-span-4 h-auto aspect-square object-cover rounded-2xl"
  //             />
  //           )}
  //           {/* Nombre del producto */}
  //           <h2
  //             className={` text-sm  ${
  //               data.image ? "col-span-7 row-span-2" : "col-span-10 row-span-1"
  //             } `}
  //           >
  //             {data.name}
  //           </h2>
  //           {/* Descripción del producto */}
  //           <p
  //             className={` text-xs row-span-2 ${
  //               data.image ? "col-span-7" : "col-span-10"
  //             } `}
  //           >
  //             {data.description
  //               ? data.description.slice(0, 50) + "..."
  //               : "No hay descripción del producto."}
  //           </p>
  //           {/* <div className="col-span-2 row-span-4 aspect-square my-auto w-full">
  //               <button
  //                 onClick={() => {
  //                   active.productos ? editClick() : console.log("añadir");
  //                 }}
  //                 className="aspect-square bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)] transition-transform duration-200 ease-in-out transform hover:scale-105 font-medium px-2 py-1 rounded-md w-full"
  //               >
  //                 {active.productos ? (
  //                   <MdOutlineEdit className="text-2xl w-full" />
  //                 ) : (
  //                   <BiCartDownload className="text-3xl w-full" />
  //                 )}
  //               </button>
  //             </div> */}
  //         </div>

  //         <div
  //           className={`flex flex-row gap-3 col-span-10 justify-center ${
  //             !data.categories && "hidden"
  //           } `}
  //         >
  //           {/* Precio del producto */}
  //           {data.price && (
  //             <PillGenerical category={`${data.price?.replace(".", ",")}€`} />
  //           )}
  //           {/* Categorías del producto */}
  //           {data.categories.map((category, index) => {
  //             return <PillGenerical key={index} category={category} />;
  //           })}
  //         </div>
  //       </div>
  //     </>
  //   );
}
