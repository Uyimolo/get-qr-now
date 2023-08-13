import { useContext, useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import RecentMobile from "./RecentMobile";
import DownloadQr from "./DownloadQr";
import close from "../images/close.svg";

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
    <div className="mx-6 ">
      {/* show expanded qr view when view button is clicked*/}
      {showQRModal && (
        <div
          className={`${
            isDarkMode ? "bg-[#424548]" : "bg-[#fafafa]"
          } fixed left-0 right-0 bottom-0 top-0 flex flex-col items-center justify-center`}
        >
          <div
            className="w-10 h-10 cursor-pointer absolute bg-gray-400 rounded-full top-10 left-6 flex items-center justify-center"
            onClick={() => setShowQRModal(false)}
          >
            <img src={close} alt="" className="w-6" />
          </div>
          <h3
            className={`${
              isDarkMode ? "text-white" : "text-gray-600"
            } text-3xl font-semibold text-center px-6 truncate`}
          >
            {recentQRData[qRToShow].name.toUpperCase()}
          </h3>
          <div>
            <DownloadQr
              value={recentQRData[qRToShow].value}
              foreground={recentQRData[qRToShow].foreground}
              background={recentQRData[qRToShow].background}
              fileName={recentQRData[qRToShow].name}
            />
          </div>
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
