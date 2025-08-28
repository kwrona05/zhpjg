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
    <div className="relative w-full h-60 bg-[#D7D5BE] rounded-2xl flex items-center mt-4">
      {/* Left arrow */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        aria-label="Poprzednie zdjęcie"
        className="absolute left-0 z-10 h-full px-4 text-[#3E452A] bg-[#BCA97A] disabled:opacity-40 rounded-l-2xl flex items-center justify-center hover:bg-[#A99956] transition-colors"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Photos */}
      <div className="flex w-full px-16 py-6 justify-center">
        {visiblePhotos.length === 0 ? (
          <div className="text-center w-full text-[#3E452A]">Brak zdjęć</div>
        ) : (
          visiblePhotos.map((photo) => (
            <div
              key={photo.id}
              className="flex-shrink-0 w-1/3 px-2 flex flex-col items-center"
            >
              <img
                src={photo.url}
                alt={photo.caption || `Zdjęcie ${photo.id}`}
                className="h-48 w-auto rounded shadow"
              />
              {photo.caption && (
                <div className="text-center mt-1 text-sm text-[#3E452A]">
                  {photo.caption}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Right arrow */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1 || totalPages === 0}
        aria-label="Następne zdjęcie"
        className="absolute right-0 z-10 h-full px-4 text-[#3E452A] bg-[#BCA97A] disabled:opacity-40 rounded-r-2xl flex items-center justify-center hover:bg-[#A99956] transition-colors"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default PhotosPlayer;
