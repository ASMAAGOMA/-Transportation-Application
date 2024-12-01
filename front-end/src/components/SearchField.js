// SearchField.js
import React from 'react';

const SearchField = ({ label, value }) => (
    <div>
      <label className="block text-sm text-gray-500">{label}</label>
      <div className="font-medium">{value}</div>
    </div>
  );
  
export default SearchField;