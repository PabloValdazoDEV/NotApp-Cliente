import { atom } from "jotai";
import Cookies from "js-cookie"
import { tryMe } from "../api/auth";

const user = atom(undefined);

const fetchUser = atom(
    null, async (get, set) =>{
        const token = Cookies.get("token");
        if (!token) {
            set(user, null);
            return;
          }
          try{
            const response = await tryMe(token);
            // console.log(response.user)
            if (response?.user) {
              set(user, response.user);
            } else {
              set(user, null);
            }
          }catch(error){
            console.error("Error fetching user:", error.message);
            set(user, null);
          }
          
    }
)



export {user, fetchUser };