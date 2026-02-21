import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DropdownMenu.css';

const DropdownMenu = ({ items, onClose }) => {
  return (
    <ul className="dropdown-menu">
      {items.map((item, index) => (
        <li key={index}>
          <Link to={item.path} onClick={onClose}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;