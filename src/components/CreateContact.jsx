import { useState, useCallback, useContext } from "react";
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

  const handleCreateQr = (event) => {
    event.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;

    if (
      qRData.firstName === "" ||
      qRData.lastName === "" ||
      qRData.fileName === "" ||
      qRData.email === "" ||
      qRData.website === "" ||
      qRData.phoneNumber === ""
    ) {
      setError("please fill in all fields");
    } else if (
      qRData.firstName.trim().includes(" ") ||
      qRData.lastName.trim().includes(" ")
    ) {
      setError("Name fields cannot include spaces");
    } else if (urlPattern.test(qRData.website.trim()) === false) {
      setError(
        "Invalid URL format. URLs should be in the format 'https://example.com'"
      );
    } else if (emailPattern.test(qRData.email.trim()) === false) {
      setError(
        "Invalid email format. Please enter a valid email address (e.g., example@example.com)."
      );
    } else {
      const { firstName, lastName, email, website, phoneNumber } = qRData;
      const vCard = new VCard();
      vCard
        .addName(firstName, lastName)
        .addEmail(email)
        .addURL(website)
        .addPhoneNumber(phoneNumber);
      setQRimageData(vCard.toString());
    }
  };
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
      type: "telephone",
    },
    {
      label: "Email",
      value: qRData.email,
      id: "email",
      placeholder: "Enter email here",
      type: "email",
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
        foreground={qRData.foreground}
        background={qRData.background}
        error={error}
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
