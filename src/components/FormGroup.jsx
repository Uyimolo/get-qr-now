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
  // select which icon should show for specific inputs based on their ids which corresponds to the input names
  let IconSrc = urlIcon;
  if (id === "phoneNumber") {
    IconSrc = phoneIcon;
  } else if (id === "file" || id === "fileName") {
    IconSrc = fileIcon;
  } else if (id === "firstName" || id === "lastName") {
    IconSrc = userIcon;
  } else if (id === "email") {
    IconSrc = emailIcon;
  }

  const { isDarkMode } = useContext(ThemeContext);

  // create input styles for validated and error states
  let inputStateStyle = "";

  if (type !== "file") {
    error.length > 0
      ? (inputStateStyle = "border-red-500 border-[2px]")
      : (inputStateStyle =
          !error && value.length > 0
            ? (inputStateStyle = "border-green-500 border-[2px]")
            : (inputStateStyle = ""));
  } else {
    error.length > 0
      ? (inputStateStyle = "border-red-500 border-[3px]")
      : (inputStateStyle = "border-green-500 border-[3px]");
  }

  return (
    <div
      className={`flex flex-col space-y-1 w-full mx-auto max-w-[21rem] xl:max-w-md`}
    >
      <label htmlFor={id} className={`flex ${paragraphStyle}`}>
        {label} <p className="text-red-600 text-xl h-1 px-2 ">*</p>
      </label>
      <div className="relative">
        {/* input icon */}
        <img
          src={IconSrc}
          alt=""
          className="w-5 absolute top-0 bottom-0 my-auto left-2"
        />
        <input
          type={type}
          name={id}
          placeholder={placeholder}
          className={` ${
            isDarkMode ? "bg-gray-200" : "bg-[#fafafa]"
          } p-2 pl-8 border-[2px] border-black rounded-md hover:bg-gray-100 transition-all duration-1 w-full ${inputStateStyle}`}
          value={value}
          onChange={onChange}
          // validate everytime the input value changes
          onInput={handleValidation}
        />
      </div>
      {/* show error if available */}
      <p className="text-red-500 text-[14px]">{error}</p>
    </div>
  );
};

export default FormGroup;
