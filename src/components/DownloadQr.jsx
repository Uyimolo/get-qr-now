/* eslint-disable react/prop-types */
import QrCode from "./QrCode";
import download from "../images/download.svg";
import save from "../images/save.svg";
import share from "../images/share.svg";
import deleteIcon from "../images/delete.svg";
import close from "../images/close.svg";
import LoadingIndicator from "./LoadingIndicator";

import html2Canvas from "html2canvas";
import fileSaver from "file-saver";
import { motion } from "framer-motion";

import { useCallback, useRef, useState, useEffect, useContext } from "react";

import { deleteDocFunction } from "../myHooks/deleteDocFunction";

import { ThemeContext } from "../context/ThemeContext";

const DownloadQr = ({
  value,
  foreground,
  background,
  fileName,
  onClick,
  id,
  showDelete,
  showSave,
  status,
  setQRImageData,
  setStatus,
}) => {
  const [qRDataURL, setQRDataURL] = useState("");
  const { isDarkMode } = useContext(ThemeContext);

  const qrRef = useRef();

  // convert qrcode image to data url for both sharing and download
  useEffect(() => {
    // create dataURL of image and set qRDataURL state with it
    const createQRDataURL = async () => {
      const canvas = await html2Canvas(qrRef.current, {
        useCORS: true,
        transparent: true,
      });

      const dataURL = canvas.toDataURL("image/png");
      setQRDataURL(dataURL);
    };
    createQRDataURL();
  }, [value, qRDataURL]);

  // download qrcode with file-saver using the qRDataURL
  const handleDownload = useCallback(() => {
    fileSaver.saveAs(qRDataURL, `${fileName}.png`);
  }, [fileName, qRDataURL]);

  const handleShareQR = useCallback(async () => {
    if (navigator.share) {
      try {
        const response = await fetch(qRDataURL);
        // convert qrDataURL to blob
        const blob = await response.blob();
        const file = new File([blob], `${fileName}.png`, { type: "image/png" });

        await navigator.share({
          title: "Share QR Code",
          text: "Check out this QR Code!",
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing qr code:", error);
      }
    } else {
      // Fallback for browsers that do not support navigator.share
      alert("Web Share API is not supported in this browser.");
    }
  }, [qRDataURL, fileName]);

  const handleCloseQrModal = () => {
    setQRImageData(null);
    setStatus("");
  };

  const paragraphStyle = isDarkMode
    ? "text-gray-200 text-[14px]"
    : "text-gray-800 text-[12px]";

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8 }}
      className={`${
        isDarkMode
          ? "bg-[#424548ef]"
          : "bg-[#f1f1f1ef]"
      } shadow-lg border fixed w-full left-0 right-0 top-0 bottom-0 flex flex-col justify-center align-center z-10 mx-auto px-6 pb-6 w-full `}
    >
      <div
        className="absolute top-10 right-6 p-1 cursor-pointer w-8 h-8 rounded-full bg-gray-400 hover:bg-blue-400"
        onClick={handleCloseQrModal}
      >
        <img src={close} alt="" />
      </div>

      <h3
        className={`text-blue-400 text-3xl font-semibold text-center px-6 truncate`}
      >
        {fileName.toUpperCase()}
      </h3>

      <div
        ref={qrRef}
        className="mt-6 p-4 w-fit mx-auto bg-transparent overflow-hidden"
      >
        <QrCode value={value} foreground={foreground} background={background} />
        <p className="text-black text-3xl text-center">Scan me</p>
      </div>
      <div className="mx-auto mt-6 flex space-x-6 justify-center items-center">
        <div className="flex flex-col items-center">
          <button
            onClick={handleDownload}
            className="bg-black p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
          >
            <img src={download} alt="" className="w-6" />{" "}
          </button>
          <p className={`${paragraphStyle}`}>Download</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="bg-black p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
            onClick={handleShareQR}
          >
            <img src={share} alt="" className="w-6" />{" "}
          </button>
          <p className={paragraphStyle}>Share</p>
        </div>

        {showSave && (
          <div className="flex flex-col items-center">
            <button
              onClick={onClick}
              className="bg-black p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
            >
              <img src={save} alt="" className="w-6" />{" "}
            </button>
            <p className={paragraphStyle}>Save</p>
          </div>
        )}

        {showDelete && (
          <div className="flex flex-col items-center">
            <button
              onClick={() => deleteDocFunction(id)}
              className="bg-black p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
            >
              <img src={deleteIcon} alt="" className="w-6" />
            </button>
            <p className={paragraphStyle}>Delete</p>
          </div>
        )}
      </div>
      {status && status !== "Qr code saved successfully" && (
        <LoadingIndicator />
      )}
      {status && <p className="text-center mt-4 text-blue-400">{status}</p>}
    </motion.div>
  );
};

export default DownloadQr;
