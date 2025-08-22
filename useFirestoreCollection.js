import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Prosty hook do subskrypcji kolekcji Firestore.
 * @param {string} collectionName - nazwa kolekcji np. "posts" albo "gallery"
 * @param {string} [sortField] - pole do sortowania, np. "createdAt"
 */
const useFirestoreCollection = (collectionName, sortField = "createdAt") => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy(sortField, "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDocs(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      );
    });

    return () => unsubscribe();
  }, [collectionName, sortField]);

  return docs;
};

export default useFirestoreCollection;
