// import { } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  db,
  //  auth
} from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
const CreatedQrs = () => {
  const [qrData, setQrData] = useState([]);
  const { user } = useContext(UserContext);
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
    <div className="px-6 md:px-16 xl:px-28">
      <h2 className="text-blue-800 text-2xl text-center font-semibold lg:text-4xl">Recently Saved Qr Codes</h2>
      <div className="shadow-md border rounded-md max-w-md mx-auto md:max-w-3xl xl:max-w-4xl overflow-hidden">
        {qrData
          .slice(0, 3)
          .sort((b, a) => a.sortDate - b.sortDate)
          .map((data) => (
            <div
              className="flex px-2 py-2 space-x-4 border-b md:flex-col md:space-x-0 md:px-0 hover:bg-blue-50"
              key={data.id}
            >
              <div className="flex-col flex space-y-2 w-1/4 md md:flex-row md:space-y-0 md:space-x-4 md:justify-between md:w-full ">
                <p className="md:w-2/4 ">Name:</p>
                <p className="md:w-1/4 ">Date:</p>
                <p className="md:w-1/4 ">Downloads:</p>
              </div>
              <div className="flex-col flex space-y-2 w-3/4 md:flex-row md:space-y-0 md:space-x-4 md:justify-between md:w-full">
                <p className="md:w-2/4 ">{data.name}</p>
                <p className="md:w-1/4 ">{data.date}</p>
                <p className="md:w-1/4 ">{data.numDownload}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreatedQrs;
