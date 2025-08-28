import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const adminsRef = collection(db, "admins");
      const q = query(adminsRef, where("login", "==", email)); // <- używamy email
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

      // logowanie udane
      localStorage.setItem("isAdmin", "true");
      navigate("/admin"); // przeniesienie po zalogowaniu
    } catch (err) {
      console.error(err);
      setError("Błąd logowania");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md flex flex-col gap-4 w-80"
      >
        <h2 className="text-xl font-bold text-center">Panel Admina</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded border"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded border"
        />
        {error && <p className="text-red-600 text-center">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded mt-2"
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
