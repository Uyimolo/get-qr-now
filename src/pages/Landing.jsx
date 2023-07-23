import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
const Landing = () => {
  const { user } = useContext(UserContext);
  return (
    <main className="px-6 pt-32 flex flex-col space-y-12">
      <h1 className="text-blue-500 text-4xl text-center font-semibold">
        {`Create, save and share your Qr's all in one place`}
      </h1>
      {/* <p>Start creating today!</p> */}
      <Link to={user ? "dashboard" : "auth"} className="w-fit mx-auto">
        <p className="text-white px-4 py-2 rounded-full bg-blue-800 w-fit mx-auto transition-all duration-300  hover:px-6">
          {user ? "Continue to dashboard" : "Get started"}
        </p>
      </Link>
    </main>
  );
};

export default Landing;
