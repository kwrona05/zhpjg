import { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
    const [token, setToken] = useState("");
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [activeSection, setActiveSection] = useState("addPost");
    const [serviceMessages, setServiceMessages] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!token) return;

        const fetchPosts = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/posts");
                setPosts(res.data);
            } catch (err) {
                console.error("Błąd przy pobieraniu postów:", err);
            }
        };

        fetchPosts();
    }, [token]);

    useEffect(() => {
        if (!token || activeSection !== "contactMessages") return

        const fetchMessages = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/messages", {
                    headers: {Authorization: `Bearer ${token}`},
                })

                setContactMessages(res.data);
            } catch (error) {
                console.error("Wystąpił błąd podczas pobierania wiadomości kontaktowych")
            }
        }

        fetchMessages();
    }, [token, activeSection]);

    const handleMessage = () => {
        if(!newMessage.trim()) {return}

        const newMsg = {
            id: Date.now(),
            content: newMessage.trim(),
        }
        setServiceMessages((prev) => [...prev, newMsg])
        setNewMessage("");
    }

    const handleDeleteMessage = (id) => {
        setServiceMessages((prev) => prev.filter((msg) => msg.id !== id));
    }

    const handleLogin = async () => {
        const res = await axios.post("http://localhost:4000/api/login", { username, password });
        setToken(res.data.token);
    };

    const handleCreatePost = async () => {
        if (!file) return alert("Wybierz plik!");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);
        formData.append("image", file);

        try {
            await axios.post("http://localhost:4000/api/posts", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setTitle("");
            setContent("");
            setFile("");
            alert("Post dodany!");
        } catch (err) {
            console.error("Błąd przy dodawaniu posta:", err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć wpis?")) return;

        try {
            await axios.delete(`http://localhost:4000/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (error) {
            console.error(error);
            alert("Wystąpił błąd podczas usuwania posta");
        }
    };

    if (!token) {
        return (
            <main className="w-screen h-screen bg-[#3E452A] flex justify-center items-center">
                <div className="w-[40%] h-[40%] bg-[#CAD2C5] flex flex-col gap-6 p-6 rounded-2xl items-center">
                    <h1 className="text-xl font-semibold">Logowanie</h1>
                    <input
                        placeholder="Nazwa użytkownika"
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-[60%] text-center bg-white rounded-2xl py-2"
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-[60%] text-center bg-white rounded-2xl py-2"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-[60%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-black font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300"
                    >
                        Zaloguj się
                    </button>
                </div>
            </main>
        );
    }

    const handleAddMessage = () => {
        if (!newMessage.trim()) {
            return
        }

        const newMsg = {
            id: Date.now(),
            content: newMessage.trim(),
        }

        setServiceMessages((prev) => [...prev, newMsg]);
        setNewMessage("");
    }

    return (
        <div className="w-screen flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-[#3E452A] text-white p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-4">Panel admina</h2>
                <button onClick={() => setActiveSection("addPost")} className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded">
                    ➕ Dodaj wpis
                </button>
                <button onClick={() => setActiveSection("posts")} className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded">
                    📋 Wpisy
                </button>
                <button onClick={() => setActiveSection("messages")} className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded">
                    🛠️ Wiadomości serwisowe
                </button>
                <button onClick={() => setActiveSection("contactMessages")} className="w-[90%] bg-[#D7D5BE] hover:bg-[#BCA97A] text-[#3E452A] p-2 rounded">
                    Powiadomienia
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[#CAD2C5] p-6 overflow-y-auto">
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
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full p-2 text-[#3E452A] bg-white rounded"
                        />
                        <button
                            onClick={handleCreatePost}
                            className="bg-[#BCA97A] w-[60%] hover:bg-[#c5c3aa] text-[#3E452A] font-bold py-2 px-6 rounded-xl shadow-md transition duration-300"
                        >
                            Opublikuj
                        </button>
                    </div>
                )}

                {activeSection === "posts" && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold mb-4">Lista wpisów</h2>
                        <ul className="space-y-4 w-[85%] bg-[#D7D5BE] rounded-2xl text-center p-4">
                            {posts.map((post) => (
                                <li key={post.id} className="bg-white rounded shadow p-4">
                                    <h3 className="font-bold font-sans text-lg">{post.title}</h3>
                                    <p className="text-sm font-mono">{post.content.slice(0, 100)}...</p>
                                    {post.image && (
                                        <img
                                            src={`http://localhost:4000/uploads/${post.image}`}
                                            alt="Post image"
                                            className="scale-90 h-60 mt-2 rounded"
                                        />
                                    )}
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition duration-300"
                                    >
                                        Usuń
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeSection === "messages" && (
                    <div className="flex flex-col gap-4 text-center">
                        <h2 className="text-2xl font-bold font-sans mb-4">Wiadomości serwisowe</h2>

                        <div className="flex gap-2 mb-4 p-4">
            <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Wpisz nową wiadomość..."
                className="w-80 flex-1 p-2 rounded text-[#3E452A] bg-white"
            />
                            <button
                                onClick={handleAddMessage}
                                className="w-30 bg-[#BCA97A] hover:bg-[#c5c3aa] text-[#3E452A] px-4 py-2 rounded shadow-md"
                            >
                                ➕ Dodaj
                            </button>
                        </div>

                        {serviceMessages.length === 0 ? (
                            <p className="text-[#3E452A]">Brak wiadomości serwisowych</p>
                        ) : (
                            <ul className="w-full flex flex-col gap-4">
                                {serviceMessages.map((message) => (
                                    <li key={message.id} className="w-[80%] bg-white p-4 rounded shadow flex justify-between items-center text-wrap">
                                        <p className="text-[#3E452A]">{message.content}</p>
                                        <button
                                            onClick={() => handleDeleteMessage(message.id)}
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

                {activeSection === "contactMessages" && (
                    <div className="flex flex-col gap-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">Wiadomości kontaktowe</h2>

                        {contactMessages.length === 0 ? (
                            <p className="text-[#3E452A]">Brak wiadomości</p>
                        ) : (
                            <ul className="w-full flex flex-col gap-4">
                                {contactMessages.map((msg) => (
                                    <li key={msg.id} className="w-[80%] bg-white p-4 rounded shadow text-left">
                                        <p><strong>Email:</strong> {msg.email}</p>
                                        <p className="mt-2"><strong>Wiadomość:</strong> {msg.message}</p>
                                        <p className="mt-1 text-sm text-gray-500">📅 {new Date(msg.createdAt).toLocaleString()}</p>
                                        <button
                                            onClick={() => alert('Funkcja usuwania wiadomości będzie dostępna wkrótce')}
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

            </main>
        </div>
    );
};

export default AdminPage;
