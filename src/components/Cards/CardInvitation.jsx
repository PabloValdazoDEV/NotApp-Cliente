import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHome } from "../../api/home";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import { updateInvitation } from "../../api/member";
import { useSetAtom } from "jotai";
import { fetchUser } from "../../store/userAtom";
import ButtonSecondary from "../Buttons/ButtonSecondary";
import { FaUserGroup } from "react-icons/fa6";
import { SkeletonBlock } from "../Skeleton/Skeleton";

export default function CardInvitation({ data }) {
  const queryClient = useQueryClient();
  const fetchUserContext = useSetAtom(fetchUser);
  const {
    data: dataQuery,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getHogar", data.home_id],
    queryFn: () => {
      return getHome(data.home_id);
    },
  });

  const mutation = useMutation({
    mutationFn: updateInvitation,
    onSuccess: () => {
      fetchUserContext();
      queryClient.invalidateQueries();
    },
  });

  const onSubmit = (valueInvitation) => {
    mutation.mutate({ id_invitation: data.id, accept: valueInvitation });
  };

  const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  for (const interval of intervals) {
    const value = Math.floor(seconds / interval.seconds);
    if (value >= 1) {
      return rtf.format(-value, interval.label);
    }
  }

  return "Ahora mismo";
}


  if (isLoading) {
    return <SkeletonBlock className="h-36 w-full rounded-xl" />;
  }
  if (error) {
    return <p>Error al cargar la invitación</p>;
  }
  return (
    <>
      <div className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:border-(--color-primary)/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
          {dataQuery?.image && (
            <img
              src={`https://res.cloudinary.com/${
                import.meta.env.VITE_NAME_CLOUDINARY
              }/image/upload/f_auto,q_auto,w_500/${dataQuery?.image}`}
              alt="Preview imagen hogar"
              className="w-full md:w-48 h-32 md:h-28 rounded-lg object-cover shrink-0 shadow-inner"
            />
          )}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-text-(--color-seconday)">
                {data.home_id == dataQuery.id && timeAgo(data.createdAt)}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-text-main truncate">
              {dataQuery?.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-text-(--color-seconday) mt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm"><FaUserGroup /></span>{dataQuery?.members.length === 1 ? `1 Miembro` : `${dataQuery?.members.length} Miembros` }
              </span>
            </div>
          </div>
          <div className="w-full md:w-auto flex md:flex-col lg:flex-row gap-3 mt-2 md:mt-0 justify-end">
            <ButtonSecondary
              children="Rechazar"
              onClick={() => {
                onSubmit(false);
              }}
              className="border border-gray-300 w-full"
            />
            <ButtonGeneral
              children="Aceptar"
              onClick={() => {
                onSubmit(true);
              }}
              className="border border-gray-300 w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
