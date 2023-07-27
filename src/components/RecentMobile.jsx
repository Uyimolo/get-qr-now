import { PropTypes } from "prop-types";
import deleteQr from "../images/delete.svg";
import view from "../images/view.svg";
import { deleteDocFunction } from "../myHooks/deleteDocFunction";
const RecentMobile = ({ name, date, numDownload, id, paragraphStyle }) => {
  return (
    <div>
      <div className={`flex py-2 space-x-6 items-start`}>
        <div className="flex-col flex space-y-2 ">
          <p className={paragraphStyle}>Name:</p>
          <p className={paragraphStyle}>Date:</p>
          <p className={paragraphStyle}>Downloads:</p>
          <button
            className={`text-gray-200 items-center flex space-x-2 px-2 py-1 bg-blue-400 rounded`}
          >
            <img src={view} className="w-6 mr-2" alt="" /> View
          </button>
        </div>
        <div className="flex-col flex  space-y-2 items-start">
          <p className={`${paragraphStyle} truncate`}>{name}</p>
          <p className={paragraphStyle}>{date}</p>
          <p className={paragraphStyle}>{numDownload}</p>
          <button
            className={`text-gray-200 flex px-2 space-x-2 py-1 bg-blue-400 rounded`}
            onClick={() => deleteDocFunction(id)}
          >
            <img src={deleteQr} className="w-6" alt="" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

RecentMobile.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  numDownload: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  paragraphStyle: PropTypes.string.isRequired,
};

export default RecentMobile;
