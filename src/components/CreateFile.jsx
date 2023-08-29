import { useContext, useState, useCallback } from "react";
import { UserContext } from "../context/UserContext";

import QrFileForm from "./QrFileForm";
import DownloadQr from "./DownloadQr";
import CreateQRHeader from "./CreateQRHeader";
import fileImg from "../images/uploadimg.svg";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { storage, db } from "../../config/firebase";

const CreateFile = () => {
  const { user } = useContext(UserContext);

  const [qRData, setQRData] = useState({
    file: null,
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
    downloadURL: "",
  });

  //each input error should have the same variable name as the name of the input it concerns
  const [inputErrors, setInputErrors] = useState({
    file: "",
    fileName: "",
  });

  const [loading, setLoading] = useState(false);

  const [filePreview, setFilePreview] = useState("");
  const [status, setStatus] = useState("");

  const [qRImageData, setQRImageData] = useState(null);

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
  const uploadFile = async () => {
    setStatus("Uploading file...");

    const fileStorageRef = ref(storage, `files/${qRData.fileName}`);

    // upload file to firebase storage
    try {
      const uploadedFile = await uploadBytes(fileStorageRef, qRData.file);

      if (uploadedFile) {
        setStatus("Getting download URL");
        const downloadURL = await getDownloadURL(fileStorageRef);

        // add qr code to firestore database
        addToDb(downloadURL);
      }
    } catch (error) {
      setStatus(error.message);
    }
  };

  const addToDb = useCallback(
    async (downloadURL) => {
      // collection ref for document to be used by users (who didnt create the qRCode)
      const fileRef = collection(db, "files-collection");

      // collection ref for document to be created for authenticated user who created qrCode
      const collectionRef = collection(
        db,
        "qr-codes-collection",
        `${user}`,
        "qr-code-data"
      );

      setStatus("Saving Qr code");

      const { fileName, file, foreground, background } = qRData;

      // get file extension of uploadled file
      const fileType = getFileExtension(file.name).slice(1);

      // step 2 : create public document that will be used in fetching the private doc during file download. accessible to all users. the publicDoc also holds the reference to the authenticated user who created the qr code (createdBy)
      try {
        const publicDoc = {
          name: fileName,
          downloadURL: downloadURL,
          createdBy: user,
          type: fileType,
        };

        const newPublicDoc = await addDoc(fileRef, publicDoc);

        if (newPublicDoc) {
          //this is the url that will be encoded into the qr code, the newPublicDoc.Id will be used as a route parameter to retrieve the public doc
          const url = `get-qr-now.vercel.app/download/${newPublicDoc.id}`;

          // step 3 : create private document for qrCode creator (auth user) which has the link to the public document (used for deleting the public doc when userDoc is deleted) and can be used to create more copies of the origin qr code. it also contains the number of times the uploaded file is downloaded
          const privateDoc = {
            name: fileName,
            value: url,
            downloadURL: downloadURL,
            type: "file",
            date: new Date().toDateString(),
            sortDate: Number(new Date()),
            numDownload: 0,
            publicDocRef: newPublicDoc.id,
            foreground: foreground,
            background: background,
          };

          const newPrivateDoc = await addDoc(collectionRef, privateDoc);

          if (newPrivateDoc) {
            setStatus("Qr code saved successfully");
            const { fileName, background, foreground } = qRData;

            setQRImageData({
              value: url,
              fileName: fileName,
              background: background,
              foreground: foreground,
            });

            // reset inputs
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

    // if all inputs are not empty and no errors are found reset errors[allFields]
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      allFields: "",
    }));

    // start file upload and document creation process
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

  // create data to be mapped over in qrTextForm to create inputs
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

  const headerData = {
    img: fileImg,
    heading: "Create QR's for File Downloads Easily!",
    subText:
      "Effortless File Sharing, Elevated Efficiency. Generate for Your Files QR Codes in Seconds!",
  };
  return (
    <div>
      <div className="">
        <CreateQRHeader createQRData={headerData} />
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
          <div className="w-fit px-6 mx-auto">
            <DownloadQr
              value={qRImageData.value}
              foreground={qRImageData.foreground}
              background={qRImageData.background}
              fileName={qRImageData.fileName}
              secondary
              setStatus={setStatus}
              setQRImageData={setQRImageData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFile;
