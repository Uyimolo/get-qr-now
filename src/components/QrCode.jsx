/* eslint-disable react/prop-types */
import QRCode from "react-qr-code";
const QrCode = ({ value, foreground, background }) => {
  const qrStyle = `bg-[${background}] p-1 bg-white border-[${background}]`;
  // todo: make the background color for qr div to be same with the qrCode bgColor
  return (
    <div className={qrStyle}>
      <QRCode
        value={value}
        bgColor={background}
        fgColor={foreground}
        size={160}
        level="Q"
      />
    </div>
  );
};

export default QrCode;
