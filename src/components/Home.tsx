const Home: Function = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <img src="grgr" alt="Photo1" />
                <h1>Ocalić od zapomnienia</h1>
                <img  src="grgr" alt="Photo2" />
                <img  src="grgr" alt="Photo3" />
            </header>
            <div className="header-bar">
                <div>Home</div>
                <div>Komisja Historyczna</div>
                <div>Panteon</div>
                <div>Publikacje</div>
                <div>Sztandary</div>
                <div>Muzeum</div>
                <div>Chorągiew</div>
                <div>Hufiec</div>
                <div>Kontakt</div>
                <div>FEN</div>
            </div>
            <div className="photos-container"></div>
            <div className="posts"></div>
            <div className="footer"></div>
        </div>
    )
}
export default Home