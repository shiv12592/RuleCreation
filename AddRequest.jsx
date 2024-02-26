import React, { useState } from 'react';

const AddRequest = () => {
  const [requestData, setRequestData] = useState([]);
  const [currentRow, setCurrentRow] = useState({});

  const handleAddRow = () => {
    setCurrentRow({
      attribute: '',
      operation: '',
      value: '',
    });
  };

  const handleChange = (event, field) => {
    setCurrentRow({
      ...currentRow,
      [field]: event.target.value,
    });
  };

  const handleSaveRequest = () => {
    const newRequest = {
      ...currentRow,
    };
    setRequestData([...requestData, newRequest]);
    setCurrentRow({}); // Clear current row data after saving
  };

  const handleRemoveRequest = (index) => {
    const updatedData = [...requestData];
    updatedData.splice(index, 1);
    setRequestData(updatedData);
  };

  return (
    <div>
      <table>
        <tbody>
          {/* Iterate over requestData to render existing rows */}
          {requestData.map((request, index) => (
            <tr key={index}>
              <td>{request.attribute}</td>
              <td>{request.operation}</td>
              <td>{request.value}</td>
              <td>
                <button onClick={() => handleRemoveRequest(index)}>
                  Remove Request
                </button>
              </td>
            </tr>
          ))}

          {/* Render the "Add Request" row dynamically */}
          {currentRow.attribute || currentRow.operation || currentRow.value ? (
            <tr key="new-row" style={{ backgroundColor: 'lightblue' }}> {/* Highlight added row */}
              <td>
                <select
                  value={currentRow.attribute}
                  onChange={(event) => handleChange(event, 'attribute')}
                >
                  <option value="">Select Attribute</option>
                  <option value="attr1">attr1</option>
                  <option value="attr2">attr2</option>
                  <option value="attr3">attr3</option>
                </select>
              </td>
              <td>
                <select
                  value={currentRow.operation}
                  onChange={(event) => handleChange(event, 'operation')}
                >
                  <option value="">Select Operation</option>
                  <option value="add">add</option>
                  <option value="delete">delete</option>
                  <option value="update">update</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={currentRow.value}
                  onChange={(event) => handleChange(event, 'value')}
                />
              </td>
              <td>
                <button onClick={handleSaveRequest}>Save Request</button>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="4">
                <button onClick={handleAddRow}>Add Request Attribute</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => console.log(JSON.stringify(requestData))}>
        Log Request Data
      </button>
    </div>
  );
};

export default AddRequest;
