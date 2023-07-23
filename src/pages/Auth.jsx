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
  const { user } = useContext(UserContext);
  // todo: use a reducer for both functions
  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSigninChange = (e) => {
    setSigninData({ ...signinData, [e.target.name]: e.target.value });
  };

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
      console.log(error);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );
    } catch (error) {
      console.error(error);
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
     
    } catch (error)  {
      console.error(error);
    }
  };
  return (
    <main className="px-6 pt-32">
      {isNewUser ? (
        <SignupForm
          handleChange={handleChange}
          handleEmailSignup={handleEmailSignup}
          handleGoogleAuth={handleGoogleAuth}
          setIsNewUser={setIsNewUser}
          emailValue={signupData.email}
          passwordValue={signupData.password}
        />
      ) : (
        <SigninForm
          handleSigninChange={handleSigninChange}
          handleEmailSignin={handleEmailSignin}
          handleGoogleAuth={handleGoogleAuth}
          setIsNewUser={setIsNewUser}
          emailValue={signinData.email}
          passwordValue={signinData.password}
        />
      )}
    </main>
  );
};

export default Auth;
