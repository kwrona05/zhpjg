import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PhotosPlayer = () => {
  const photos = [
    { src: "/photo1.jpg", description: "Seniorzy ZHP" },
    { src: "/photo4.jpg", description: "Historia w odznakach" },
    { src: "/photo3.jpg", description: "ZHP dawniej" },
    { src: "/photo2.jpg", description: "Harcerze i nowy sztandar" },
    { src: "/photo5.jpg", description: "Legenda ZHP" },
    { src: "/photo6.jpg", description: "Nowy rok 2025" },
    { src: "/photo7.jpg", description: "ZHP dawniej" },
    { src: "/photo8.jpg", description: "Młode lata ZHP" },
    { src: "/photo9.jpg", description: "Młode lata ZHP" },
    { src: "/photo10.jpg", description: "Spotkanie komendantów" },
  ];

  const [isAnimating, setIsAnimating] = useState(false);

  const photosPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const startIndex = currentPage * photosPerPage;
  const currentPhotos = photos.slice(startIndex, startIndex + photosPerPage);

  const totalPages = Math.ceil(photos.length / photosPerPage);

  const handlePrev = () => {
    if (currentPage > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="w-[85%] bg-[#D7D5BE] rounded-2xl flex justify-center">
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        className="px-4 py-2 bg-[#BCA97A] text-[#3E452A] rounded-l-2xl disabled:opacity-50"
      >
        <ChevronLeft />
      </button>
      <div
        className={`scale-90 flex flex-wrap gap-4 justify-center transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {currentPhotos.map((photo, index) => {
          const isTopRow = index < 2;
          const widthClass = isTopRow ? "w-[48%]" : "[w-33%]";

          return (
            <div
              key={index}
              className={`${widthClass} relative overflow-hidden rounded-2xl shadow-md group m-10`}
            >
              <img
                src={photo.src}
                alt={photo.description}
                className="w-full object-cover h-48"
              />
              <div className="font-mono absolute bottom-0 left-0 w-full bg-[#BCA97A] text-[#3E452A] text-center py-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {photo.description}
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 bg-[#BCA97A] text-[#3E452A] rounded-r-2xl disabled:opacity-50"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default PhotosPlayer;
