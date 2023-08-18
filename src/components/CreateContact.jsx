import { useState, useCallback, useContext, useEffect } from "react";
import QrTextForm from "./QrTextForm";
import { motion } from "framer-motion";
import DownloadQr from "./DownloadQr";
import { ThemeContext } from "../context/ThemeContext";
import { collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { UserContext } from "../context/UserContext";
import VCard from "vcard-creator";
import uploadDocFunction from "../myHooks/uploadDocFunction";

const CreateContact = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [error, setError] = useState("");

  const { user } = useContext(UserContext);
  const [qRData, setQRData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    website: "",
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
  });
  const [qRImageData, setQRimageData] = useState(null);
  const [status, setStatus] = useState("");
  const [inputErrors, setInputErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    website: "",
    fileName: "",
  });
  const collectionRef = collection(
    db,
    "qr-codes-collection",
    `${user}`,
    "qr-code-data"
  );

  const addToDb = useCallback(async () => {
    setStatus("Saving Qr code");
    const { fileName, foreground, background } = qRData;
    try {
      const docToBeAdded = {
        name: fileName,
        value: qRImageData,
        type: "vCard",
        date: new Date().toDateString(),
        sortDate: Number(new Date()),
        numDownload: "Not applicable",
        foreground: foreground,
        background: background,
      };
      const success = await uploadDocFunction(collectionRef, docToBeAdded);

      if (success) {
        setStatus("Qr code saved successfully");
        setQRData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          website: "",
          fileName: "",
          foreground: "#000000",
          background: "#ffffff",
        });
      }
    } catch (error) {
      setStatus("failed to save Qr code: Try again");
    }
  }, [qRData, collectionRef, qRImageData]);

  const handleChange = (event) => {
    setQRData({ ...qRData, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const inputEl = event.target;
    const { name } = inputEl;
    const value = inputEl.value.trim();

    if (name === "firstName" || name === "lastName") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value.trim().includes(" ")
          ? "Name field can't contain spaces"
          : "",
      }));
    }
    if (name === "phoneNumber") {
      const phonePattern =
        /^(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)|\d{1,4})[-\s]?\d{1,4}[-\s]?\d{1,4}$/;

      setInputErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: phonePattern.test(value)
          ? ""
          : "Phone number is invalid. Example of a valid phone number: +1 (123) 456-7890",
      }));
    }
    if (name === "website") {
      const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        website: urlPattern.test(value)
          ? ""
          : "Invalid URL format. URLs should be in the format 'https://getQrNow.com'",
      }));
    } else if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        email: emailPattern.test(value)
          ? ""
          : "Invalid email format. Please enter a valid email address (e.g., getQrNow@getQrNow.com)",
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

  const handleCreateQr = (event) => {
    event.preventDefault();
    if (
      qRData.firstName === "" ||
      qRData.lastName === "" ||
      qRData.fileName === "" ||
      qRData.email === "" ||
      qRData.website === "" ||
      qRData.phoneNumber === ""
    ) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        allFields: "Please fill in all required fields",
      }));
      return;
    } else if (
      inputErrors.firstName ||
      inputErrors.lastName ||
      inputErrors.fileName ||
      inputErrors.email ||
      inputErrors.website ||
      inputErrors.phoneNumber
    ) {
      return;
    }
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      allFields: "",
    }));
    const { firstName, lastName, email, website, phoneNumber } = qRData;
    const vCard = new VCard();
    vCard
      .addName(firstName, lastName)
      .addEmail(email)
      .addURL(website)
      .addPhoneNumber(phoneNumber);
    setQRimageData(vCard.toString());
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error]);

  const inputData = [
    {
      label: "First name",
      value: qRData.firstName,
      id: "firstName",
      placeholder: "Enter first name",
      type: "text",
    },
    {
      label: "Last name",
      value: qRData.lastName,
      id: "lastName",
      placeholder: "Enter last name",
      type: "text",
    },
    {
      label: "Phone number",
      value: qRData.phoneNumber,
      id: "phoneNumber",
      placeholder: "Enter phone number here",
      type: "text",
    },
    {
      label: "Email",
      value: qRData.email,
      id: "email",
      placeholder: "Enter email here",
      type: "text",
    },
    {
      label: "Website",
      value: qRData.website,
      id: "website",
      placeholder: "Enter email here",
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
          Share Contact Info in a Scan!
        </h1>
      </div>
      <QrTextForm
        inputData={inputData}
        handleChange={handleChange}
        handleCreateQr={handleCreateQr}
        handleValidation={handleValidation}
        foreground={qRData.foreground}
        background={qRData.background}
        errors={inputErrors}
      />
      {qRImageData && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-fit px-6 mx-auto"
        >
          <DownloadQr
            value={qRImageData}
            foreground={qRData.foreground}
            background={qRData.background}
            fileName={qRData.fileName}
            onClick={addToDb}
            showSave
            status={status}
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

export default CreateContact;
