import { useEffect, useState } from "react";
import axios from "axios";
import HeaderBar from "./HeaderBar";

const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const API_URL =
    "https://hib2xshxpi7aict3l2hqlbqcx40bmwnh.lambda-url.us-east-1.on.aws";

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Błąd przy pobieraniu wiadomości:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/messages`,
        { email, message: userMessage },
        { headers: { "Content-Type": "application/json" } }
      );
      setSubmitted(true);
      setEmail("");
      setUserMessage("");
      fetchMessages(); // Odśwież listę wiadomości po wysłaniu
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <main className="bg-[#78815E] min-h-screen w-screen flex flex-col items-center gap-4 p-4">
      <HeaderBar />
      <form
        onSubmit={handleSubmit}
        className="w-[40%] bg-[#EAE9E0] p-4 rounded-xl shadow-md flex flex-col gap-2"
      >
        <h2>Masz ciekawe artefakty? Skontaktuj się z nami</h2>
        <input
          type="email"
          placeholder="Twój email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-[90%] p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Twoja wiadomość"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          required
          className="w-[90%] p-2 mb-2 border rounded"
        />
        <button
          type="submit"
          className="bg-[#3E452A] text-white px-4 py-2 rounded hover:bg-[#2f351d]"
        >
          Wyślij
        </button>
        {submitted && (
          <p className="text-green-600 mt-2">Wiadomość została wysłana!</p>
        )}
      </form>
      <footer className="text-white mt-auto">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>
    </main>
  );
};

export default Contact;
