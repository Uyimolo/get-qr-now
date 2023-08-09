/* eslint-disable react/prop-types */
import { ThemeContext } from "../context/ThemeContext";
import Button from "./Button";
import { motion } from "framer-motion";
import { useContext } from "react";
import FormGroup from "./FormGroup";

const QrFileForm = ({
  handleCreateQr,
  handleChange,
  foreground,
  background,
  inputData,
  error,
  file,
  filePreview,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const paragraphStyle = isDarkMode ? "text-gray-200" : "text-gray-600";

  return (
    // this form will be used for image download and pdf download sections of the webapp
    <form
      action=""
      className={`px-4 py-4 ${
        isDarkMode
          ? " bg-[#424548] hover:bg-[#424548aa] border-gray-500"
          : "  bg-[#f1f1f199] border-gray-300"
      } rounded-md shadow-lg border flex flex-col space-y-8 min-w-[18rem] max-w-[20rem] mx-auto md:min-w-[42rem] `}
      onSubmit={handleCreateQr}
    >
      <div className="flex flex-col space-y-4 ">
        <div className="flex flex-col space-y-3 md:justify-center md:flex-row md:space-y-0 md:gap-4 md:flex-wrap ">
          {inputData.map((input) => (
            <FormGroup
              key={input.id}
              value={input.value}
              label={input.label}
              id={input.id}
              placeholder={input.placeholder}
              paragraphStyle={paragraphStyle}
              onChange={handleChange}
              type={input.type}
            />
          ))}
        </div>

        <div className=" flex items-center justify-center">
          {file && (
            <div className="">
              <p className={`${paragraphStyle} text-center`}>
                Selected file: {file.name}
              </p>
              {file.type === "application/pdf" ? (
                <embed
                  src={filePreview}
                  type="application/pdf"
                  width="100%"
                  height="300px"
                  className="mx-auto"
                />
              ) : (
                <img
                  src={filePreview}
                  alt="Selected Preview"
                  className="h-60  mx-auto"
                />
              )}
            </div>
          )}
        </div>

        {/* color inputs */}
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <div className="flex flex-col w-full">
            <label htmlFor="foreground" className={`flex ${paragraphStyle}`}>
              Foreground color {`(${foreground})`}
            </label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="color"
              name="foreground"
              id="foreground"
              className="w-full bg-transparent h-12 cursor-crosshair"
              value={foreground}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="background" className={`flex ${paragraphStyle}`}>
              Background color {`(${background})`}
            </label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="color"
              name="background"
              id="background"
              className="w-full bg-transparent h-12 cursor-crosshair"
              value={background}
              onChange={handleChange}
            />
          </div>
        </div>
        {error && <p className={paragraphStyle}>{error}</p>}
      </div>

      <div className="mx-auto">
        <Button type="submit" text="Create Qr" extraStyle="px-12" />
      </div>
    </form>
  );
};

export default QrFileForm;
