import { useState, useContext, useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UserContext } from "../context/UserContext";
import SignupForm from "../components/SignupForm";
import SigninForm from "../components/SigninForm";
const Auth = () => {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
  });

  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });
  //   const [user, setUser] = useState("");
  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    // const [name, value] = e.target;
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSigninChange = (e) => {
    // const [name, value] = e.target;
    setSigninData({ ...signinData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log(signupData);
  }, [signupData]);

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      console.log(user);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      const signup = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );
      if (signup) {
        console.log(signup.user.email);
        console.log(user);
      }
    } catch {
      console.error();
    }
  };

  const handleEmailSignin = async (e) => {
    e.preventDefault();
    try {
      const signin = await signInWithEmailAndPassword(
        auth,
        signinData.email,
        signinData.password
      );
      if (signin) {
        console.log();
      }
    } catch {
      console.error();
    }
  };
  return (
    <main className="px-6 pt-32">
      {!user ? (
        <SignupForm
          handleChange={handleChange}
          handleEmailSignup={handleEmailSignup}
          handleGoogleAuth={handleGoogleAuth}
        />
      ) : (
        <SigninForm
          handleSigninChange={handleSigninChange}
          handleEmailSignin={handleEmailSignin}
          handleGoogleAuth={handleGoogleAuth}
        />
      )}
    </main>
  );
};

export default Auth;
