import { useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import useFirestoreCollection from "../../useFirestoreCollection";
import UpdatePost from "./UpdatePost";
import AdminAddPhoto from "./PhotoFile";

const AdminPage = () => {
  // sekcje i formularze
  const [activeSection, setActiveSection] = useState("addPost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  // realtime z Firestore
  const posts = useFirestoreCollection("posts");
  const serviceMessages = useFirestoreCollection("serviceMessages");
  const contactMessages = useFirestoreCollection("messages");

  // 📌 Dodawanie posta
  const handleCreatePost = async () => {
    if (!title || !content) return alert("Uzupełnij tytuł i treść!");

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        category,
        image: null, // obrazek ustawisz w UpdatePost
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");
      setCategory("");
      setFile(null);
      alert("Post dodany!");
    } catch (err) {
      console.error("Błąd przy dodawaniu posta:", err);
    }
  };

  // 📌 Usuwanie posta
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć wpis?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error("Błąd podczas usuwania posta:", error);
    }
  };

  // 📌 Dodanie wiadomości serwisowej
  const handleServiceMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "serviceMessages"), {
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Błąd podczas zapisywania wiadomości:", error);
    }
  };

  // 📌 Usuwanie wiadomości serwisowej
  const handleDeleteServiceMessage = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć wiadomość serwisową?"))
      return;

    try {
      await deleteDoc(doc(db, "serviceMessages", id));
    } catch (error) {
      console.error("Błąd podczas usuwania wiadomości serwisowej:", error);
    }
  };

  // 📌 Usuwanie wiadomości kontaktowej
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć wiadomość?")) return;

    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      console.error("Błąd podczas usuwania wiadomości:", error);
    }
  };

  return (
    <div className="w-screen flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3E452A] text-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4">Panel admina</h2>
        <button
          onClick={() => setActiveSection("addPost")}
          className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded"
        >
          ➕ Dodaj wpis
        </button>
        <button
          onClick={() => setActiveSection("posts")}
          className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded"
        >
          📋 Wpisy
        </button>
        <button
          onClick={() => setActiveSection("messages")}
          className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded"
        >
          🛠️ Wiadomości serwisowe
        </button>
        <button
          onClick={() => setActiveSection("contactMessages")}
          className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded"
        >
          Powiadomienia
        </button>
        <button
          onClick={() => setActiveSection("gallery")}
          className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded"
        >
          Wyjątkowe zdjęcia
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#CAD2C5] p-6 overflow-y-auto">
        {/* Dodaj wpis */}
        {activeSection === "addPost" && (
          <div className="max-w-xl space-y-4 flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Dodaj nowy wpis</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tytuł"
              className="w-full text-[#3E452A] p-2 rounded bg-white"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Treść"
              className="w-full p-2 h-32 rounded text-[#3E452A] bg-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded text-[#3E452A] bg-white"
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
            <button
              onClick={handleCreatePost}
              className="bg-[#BCA97A] w-[60%] hover:bg-[#c5c3aa] text-[#3E452A] font-bold py-2 px-6 rounded-xl shadow-md transition duration-300"
            >
              Opublikuj
            </button>
          </div>
        )}

        {/* Lista wpisów */}
        {activeSection === "posts" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-4">Lista wpisów</h2>
            <ul className="space-y-4 w-[85%] bg-[#D7D5BE] rounded-2xl text-center p-4">
              {posts.map((post) => (
                <li key={post.id} className="bg-white rounded shadow p-4">
                  <h3 className="font-bold font-sans text-lg">{post.title}</h3>
                  <p className="text-sm font-mono">
                    {post.content.slice(0, 100)}...
                  </p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="scale-90 h-60 mt-2 rounded"
                    />
                  )}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition duration-300"
                  >
                    Usuń
                  </button>
                  <button
                    onClick={() => setEditingPost(post)}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-300"
                  >
                    Edytuj
                  </button>
                </li>
              ))}
            </ul>
            {editingPost && (
              <UpdatePost
                post={editingPost}
                onClose={() => setEditingPost(null)}
                onUpdated={(updatedPost) => {
                  setEditingPost(null);
                }}
              />
            )}
          </div>
        )}

        {/* Wiadomości serwisowe */}
        {activeSection === "messages" && (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-2xl font-bold font-sans mb-4">
              Wiadomości serwisowe
            </h2>
            <form
              onSubmit={handleServiceMessage}
              className="flex gap-2 mb-4 p-4"
            >
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Wpisz nową wiadomość..."
                className="w-80 flex-1 p-2 rounded text-[#3E452A] bg-white"
              />
              <button
                type="submit"
                className="w-30 bg-[#BCA97A] hover:bg-[#c5c3aa] text-[#3E452A] px-4 py-2 rounded shadow-md"
              >
                ➕ Dodaj
              </button>
            </form>
            {serviceMessages.length === 0 ? (
              <p className="text-[#3E452A]">Brak wiadomości serwisowych</p>
            ) : (
              <ul className="w-full flex flex-col gap-4">
                {serviceMessages.map((msg) => (
                  <li
                    key={msg.id}
                    className="w-[80%] bg-white p-4 rounded shadow flex justify-between items-center text-wrap"
                  >
                    <p className="text-[#3E452A]">{msg.text}</p>
                    <button
                      onClick={() => handleDeleteServiceMessage(msg.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Wiadomości kontaktowe */}
        {activeSection === "contactMessages" && (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Wiadomości kontaktowe</h2>
            {contactMessages.length === 0 ? (
              <p className="text-[#3E452A]">Brak wiadomości</p>
            ) : (
              <ul className="w-full flex flex-col gap-4">
                {contactMessages.map((msg) => (
                  <li
                    key={msg.id}
                    className="w-[80%] bg-white p-4 rounded shadow text-left"
                  >
                    <p>
                      <strong>Email:</strong> {msg.email}
                    </p>
                    <p className="mt-2">
                      <strong>Wiadomość:</strong> {msg.message}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      📅 {msg.createdAt?.toDate().toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-red-600 hover:text-red-800 mt-2"
                    >
                      🗑️ Usuń
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Galeria */}
        {activeSection === "gallery" && <AdminAddPhoto />}
      </main>
    </div>
  );
};

export default AdminPage;
