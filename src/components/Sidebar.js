import React, { useEffect, useRef, useState } from 'react';
import { Calendar2, ChevronDown2, ChevronRight2 } from 'pixelarticons/react';
import '../styles/PixelInput.css';
import '../styles/Sidebar.css';

const Sidebar = ({ entries, selectedEntry, onSelectEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSearchCompact, setIsSearchCompact] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const searchInput = searchInputRef.current;

    if (!searchInput) {
      return undefined;
    }

    const updateSearchPlaceholder = () => {
      setIsSearchCompact(searchInput.offsetWidth < 240);
    };

    updateSearchPlaceholder();
    const resizeObserver = new ResizeObserver(updateSearchPlaceholder);
    resizeObserver.observe(searchInput);

    return () => resizeObserver.disconnect();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleControlsToggle = (event) => {
    if (window.innerWidth > 768) {
      event.preventDefault();
    }
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
      <details className="entry-controls" open>
        <summary onClick={handleControlsToggle}>
          <ChevronRight2 className="entry-toggle-icon entry-toggle-icon-closed" aria-hidden="true" focusable="false" />
          <ChevronDown2 className="entry-toggle-icon entry-toggle-icon-open" aria-hidden="true" focusable="false" />
          <span>Browse Posts</span>
        </summary>

        {/* Search Bar */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder={isSearchCompact ? 'Search...' : 'Search by title, tag, or link...'}
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar pixel-input"
        />

        {/* Date Filters */}
        <div className="date-filters">
          <label>
            Start Date:
            <div className="date-input-wrapper">
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
            <div className="date-input-wrapper">
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

        <hr className="posts-divider" />
        <h3 className="previous-posts-heading">Previous Posts</h3>

        {/* Show message if no entries match */}
        {sortedEntries.length === 0 ? (
          <p>No entries match your search criteria.</p>
        ) : (
          <ul className="entry-list">
            {sortedEntries.map(entry => {
              const isSelected = entry === selectedEntry ||
                (entry.id && entry.id === selectedEntry?.id);

              return (
                <li
                  key={entry.id || `${entry.title}-${entry.date}`}
                  onClick={() => onSelectEntry(entry)}
                  className={isSelected ? 'selected' : ''}
                  aria-current={isSelected ? 'page' : undefined}
                >
                  <span className="entry-title">{entry.title} </span>
                  <span className="entry-date">{entry.date}</span>
                </li>
              );
            })}
          </ul>
        )}
      </details>
    </div>
  );
};

export default Sidebar;
