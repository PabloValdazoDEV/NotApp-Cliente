import { useNavigate } from "react-router";
import { tryLogout } from "../api/auth";
import ButtonGeneral from "./Buttons/ButtonGeneral";
import { fetchUser } from "../store/userAtom";
import { useSetAtom } from "jotai";

export default function () {
    const navigate = useNavigate()
    const fetchUserContext = useSetAtom(fetchUser);
  return (
    <>
      <nav className="bg-[color:var(--color-background-object)] shadow-lg sticky top-0 z-100">
        <h1>Navbar</h1>{" "}
        <ButtonGeneral
          onClick={() => {
            tryLogout();
            navigate("/login");
            fetchUserContext()

          }}
        />{" "}
      </nav>
    </>
  );
}
