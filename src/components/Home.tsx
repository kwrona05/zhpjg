import HeaderBar from './HeaderBar';
import '../App.css';
import PhotosPlayer from "./PhotosPlayer.tsx";
import Articles from "./Articles";

const Home = () => {
    return (
        <div className="flex flex-col gap-5 items-center min-h-screen w-screen bg-[#78815E] text-gray-800">
            <header className="flex flex-row justify-center items-center w-full py-6 px-4 gap-4">
                <img src="/logo.png" alt="Photo1" className="w-16 h-16 object-cover rounded-full" />
                <h1 className="font-sans text-3xl font-bold text-[#3E452A]">Ocalić od zapomnienia</h1>
                <img src="" alt="Photo2" className="w-16 h-16 object-cover rounded-full" />
            </header>
            <div className="w-full py-4 px-4">
                <HeaderBar />
            </div>
            <div className="flex flex-col items-center w-full">
                <PhotosPlayer />
            </div>
            <div className='flex flex-col items-center w-full '>
                <Articles />
            </div>
            <footer className="mt-auto w-full text-center py-4 text-white text-sm">
                &copy; {new Date().getFullYear()} Twoja Nazwa | Wszystkie prawa zastrzeżone
            </footer>
        </div>
    );
};

export default Home;
