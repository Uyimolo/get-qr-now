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
  errors,
  file,
  filePreview,
  handleValidation,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const paragraphStyle = isDarkMode ? "text-gray-200" : "text-gray-600";

  return (
    // this form will be used for image download and pdf download sections of the webapp
    <motion.form
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
      action=""
      className={`px-4 py-4
      shadow-g boder flex flex-col space-y-8 max-w-[25rem] md:max-w-full  mx-auto md:max-w-5xl `}
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
              error={errors[input.id]}
              handleValidation={handleValidation}
            />
          ))}
        </div>

        <div className=" flex items-center justify-center">
          {file && !errors.file && (
            <div className="w-full">
              <p className={`text-blue-400 text-center truncate`}>
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
        <div className="flex flex-col items-center mx-auto w-full  space-y-2 md:flex-row md:space-y-0 md:gap-4 md:justify-around">
          <div className="flex flex-col w-full max-w-[21rem] xl:max-w-md ">
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

          <div className="flex flex-col w-full max-w-[21rem] xl:max-w-md ">
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
        <p className="text-red-400 text-center">{errors.allFields}</p>
      </div>

      <div className="mx-auto">
        <Button type="submit" text="Create Qr" extraStyle="px-12" />
      </div>
    </motion.form>
  );
};

export default QrFileForm;
