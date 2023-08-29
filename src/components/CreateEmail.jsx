import { useCallback, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

import DownloadQr from "./DownloadQr";
import QrTextForm from "./QrTextForm";
import CreateQRHeader from "./CreateQRHeader";
import emailImg from "../images/emailimg.svg";

import uploadDocFunction from "../myHooks/uploadDocFunction";
import { db } from "../../config/firebase";
import { collection } from "firebase/firestore";

const CreateEmail = () => {
  const { user } = useContext(UserContext);

  const [qRData, setQRData] = useState({
    email: "",
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
  });

  const [qRImageData, setQRImageData] = useState(null);
  const [status, setStatus] = useState("");

  //each input error should have the same variable name as the name of the input it concerns
  const [inputErrors, setInputErrors] = useState({
    email: "",
    fileName: "",
    allFields: "",
  });

  // firestore collection ref
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
          // reset inputs
          setQRData({
            email: "",
            fileName: "",
            foreground: "#000000",
            background: "#ffffff",
          });
          setStatus("Qr code saved successfully");
        }
      } catch (error) {
        setStatus("failed to save Qr code: Try again");
      }
    }
  }, [qRData, collectionRef]);
  const handleChange = (e) => {
    setQRData({ ...qRData, [e.target.name]: e.target.value });
  };

  // triggered from FormGroup when input value changes

  const handleValidation = (event) => {
    event.preventDefault();
    const inputEl = event.target; // the input that triggered the validation function
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
    // if all inputs are not empty and no errors are found reset errors[allFields]
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      allFields: "",
    }));
    setQRImageData(qRData);
  };

  // create data to be mapped over in qrTextForm to create inputs
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

  const headerData = {
    img: emailImg,
    heading: "Instant Email QR Codes",
    subText: "Seamless Sharing, Effortless Connection. Get Your Email QR Code Instantly",
  };



  return (
    <div>
      <div className="">
        <CreateQRHeader createQRData={headerData} />
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
        <div className="w-fit px-6 mx-auto">
          <DownloadQr
            value={qRImageData.email}
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

export default CreateEmail;
