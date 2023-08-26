import { deleteDoc, doc } from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase";
// import { storage } from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";

export const deleteDocFunction = async (id, type, fileName) => {
  const user = auth.currentUser.email;
  const collectionRef = doc(
    db,
    "qr-codes-collection",
    user,
    "qr-code-data",
    id
  );
  if (type === "file") {
    const bucketName = storage.app.options.storageBucket;
    const gsPath = `gs://${bucketName}/files/${fileName}`;

    const fileRef = ref(storage, gsPath);
    try {
      const isDeleted = deleteObject(fileRef);
      if (isDeleted) {
        alert("deleted");
        console.log(isDeleted);
        await deleteDoc(collectionRef);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    await deleteDoc(collectionRef);
  }
};
