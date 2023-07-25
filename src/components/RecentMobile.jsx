import { PropTypes } from "prop-types";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const RecentMobile = ({ name, date, numDownload }) => {
  const { isDarkMode } = useContext(ThemeContext);
  let paragraphStyle;
  isDarkMode
    ? (paragraphStyle = "text-gray-200")
    : (paragraphStyle = "text-gray-600");
  return (
    <div>
      <div className={`flex py-2 space-x-6 overflow-hidden`}>
        <div className="flex-col flex space-y-2 ">
          <p className={paragraphStyle}>Name:</p>
          <p className={paragraphStyle}>Date:</p>
          <p className={paragraphStyle}>Downloads:</p>
        </div>
        <div className="flex-col flex  space-y-2">
          <p className={`${paragraphStyle} truncate`}>{name}</p>
          <p className={paragraphStyle}>{date}</p>
          <p className={paragraphStyle}>{numDownload}</p>
        </div>
      </div>
    </div>
  );
};

RecentMobile.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  numDownload: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
};

export default RecentMobile;
