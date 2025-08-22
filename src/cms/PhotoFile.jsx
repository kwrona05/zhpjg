import { useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import useFirestoreCollection from "../../useFirestoreCollection";

const AdminAddPhoto = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const photos = useFirestoreCollection("gallery"); // <- nasz hook

  const handleUpload = async () => {
    if (!file) return alert("Wybierz zdjęcie!");

    try {
      const storageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "gallery"), {
        url,
        caption,
        createdAt: new Date(),
        storagePath: storageRef.fullPath,
      });

      setFile(null);
      setCaption("");
    } catch (err) {
      console.error("Błąd przy dodawaniu zdjęcia:", err);
    }
  };

  const handleDelete = async (photo) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;

    try {
      const fileRef = ref(storage, photo.storagePath);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "gallery", photo.id));
    } catch (err) {
      console.error("Błąd przy usuwaniu zdjęcia:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Dodaj zdjęcie</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2 bg-white rounded"
      />
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Podpis / opis zdjęcia"
        className="p-2 bg-white rounded"
      />
      <button
        onClick={handleUpload}
        className="bg-[#BCA97A] hover:bg-[#c5c3aa] text-[#3E452A] font-bold py-2 px-6 rounded-xl shadow-md transition duration-300 w-40"
      >
        Prześlij
      </button>

      <h3 className="text-xl font-semibold mt-6">📷 Galeria</h3>
      {photos.length === 0 ? (
        <p className="text-[#3E452A]">Brak zdjęć</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white p-2 rounded shadow relative"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="rounded mb-2"
              />
              {photo.caption && (
                <p className="text-sm text-gray-700">{photo.caption}</p>
              )}
              <button
                onClick={() => handleDelete(photo)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAddPhoto;
