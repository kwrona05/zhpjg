import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import HeaderBar from "./HeaderBar";
import { db } from "../../firebase";
import useFirestoreCollection from "../../useFirestoreCollection";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 🔥 Subskrypcja wiadomości (jeśli chcesz je potem wyświetlać)
  const messages = useFirestoreCollection("messages", "createdAt");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        email,
        message: userMessage,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setEmail("");
      setUserMessage("");
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };

  return (
    <main className="bg-[#78815E] min-h-screen w-screen flex flex-col items-center gap-4 p-4">
      <HeaderBar />

      <form
        onSubmit={handleSubmit}
        className="w-[90%] md:w-[40%] bg-[#EAE9E0] p-4 rounded-xl shadow-md flex flex-col gap-2"
      >
        <h2 className="text-[#3E452A] font-bold text-xl mb-2">
          Masz ciekawe artefakty? Skontaktuj się z nami
        </h2>
        <input
          type="email"
          placeholder="Twój email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Twoja wiadomość"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          required
          className="w-full p-2 mb-2 border rounded"
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

      {/* 🔍 Sekcja tylko do podglądu wszystkich wiadomości (opcjonalna) */}
      {messages.length > 0 && (
        <section className="w-[90%] md:w-[60%] bg-white mt-6 p-4 rounded-lg shadow">
          <h3 className="text-[#3E452A] text-lg font-semibold mb-2">
            Ostatnie wiadomości
          </h3>
          <ul className="flex flex-col gap-2">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="p-2 border-b border-gray-200 text-sm text-[#3E452A]"
              >
                <strong>{msg.email}:</strong> {msg.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="text-white mt-auto text-center py-4">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>
    </main>
  );
};

export default Contact;
