/* eslint-disable react/prop-types */
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { user } = useContext(UserContext);
  // const user = window.localStorage.getItem("user")
  if (user) {
    return children;
  } else {
    return <Navigate to="/auth" />;
  }
};

export default Protected;
