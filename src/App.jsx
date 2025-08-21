import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Articles from "./components/Articles.jsx";
import AdminPage from "./cms/page.jsx";
import HistoricComission from "./components/HistoricComission.jsx";
import Panteon from "./components/Panteon.jsx";
import Banners from "./components/Banners.jsx";
import Museum from "./components/Museum.jsx";
import Flag from "./components/Flag.jsx";
import Detachment from "./components/Detachment.jsx";
import Contact from "./components/Contact.jsx";
import FEN from "./components/FEN.jsx";
import Messages from "./components/Messages.jsx";
import ServiceMessages from "./components/ServiceMessages.jsx";
import Photos from "./components/photos.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Articles />} />
        <Route path="/page" element={<AdminPage />} />
        <Route path="/komisja-historyczna" element={<HistoricComission />} />
        <Route path="/panteon" element={<Panteon />} />
        <Route path="/sztandary" element={<Banners />} />
        <Route path="/muzeum" element={<Museum />} />
        <Route path="/choragiew" element={<Flag />} />
        <Route path="/hufiec" element={<Detachment />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/fen" element={<FEN />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/serviceMessages" element={<ServiceMessages />} />
        <Route path="/photos" element={<Photos />} />
      </Routes>
    </Router>
  );
};

export default App;
