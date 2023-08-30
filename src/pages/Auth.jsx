import { useState, useContext, useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import SignupForm from "../components/SignupForm";
import SigninForm from "../components/SigninForm";
const Auth = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
  });
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });
  const [isNewUser, setIsNewUser] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  // todo: use a reducer for both functions
  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSigninChange = (e) => {
    setSigninData({ ...signinData, [e.target.name]: e.target.value });
  };

  const handleErrorMessage = (errorCode) => {
    if (errorCode === "auth/email-already-in-use") {
      setError("Email already in use");
    } else if (errorCode === "auth/wrong-password") {
      setError("Password is incorrect");
    } else if (errorCode === "auth/invalid-email") {
      setError("Email address is invalid");
    } else if (errorCode === "auth/invalid-password") {
      setError("Passwords should be above 6 letters");
    } else if (errorCode === "auth/user-not-found") {
      setError("Account does not exist");
    } else if (errorCode === "auth/network-request-failed") {
      setError("Please switch on your internet");
    } else if (errorCode === "auth/internal-error") {
      setError("Check if internet or popups is allowed");
    } else if (errorCode === "auth/weak-password") {
      setError("Passwords should have atleast 6 characters");
    } else {
      setError("Something went wrong, please try again");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      handleErrorMessage(error.code);
      console.log(error.code + " " + error.message);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (signupData.email !== "" || signupData.password !== "") {
      try {
        await createUserWithEmailAndPassword(
          auth,
          signupData.email,
          signupData.password
        );
      } catch (error) {
        handleErrorMessage(error.code);
      }
    } else {
      setError("Please fill in all fields");
    }
  };

  const handleEmailSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        signinData.email,
        signinData.password
      );
    } catch (error) {
      handleErrorMessage(error.code);
    }
  };
  return (
    <main className="px-6 pt-32">
      {!user && isNewUser ? (
        <SignupForm
          handleChange={handleChange}
          handleEmailSignup={handleEmailSignup}
          handleGoogleAuth={handleGoogleAuth}
          setIsNewUser={setIsNewUser}
          emailValue={signupData.email}
          passwordValue={signupData.password}
          error={error}
        />
      ) : (
        <SigninForm
          handleSigninChange={handleSigninChange}
          handleEmailSignin={handleEmailSignin}
          handleGoogleAuth={handleGoogleAuth}
          setIsNewUser={setIsNewUser}
          emailValue={signinData.email}
          passwordValue={signinData.password}
          error={error}
        />
      )}
    </main>
  );
};

export default Auth;
