import React, { useState } from 'react';
import { Calendar2 } from 'pixelarticons/react';
import '../styles/PixelInput.css';
import '../styles/Sidebar.css';

const Sidebar = ({ entries, onSelectEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Filter logic
  const filteredEntries = entries.filter(entry => {
    const matchesSearchQuery =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.externalLink.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateFilter = (!startDate || new Date(entry.date) >= new Date(startDate)) &&
                              (!endDate || new Date(entry.date) <= new Date(endDate));

    return matchesSearchQuery && matchesDateFilter;
  });

  // Sorting by date (ascending)
  const sortedEntries = filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="sidebar-container">
      {/* Search Bar */}
      <div className="pixel-input-frame search-bar-wrapper">
        <input
          type="text"
          placeholder="Search by title, tag, link, or metadata..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar pixel-input"
        />
      </div>

      {/* Date Filters */}
      <div className="date-filters">
        <label>
          Start Date:
          <div className="date-input-wrapper pixel-input-frame">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="date-input pixel-input"
            />
            <Calendar2 className="date-input-icon" aria-hidden="true" focusable="false" />
          </div>
        </label>
        <label>
          End Date:
          <div className="date-input-wrapper pixel-input-frame">
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="date-input pixel-input"
            />
            <Calendar2 className="date-input-icon" aria-hidden="true" focusable="false" />
          </div>
        </label>
      </div>

      <h3>Previous Entries</h3>

      {/* Show message if no entries match */}
      {sortedEntries.length === 0 ? (
        <p>No entries match your search criteria.</p>
      ) : (
        <ul className="entry-list">
          {sortedEntries.map(entry => (
            <li key={entry.id} onClick={() => onSelectEntry(entry)}>
              <span className="entry-title">{entry.title} </span>
              <span className="entry-date">{entry.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
