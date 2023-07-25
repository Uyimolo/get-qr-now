import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router";
import { PropTypes } from "prop-types";
const Protected = ({ children }) => {
  const { user } = useContext(UserContext);
  if (user) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

Protected.propTypes = {
  children: PropTypes.element,
};

export default Protected;
