// useFirestoreCollection.js
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Subskrypcja kolekcji Firestore z opcjonalnym filtrowaniem.
 * @param {string} collectionName - nazwa kolekcji np. "gallery"
 * @param {string} [sortField] - pole do sortowania
 * @param {object} [filter] - { field: string, op: string, value: any }
 */
const useFirestoreCollection = (
  collectionName,
  sortField = "createdAt",
  filter
) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    let q = query(collection(db, collectionName), orderBy(sortField, "desc"));

    if (filter) {
      q = query(
        collection(db, collectionName),
        where(filter.field, filter.op, filter.value),
        orderBy(sortField, "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDocs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [collectionName, sortField, filter]);

  return docs;
};

export default useFirestoreCollection;
