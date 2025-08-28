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
    <div className="flex flex-col min-h-screen w-screen bg-[#78815E] text-gray-800">
      <div className="flex flex-col flex-grow gap-5 items-center">
        {/* HEADER */}
        <header className="flex flex-row justify-center items-center w-full gap-2">
          <img
            src="/logo.png"
            alt="Photo1"
            className="w-16 h-16 object-cover rounded-full"
          />
          <h1 className="font-sans text-3xl font-bold text-[#3E452A]">
            Ocalić od zapomnienia
          </h1>
          <img
            src="./krzyz.png"
            alt="Krzyz harcerski"
            className="w-16 h-16 object-cover rounded-full"
          />
        </header>

        {/* HEADERBAR */}
        <div className="w-full py-4 px-4">
          <HeaderBar />
        </div>
        <div className="flex flex-col items-center w-full">
          <PhotosPlayer photos={playerImages} />
        </div>
        <div className="flex flex-col items-center w-full">
          <Articles />
        </div>
      </div>
      {/* FOOTER
      <footer className="w-full text-center text-white text-sm">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer> */}
    </div>
  );
};

export default Home;
