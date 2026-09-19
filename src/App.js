// src/App.js
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Blog from './pages/mainpages/Blog';
import Professional from './pages/mainpages/Professional';
import Projects from './pages/mainpages/Projects';
import Favorites from './pages/mainpages/Favorites';
import Message from './pages/mainpages/MessageCenter';
import BooksPodcasts from './pages/favoritessubpages/Books-Podcasts';
import TVMovies from './pages/favoritessubpages/TV-Movies';
import Restaurants from './pages/favoritessubpages/Restaurants';
import Overworld from './components/Overworld'; // the walk-around game world
import TitleScreen from './pages/mainpages/TitleScreen'; // landing/title screen
import AdminAdd from './pages/adminpages/AdminAdd';
import AdminDelete from './pages/adminpages/AdminDelete';
import AdminMessages from './pages/adminpages/AdminMessages';
import PixelFrame from './components/PixelFrame';
import './styles/Global.css';

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOverworld = location.pathname === '/overworld';
  const [controlsOpen, setControlsOpen] = useState(false);
  const toggleControls = () => setControlsOpen((open) => !open);
  const closeControls = () => setControlsOpen(false);

  const routes = (
    <Routes>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/professional" element={<Professional />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/message" element={<Message />} />
          <Route path="/books-podcasts" element={<BooksPodcasts />} />
          <Route path="/tv-movies" element={<TVMovies />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/overworld" element={<Overworld controlsOpen={controlsOpen} onCloseControls={closeControls} />} />
          {/* Admin routes: not linked from the main nav. No auth-check yet —
              access control still relies on Firestore security rules. */}
          <Route path="/admin" element={<AdminAdd />} />
          <Route path="/admin/delete" element={<AdminDelete />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
    </Routes>
  );

  return (
    <div className="App">
      {isAdminRoute ? <main className="admin-route-content">{routes}</main> : (
        <PixelFrame header={<Header showInfo={isOverworld} infoOpen={controlsOpen} onToggleInfo={toggleControls} />}>
          <main className="pixel-frame-content">{routes}</main>
        </PixelFrame>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
