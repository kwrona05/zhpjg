import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import HeaderBar from "./HeaderBar";
import { db } from "../../firebase";
import useFirestoreCollection from "../../useFirestoreCollection";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
    <main className="bg-[#78815E] min-h-screen w-screen flex flex-col">
      <HeaderBar />

      {/* Formularz */}
      <section className="flex flex-col items-center flex-grow px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-[#EAE9E0] p-6 rounded-2xl shadow-lg flex flex-col gap-4"
        >
          <h2 className="text-[#3E452A] font-serif font-bold text-2xl text-center mb-2">
            Masz ciekawe artefakty? <br /> Skontaktuj się z nami
          </h2>

          <input
            type="email"
            placeholder="Twój email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3E452A]"
          />

          <textarea
            placeholder="Twoja wiadomość"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            required
            rows="5"
            className="w-full p-3 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3E452A]"
          />

          <button
            type="submit"
            className="bg-[#3E452A] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#2f351d] transition"
          >
            Wyślij
          </button>

          {submitted && (
            <p className="text-green-600 font-medium mt-2 text-center">
              ✅ Wiadomość została wysłana!
            </p>
          )}
        </form>

        {/* Ostatnie wiadomości */}
        {messages.length > 0 && (
          <section className="w-full max-w-2xl bg-[#EAE9E0] mt-10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-[#3E452A] text-xl font-semibold mb-4 text-center">
              Ostatnie wiadomości
            </h3>
            <ul className="flex flex-col gap-3">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className="p-3 bg-white rounded-lg shadow-sm text-sm text-[#3E452A] border"
                >
                  <strong className="block text-[#2f351d]">{msg.email}</strong>
                  <p className="mt-1">{msg.message}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>

      {/* Stopka */}
      <footer className="text-white bg-[#3E452A] mt-auto text-center py-4 rounded-t-2xl shadow-inner">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>
    </main>
  );
};

export default Contact;
