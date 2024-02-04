import React, { useState } from 'react'
const RuleConditionRows = () => {
  const [conditions, setConditions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOperation, setSelectOperation] = useState('AND');
  const [isAddClicked, setIsAddClicked] = useState(false); // State variable to track if the add condition row button has been clicked
  const [locationValues, setLocationValues] = useState([]); // State variable to track the array of entries for the location value field

  const handleAddConditionRow = () => {
    // Add a new empty condition object into the conditions array
    setConditions([...conditions, {}]);
    setIsAddClicked(true); // Set the state variable to true
  };

  const handleChange = (index, field, value) => {
    // Update specific field value of a particular condition at given index
    let updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
    if (field === 'value' && conditions[index].source === 'Location') {
      // Update the array of entries for the location value field
      setLocationValues(value.split(','));
    }
  };

  const handleSelectRow = (index) => {
   // Toggle selection status of row at given index
   if (selectedRows.includes(index)) {
     setSelectedRows(selectedRows.filter(i => i !== index));
   } else {
     setSelectedRows([...selectedRows, index]);
   }
 };

  const handleGroupSelected = () => {
    // Group selected rows into a new condition object with a nested array and a select operation
    if (selectedRows.length > 1) {
      let groupedConditions = [];
      let groupedRows = [];
      conditions.forEach((condition, index) => {
        if (selectedRows.includes(index)) {
          // Add selected rows to the nested array
          groupedRows.push(condition);
        } else {
          // Keep unselected rows as they are
          groupedConditions.push(condition);
        }
      });
      // Check if the nested array contains a group condition
      let hasGroup = groupedRows.some(row => row.rows && row.selectOperation);
      if (hasGroup) {
        // Create a new group of group + single row
        let newGroup = {rows: [], selectOperation};
        groupedRows.forEach(row => {
          if (row.rows && row.selectOperation) {
            // Add the group condition to the new group
            newGroup.rows.push(row);
          } else {
            // Create a new group condition with the single row
            newGroup.rows.push({rows: [row], selectOperation});
          }
        });
        // Add the new group condition to the grouped conditions array
        groupedConditions.push(newGroup);
      } else {
        // Add the new condition object with the nested array and the select operation
        groupedConditions.push({rows: groupedRows, selectOperation});
      }
      // Update the conditions array and clear the selected rows
      setConditions(groupedConditions);
      setSelectedRows([]);
    }
  };

  const handleUngroupSelected = () => {
    // Ungroup selected rows that have a nested array and a select operation
    let ungroupedConditions = [];
    conditions.forEach((condition, index) => {
      if (selectedRows.includes(index) && condition.rows && condition.selectOperation) {
        // Add the nested rows to the ungrouped conditions array
        ungroupedConditions.push(...condition.rows);
      } else {
        // Keep other rows as they are
        ungroupedConditions.push(condition);
      }
    });
    // Update the conditions array and clear the selected rows
    setConditions(ungroupedConditions);
    setSelectedRows([]);
  };

  const handleDeleteSelected = () => {
    // Delete selected rows from the conditions array
    let updatedConditions = conditions.filter((condition, index) => !selectedRows.includes(index));
    // Update the conditions array and clear the selected rows
    setConditions(updatedConditions);
    setSelectedRows([]);
  };

  const handleSubmit = () => {
    // Submit all added conditions and display them in JSON format in the console
    console.log(JSON.stringify({conditions: format(conditions, selectOperation)}, null, 2));
  };

  const format = (conditions, selectOperation) => {
    // Format the conditions array into a JSON object with the select operation and the rows
    let result = {};
    result[selectOperation] = conditions.map(condition => {
      if (condition.rows && condition.selectOperation) {
        // Format the nested array and the select operation
        return format(condition.rows, condition.selectOperation);
      } else {
        // Format the normal condition object with the source, attribute, value, and field
        let obj = {};
        obj["Source"] = condition.source || ""; // Send empty string if source is not selected
        if (condition.source === 'Request') {
          obj["requestAttribute"] = condition.requestAttribute || ""; // Send empty string if request attribute is not selected
          obj["requestValue"] = condition.value || ""; // Send empty string if request value is not entered
        } else if (condition.source === 'Identity') {
          obj["identityAttribute"] = condition.identityAttribute || ""; // Send empty string if identity attribute is not selected
          obj["identityValue"] = condition.value || ""; // Send empty string if identity value is not entered
        } else if (condition.source === 'Location') {
          obj["locationAttribute"] = condition.locationAttribute || ""; // Send empty string if location attribute is not selected
          obj["locationValue"] = condition.value || ""; // Send empty string if location value is not entered
          obj["locationField"] = condition.locationField || ""; // Send empty string if location field is not selected
        }
        return obj;
      }
    });
    return result;
  };

  const handleChangeInner = (index, i, field, value) => {
    // Update specific field value of a particular condition at given index and i within a nested array
    let updatedConditions = [...conditions];
    updatedConditions[index].rows[i][field] = value;
    setConditions(updatedConditions);
    if (field === 'value' && conditions[index].rows[i].source === 'Location') {
      // Update the array of entries for the location value field
      setLocationValues(value.split(','));
    }
  };

  const handleAddEntry = () => {
    // Add a new empty entry to the array of entries for the location value field
    setLocationValues([...locationValues, '']);
  };

  const handleRemoveEntry = (i) => {
    // Remove the entry at the given index from the array of entries for the location value field
    let updatedLocationValues = [...locationValues];
    updatedLocationValues.splice(i, 1);
    setLocationValues(updatedLocationValues);
  };

 const renderConditionRow = (condition, index, i, isGrouped = false) => {
    // Render a single condition row based on the condition object and index
    return (
      condition.rows && condition.selectOperation ? (
        // Render a grouped condition row with a nested table and a select operation
        <table style={{border: '1px solid black', margin: '10px'}}>
          <tbody>
            <tr style={{border: '1px solid black'}}>
              <td>
                <input type="checkbox" checked={isGrouped ? condition.checked : selectedRows.includes(index)} onChange={() => isGrouped ? handleChangeInner(index, i, 'checked', !condition.checked) : handleSelectRow(index)} />
              </td>
              <td>
                <label>Select Operation</label>
                <select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </td>
              <td>
                {condition.rows.map((row, i) => (
                  <div key={i}>{renderConditionRow(row, index, i, true)}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        // Render a normal condition row with dropdowns and input
        <div style={{border: '1px solid black', margin: '10px', padding: '10px'}}>
          <input type="checkbox" checked={isGrouped ? condition.checked : selectedRows.includes(index)} onChange={() => isGrouped ? handleChangeInner(index, i, 'checked', !condition.checked) : handleSelectRow(index)} />
          <select value={condition.source} onChange={(e) => isGrouped ? handleChangeInner(index, i, 'source', e.target.value) : handleChange(index, 'source', e.target.value)}>
            <option value="">Select Source</option>
            <option value="Request">Request</option>
            <option value="Identity">Identity</option>
            <option value="Location">Location</option>
          </select>
          {condition.source === 'Request' && (
            <select value={condition.requestAttribute} onChange={(e) => isGrouped ? handleChangeInner(index, i, 'requestAttribute', e.target.value) : handleChange(index, 'requestAttribute', e.target.value)}>
              <option value="">Select Request Attribute</option>
              <option value="requestAttribute1">requestAttribute1</option>
            <option value="requestAttribute2">requestAttribute2</option>
          </select>
        )}

        {condition.source === 'Identity' && (
          <select
            value={condition.identityAttribute}
            onChange={(e) =>
              isGrouped
                ? handleChangeInner(index, i, 'identityAttribute', e.target.value)
                : handleChange(index, 'identityAttribute', e.target.value)
            }>
            <option value="">Select Identity Attribute</option>
            <option value="identityAttribute1">identityAttribute1</option>
            <option value="identityAttribute2">identityAttribute2</option>
          </select>
        )}
        {condition.source === 'Location' && (
          <select
            value={condition.locationAttribute}
            onChange={(e) =>
              isGrouped
                ? handleChangeInner(index, i, 'locationAttribute', e.target.value)
                : handleChange(index, 'locationAttribute', e.target.value)
            }>
            <option value="">Select Location Attribute</option>
            <option value="locationAttribute1">locationAttribute1</option>
            <option value="locationAttribute2">locationAttribute2</option>
          </select>
        )}
        <input
          type="text"
          value={condition.value}
          onChange={(e) =>
            isGrouped ? handleChangeInner(index, i, 'value', e.target.value) : handleChange(index, 'value', e.target.value)
          }
        />
      </div>
    )
  }
  return (
    <div className="col-md-12 pad-1 card-rounded">
      <button onClick={handleAddConditionRow}>Add Condition Row</button>
      <table style={{ border: '1px solid black' }}>
        <tbody>
          <tr style={{ border: '1px solid black' }}>
            <td>
              <label>Select Operation</label>
              <select value={selectOperation} onChange={(e) => setSelectOperation(e.target.value)}>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </td>
            <td>
              {conditions.map((condition, index) => (
                <div key={index}>{renderConditionRow(condition, index)}</div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleGroupSelected}>Group Selected</button>
      <button onClick={handleUngroupSelected}>Un-group Selected</button>
      <button onClick={handleDeleteSelected}>Delete Selected</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
export default RuleConditionRows
