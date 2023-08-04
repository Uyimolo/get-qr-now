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
const DownloadQr = ({
  value,
  foreground,
  background,
  fileName,
  onClick,
  id,
}) => {
  const [qRDataURL, setQRDataURL] = useState("");
  const {isDarkMode} = useContext(ThemeContext)

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

  useEffect(() => {
    console.log(isDarkMode);
  }, [isDarkMode]);

  let paragraphStyle;
  isDarkMode
    ? (paragraphStyle = "text-gray-200 text-[14px]")
    : (paragraphStyle = "text-gray-600 text-[12px]");

  return (
    <div className="p-2 w-full">
      <div
        ref={qrRef}
        className="mt-6 p-4 w-fit mx-auto bg-blue-400 overflow-hidden"
      >
        <QrCode value={value} foreground={foreground} background={background} />
        <p className="text-gray-200 text-3xl text-center">Scan me</p>
      </div>
      <div className="mx-auto mt-6 flex space-x-6 justify-center items-center">
        <div className="flex flex-col items-center">
          <button
            onClick={handleDownload}
            className="bg-blue-400 p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
          >
            <img src={download} alt="" className="w-6" />{" "}
          </button>
          <p className={`${paragraphStyle}`}>Download</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="bg-blue-400 p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
            onClick={handleShareQR}
          >
            <img src={share} alt="" className="w-6" />{" "}
          </button>
          <p className={paragraphStyle}>Share</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={onClick}
            className="bg-blue-400 p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
          >
            <img src={save} alt="" className="w-6" />{" "}
          </button>
          <p className={paragraphStyle}>Save</p>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={() => deleteDocFunction(id)}
            className="bg-blue-400 p-2 rounded-full transition-all duration-400  hover:bg-blue-500"
          >
            <img src={deleteIcon} alt="" className="w-6" />
          </button>
          <p className={paragraphStyle}>Delete</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadQr;
