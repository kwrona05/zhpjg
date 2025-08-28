import { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminAddPhoto = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [featured, setFeatured] = useState(false); // 🔥 checkbox
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Wybierz plik!");

    try {
      setLoading(true);

      // 1. Upload pliku do Firebase Storage
      const storageRef = ref(storage, `gallery/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // 2. Zapis metadanych w Firestore
      await addDoc(collection(db, "gallery"), {
        url,
        caption,
        featured, // 🔥 dodajemy info, czy ma iść do PhotosPlayer
        createdAt: serverTimestamp(),
      });

      alert("Zdjęcie dodane!");
      setFile(null);
      setCaption("");
      setFeatured(false);
    } catch (err) {
      console.error("Błąd przy uploadzie:", err);
      alert("Nie udało się przesłać zdjęcia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md w-[400px]"
    >
      <h2 className="text-xl font-bold text-[#3E452A]">Dodaj zdjęcie</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Podpis zdjęcia"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="border p-2 rounded"
      />

      {/* 🔥 checkbox do wyboru zdjęć do galerii */}
      <label className="flex items-center gap-2 text-[#3E452A]">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Dodaj do galerii
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#3E452A] text-white px-4 py-2 rounded hover:bg-[#2f351d]"
      >
        {loading ? "Wysyłanie..." : "Dodaj zdjęcie"}
      </button>
    </form>
  );
};

export default AdminAddPhoto;
