import { useCallback, useContext, useState } from "react";
import { db } from "../../config/firebase";
import { collection } from "firebase/firestore";
import DownloadQr from "./DownloadQr";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import QrTextForm from "./QrTextForm";
import uploadDocFunction from "../myHooks/uploadDocFunction";

const CreateUrl = () => {
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [qRData, setQRData] = useState({
    url: "",
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
  });
  const [inputErrors, setInputErrors] = useState({
    url: "",
    fileName: "",
    allFields: "",
  });
  const [loading, setLoading] = useState(false);
  const [qRImageData, setQRimageData] = useState(null);
  const [status, setStatus] = useState("");

  const collectionRef = collection(
    db,
    "qr-codes-collection",
    `${user}`,
    "qr-code-data"
  );
  //add qrCode to database
  const addToDb = useCallback(async () => {
    setStatus("Saving Qr code");
    const { fileName, url, foreground, background } = qRData;
    try {
      const docToBeAdded = {
        name: fileName,
        value: url,
        type: "url",
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
          url: "",
          fileName: "",
          foreground: "#000000",
          background: "#ffffff",
        });
      }
    } catch (error) {
      setStatus("failed to save Qr code: Try again");
    }
  }, [qRData, collectionRef]);

  const handleChange = (e) => {
    setQRData({ ...qRData, [e.target.name]: e.target.value });
    handleValidation(e);
  };

  const handleValidation = (event) => {
    const inputEl = event.target;
    const { name } = inputEl;
    const value = inputEl.value.trim();

    if (name === "url") {
      const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        url: urlPattern.test(value)
          ? ""
          : "Invalid URL format. URLs should be in the format 'https://example.com'",
      }));
    } else if (name === "fileName") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        fileName:
          value.length > 0 && value.includes(" ")
            ? "File names should not contain spaces."
            : "",
      }));
    }
  };

  const handleCreateQr = (event) => {
    event.preventDefault();
    setLoading(true);

    // Check for validation errors
    if (inputErrors.url || inputErrors.fileName) {
      setLoading(false);

      return;
    } else if (qRData.url === "" || qRData.fileName === "") {
      setLoading(false);
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
    setLoading(false);
    setQRimageData(qRData);
  };

  // create data to be mapped over in qrTextForm to create inputs
  const inputData = [
    {
      label: "Address",
      value: qRData.url,
      id: "url",
      placeholder: "Should begin with 'https://'",
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
    <div className="">
      <div className="">
        <h1 className={`${paragraphStyle} text-3xl text-center mb-6`}>
          Share Links with Ease!
        </h1>
      </div>

      <QrTextForm
        handleCreateQr={handleCreateQr}
        fileName={qRData.fileName}
        handleChange={handleChange}
        foreground={qRData.foreground}
        background={qRData.background}
        inputData={inputData}
        handleValidation={handleValidation}
        errors={inputErrors}
        loading={loading}
      />

      {qRImageData && (
        <div className="w-fit px-6 mx-auto">
          <DownloadQr
            value={qRImageData.url}
            foreground={qRImageData.foreground}
            background={qRImageData.background}
            fileName={qRImageData.fileName}
            onClick={addToDb}
            showSave
            status={status}
          />
        </div>
      )}
    </div>
  );
};

export default CreateUrl;
