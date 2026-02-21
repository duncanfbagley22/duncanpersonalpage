import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu.js';
import '../styles/Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <nav>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
        <span className="nav-title">Duncan's Personal Page</span>
        <ul className={isOpen ? 'open' : ''}>
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
          <li><Link to="/professional" onClick={() => setIsOpen(false)}>Professional</Link></li>
          <li><Link to="/projects" onClick={() => setIsOpen(false)}>Projects</Link></li>
          <li>
            <Link to="/favorites" onClick={() => setIsOpen(false)}>Favorites</Link>
            <DropdownMenu items={[
              { label: 'TV and Movies', path: '/tv-movies' },
              { label: 'Books and Podcasts', path: '/books-podcasts' },
              { label: 'Restaurants', path: '/restaurants' }
            ]}
            onClose={() => setIsOpen(false)} />
          </li>
          <li><Link to="/message" onClick={() => setIsOpen(false)}>Message</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;