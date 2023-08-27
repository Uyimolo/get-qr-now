import { deleteDoc, doc } from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";

export const deleteDocFunction = async (id, type, fileName, publicDocId) => {
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
    const publicRef = doc(db, "files-collection", publicDocId);

    const fileRef = ref(storage, gsPath);
    try {
      // delete file from firebase storage
      const isDeleted = deleteObject(fileRef);
      if (isDeleted) {
        // delete both public and userDocs
        await deleteDoc(collectionRef);
        await deleteDoc(publicRef);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    await deleteDoc(collectionRef);
  }
};
