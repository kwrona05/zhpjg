import { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar.jsx";
import "../App.css";
import PhotosPlayer from "./PhotosPlayer.jsx";
import Articles from "./Articles.jsx";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase.js";

const Home = () => {
  const [playerImages, setPlayerImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const images = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayerImages(images);
    };

    fetchImages();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#78815E] text-gray-900">
      <div className="flex flex-col flex-grow gap-12 items-center mt-12">
        {/* Hero nagłówek */}
        <div className="bg-[#E5E8DA] rounded-3xl shadow-xl py-8 px-6 w-full mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-16 h-16 object-cover rounded-full shadow-lg border-2 border-[#3E452A]"
            />
            <img
              src="./krzyz.png"
              alt="Krzyż harcerski"
              className="w-16 h-16 object-cover rounded-full shadow-lg border-2 border-[#3E452A]"
            />
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#3E452A] text-center">
            Ocalić od zapomnienia
          </h1>
        </div>

        {/* HEADERBAR */}
        <div className="bg-[#E5E8DA] rounded-xl shadow-md py-3 px-4 w-full max-w-[90vw] mx-auto">
          <HeaderBar />
        </div>

        {/* GALERIA */}
        <section className="bg-[#E5E8DA] rounded-2xl shadow-lg p-6 w-full max-w-[90vw] mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#3E452A] mb-6">
            Galeria wspomnień
          </h2>
          <PhotosPlayer photos={playerImages} />
        </section>

        {/* ARTYKUŁY */}
        <section className="bg-[#E5E8DA] rounded-2xl shadow-lg p-6 w-full max-w-[90vw] mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#3E452A] mb-6">
            Artykuły i wspomnienia
          </h2>
          <Articles />
        </section>
      </div>

      {/* FOOTER */}
      <footer className="w-full mx-auto text-center text-sm text-gray-100 bg-[#3E452A] py-4 mt-12 rounded-t-2xl shadow-inner">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>
    </div>
  );
};

export default Home;
