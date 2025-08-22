
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './screens/SplashPage';
import MainMenu from './screens/MainMenu';
import GameLobby from './screens/GameLobby';
import GameTable from './screens/GameTable';
import VictoryScreen from './screens/VictoryScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/lobby" element={<GameLobby />} />
        <Route path="/game" element={<GameTable />} />
        <Route path="/victory" element={<VictoryScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
