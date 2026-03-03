import React, { useRef } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
// Import createSearchParams
// Import useNavigate


export default function Search({ value, onChange }) {
  return (
    <input
      className="searchBar"
      type="text"
      placeholder="Search posts..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

