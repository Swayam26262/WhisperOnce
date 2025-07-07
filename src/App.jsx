import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ConfessionReader } from './components/ConfessionReader';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/whisper/:slug" element={<ConfessionReader />} />
          <Route path="/read-random" element={<ConfessionReader isRandom={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;