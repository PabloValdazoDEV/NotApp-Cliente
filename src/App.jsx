import { userAtom } from "./store/userAtom";
import { useSupabaseSession } from "./hooks/useSupabaseSession";

import { Navigate, Routes, Route } from "react-router";
import { useAtom } from "jotai";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./components/Layout";

import "./global.css";

function App() {
  useSupabaseSession();
  const [user] = useAtom(userAtom);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
