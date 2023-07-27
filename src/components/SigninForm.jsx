import { PropTypes } from "prop-types";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const SigninForm = ({
  handleSigninChange,
  handleEmailSignin,
  handleGoogleAuth,
  setIsNewUser,
  emailValue,
  passwordValue,
}) => {
  const {isDarkMode} = useContext(ThemeContext)
  return (
    <form
      action=""
      className={`${
        isDarkMode
          ? "border-[1px] border-gray-600 bg-[#424548] hover:bg-[#424548aa]"
          : "bg-blue-400"
      } flex flex-col space-y-12 max-w-[21rem]  rounded-lg px-4 pt-6 pb-10 mx-auto`}
    >
      {/* email and password auth */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-gray-100">
            Email
          </label>
          <input
            type="email"
            placeholder="email..."
            name="email"
            className="px-3 py-2 rounded-md "
            onChange={handleSigninChange}
            value={emailValue}
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label htmlFor="password" className="text-gray-100">
            Password
          </label>
          <input
            type="password"
            placeholder="password..."
            name="password"
            className="px-3 py-2 rounded-md"
            onChange={handleSigninChange}
            value={passwordValue}
          />
        </div>
      </div>

      {/* buttons */}
      <div className="">
        <button
          type="submit"
          className="w-full py-2 bg-blue-800 text-gray-100 rounded-md shadow-2xl mb-4"
          onClick={handleEmailSignin}
        >
          Sign in
        </button>

        {/* google auth */}
        <div className="flex flex-col space-y-2">
          <p className="text-gray-100 text-center">Or sign in with Google</p>
          <button
            className="w-full py-2 bg-blue-800 text-gray-100 rounded-md shadow-2xl"
            onClick={handleGoogleAuth}
          >
            Google
          </button>
        </div>
      </div>
      <p
        className="text-red-600 cursor-pointer text-center"
        onClick={() => setIsNewUser(true)}
      >
        {`Don't have an account? sign up.`}
      </p>
    </form>
  );
};

SigninForm.propTypes = {
  handleSigninChange: PropTypes.func.isRequired,
  handleEmailSignin: PropTypes.func.isRequired,
  handleGoogleAuth: PropTypes.func.isRequired,
  setIsNewUser: PropTypes.func.isRequired,
  emailValue: PropTypes.string.isRequired,
  passwordValue: PropTypes.string.isRequired,
};

export default SigninForm;
