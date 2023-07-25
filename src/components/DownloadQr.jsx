import Button from "./Button";
import QrCode from "./QrCode";
import { PropTypes } from "prop-types";
import html2Canvas from "html2canvas";
import fileSaver from "file-saver";
import { useCallback, useRef } from "react";
const DownloadQr = ({ value, foreground, background, fileName, onClick }) => {
  const qrRef = useRef();
  const handleDownload = useCallback(async () => {
    const canvas = await html2Canvas(qrRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    fileSaver.saveAs(dataUrl, `${fileName}.png`);
  }, [fileName]);
  return (
    <div className="w-full max-w-lg mx-auto">
      <div ref={qrRef} className="mx-auto w-fit mt-6 p-2">
        <QrCode value={value} foreground={foreground} background={background} />
      </div>
      <div className="mx-auto w-fit mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button text="Download Qr" onClick={handleDownload} extraStyle="px-8" />
        <Button text="Save to cloud" onClick={onClick} />
      </div>
    </div>
  );
};

DownloadQr.propTypes = {
  value: PropTypes.string.isRequired,
  foreground: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DownloadQr;
