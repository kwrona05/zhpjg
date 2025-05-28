import { useState } from "react";
import axios from "axios";

const AdminAddPhoto = () => {
  const [photoFile, setPhotoFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) return alert("Wybierz zdjęcie!");

    const formData = new FormData();
    formData.append("photo", photoFile);
    formData.append("description", description);

    try {
      await axios.post("http://localhost:4000/api/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Zdjęcie dodane!");
      setPhotoFile(null);
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Błąd podczas dodawania zdjęcia");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhotoFile(e.target.files[0])}
        required
      />
      <input
        type="text"
        placeholder="Opis zdjęcia"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit" className="bg-green-500 text-white py-2 rounded">
        Dodaj zdjęcie
      </button>
    </form>
  );
};

export default AdminAddPhoto;
