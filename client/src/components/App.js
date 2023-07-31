import React from 'react'
import Game from "./Game.js";
import { Navbar } from './NavBar.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { About } from './About.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Game />} />
          {/* {<Route path="/history" element={cookies.access_token &&<BetHistory />} />} */}
          {<Route path="/about" element={<About />} />}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
