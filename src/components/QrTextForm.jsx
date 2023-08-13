/* eslint-disable react/prop-types */
import { ThemeContext } from "../context/ThemeContext";
import Button from "./Button";
import { motion } from "framer-motion";
import { useContext } from "react";
import FormGroup from "./FormGroup";

const QrTextForm = ({
  handleCreateQr,
  handleChange,
  foreground,
  background,
  inputData,
  errors,
  handleValidation,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  let paragraphStyle = "";
  isDarkMode
    ? (paragraphStyle = "text-gray-200")
    : (paragraphStyle = "text-gray-900");
  return (
    // this form will be used for the website, google doc, facebook, youtube and email sections of the webapp
    <motion.form
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
      action=""
      id="textForm"
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
              handleValidation={handleValidation}
              error={errors[input.id]}
            />
          ))}
        </div>

        {/* color inputs */}
        <div className="flex flex-col items-center mx-auto w-full  space-y-2 md:flex-row md:space-y-0 md:gap-4 md:justify-around">
          <div className="flex flex-col w-full max-w-[21rem] xl:max-w-md">
            <label htmlFor="foreground" className={`flex ${paragraphStyle}`}>
              Foreground color {`(${foreground})`}
            </label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="color"
              name="foreground"
              id="foreground"
              className="w-full bg-transparent h-12 cursor-crosshair "
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
              className="w-full bg-transparent h-11 cursor-crosshair"
              value={background}
              onChange={handleChange}
            />
          </div>
        </div>
        <p className="text-red-500 text-center">{errors.allFields}</p>
      </div>
      <div className="mx-auto">
        <Button type="submit" text="Create Qr" extraStyle="px-12" />
      </div>
    </motion.form>
  );
};

export default QrTextForm;
