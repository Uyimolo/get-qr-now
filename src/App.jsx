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
import CreateContact from "./components/CreateContact";
import CreateEmail from "./components/CreateEmail";
import FileOptions from "./pages/FileOptions";
import FileDownload from "./pages/FileDownload";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Route
        path="/"
        element={
          <Layout setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        }
      >
        <Route index element={<Landing />} />
        <Route path="auth" element={<Auth />} />
        <Route path="download" element={<FileOptions />}>
          <Route path=":id" element={<FileDownload />} />
        </Route>
        <Route
          path="dashboard"
          element={
            <Protected>
              <DashboardLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </Protected>
          }
        >
          <Route index element={<CreateUrl />} />
          <Route path="file" element={<CreateFile />} />
          <Route path="contact-card" element={<CreateContact />} />
          <Route path="email" element={<CreateEmail />} />
        </Route>
      </Route>
    )
  );
  return (
    <div className="h-6 w-full">
      <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        <UserContext.Provider value={{ user }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
