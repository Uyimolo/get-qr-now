/* eslint-disable react/prop-types */

import QRCode from "react-qr-code";
import download from "../images/download.svg";
import share from "../images/share.svg";
import deleteIcon from "../images/delete.svg";

const QrModal = ({ value, foreground, background }) => {
  const iconStyle = ""
  return (
    <div className="flex flex-col space-x-4 justify-center left-0 right-0 bottom-0 top-0 absolute bg-[#00000044] flex items-center">
      {/* add buttons for delete, share and download */}
      <div className="">
        <img src={share} alt="" className={iconStyle} />
        <img src={deleteIcon} alt="" className={iconStyle} />
        <img src={download} alt="" className={iconStyle} />
      </div>
      <div className="p-2 bg-white">
        <QRCode value={value} fgColor={foreground} bgColor={background} />
      </div>
    </div>
  );
};

export default QrModal;
