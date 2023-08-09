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
      initial={{ scale: 1.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      action=""
      id="textForm"
      className={`px-4 py-4 ${
        isDarkMode
          ? " bg-[#424548] hover:bg-[#424548aa] border-gray-500 "
          : " bg-[#f1f1f199] border-gray-300"
      } rounded-xl shadow-lg border flex flex-col space-y-8 min-w-[18rem] max-w-[20rem] mx-auto md:min-w-[42rem] `}
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
        <p className="text-blue-400">
          NB: Please fill in all fields before submitting
        </p>
      </div>
      <div className="mx-auto">
        <Button type="submit" text="Create Qr" extraStyle="px-12" />
      </div>
    </motion.form>
  );
};

export default QrTextForm;
