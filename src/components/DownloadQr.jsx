/* eslint-disable react/prop-types */
import QrCode from "./QrCode";
import html2Canvas from "html2canvas";
import fileSaver from "file-saver";
import { useCallback, useRef } from "react";
import download from "../images/download.svg";
import save from "../images/save.svg";
const DownloadQr = ({ value, foreground, background, fileName, onClick }) => {
  const qrRef = useRef();
  const handleDownload = useCallback(async () => {
    const canvas = await html2Canvas(qrRef.current, {
      useCORS: true,
      transparent: true,
      
    });

    const dataUrl = canvas.toDataURL("image/png");
    fileSaver.saveAs(dataUrl, `${fileName}.png`);
  }, [fileName]);
  return (
    <div className="w-fit p-2">
      <div
        ref={qrRef}
        className="mt-6 p-4 bg-blue-400 overflow-hidden"
      >
        <QrCode value={value} foreground={foreground} background={background} />
        <p className="text-gray-200 text-3xl text-center">Scan me</p>
      </div>
      <div className="mx-auto w-fit mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handleDownload}
          className="bg-blue-400 p-2 rounded-full"
        >
          <img src={download} alt="" className="w-6" />{" "}
        </button>
        <button onClick={onClick} className="bg-blue-400 p-2 rounded-full">
          <img src={save} alt="" className="w-6" />{" "}
        </button>
      </div>
    </div>
  );
};

export default DownloadQr;
