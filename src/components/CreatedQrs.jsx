// import { } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
const CreatedQrs = () => {
  const [qrData, setQrData] = useState([]);

  useEffect(() => {
    // reference to firestore collection
    const collectionRef = collection(
      db,
      "qr-codes-collection",
      `${auth.currentUser.email}`,
      "qr-code-data"
    );
    onSnapshot(collectionRef, (snapshot) => {
      const fetchedQrs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setQrData(fetchedQrs);
    });
    // console.log(qrData)
  }, []);
  return (
    <div className="">
      {qrData.map((data) => {
        <p key={data.id}>{data.url}</p>;
      })}
      <p>loverholic</p>
    </div>
  );
};

export default CreatedQrs;
