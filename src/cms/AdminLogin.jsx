import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const adminsRef = collection(db, "admins");
      const q = query(adminsRef, where("login", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Niepoprawny email lub hasło");
        return;
      }

      const adminDoc = snapshot.docs[0];
      const data = adminDoc.data();

      if (data.password !== password) {
        setError("Niepoprawny email lub hasło");
        return;
      }

      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Błąd logowania");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#78815E] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#D7D5BE] w-full max-w-md p-6 rounded-2xl shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#3E452A]">
          Panel Admina
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3E452A] bg-white"
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3E452A] bg-white"
        />

        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="bg-[#3E452A] text-[#D7D5BE] py-2 rounded-lg mt-2 font-semibold hover:bg-[#2f351d] transition"
        >
          Zaloguj
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
