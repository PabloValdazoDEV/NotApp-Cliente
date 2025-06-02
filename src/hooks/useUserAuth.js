import { useAtomValue } from "jotai";
import { user } from "../store/userAtom";

export const useUserAuth = () => {
    const userContext = useAtomValue(user);

    if (userContext === null) return { isAuth: false, loading: false }; 
    if (userContext === undefined) return { isAuth: undefined, loading: true }; 

    return { isAuth: true, loading: false };
  };
  