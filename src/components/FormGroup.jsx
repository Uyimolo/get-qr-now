/* eslint-disable react/prop-types */
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const FormGroup = ({
  paragraphStyle,
  value,
  onChange,
  label,
  id,
  placeholder,
  type,
  handleValidation,
  error
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className={`flex flex-col space-y-1 w-full md:w-[19rem] `}>
      <label htmlFor={id} className={`flex ${paragraphStyle}`}>
        {label} <p className="text-red-600 text-xl h-1 px-2 ">*</p>
      </label>
      <input
        type={type}
        name={id}
        placeholder={placeholder}
        className={` ${
          isDarkMode ? "bg-gray-200" : "bg-[#fafafa]"
        } p-2 border-[1px] rounded-md hover:bg-gray-100 transition-all duration-1 ${error !== "" && " border-red-400"}`}
        value={value}
        onChange={onChange}
        onInput={handleValidation}
      />
      <p className="text-red-500 text-[14px]">{error}</p>
    </div>
  );
};

export default FormGroup;
