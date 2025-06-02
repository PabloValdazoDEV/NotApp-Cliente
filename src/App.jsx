import { fetchUser, user } from "./store/userAtom";

import { Navigate, Routes, Route } from "react-router";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./components/Layout";

import "./global.css";
import { useUserAuth } from "./hooks/useUserAuth";

const PublicRoute = ({ element }) => {
  const {isAuth, loading} = useUserAuth();
  if (loading) return <div>Cargando...</div>;
  if (isAuth)
    return <Navigate to="/home" />;
  return element;
};
const PrivateRoute = ({ element }) => {
  const {isAuth, loading} = useUserAuth();
  if (loading) return <div>Cargando...</div>;
  if (!isAuth)
    return <Navigate to="/login" />;
  return element;
};

function App() {
  const fetchUserContext = useSetAtom(fetchUser);

  useEffect(() => {
    fetchUserContext();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute  element={<Login />}/>} />
        <Route path="/register" element={<PublicRoute  element={<Register />}/>} />
        <Route path="/" element={<PrivateRoute element={<Layout />}/>}>
          <Route index element={<Home />} />
          {/* <Route path="login" element={<PublicRoute  element={<Login />}/>} />
          <Route path="register" element={<Register />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
