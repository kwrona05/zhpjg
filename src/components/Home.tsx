import { useState } from "react";
import HeaderBar from "./HeaderBar";
import "../App.css";
import PhotosPlayer from "./PhotosPlayer.tsx";
import Articles from "./Articles";
import SearchPost from "./SearchPost";
import SearchResults from "./SearchResults";

const Home = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="relative flex flex-col gap-5 items-center min-h-screen w-screen bg-[#78815E] text-gray-800">
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

      {/* SEARCH */}
      {showSearch && (
        <div className="w-full px-4">
          <SearchPost onResults={setSearchResults} />
        </div>
      )}

      {/* SEARCH RESULTS */}
      {searchResults.length > 0 && <SearchResults results={searchResults} />}

      {/* DEFAULT CONTENT */}
      {searchResults.length === 0 && (
        <>
          <div className="flex flex-col items-center w-full">
            <PhotosPlayer />
          </div>
          <div className="flex flex-col items-center w-full">
            <Articles />
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="mt-auto w-full text-center py-4 text-white text-sm">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>

      {/* BUTTON */}
      <button
        onClick={() => {
          setShowSearch((prev) => !prev);
          setSearchResults([]); // wyczyść wyniki po zamknięciu
        }}
        className="fixed bottom-6 right-6 bg-[#3E452A] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#2e331f] transition"
      >
        {showSearch ? "Zamknij" : "🔍 Szukaj postów"}
      </button>
    </div>
  );
};

export default Home;
