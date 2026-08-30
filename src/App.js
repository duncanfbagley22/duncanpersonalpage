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
import UnityGame from './components/unityGame'; // Import UnityGame
import Home from './pages/mainpages/Home'; // Import Home
import AdminAdd from './pages/adminpages/AdminAdd';
import AdminDelete from './pages/adminpages/AdminDelete';
import AdminMessages from './pages/adminpages/AdminMessages';
import './styles/Global.css';

function AppRoutes({ showUnityGame, handleContinue }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header />}
      <Routes>
          <Route path="/" element={<Home onContinue={handleContinue} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/professional" element={<Professional />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/message" element={<Message />} />
          <Route path="/books-podcasts" element={<BooksPodcasts />} />
          <Route path="/tv-movies" element={<TVMovies />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/unity-game" element={<UnityGame />} />
          {/* Admin routes: not linked from the main nav. No auth-check yet —
              access control still relies on Firestore security rules. */}
          <Route path="/admin" element={<AdminAdd />} />
          <Route path="/admin/delete" element={<AdminDelete />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
      </Routes>
    </div>
  );
}

function App() {
  const [showUnityGame, setShowUnityGame] = useState(false); // State to control Unity game visibility
  const handleContinue = () => {
    setShowUnityGame(true); // Show the Unity game when continue is pressed
  };

  console.log(showUnityGame); // or some dummy read
  return (
    <Router>
      <AppRoutes showUnityGame={showUnityGame} handleContinue={handleContinue} />
    </Router>
  );
}

export default App;
