import { useCallback, useContext, useState } from "react";
import { db } from "../../config/firebase";
import { collection } from "firebase/firestore";
import DownloadQr from "./DownloadQr";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import QrTextForm from "./QrTextForm";
import uploadDocFunction from "../myHooks/uploadDocFunction";

const CreateEmail = () => {
  const { user } = useContext(UserContext);

  const { isDarkMode } = useContext(ThemeContext);
  const [qRData, setQRData] = useState({
    email: "",
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
  });
  const [qRImageData, setQRimageData] = useState(null);
  const [status, setStatus] = useState("");
  const [inputErrors, setInputErrors] = useState({
    email: "",
    fileName: "",
    allFields: "",
  });

  const collectionRef = collection(
    db,
    "qr-codes-collection",
    `${user}`,
    "qr-code-data"
  );

  const addToDb = useCallback(async () => {
    if (qRData.url !== "" && qRData.fileName !== "") {
      setStatus("Saving Qr code");
      const { fileName, email, foreground, background } = qRData;
      try {
        const docToBeAdded = {
          name: fileName,
          value: email,
          type: "url",
          date: new Date().toDateString(),
          sortDate: Number(new Date()),
          numDownload: "Not applicable",
          foreground: foreground,
          background: background,
        };
        const success = uploadDocFunction(collectionRef, docToBeAdded);
        if (success) {
          setStatus("Qr code saved successfully");
          setQRData({
            email: "",
            fileName: "",
            foreground: "#000000",
            background: "#ffffff",
          });
        }
      } catch (error) {
        setStatus("failed to save Qr code: Try again");
      }
    }
  }, [qRData, collectionRef]);
  const handleChange = (e) => {
    setQRData({ ...qRData, [e.target.name]: e.target.value });
  };

  const handleValidation = (event) => {
    event.preventDefault();
    const inputEl = event.target;
    const { name } = inputEl;
    const value = inputEl.value.trim();

    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        email: emailPattern.test(value)
          ? ""
          : "Invalid email format. emails should be in the format 'getQrNow@example.com'",
      }));
    } else if (name === "fileName") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        fileName: value.includes(" ")
          ? "File names should not contain spaces."
          : "",
      }));
    }
  };

  const handleCreateQr = (e) => {
    e.preventDefault();
    // Check for validation errors
    if (inputErrors.email || inputErrors.fileName) {
      return;
    } else if (qRData.email === "" || qRData.fileName === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        allFields: "Please fill in all required fields",
      }));
      return;
    }
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      allFields: "",
    }));
    setQRimageData(qRData);
  };

  const inputData = [
    {
      label: "Email",
      value: qRData.email,
      id: "email",
      placeholder: "Enter an email address here",
      type: "text",
    },
    {
      label: "Name your Qr Code",
      value: qRData.fileName,
      id: "fileName",
      placeholder: "Enter a name for your Qr Code here",
      type: "text",
    },
  ];

  const paragraphStyle = `${isDarkMode ? "text-gray-200" : "text-gray-600"}`;

  return (
    <div>
      <div className="">
        <h1 className={`${paragraphStyle} text-3xl text-center mb-6`}>
          Instant Email QR Codes: Connect with a Scan!
        </h1>
      </div>
      <QrTextForm
        handleCreateQr={handleCreateQr}
        handleChange={handleChange}
        foreground={qRData.foreground}
        background={qRData.background}
        inputData={inputData}
        errors={inputErrors}
        handleValidation={handleValidation}
      />

      {qRImageData && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-fit px-6 mx-auto"
        >
          <DownloadQr
            value={qRImageData.email}
            foreground={qRImageData.foreground}
            background={qRImageData.background}
            fileName={qRImageData.fileName}
            onClick={addToDb}
            showSave
          />
          {status && (
            <p
              className={`${
                isDarkMode ? "text-gray-200" : "text-gray-600"
              } text-center`}
            >
              {status}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CreateEmail;
