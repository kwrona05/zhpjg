import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const PhotosPlayer = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const photosPerPage = 3;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/photos");
        setPhotos(res.data);
      } catch (error) {
        console.error("Błąd przy pobieraniu zdjęć:", error);
      }
    };
    fetchPhotos();
  }, []);

  const totalPages = Math.ceil(photos.length / photosPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const visiblePhotos = photos.slice(
    currentPage * photosPerPage,
    currentPage * photosPerPage + photosPerPage
  );

  return (
    <div className="relative w-[85%] h-60  bg-[#D7D5BE] rounded-2xl flex items-center">
      {/* Strzałka lewa */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        className="absolute left-0 z-10 h-full px-4 text-[#3E452A] bg-[#BCA97A] disabled:opacity-40 rounded-l-2xl flex items-center justify-center hover:bg-[#A99956] transition-colors"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Kontener zdjęć */}
      <div className="flex overflow-hidden w-full px-16 py-6">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
            width: `${totalPages * 100}%`,
          }}
        >
          {photos.length === 0 && (
            <div className="text-center w-full">Brak zdjęć do wyświetlenia</div>
          )}

          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex-shrink-0 w-1/3 px-2 flex flex-col items-center relative"
              style={{ maxHeight: "280px" }}
            >
              <div className="scale-90 h-48 rounded-lg relative group">
                <img
                  src={`http://localhost:4000${photo.url}`}
                  alt={photo.description}
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
                <div
                  className="absolute bottom-0 left-0 w-full bg-[#BCA97A] text-[#3E452A] text-center
      py-2 font-mono
      opacity-0 translate-y-full
      group-hover:opacity-100 group-hover:translate-y-0
      transition-all duration-300 ease-in-out
      rounded-b-xl"
                >
                  {photo.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strzałka prawa */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1 || totalPages === 0}
        className="absolute right-0 z-10 h-full px-4 text-[#3E452A] bg-[#BCA97A] disabled:opacity-40 rounded-r-2xl flex items-center justify-center hover:bg-[#A99956] transition-colors"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default PhotosPlayer;
