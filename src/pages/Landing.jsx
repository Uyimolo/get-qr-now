import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <main className="px-6 pt-32 flex flex-col space-y-12">
      <h1 className="text-blue-500 text-4xl text-center font-semibold">
        {`Create, save and share your Qr's all in one place`}
      </h1>
      {/* <p>Start creating today!</p> */}
      <Link to="auth">
        <p className="text-white px-4 py-2 rounded-full bg-blue-800 w-fit mx-auto">
          Get started
        </p>
      </Link>
    </main>
  );
};

export default Landing;
