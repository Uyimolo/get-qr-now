import { useState, useCallback, useContext } from "react";
import QrTextForm from "./QrTextForm";
import { motion } from "framer-motion";
import DownloadQr from "./DownloadQr";
import { ThemeContext } from "../context/ThemeContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { UserContext } from "../context/UserContext";

const CreateContact = () => {
  const isDarkMode = useContext(ThemeContext);
  const user = useContext(UserContext);
  const [qRData, setQRData] = useState({
    fullName: "",
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
      const docAdded = await addDoc(collectionRef, {
        name: fileName,
        value: qRImageData,
        type: "contact",
        date: new Date().toDateString(),
        sortDate: Number(new Date()),
        numDownload: "Not applicable",
        foreground: foreground,
        background: background,
      });
      if (docAdded) {
        setStatus("Qr code saved successfully");
        setQRData({
          fullName: "",
          phoneNumber: "",
          email: "",
          website: "",
          fileName: "",
          foreground: "",
          background: "",
        });
      }
    } catch (error) {
      setStatus("failed to save Qr code: Try again");
    }
  }, [qRData, collectionRef, qRImageData]);

  const handleChange = (event) => {
    setQRData({ ...qRData, [event.target.name]: event.target.value });
    console.log(qRData);
  };

  const handleCreateQr = (event) => {
    event.preventDefault();
    if (
      qRData.fullName !== "" &&
      qRData.fileName !== "" &&
      qRData.email !== "" &&
      qRData.website !== ""
    ) {
      // console.log(qRData);
      //   fullName: qRData.fullName,
      //   workPhone: qRData.phoneNumber,
      //   email: qRData.email,
      //   url: qRData.website,
      // });
      // setQRimageData(createdVCard.getFormattedString());
      // console.log(qRImageData);
    }
  };

  const inputData = [
    {
      label: "Full name",
      value: qRData.fullName,
      id: "fullName",
      placeholder: "Enter full name",
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
      type: "url",
    },
    {
      label: "Name your Qr Code",
      value: qRData.fileName,
      id: "fileName",
      placeholder: "Enter a name for your Qr Code here",
      type: "text",
    },
  ];
  return (
    <div>
      <QrTextForm
        inputData={inputData}
        handleChange={handleChange}
        handleCreateQr={handleCreateQr}
        foreground={qRData.foreground}
        background={qRData.background}
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
