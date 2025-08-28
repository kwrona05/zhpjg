import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

const UpdatePost = ({ post, onClose, onUpdated }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category || "");
  const [files, setFiles] = useState([]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let imageUrls = post.images || [];

      if (files.length > 0) {
        const newUrls = [];
        for (const file of files) {
          const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          newUrls.push(url);
        }
        imageUrls = [...imageUrls, ...newUrls];
      }

      // aktualizacja Firestore
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        title,
        content,
        category,
        images: imageUrls,
      });

      onUpdated({ ...post, title, content, category, images: imageUrls });
      setFiles([]);
    } catch (err) {
      console.error("Błąd podczas aktualizacji posta:", err);
      alert("Nie udało się zaktualizować posta");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl mb-6">
      <h3 className="text-xl font-bold mb-4">Edytuj wpis: {post.title}</h3>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tytuł"
          className="p-2 rounded bg-[#F0F0F0]"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Treść"
          className="p-2 rounded bg-[#F0F0F0] h-32"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded bg-[#F0F0F0]"
        >
          <option value="">Wybierz kategorię</option>
          <option value="Komisja Historyczna">Komisja Historyczna</option>
          <option value="Panteon">Panteon</option>
          <option value="Sztandary">Sztandary</option>
          <option value="Muzeum">Muzeum</option>
          <option value="Chorągiew">Chorągiew</option>
          <option value="Hufiec">Hufiec</option>
          <option value="Kontakt">Kontakt</option>
          <option value="FEN">FEN</option>
        </select>

        {/* Upload nowych zdjęć */}
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        {/* Podgląd już dodanych zdjęć */}
        {post.images && post.images.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {post.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Post-${idx}`}
                className="h-24 rounded object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Zapisz zmiany
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
