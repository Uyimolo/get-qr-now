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

  const handleCreateQr = (e) => {
    e.preventDefault();
    if (qRData.email !== "" && qRData.fileName !== "") {
      setQRimageData(qRData);
    }
  };

  const inputData = [
    {
      label: "Email",
      value: qRData.value,
      id: "email",
      placeholder: "Enter a web address here",
      type: "email",
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
    <div
      className={`  px-2 py-4 ${
        isDarkMode ? "" : ""
      } flex flex-col justify-center w-full  lg:max-w-3xl lg:mx-auto  md:items-center `}
    >
      <QrTextForm
        handleCreateQr={handleCreateQr}
        // fileName={qRData.fileName}
        handleChange={handleChange}
        foreground={qRData.foreground}
        background={qRData.background}
        inputData={inputData}
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