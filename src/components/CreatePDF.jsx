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
const CreatePDF = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [qRData, setQRData] = useState({
    file: null,
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
    downloadURL: "",
  });
  const [error, setError] = useState("");
  const [qRImageData, setQRImageData] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "pdf") {
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

    if (!qRData.file) {
      setError(
        "Please select an image, PDF, GIF, Word document,Text or PowerPoint document file"
      );
    } else {
      const fileExtension = getFileExtension(qRData.file.name);

      if (qRData.fileName === "") {
        setError("Please input a name for your file");
      } else if (qRData.file.size > 2000000) {
        setError("Maximum file size of 2 megabytes exceeded");
      } else if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        setError(
          "Invalid file type. Please select images (JPEG, SVG, PNG), PDFs, GIFs,Text (TXT) Word documents, or PowerPoint documents."
        );
      } else {
        uploadFile();
      }
    }
  };

  const inputData = [
    {
      label: "Select PDF file",
      id: "pdf",
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
          error={error}
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

export default CreatePDF;
