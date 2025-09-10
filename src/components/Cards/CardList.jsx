import ButtonGeneral from "../Buttons/ButtonGeneral";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FiEye } from "react-icons/fi";



export default function CardList({ data }) {
  return (
    <>
      <div className=" grid grid-cols-10 grid-rows-2 gap-3 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]">
        <p className="col-span-6"> {data.title}</p>
        <div className="col-span-4 grid grid-cols-2 gap-3">
          <ButtonGeneral
            type="button"
            children={<FiEye className="text-xl text-white" />}
            onClick={()=>{console.log("Ver lista")}}
          />
          <ButtonGeneral
            type="button"
            children={<MdOutlineShoppingCartCheckout className="text-xl text-white" />}
            onClick={()=>{console.log("Hacer la lista")}}
          />
        </div>
        <div className="bg-green-500 w-full col-span-full rounded-xl flex justify-center items-center">
          <p className="text-white">Porcentaje de la lista - {`10 / 67`}</p>
        </div>
      </div>
    </>
  );
}
