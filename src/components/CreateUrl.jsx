import {
  useCallback,
  useContext,
  useState,
  //  useContext
} from "react";
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
// import { UserContext } from "../context/UserContext";
import Button from "./Button";
import DownloadQr from "./DownloadQr";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

const CreateUrl = () => {
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [QrData, setQrData] = useState({
    url: "",
    fileName: "",
    foreground: "#000000",
    background: "#ffffff",
  });
  const [qrImageData, setQrimageData] = useState(null);
  const [status, setStatus] = useState("");

  const collectionRef = collection(
    db,
    "qr-codes-collection",
    `${user}`,
    "qr-code-data"
  );

  const addToDb = useCallback(async () => {
    if (QrData.url !== "" && QrData.fileName !== "") {
      setStatus("Saving Qr code");
      const { fileName, url } = QrData;
      try {
        const docAdded = await addDoc(collectionRef, {
          name: fileName,
          url: url,
          type: "url",
          date: new Date().toDateString(),
          sortDate: Number(new Date()),
          numDownload: "Not applicable",
        });
        if (docAdded) {
          setStatus("Qr code saved successfully");
          setQrData({
            url: "",
            fileName: "",
            foreground: "#000000",
            background: "#ffffff",
          });
        }
      } catch (error) {
        setStatus("failed to save Qr code: Try again");
      }
    }
  }, [QrData, collectionRef]);
  const handleChange = (e) => {
    setQrData({ ...QrData, [e.target.name]: e.target.value });
  };

  const handleCreateQr = (e) => {
    e.preventDefault();
    if (QrData.url !== "" && QrData.fileName !== "") {
      setQrimageData(QrData);
    }
  };
  let paragraphStyle = "";
  isDarkMode
    ? (paragraphStyle = "text-gray-200")
    : (paragraphStyle = "text-gray-600");

  return (
    <div
      className={`border-[0.5px]  px-2 py-4 ${
        isDarkMode
          ? "border-[0px] bg-[#424548] hover:bg-[#424548aa]"
          : " bg-gray-50 "
      } rounded-md shadow-lg max-w-md mx-auto md:max-w-3xl xl:max-w-4xl `}
    >
      <form
        action=""
        className="flex flex-col space-y-8 mx-auto"
        onSubmit={handleCreateQr}
      >
        <div className="flex flex-col space-y-2 ">
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6 md:justify-between">
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="url" className={`flex ${paragraphStyle}`}>
                Enter address <p className="text-red-600 text-xl h-1 px-2">*</p>
              </label>
              <input
                type="text"
                name="url"
                placeholder="Enter url here"
                className={` ${
                  isDarkMode ? "bg-gray-200" : ""
                } p-2 border-gray-300 border-[1px] rounded-md hover:bg-gray-100 transition-all duration-1`}
                value={QrData.url}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="fileName" className={`flex ${paragraphStyle}`}>
                Name your Qr <p className="text-red-600 text-xl h-1 px-2">*</p>
              </label>
              <input
                type="text"
                name="fileName"
                placeholder="Enter a suitable name for your Qr code"
                className={` ${
                  isDarkMode ? "bg-gray-200" : ""
                } p-2 border-gray-300 border-[1px] rounded-md hover:bg-gray-100 transition-all duration-1`}
                value={QrData.fileName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* color inputs */}
          <div className="flex justify-between space-x-2">
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="foreground" className={`flex ${paragraphStyle}`}>
                Foreground color {`(${QrData.foreground})`}
              </label>
              <motion.input
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                type="color"
                name="foreground"
                id="foreground"
                className="w-full border-0 outline-none bg-transparent h-10 cursor-crosshair"
                value={QrData.foreground}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="background" className={`flex ${paragraphStyle}`}>
                Background color {`(${QrData.background})`}
              </label>
              <motion.input
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                type="color"
                name="background"
                id="background"
                className="w-full  border-0 outline-0 bg-transparent h-10 cursor-crosshair"
                value={QrData.background}
                onChange={handleChange}
              />
            </div>
          </div>
          <p className={`flex ${paragraphStyle}`}>
            Tip: Ignore to use default black and white
          </p>
        </div>
        <div className="mx-auto">
          <Button type="submit" text="Create Qr" extraStyle="px-12" />
        </div>
      </form>
      {qrImageData && (
        <DownloadQr
          value={qrImageData.url}
          foreground={qrImageData.foreground}
          background={qrImageData.background}
          fileName={qrImageData.fileName}
          onClick={addToDb}
        />
      )}
      {status && <p className="text-center">{status}</p>}
    </div>
  );
};

export default CreateUrl;
