import {
  useState,
  //  useContext
} from "react";
import { db, auth } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
// import { UserContext } from "../context/UserContext";
import Button from "./Button";
import DownloadQr from "./DownloadQr";

const CreateUrl = () => {
  // const user = useContext(UserContext);
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
    // todo:remember to change this to
    auth.currentUser.email,
    // `uyi`,
    "qr-code-data"
  );

  const addToDb = async () => {
    setStatus("Saving Qr code");
    const { fileName, url } = QrData;
    try {
      const docAdded = await addDoc(collectionRef, {
        name: fileName,
        url: url,
        type: "url",
        date: new Date(),
      });
      if (docAdded) {
        setStatus("Qr code saved successfully");
        setQrimageData(QrData);
        setQrData({
          url: "",
          fileName: "",
          foreground: "#000000",
          background: "#ffffff",
        });
      }
    } catch (error) {
      console.log(error);
      setStatus("failed to save Qr code: Try again");
    }
  };

  const handleChange = (e) => {
    setQrData({ ...QrData, [e.target.name]: e.target.value });
  };

  const handleCreateQr = (e) => {
    e.preventDefault();
    if (QrData.url.length > 5) {
      addToDb();
    }
  };

  return (
    <div className="bg-blue-400 p-2 py-4 rounded-md max-w-md mx-auto lg:max-w-3xl">
      <form
        action=""
        className="flex flex-col space-y-8 max-w-lg mx-auto"
        onSubmit={handleCreateQr}
      >
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-2">
            <label htmlFor="url" className="flex">
              Enter address <p className="text-red-600 text-xl h-1 px-2">*</p>
            </label>
            <input
              type="text"
              name="url"
              placeholder="Enter url here"
              className="p-2 rounded-md"
              value={QrData.url}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="fileName">Name your Qr</label>
            <input
              type="text"
              name="fileName"
              placeholder="Enter a suitable name for your Qr code"
              className="p-2 rounded-md"
              value={QrData.fileName}
              onChange={handleChange}
            />
          </div>

          {/* color inputs */}
          <div className="flex justify-between">
            <div className="flex flex-col space-y-2">
              <label htmlFor="foreground">Foreground color</label>
              <div className="">
                <input
                  type="color"
                  name="foreground"
                  id="foreground"
                  className="w-full border-0 outline-none bg-transparent"
                  value={QrData.foreground}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="background">Background color</label>
              <div className="">
                <input
                  type="color"
                  name="background"
                  id="background"
                  className="w-full rounded-full border-0 outline-0 bg-transparent"
                  value={QrData.background}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <p>Tip: Ignore to use default black and white</p>
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
        />
      )}
      {status && <p className="text-center">{status}</p>}
    </div>
  );
};

export default CreateUrl;
