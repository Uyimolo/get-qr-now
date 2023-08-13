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
  // todo

  // update userData
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
          console.log("FILE TO BE UPDATED FOUND yeah");
          try {
            await updateDoc(fileDocRef, {
              numDownload: newNumDownload,
            });
            console.log("updated");

            const { fileName, fileType, downloadURL } = publicData;
            const link = document.createElement("a");
            link.href = downloadURL;
            link.download = `${fileName}.${fileType}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("File download triggered.");
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
        console.log(publicData);
        handleNumDownloadsUpdate(publicData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // retreivePublicDoc();

  // useEffect(() => {
  //   if (data && canDownload) {
  //   }
  // }, [data, canDownload]);

  return (
    <div className="mt-40">
      <button
        className="px-4 bg-blue-400 py-2 text-white rounded-full"
        onClick={retreivePublicDoc}
      >
        Download
      </button>
    </div>
  );
};

export default FileDownload;
