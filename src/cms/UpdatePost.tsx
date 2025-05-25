import { useState } from "react";
import axios from "axios";

const UpdatePost = ({ post, token, onClose, onUpdated }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category);
  const [file, setFile] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (file) formData.append("image", file);

    try {
      const res = await axios.put(
        `http://localhost:4000/api/posts/${post.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUpdated(res.data);
    } catch (err) {
      console.error("Błąd podczas aktualizacji posta:", err);
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
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
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
