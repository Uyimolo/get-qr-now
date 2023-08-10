import { useContext, useState, useCallback } from "react";
import QrFileForm from "./QrFileForm";
import { motion } from "framer-motion";
import DownloadQr from "./DownloadQr";
import { ThemeContext } from "../context/ThemeContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { collection } from "firebase/firestore";
import { storage, db } from "../../config/firebase";
import uploadDocFunction from "../myHooks/uploadDocFunction";
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
  const [qRImageData, setQRImageData] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "file") {
      const file = files[0]; // Correctly accessing the selected file
      if (file) {
        setQRData({ ...qRData, file: file }); // Set the selected file
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

  const uploadFile = async () => {
    setStatus("Uploading file...");
    const imageRef = ref(storage, `files/${qRData.fileName}`);
    const uploadedFile = await uploadBytes(imageRef, qRData.file);

    if (uploadedFile) {
      alert("file uploaded successfully");
      setStatus("Getting download URL");
      const downloadURL = await getDownloadURL(imageRef);

      addToDb(downloadURL);
    }
  };

  const collectionRef = collection(
    db,
    "qr-codes-collection",
    `${user}`,
    "qr-code-data"
  );

  const addToDb = useCallback(
    async (downloadURL) => {
      setStatus("Saving Qr code");
      const { fileName, foreground, background } = qRData;

      try {
        const docToBeAdded = {
          name: fileName,
          value: downloadURL,
          type: "file",
          date: new Date().toDateString(),
          sortDate: Number(new Date()),
          numDownload: "Not applicable",
          foreground: foreground,
          background: background,
        };

        const success = await uploadDocFunction(collectionRef, docToBeAdded);

        if (success) {
          setStatus("Qr code saved successfully");
          const { fileName, background, foreground } = qRData;
          setQRImageData({
            downloadURL: downloadURL,
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
        }
      } catch (error) {
        setStatus("failed to save Qr code:" + error.message);
      }
    },
    [qRData, collectionRef]
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

  return (
    <div>
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
              value={qRImageData.downloadURL}
              foreground={qRImageData.foreground}
              background={qRImageData.background}
              fileName={qRImageData.fileName}
              secondary
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
    </div>
  );
};

export default CreateFile;
