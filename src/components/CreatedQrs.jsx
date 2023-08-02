import { useContext, useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import RecentMobile from "./RecentMobile";

import { useMediaQuery } from "react-responsive";
import RecentDesktop from "./RecentDesktop";
const CreatedQrs = () => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState([]);
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  // reference to firestore collection
  const collectionRef = collection(
    db,
    "qr-codes-collection",
    user,
    "qr-code-data"
  );
  // get data from firestore
  useEffect(() => {
    onSnapshot(collectionRef, (snapshot) => {
      const fetchedQrs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setQrData(fetchedQrs);
    });
  }, [collectionRef]);

  let paragraphStyle;
  isDarkMode
    ? (paragraphStyle = "text-gray-200")
    : (paragraphStyle = "text-gray-600");

  return (
    <div className="mx-6 ">
      <h2
        className={`${
          isDarkMode && "text-gray-200"
        } text-2xl py-4 mb-2 font-semibold text-center lg:text-4xl`}
      >
        Recently Saved Qr Codes
      </h2>
      <div className={`rounded-md mx-auto max-w-5xl`}>
        {isDesktop && (
          <div
            className={`flex ${
              isDarkMode ? "border-blue-400" : "border-gray-600"
            } border-b px-2 py-2`}
          >
            <p className={`${paragraphStyle} w-2/5`}>Name</p>
            <p className={`${paragraphStyle} w-1/5`}>Date</p>
            <p className={`${paragraphStyle} w-1/5`}>Downloads</p>
            <p className={`${paragraphStyle} w-1/5`}>Action</p>
          </div>
        )}
        {qrData
          .sort((b, a) => a.sortDate - b.sortDate)
          .slice(0, 3)
          .map((data) => (
            <div
              key={data.id}
              className={`${
                isDarkMode
                  ? "border-gray-200 hover:bg-[#424548aa]"
                  : "border-gray-600 hover:bg-blue-50"
              } border-b-[1px]  px-2 `}
            >
              {isDesktop ? (
                <div className="py-2">
                  <RecentDesktop
                    name={data.name}
                    date={data.date}
                    numDownload={data.numDownload}
                    id={data.id}
                    paragraphStyle={paragraphStyle}
                    setShowViewModal={setShowQRModal}
                    showViewModal={showQRModal}
                  />
                </div>
              ) : (
                <RecentMobile
                  name={data.name}
                  date={data.date}
                  numDownload={data.numDownload}
                  id={data.id}
                  paragraphStyle={paragraphStyle}
                  setShowViewModal={setShowQRModal}
                  showViewModal={showQRModal}

                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreatedQrs;
