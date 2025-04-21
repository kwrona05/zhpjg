import { useNavigate } from "react-router-dom";

const HeaderBar = () => {
    const navigate = useNavigate();

    return (
        <div className="font-mono flex flex-row justify-center w-full h-16 shadow-md py-4 px-6 sticky top-0 z-50 bg-[#3E452A]">
            <nav className="flex items-center justify-center gap-15 text-[#D7D5BE] font-medium text-base text-center bg-[#3E452A]">
                <div
                    onClick={() => navigate("/")}
                    className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Home
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Komisja Historyczna
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Panteon
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Publikacje
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Sztandary
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Muzeum
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Chorągiew
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Hufiec
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    Kontakt
                </div>
                <div className="h-16 flex items-center cursor-pointer border-b-2 border-transparent hover:border-[#BFD7EA] hover:text-[#BFD7EA] transition">
                    FEN
                </div>
            </nav>
        </div>
    );
};

export default HeaderBar;