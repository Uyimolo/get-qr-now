import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { UserContext } from "./context/UserContext";

import { auth } from "../config/firebase";
import { useState, useEffect } from "react";

import Layout from "./layout/Layout";
import Auth from "./pages/Auth";
import DashboardLayout from "./layout/DashboardLayout";
import CreateUrl from "./components/CreateUrl";
import Landing from "./pages/Landing";

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser.email);
      } else {
        setUser("");
      }
    });
  }, [user]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="auth" element={<Auth />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route path="create-url" element={<CreateUrl />} />
        </Route>
      </Route>
    )
  );
  return (
    <div className="h-6 w-full bg-blue-600">
      <UserContext.Provider value={{ user }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </div>
  );
}

export default App;
