import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddRequest = ({ requestData, onChange }) => {
  const [rows, setRows] = useState(requestData || []);

  const handleAddRow = () => {
    const newRow = { attribute: '', operation: '', value: '' };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const handleSelectChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const handleInputChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].value = value;
    setRows(updatedRows);
    onChange(updatedRows);
  };

  return (
    <div>
      {rows.map((row, index) => (
        <div key={index}>
          <select
            value={row.attribute}
            onChange={(e) => handleSelectChange(index, 'attribute', e.target.value)}
          >
            <option value="">Select Attribute</option>
            <option value="attr1">attr1</option>
            <option value="attr2">attr2</option>
            <option value="attr3">attr3</option>
          </select>

          {row.attribute && (
            <select
              value={row.operation}
              onChange={(e) => handleSelectChange(index, 'operation', e.target.value)}
            >
              <option value="">Select Operation</option>
              <option value="add">Add</option>
              <option value="delete">Delete</option>
              <option value="update">Update</option>
            </select>
          )}

          {row.operation && (
            <input
              type="text"
              value={row.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          )}

          {index === rows.length - 1 ? (
            <button onClick={handleAddRow}>Add Request Attribute</button>
          ) : (
            <button onClick={() => handleRemoveRow(index)}>Remove Request</button>
          )}
        </div>
      ))}
    </div>
  );
};

AddRequest.propTypes = {
  requestData: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default AddRequest;
