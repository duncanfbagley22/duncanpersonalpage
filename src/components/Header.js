// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu.js';
import '../styles/Header.css';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>
            <Link to="/blog">Blog</Link>

          </li>
          <li><Link to="/professional">Professional</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/favorites">Favorites</Link><DropdownMenu items={[
                { label: 'TV and Movies', path: '/tv-movies' },
                { label: 'Books and Podcasts', path: '/books-podcasts' },
                { label: 'Restaurants', path: '/restaurants' }
              ]}  /></li>
          <li><Link to="/message">Message</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
