import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home.tsx'
import Articles from "./components/Articles.tsx";
import AdminPage from "./cms/page.tsx";
import HistoricComission from "./components/HistoricComission.tsx";
import Panteon from "./components/Panteon";
import Banners from "./components/Banners.tsx";
import Museum from "./components/Museum.tsx";
import Flag from "./components/Flag.tsx";
import Detachment from "./components/Detachment.tsx";
import Contact from "./components/Contact.tsx";
import FEN from "./components/FEN.tsx";

const App = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/posts" element={<Articles />} />
                <Route path="/page" element={<AdminPage />} />
                <Route path='/komisja-historyczna' element={<HistoricComission />} />
                <Route path='/panteon' element={<Panteon />} />
                <Route path='/sztandary' element={<Banners />} />
                <Route path='/muzeum' element={<Museum />} />
                <Route path='/choragiew' element={<Flag />} />
                <Route path='/hufiec' element={<Detachment />} />
                <Route path='/kontakt' element={<Contact />} />
                <Route path='/fen' element={<FEN />} />
            </Routes>
        </Router>
    )
}

export default App;