import { BiCartDownload } from "react-icons/bi";
import PillGenerical from "../Pill/PillGenerical";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { LuSearchX } from "react-icons/lu";


export default function CardItemList({ dataProv, type }) {


  // console.log(dataProv);

  if(type === "do"){
return (
    <>
      {" "}
      <div
        className={`grid grid-cols-10 gap-3 mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]${
          dataProv.item.image ? "grid-rows-4 " : "grid-rows-4 "
        }`}
      >
        <div
          className={`grid grid-cols-8  col-span-8  gap-3 ${
            dataProv.item.image ? "grid-rows-3 row-span-4" : "grid-rows-2 row-span-4"
          }`}
        >
          {dataProv.item.image && (
            <img
              src={`https://res.cloudinary.com/${
                import.meta.env.VITE_NAME_CLOUDINARY
              }/image/upload/f_auto,q_auto,w_500/${dataProv.item.image}`}
              className="col-span-3 row-span-4 h-auto aspect-square object-cover rounded-2xl"
            />
          )}
          <h2
            className={` text-sm  ${
              dataProv.item.image ? "col-span-5 row-span-1" : "col-span-8 row-span-1"
            } `}
          >
            {dataProv.item.name.slice(0, 15) + (dataProv.item.name.length >= 15 ? "..." : "")}
          </h2>
          <p
            className={` text-xs row-span-1 ${
              dataProv.item.image ? "col-span-5" : "col-span-8"
            } `}
          >
            {dataProv.item.description
              ? dataProv.item.description.slice(0, 20) +
                (dataProv.item.description.length >= 20 ? "..." : "")
              : "No hay descripción."}
          </p>
          <p
            className={` text-xs row-span-1 ${
              dataProv.item.image ? "col-span-5" : "col-span-8"
            } `}
          >
            Cantidad: 2
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
          <button
            //   onClick={() => {
            //     active.productos ? addCart() : console.log("añadir");
            //   }}
            className="aspect-square bg-red-500 text-white hover:bg-red-500 transition-transform duration-200 ease-in-out transform hover:scale-105 font-medium px-2 py-1 rounded-md w-full"
          >
          
           <LuSearchX className="text-3xl w-full" />
     
          </button>
        </div>
        <div
          className={`flex flex-row gap-3 col-span-10 justify-center ${
            !dataProv.item.categories && "hidden"
          } `}
        >
          {dataProv.item.price && (
            <PillGenerical category={`${dataProv.item.price?.replace(".", ",")}€`} />
          )}
          {dataProv.item.categories.map((category, index) => {
            return <PillGenerical key={index} category={category} />;
          })}
        </div>
      </div>
    </>
  );
  }

  
if(type === "add"){


  return (
    <>
      <div className=" grid grid-cols-10 grid-rows-3 gap-3  mb-5 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]">
        {dataProv.item.image && (
          <div className="col-span-3 row-span-2 ">
            <img
              src={`https://res.cloudinary.com/${
                import.meta.env.VITE_NAME_CLOUDINARY
              }/image/upload/f_auto,q_auto,w_500/${dataProv.item.image}`}
              className="h-auto aspect-square object-cover rounded-2xl"
            />
          </div>
        )}

        <div
          className={`row-span-2  ${
            dataProv.item.image ? "col-span-5" : "col-span-7"
          }`}
        >
          <h2>{dataProv.item.name}</h2>
          <p>{dataProv.item.description}</p>
        </div>
        <div
          className={`row-span-2 flex flex-col gap-2 items-end ${
            dataProv.item.image ? "col-span-2" : "col-span-3"
          }`}
        >
          {dataProv.item.categories.map((category, index) => {
            return <PillGenerical key={index} category={category} />;
          })}
           {dataProv.item.price && (
            <PillGenerical category={`${dataProv.item.price?.replace(".", ",")}€`} />
          )}
        </div>
        <div className="col-span-10 row-span-1  flex justify-between items-center">
          <ButtonGeneral children="Borrar" className=" bg-red-600 hover:bg-red-600 " onClick={()=>console.log("Borrar")}/>
          <div className="flex flex-row gap-3 justify-center items-center">
            <ButtonGeneral children="-" className="" onClick={()=>console.log("-")}/>
            <p>0</p>
           <ButtonGeneral children="+" className="" onClick={()=>console.log("+")}/>
          </div>
          <ButtonGeneral children="Editar" className="" onClick={()=>console.log("Editar")}/>
        </div>
      </div>
    </>
  );
}
}