import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import useFirestoreCollection from "../../useFirestoreCollection";
import UpdatePost from "./UpdatePost";
import AdminAddPhoto from "./PhotoFile";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PhotosPlayer from "../components/PhotosPlayer";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("addPost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [playerFiles, setPlayerFiles] = useState([]);
  const [playerImages, setPlayerImages] = useState([]);

  const posts = useFirestoreCollection("posts");
  const serviceMessages = useFirestoreCollection("serviceMessages");
  const contactMessages = useFirestoreCollection("messages");

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/login");
    fetchPlayerImages();
  }, [navigate]);

  const fetchPlayerImages = async () => {
    try {
      const snapshot = await getDocs(collection(db, "gallery")); // 👈 zamiast "playerPhotos"
      const images = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayerImages(images);
    } catch (err) {
      console.error("Błąd pobierania zdjęć:", err);
    }
  };

  const handleCreatePost = async () => {
    if (!title || !content) return alert("Uzupełnij tytuł i treść!");

    try {
      let imageUrls = [];

      // Jeśli wybrano pliki → wrzucamy wszystkie do Firebase Storage
      if (files.length > 0) {
        for (const file of files) {
          const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
        }
      }

      // Zapis dokumentu w Firestore
      await addDoc(collection(db, "posts"), {
        title,
        content,
        category,
        images: imageUrls, // <-- teraz zapisujemy tablicę zdjęć
        createdAt: serverTimestamp(),
      });

      // Reset formularza
      setTitle("");
      setContent("");
      setCategory("");
      setFiles([]);
      alert("Post dodany!");
    } catch (err) {
      console.error("Błąd przy dodawaniu posta:", err);
      alert("Nie udało się dodać posta");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć wpis?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error("Błąd podczas usuwania posta:", error);
    }
  };

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

  const handleDeleteServiceMessage = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć wiadomość serwisową?"))
      return;

    try {
      await deleteDoc(doc(db, "serviceMessages", id));
    } catch (error) {
      console.error("Błąd podczas usuwania wiadomości serwisowej:", error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć wiadomość?")) return;

    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      console.error("Błąd podczas usuwania wiadomości:", error);
    }
  };

  const handleAddPlayerPhotos = async () => {
    if (playerFiles.length === 0) return;

    try {
      const urls = [];
      for (const file of playerFiles) {
        const storageRef = ref(storage, `player/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }

      for (const url of urls) {
        const docRef = await addDoc(collection(db, "gallery"), {
          url,
          createdAt: serverTimestamp(),
        });
        // od razu dodajemy do stanu lokalnego, żeby PhotosPlayer odświeżył się natychmiast
        setPlayerImages((prev) => [...prev, { id: docRef.id, url }]);
      }

      setPlayerFiles([]);
      alert("Zdjęcia dodane do Photo Playera!");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania zdjęć");
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
        <button onClick={() => setActiveSection("photoPlayer")}>Galeria</button>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            navigate("/login");
          }}
        >
          Wyloguj
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
            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
              className="w-full p-2 rounded bg-white"
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
                  {post.images && post.images.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {post.images.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Post ${idx}`}
                          className="h-40 w-auto rounded shadow"
                        />
                      ))}
                    </div>
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
        {activeSection === "photoPlayer" && (
          <div className="max-w-xl flex flex-col gap-4">
            <h2 className="text-2xl font-bold">
              Dodaj zdjęcia do Photo Playera
            </h2>

            {/* formularz uploadu */}
            <input
              type="file"
              multiple
              onChange={(e) => setPlayerFiles([...e.target.files])}
              className="w-full p-2 rounded bg-white"
            />
            <button
              onClick={handleAddPlayerPhotos}
              className="bg-[#BCA97A] w-[60%] hover:bg-[#c5c3aa] text-[#3E452A] font-bold py-2 px-6 rounded-xl shadow-md transition duration-300"
            >
              Dodaj zdjęcia
            </button>

            {/* Podgląd zdjęć */}
            {playerFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {playerFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Podgląd ${idx}`}
                    className="h-40 w-auto rounded shadow"
                  />
                ))}
              </div>
            )}

            {/* 👇 Photo Player */}
            <PhotosPlayer photos={playerImages} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
