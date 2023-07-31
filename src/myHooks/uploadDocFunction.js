import { addDoc } from "firebase/firestore";

const uploadDocFunction = async (collectionRef, qRData) => {
  try {
    await addDoc(collectionRef, qRData);
    return true; // Success
  } catch (error) {
    console.error("Error uploading document to Firestore:", error);
    return false; // Error
  }
};

export default uploadDocFunction;