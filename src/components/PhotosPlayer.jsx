import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PhotosPlayer = ({ photos = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const photosPerPage = 3;

  const totalPages = Math.ceil(photos.length / photosPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const handleNext = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  const visiblePhotos = photos.slice(
    currentPage * photosPerPage,
    currentPage * photosPerPage + photosPerPage
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-[#D7D5BE] rounded-2xl shadow-lg overflow-hidden mt-6">
      {/* Photos */}
      <div className="flex justify-center gap-4 px-6 py-6 flex-nowrap overflow-x-auto">
        {visiblePhotos.length === 0 ? (
          <div className="text-center w-full text-[#3E452A]">Brak zdjęć</div>
        ) : (
          visiblePhotos.map((photo) => (
            <div
              key={photo.id}
              className="flex-shrink-0 relative rounded-xl overflow-hidden group h-60"
            >
              <img
                src={photo.url}
                alt={photo.caption || `Zdjęcie ${photo.id}`}
                className="h-full w-auto object-contain rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm text-center py-1 opacity-0 group-hover:opacity-100 transition">
                  {photo.caption}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Left arrow */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        aria-label="Poprzednie zdjęcie"
        className="absolute top-1/2 -translate-y-1/2 left-4 bg-[#3E452A] text-[#D7D5BE] p-3 rounded-full shadow-lg disabled:opacity-40 hover:bg-[#2f351d] transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right arrow */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1 || totalPages === 0}
        aria-label="Następne zdjęcie"
        className="absolute top-1/2 -translate-y-1/2 right-4 bg-[#3E452A] text-[#D7D5BE] p-3 rounded-full shadow-lg disabled:opacity-40 hover:bg-[#2f351d] transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-4">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full transition ${
                idx === currentPage
                  ? "bg-[#3E452A]"
                  : "bg-gray-400 hover:bg-gray-600 cursor-pointer"
              }`}
              onClick={() => setCurrentPage(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotosPlayer;
