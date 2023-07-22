import { useState } from "react";
import QrCode from "./QrCode";
import { db, auth } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const CreateUrl = () => {
  // const user = auth.currentUser.email;
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
    `${auth.currentUser.email}`,
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
    <div className="bg-blue-400 p-2 py-4 rounded-md max-w-md mx-auto lg:max-w-lg">
      <form
        action=""
        className="flex flex-col space-y-8 "
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
                  className="w-full rounded-full border-0 outline-0 bg-transparent"
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

        <button
          type="submit"
          className="p-2 text-gray-200 rounded-md bg-blue-800 w-full"
        >
          Create your code
        </button>
      </form>
      {qrImageData && (
        <div className="w-full">
          <div className="mx-auto w-fit mt-6 p-2">
            <QrCode
              value={qrImageData.url}
              foreground={qrImageData.foreground}
              background={qrImageData.background}
            />
          </div>
          <button className="p-2 text-gray-200 mt-6 w-full rounded-md bg-blue-800">
            Download Qr Code
          </button>
        </div>
      )}
      {status && <p className="text-gray-200">{status}</p>}
    </div>
  );
};

export default CreateUrl;
