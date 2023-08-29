import { useCallback, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

import DownloadQr from "./DownloadQr";
import QrTextForm from "./QrTextForm";
import CreateQRHeader from "./CreateQRHeader";
import urlImg from "../images/urlimg.svg";

import { db } from "../../config/firebase";
import { collection } from "firebase/firestore";
import uploadDocFunction from "../myHooks/uploadDocFunction";

const CreateUrl = () => {
  const { user } = useContext(UserContext);

  const [qRData, setQRData] = useState({
    url: "",
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
  });

  //each input error should have the same variable name as the name of the input it concerns
  const [inputErrors, setInputErrors] = useState({
    url: "",
    fileName: "",
    allFields: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [qRImageData, setQRImageData] = useState(null);

  // firestore collection ref
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
        // reset inputs
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

  // triggered from FormGroup when input value changes
  const handleValidation = (event) => {
    const inputEl = event.target; // the input that triggered the validation function
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
    // if all inputs are not empty and no errors are found reset errors[allFields]
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      allFields: "",
    }));
    setLoading(false);
    setQRImageData(qRData);
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

  const headerData = {
    img: urlImg,
    heading: "Share Links with Ease!",
    subText: "social media handles, websites, basically anything on the web",
  };

  // const paragraphStyle = isDarkMode ? "text-gray-200" : "text-gray-600";

  return (
    <div className="">
      <div className="">
        <CreateQRHeader createQRData={headerData} />
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
            setStatus={setStatus}
            setQRImageData={setQRImageData}
          />
        </div>
      )}
    </div>
  );
};

export default CreateUrl;
