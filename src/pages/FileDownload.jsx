// import { ref } from "firebase/storage";
import { db } from "../../config/firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router";

const FileDownload = () => {
  const { id } = useParams();

  const handleNumDownloadsUpdate = async (publicData) => {
    if (publicData) {
      const userDocRef = collection(
        db,
        "qr-codes-collection",
        `${publicData.createdBy}`,
        "qr-code-data"
      );
      try {
        const q = query(
          userDocRef,
          where("type", "==", "file"),
          where("publicDocRef", "==", id)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fileDocRef = querySnapshot.docs[0].ref;
          const docData = querySnapshot.docs[0].data();
          const newNumDownload = docData.numDownload + 1;
          try {
            await updateDoc(fileDocRef, {
              numDownload: newNumDownload,
            });

            const { fileName, fileType, downloadURL } = publicData;
            const link = document.createElement("a");
            link.href = downloadURL;
            link.download = `${fileName}.${fileType}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // retreive public doc
  const retreivePublicDoc = async () => {
    const publicDocRef = doc(db, "files-collection", id);
    try {
      const docSnapshot = await getDoc(publicDocRef);
      const publicData = docSnapshot.data();
      if (publicData) {
        handleNumDownloadsUpdate(publicData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-40 w-full px-6 flex flex-col gap-8">
      <h1 className="text-blue-400 text-center text-3xl">
        Click to download file to your device
      </h1>
      <div className="w-fit mx-auto">
        <button
          className="px-4 bg-blue-400 py-2 text-white rounded-full"
          onClick={retreivePublicDoc}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default FileDownload;
