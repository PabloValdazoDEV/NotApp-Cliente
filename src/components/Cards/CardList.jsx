import ButtonGeneral from "../Buttons/ButtonGeneral";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router";

export default function CardList({ data }) {
   const navigate = useNavigate();

  const iso = data.createdAt;
  const d = new Date(iso);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  const outDate = `${dd}-${mm}-${yy}`;

  return (
    <>
      <div className=" grid grid-cols-10 grid-rows-2 gap-3 border-b-1 pb-5 last:border-0 border-[var(--color-primary)]">
        <div className="col-span-6">
          <p>{data.title}</p>
          <p className="text-xs mt-1 font-thin">Creado el {outDate}</p>
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-3">
          <ButtonGeneral
            type="button"
            children={<FiEye className="text-xl text-white" />}
            onClick={() => {
              console.log("Ver lista");
              navigate(`/hogar/${data.home_id}/${data.id}/add`);
            }}
          />
          <ButtonGeneral
            type="button"
            children={
              <MdOutlineShoppingCartCheckout className="text-xl text-white" />
            }
            onClick={() => {
              console.log("Hacer la lista");
                navigate(`/hogar/${data.home_id}/${data.id}/do`);
            }}
          />
        </div>
        <div className="bg-green-500 w-full col-span-full rounded-xl flex justify-center items-center">
          <p className="text-white">Porcentaje de la lista - {`10 / 67`}</p>
        </div>
      </div>
    </>
  );
}
