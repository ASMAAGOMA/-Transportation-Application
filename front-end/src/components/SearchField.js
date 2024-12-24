// SearchField.js
import React from 'react';

const SearchField = ({ label, value }) => (
  <div className="space-y-2">
    <label className="block text-sm text-gray-500 md:text-base">{label}</label>
    <div className="font-medium text-gray-700 md:text-lg">{value}</div>
  </div>
);

export default SearchField;
