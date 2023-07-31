/* eslint-disable react/prop-types */
import {useContext} from "react";
import { ThemeContext } from "../context/ThemeContext";

const FormGroup = ({ paragraphStyle, value, onChange, label, id, placeholder, type }) => {
  const isDarkMode = useContext(ThemeContext);
  return (
    <div className="flex flex-col space-y-2 w-full md:w-[20rem]">
      <label htmlFor={id} className={`flex justify-center ${paragraphStyle}`}>
        {label} <p className="text-red-600 text-xl h-1 px-2 ">*</p>
      </label>
      <input
        type={type}
        name={id}
        placeholder={placeholder}
        className={` ${
          isDarkMode ? "bg-gray-200" : ""
        } p-2 border-gray-300 border-[1px] rounded-md hover:bg-gray-100 transition-all duration-1`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormGroup;
