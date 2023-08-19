import { useContext, useState, useCallback } from "react";
import QrFileForm from "./QrFileForm";
import { motion } from "framer-motion";
import DownloadQr from "./DownloadQr";
import { ThemeContext } from "../context/ThemeContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc } from "firebase/firestore";

import { collection } from "firebase/firestore";
import { storage, db } from "../../config/firebase";
import { UserContext } from "../context/UserContext";
const CreateFile = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [qRData, setQRData] = useState({
    file: null,
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
    downloadURL: "",
  });
  const [inputErrors, setInputErrors] = useState({
    file: "",
    fileName: "",
  });
  const [loading, setLoading] = useState(false);
  const [qRImageData, setQRImageData] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [status, setStatus] = useState("");

  //handle changes to inputs
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "file") {
      const file = files[0];

      if (file) {
        setQRData({ ...qRData, file: file });
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result);
        };

        reader.readAsDataURL(file);
      } else {
        setFilePreview("");
      }
    } else {
      setQRData({ ...qRData, [name]: value });
    }
  };

  // step 1: upload file to firebase storage and retreive the downloadURL

  const fileStorageRef = ref(storage, `files/${qRData.fileName}`);
  const uploadFile = async () => {
    setStatus("Uploading file...");
    const uploadedFile = await uploadBytes(fileStorageRef, qRData.file);

    if (uploadedFile) {
      alert("uploaded");
      setStatus("Getting download URL");
      const downloadURL = await getDownloadURL(fileStorageRef);

      addToDb(downloadURL);
    }
  };

  const addToDb = useCallback(
    async (downloadURL) => {
      // For auth user (user creating the qr)
      const collectionRef = collection(
        db,
        "qr-codes-collection",
        `${user}`,
        "qr-code-data"
      );

      setStatus("Saving Qr code");

      const { fileName, file, foreground, background } = qRData;
      const fileType = getFileExtension(file.name).slice(1);
      // step 2 : create document containing the downloadUrl.
      try {
        const publicDoc = {
          name: fileName,
          downloadURL: downloadURL,
          createdBy: user,
          type: fileType,
          date: new Date().toDateString(),
          sortDate: Number(new Date()),
          foreground: foreground,
          background: background,
        };
        // for public users who'll scan the qr
        const fileRef = collection(db, "files-collection");
        const newPublicDoc = await addDoc(fileRef, publicDoc);

        if (newPublicDoc) {
          //this is the url that will be encoded into the qr code, the newPublicDoc.Id will be used as a route parameter to retreive the document and the numdownloads will be increased by one when user hits this route

          // const url = `localhost:5173/download/${newPublicDoc.id}`; use this when working with a local server

          // for live site
          const url = `get-qr-now.vercel.app/download/${newPublicDoc.id}`;

          const userDoc = {
            name: fileName,
            value: url,
            type: "file",
            date: new Date().toDateString(),
            sortDate: Number(new Date()),
            numDownload: 0,
            publicDocRef: newPublicDoc.id,
            foreground: foreground,
            background: background,
          };
          // step 3 : create doc for user which has the link to the public document and can be used to create more copies of the origin qr code.
          const newUserDoc = await addDoc(collectionRef, userDoc);

          if (newUserDoc) {
            setStatus("Qr code saved successfully");
            const { fileName, background, foreground } = qRData;

            setQRImageData({
              value: url,
              fileName: fileName,
              background: background,
              foreground: foreground,
            });

            setQRData({
              file: "",
              fileName: "",
              foreground: "#000000",
              background: "#ffffff",
              downloadURL: "",
            });

            setLoading(false);
          }
        }
      } catch (error) {
        setStatus("failed to save Qr code:" + error.message);
      }
    },
    [qRData, user]
  );

  function getFileExtension(filename) {
    return filename.slice(filename.lastIndexOf("."));
  }

  const handleCreateQR = (event) => {
    event.preventDefault();
    // Check for validation errors
    if (inputErrors.url || inputErrors.fileName) {
      return;
    } else if (!qRData.file || qRData.fileName === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        allFields: "Please fill in all required fields",
      }));
      return;
    }
    setLoading(true);
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      allFields: "",
    }));
    uploadFile();
  };

  const handleValidation = (event) => {
    const inputEl = event.target;
    const { name, value } = inputEl;
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".svg",
      ".png",
      ".gif",
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".txt",
      ".pptx",
    ];
    if (name === "file") {
      const file = inputEl.files[0];

      if (!file) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          file: "Please select a file.",
        }));
      } else if (
        !allowedExtensions.includes(getFileExtension(file.name).toLowerCase())
      ) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          file: "Invalid file type. Please select images (JPEG, SVG, PNG), PDFs, GIFs,Text (TXT) Word documents, or PowerPoint documents.",
        }));
      } else if (file.size > 2000000) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          file: "Maximum file size of 2 megabytes exceeded.",
        }));
      } else {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          file: "",
        }));
      }
    } else if (name === "fileName") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        fileName: value.trim().includes(" ")
          ? "File names should not contain spaces."
          : "",
      }));
    }
  };

  const inputData = [
    {
      label: "Select PDF file",
      id: "file",
      type: "file",
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
          {`Create QR's for File Downloads Easily!`}
        </h1>
      </div>
      {
        <QrFileForm
          inputData={inputData}
          foreground={qRData.foreground}
          background={qRData.background}
          handleChange={handleChange}
          file={qRData.file}
          filePreview={filePreview}
          handleCreateQr={handleCreateQR}
          errors={inputErrors}
          handleValidation={handleValidation}
          loading={loading}
          status={status}
        />
      }
      <div className="flex flex-col md:flex-row">
        {qRImageData && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-fit px-6 mx-auto"
          >
            <DownloadQr
              value={qRImageData.value}
              foreground={qRImageData.foreground}
              background={qRImageData.background}
              fileName={qRImageData.fileName}
              secondary
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateFile;
