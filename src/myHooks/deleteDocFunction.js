import { deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";

export const deleteDocFunction = async (id) => {
  const user = auth.currentUser.email;
  const collectionRef = doc(
    db,
    "qr-codes-collection",
    user,
    "qr-code-data",
    id
  );
  await deleteDoc(collectionRef);
};
