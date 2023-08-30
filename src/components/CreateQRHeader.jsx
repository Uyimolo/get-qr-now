/* eslint-disable react/prop-types */
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const CreateQRHeader = ({ createQRData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className="px-6">
      <div
        className={`${
          isDarkMode
            ? "bg-[#424548aa] bg-gradient-to-tr from-blue-900  to-blue-400"
            : "bg-gradient-to-br from-blue-900 via-blue-400 to-blue-400"
        } flex flex-col px-2 pt-4 pb-0 transition-all duration-300 justify-between overflow-hidden  shadow-xl rounded-md max-w-[21rem] mx-auto h-[20rem] md:flex-row md:max-w-full md:pt-0 md:space-y-0 md:h-52 z-0`}
      >
        <div className="flex flex-col space-y-4  md:w-2/3 md:pt-6 md:pl-6">
          <h1 className="text-gray-100 text-2xl text-center font-semibold md:text-3xl md:text-left">
            {createQRData.heading}
          </h1>
          <p className="text-gray-200 text-center md:text-xl md:text-left md:max-w-md ">
            {createQRData.subText}
          </p>
        </div>
        <div className="md:w-1/2 md:max-w-sm  translate-x-12 translate-y-[5px] md:-translate-y-[18px] md:translate-x-[20px] md:w-[24rem]">
          <img src={createQRData.img} alt="" className="" />
        </div>
      </div>
    </div>
  );
};

export default CreateQRHeader;
