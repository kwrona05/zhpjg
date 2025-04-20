const PhotosPlayer = () => {
    const photos = [
        { src: '/photo1.jpg', description: 'Seniorzy ZHP' },
        { src: '/photo4.jpg', description: 'Historia w odznakach' },
        { src: '/photo3.jpg', description: 'ZHP dawniej' },
        { src: '/photo2.jpg', description: 'Harcerze i nowy sztandar' },
        { src: '/photo5.jpg', description: 'Legenda ZHP' },
    ];

    return (
        <div className="w-[70%] bg-[#D7D5BE] rounded-2xl flex justify-center">
            <div className="scale-90 flex flex-wrap gap-4 justify-center">
                {photos.map((photo, index) => {
                    const isTopRow = index < 2;
                    const widthClass = isTopRow ? 'w-[48%]' : 'w-[30%]';

                    return (
                        <div key={index} className={`${widthClass} relative overflow-hidden rounded-2xl shadow-md group m-10`}>
                            <img
                                src={photo.src}
                                alt={photo.description}
                                className="w-full object-cover h-48"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-[#BCA97A] text-[#3E452A] text-center py-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                {photo.description}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PhotosPlayer;
