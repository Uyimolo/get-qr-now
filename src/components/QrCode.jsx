import { PropTypes } from "prop-types";
import QRCode from "react-qr-code";
const QrCode = ({ value, foreground, background }) => {
  return (
    <div className="">
      <QRCode
        value={value}
        bgColor={background}
        fgColor={foreground}
        size={150}
        level="Q"
      />
    </div>
  );
};

QrCode.propTypes = {
  value: PropTypes.string,
  foreground: PropTypes.string,
  background: PropTypes.string,
};
export default QrCode;
