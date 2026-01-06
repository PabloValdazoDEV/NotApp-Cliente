import { useParams } from "react-router";
import CardItemList from "../components/Cards/CardItemList";
import { useQuery } from "@tanstack/react-query";
import { getList } from "../api/list";

export default function ListDo() {
  const { hogar_id, list_id } = useParams();

  //   console.log(hogar_id, list_id);

  // Hay que hacer un query que se traiga todos los datos de esa lista, pero primero comprobando que esa lista exista en ese hogar

  const {
    data: dataList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getList", list_id],
    queryFn: () => {
      return getList({ hogar_id, list_id });
    },
  });

  if (isLoading) {
    return <p className="text-center">Cargando...</p>;
  }
  if (error || dataList.success === false) {
   return <p className="text-center">Ha habido un error, recarga la página.</p>;
  }

  console.log(dataList);

  return (
    <>
      <p>Page List do</p>
      {dataList && dataList.map((data, i) => (
        <CardItemList dataProv={data} type={"do"} key={i}/>
      ))}
    </>
  );
}
