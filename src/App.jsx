import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { ThemeContext } from "./context/ThemeContext";

import { auth } from "../config/firebase";
import { useState, useEffect } from "react";

import Layout from "./layout/Layout";
import Auth from "./pages/Auth";
import DashboardLayout from "./layout/DashboardLayout";
import CreateUrl from "./components/CreateUrl";
import Landing from "./pages/Landing";
import Protected from "./components/Protected";
import CreateFile from "./components/CreateFile";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser.email);
        window.localStorage.setItem("user", user);
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
        <Route
          path="dashboard"
          element={
            <Protected>
              <DashboardLayout />
            </Protected>
          }
        >
          <Route path="create-url" element={<CreateUrl />} />
          <Route path="create-file" element={<CreateFile />} />
        </Route>
      </Route>
    )
  );
  return (
    <div className="h-6 w-full bg-blue-600">
      <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        <UserContext.Provider value={{ user }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
