/* eslint-disable react/prop-types */
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import emailIcon from "../images/email.svg";
import userIcon from "../images/user.svg";
import fileIcon from "../images/file.svg";
import phoneIcon from "../images/phone.svg";
import urlIcon from "../images/link-icon.svg";

const FormGroup = ({
  paragraphStyle,
  value,
  onChange,
  label,
  id,
  placeholder,
  type,
  handleValidation,
  error,
}) => {

  let imageSrc = urlIcon
  if(id === "phoneNumber") {
    imageSrc = phoneIcon
  }
  else if (id === "file" || id === "fileName") {
    imageSrc = fileIcon
  }
  else if (id === "firstName" || id === "lastName" ){
    imageSrc = userIcon
  }
  else if (id === "email") {
    imageSrc = emailIcon
  }
  
 

  const { isDarkMode } = useContext(ThemeContext);
  let inputStateStyle = "";

  if (type !== "file") {
    error.length > 0
      ? (inputStateStyle = "border-red-500")
      : (inputStateStyle =
          !error && value.length > 0
            ? (inputStateStyle =
                "bg-green-500 text-white hover:bg-green-300 hover:text-gray-600")
            : (inputStateStyle = ""));
  } else {
    error.length > 0
      ? (inputStateStyle = "border-red-500")
      : (inputStateStyle =
          "bg-green-500 text-white hover:text-gray-600 hover:bg-green-300");
  }

  return (
    <div className={`flex flex-col space-y-1 w-full mx-auto max-w-[21rem] xl:max-w-md`}>
      <label htmlFor={id} className={`flex ${paragraphStyle}`}>
        {label} <p className="text-red-600 text-xl h-1 px-2 ">*</p>
      </label>
      <div className="relative">
        <img src={imageSrc} alt="" className="w-5 absolute top-0 bottom-0 my-auto left-2" />
        <input
          type={type}
          name={id}
          placeholder={placeholder}
          className={` ${
            isDarkMode ? "bg-gray-200" : "bg-[#fafafa]"
          } p-2 pl-8 border-[1px] border-black rounded-md hover:bg-gray-100 transition-all duration-1 w-full ${inputStateStyle}`}
          value={value}
          onChange={onChange}
          onInput={handleValidation}
        />
      </div>

      <p className="text-red-500 text-[14px]">{error}</p>
    </div>
  );
};

export default FormGroup;
