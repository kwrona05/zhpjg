import { useState } from "react";
import HeaderBar from "./HeaderBar.jsx";
import "../App.css";
import PhotosPlayer from "./PhotosPlayer.jsx";
import Articles from "./Articles.jsx";
import SearchPost from "./SearchPost.jsx";
import SearchResults from "./SearchResults.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

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
      </div>
      {/* FOOTER
      <footer className="w-full text-center text-white text-sm">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer> */}

      {/* BUTTON */}
      <button
        onClick={() => navigate("/page")}
        className="fixed bottom-6 right-6 bg-[#3E452A] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#2e331f] transition"
      >
        Admin
      </button>
    </div>
  );
};

export default Home;
