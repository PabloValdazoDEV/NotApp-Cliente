import { fetchUser, user } from "./store/userAtom";

import { Navigate, Routes, Route } from "react-router";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useUserAuth } from "./hooks/useUserAuth";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import ResetPassword from "./pages/ResetPassword";
import Hogar from "./pages/Hogar";

import "./global.css";
import CreateHogar from "./pages/CreateHogar";
import RegisterSpecial from "./pages/RegisterSpecial";
import Profile from "./pages/Profile";

const PublicRoute = ({ element }) => {
  const { isAuth, loading } = useUserAuth();
  if (loading) return <div>Cargando...</div>;
  if (isAuth) return <Navigate to="/home" />;
  return element;
};
const PrivateRoute = ({ element }) => {
  const { isAuth, loading } = useUserAuth();
  if (loading) return <div>Cargando...</div>;
  if (!isAuth) return <Navigate to="/login" />;
  return element;
};

function App() {
  const fetchUserContext = useSetAtom(fetchUser);

  useEffect(() => {
    fetchUserContext();
  }, []);

  const register = import.meta.env.VITE_REGISTER;

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route
          path={register}
          element={<PublicRoute element={<Register />} />}
        />
        <Route
          path="/reset-password"
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route
          path="/register-special"
          element={<PublicRoute element={<RegisterSpecial />} />}
        />
        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route index element={<Home />} />
          <Route path="hogar">
            <Route path="crear-hogar" element={<CreateHogar />} />
            <Route path=":hogar_id" element={<Hogar />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
}

export default App;
