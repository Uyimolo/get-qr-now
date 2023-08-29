import { useState, useCallback, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

import QrTextForm from "./QrTextForm";
import DownloadQr from "./DownloadQr";
import CreateQRHeader from "./CreateQRHeader";
import contactImg from "../images/phoneimg.svg";

import { db } from "../../config/firebase";
import { collection } from "firebase/firestore";
import uploadDocFunction from "../myHooks/uploadDocFunction";

import VCard from "vcard-creator";

const CreateContact = () => {
  const { user } = useContext(UserContext);

  const [error, setError] = useState("");
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
  const [qRImageData, setQRImageData] = useState(null);
  const [status, setStatus] = useState("");
  //each input error should have the same variable name as the name of the input it concerns
  const [inputErrors, setInputErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    website: "",
    fileName: "",
  });
  // firestore collection ref
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
        // reset inputs
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

  // triggered from FormGroup when input value changes
  const handleValidation = (event) => {
    const inputEl = event.target; // the input that triggered the validation function
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
    // if all inputs are not empty and no errors are found reset errors[allFields]
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      allFields: "",
    }));

    // create vCard and setQRImageData to vCard Object
    const { firstName, lastName, email, website, phoneNumber } = qRData;
    const vCard = new VCard();
    vCard
      .addName(firstName, lastName)
      .addEmail(email)
      .addURL(website)
      .addPhoneNumber(phoneNumber);
    setQRImageData(vCard.toString());
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error]);

  // create data to be mapped over in qRTextForm to create inputs
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
      placeholder: "Enter your web address here",
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
    img: contactImg,
    heading: "Share Contact Info in a Scan!",
    subText:
      "Digital Business Cards, Simplified. Create Your vCard QR Code in an Instant!",
  };

  return (
    <div>
      <div className="">
        <CreateQRHeader createQRData={headerData} />
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
        <div className="w-fit px-6 mx-auto">
          <DownloadQr
            value={qRImageData}
            foreground={qRData.foreground}
            background={qRData.background}
            fileName={qRData.fileName}
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

export default CreateContact;
