import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home.tsx'
import Articles from "./components/Articles.tsx";
import AdminPage from "./cms/page.tsx";

const App = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/posts" element={<Articles />} />
                <Route path="/page" element={<AdminPage />} />
            </Routes>
        </Router>
    )
}

export default App;