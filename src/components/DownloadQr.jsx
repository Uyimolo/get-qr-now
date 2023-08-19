/* eslint-disable react/prop-types */
import QrCode from "./QrCode";
import html2Canvas from "html2canvas";
import fileSaver from "file-saver";
import { useCallback, useRef, useState, useEffect, useContext } from "react";
import download from "../images/download.svg";
import save from "../images/save.svg";
import share from "../images/share.svg";
import deleteIcon from "../images/delete.svg";
import { deleteDocFunction } from "../myHooks/deleteDocFunction";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
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
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that do not support navigator.share
      alert("Web Share API is not supported in this browser.");
    }
  }, [qRDataURL, fileName]);

  const paragraphStyle = isDarkMode
    ? "text-gray-200 text-[14px]"
    : "text-gray-800 text-[12px]";

  return (
    <motion.div
      className={`${
        isDarkMode
          ? "bg-[#424548] hover:bg-[#424548aa] border-gray-500"
          : "bg-[#f1f1f199] border-gray-300"
      } shadow-lg border px-6 pb-6 rounded-xl mt-10 w-full `}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="  rounded-full  bg-transparent h-6 w-6 mt-4 relative mx-auto"
        >
          <div className="h-2 w-2 bg-blue-400 rounded-full absolute left-0"></div>
          <div className="h-2 w-2 bg-yellow-400 rounded-full absolute right-0 "></div>
          <div className="h-2 w-2 bg-red-400 rounded-full absolute bottom-0 left-0"></div>
          <div className="h-2 w-2 bg-purple-400 rounded-full absolute bottom-0 right-0"></div>
        </motion.div>
      )}
      {status && <p className="text-center mt-4 text-blue-400">{status}</p>}
    </motion.div>
  );
};

export default DownloadQr;
