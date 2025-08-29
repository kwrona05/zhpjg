import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // ikonki do hamburgera

const navItems = [
  { path: "/", label: "Home" },
  { path: "/komisja-historyczna", label: "Komisja Historyczna" },
  { path: "/panteon", label: "Panteon" },
  { path: "/posts", label: "Publikacje" },
  { path: "/sztandary", label: "Sztandary" },
  { path: "/muzeum", label: "Muzeum" },
  { path: "/choragiew", label: "Chorągiew" },
  { path: "/hufiec", label: "Hufiec" },
  { path: "/kontakt", label: "Kontakt" },
  { path: "/fen", label: "FEN" },
];

const HeaderBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#3E452A] shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-6 py-4 relative">
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden absolute left-6 text-[#D7D5BE]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Nawigacja desktop */}
        <nav className="hidden md:flex gap-x-8 text-[#D7D5BE] font-medium">
          {navItems.map((item) => (
            <span
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative cursor-pointer transition hover:text-[#BFD7EA] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#BFD7EA] hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </span>
          ))}
        </nav>
      </div>

      {/* Nawigacja mobile */}
      {isOpen && (
        <nav className="md:hidden bg-[#3E452A] flex flex-col items-center gap-4 py-6 text-[#D7D5BE] font-medium">
          {navItems.map((item) => (
            <span
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="cursor-pointer hover:text-[#BFD7EA] transition"
            >
              {item.label}
            </span>
          ))}
        </nav>
      )}
    </header>
  );
};

export default HeaderBar;
