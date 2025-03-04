// src/components/DropdownMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DropdownMenu.css';

const DropdownMenu = ({ items }) => {
  return (
    <ul className="dropdown-menu">
      {items.map((item, index) => (
        <li key={index}>
          <Link to={item.path}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
