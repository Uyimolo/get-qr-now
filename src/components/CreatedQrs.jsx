// import { } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  db,
  //  auth
} from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import RecentMobile from "./RecentMobile";
// import deleteQr from "../images/delete.svg"
// import view from "../images/view.svg"

const CreatedQrs = () => {
  const [qrData, setQrData] = useState([]);
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  // reference to firestore collection
  const collectionRef = collection(
    db,
    "qr-codes-collection",
    user,
    "qr-code-data"
  );
  useEffect(() => {
    onSnapshot(collectionRef, (snapshot) => {
      const fetchedQrs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setQrData(fetchedQrs);
    });
  }, [collectionRef]);
  // const paragraphStyle = () => {
  //   return "text-gray-600";
  // };
  return (
    <div className="px-6 md:px-16 xl:px-28 ">
      <h2
        className={`${
          isDarkMode && "text-gray-200"
        } text-2xl py-4 mb-2 font-semibold text-center lg:text-4xl`}
      >
        Recently Saved Qr Codes
      </h2>
      <div className={`rounded-md  max-w-md mx-auto md:max-w-3xl xl:max-w-4xl`}>
        {qrData
          .sort((b, a) => a.sortDate - b.sortDate)
          .slice(0, 3)
          .map((data) => (
            <div key={data.id} className={`${isDarkMode ? "border-gray-200" : "border-gray-600"} border-b-[1px]  px-2`}>
              <RecentMobile
                name={data.name}
                date={data.date}
                numDownload={data.numDownload}
              />
              <div className="flex space-x-4 mb-2 justify-betwee">
                <p className={`text-gray-200 px-4 bg-blue-400 rounded`}>
                  View Qr
                </p>
                <p className={`text-gray-200 px-4 bg-blue-400 rounded`}>
                  Delete Qr
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreatedQrs;
