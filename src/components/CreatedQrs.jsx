import { useContext, useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import RecentMobile from "./RecentMobile";
import DownloadQr from "./DownloadQr";

const CreatedQrs = () => {
  const [recentQRData, setRecentQRData] = useState([]);
  const [qRToShow, setQRToShow] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const collectionRef = collection(
      db,
      "qr-codes-collection",
      user,
      "qr-code-data"
    );
    onSnapshot(collectionRef, (snapshot) => {
      const fetchedQrs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecentQRData(fetchedQrs);
    });
  }, [user]);

  const paragraphStyle = `${isDarkMode ? "text-gray-200" : "text-gray-700"}`;

  return (
    <div className="">
      {/* show expanded qr view when view button is clicked*/}
      {showQRModal && (
        <div>
          <DownloadQr
            value={recentQRData[qRToShow].value}
            foreground={recentQRData[qRToShow].foreground}
            background={recentQRData[qRToShow].background}
            fileName={recentQRData[qRToShow].name}
            setQRImageData={setShowQRModal}
          />
        </div>
      )}
      {recentQRData.length > 0 && (
        <div className="">
          <h2
            className={`text-3xl text-blue-400 py-4 mb-2 text-center lg:text-2xl`}
          >
            Saved Qr Codes
          </h2>
          <div
            className={`rounded-md mx-auto max-w-6xl flex flex-wrap gap-2 justify-center`}
          >
            {recentQRData
              .sort((b, a) => a.sortDate - b.sortDate)
              .map((qRData, index) => (
                <div
                  key={qRData.id}
                  className={`${
                    isDarkMode
                      ? "border-gray-200 bg-[#424548aa] border-gray-500"
                      : " border-gray-300"
                  }  px-2 w-[16.5rem] border rounded-lg hover:border-blue-400 hover:shadow-xl`}
                >
                  <RecentMobile
                    qRData={qRData}
                    paragraphStyle={paragraphStyle}
                    index={index}
                    setShowQRModal={setShowQRModal}
                    setQRToShow={setQRToShow}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedQrs;
