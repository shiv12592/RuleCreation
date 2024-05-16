import React, { useState } from 'react'
import { Button, Table, Form, Col, Container, Row } from 'react-bootstrap'
const RuleConditionRows = ({onData}) => {
  const [conditions, setConditions] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectOperation, setSelectOperation] = useState('AND')
  const [isAddClicked, setIsAddClicked] = useState(false) 
  const handleAddConditionRow = () => {
    // Add a new empty condition object into the conditions array
    setConditions([...conditions, {}])
    setIsAddClicked(true) // Set the state variable to true
  }

  const handleChange = (index, field, value) => {
   // Update specific field value of a particular condition at given index
   let updatedConditions = [...conditions];
   if (field === 'locationValue' && value.includes('\n')) {
     // Split the pasted text by newline character and remove empty entries
     const newValueArray = value.split('\n').filter((val) => val.trim() !== '');
     updatedConditions[index][field] = newValueArray; // Store as an array
   } else {
     updatedConditions[index][field] = value;
   }
   setConditions(updatedConditions);
  }

  const handleSelectRow = (index) => {
    // Toggle selection status of row at given index
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index))
    } else {
      setSelectedRows([...selectedRows, index])
    }
  }

  const handleGroupSelected = () => {
    // Group selected rows into a new condition object with a nested array and a select operation
    if (selectedRows.length > 1) {
      let groupedConditions = []
      let groupedRows = []
      conditions.forEach((condition, index) => {
        if (selectedRows.includes(index)) {
          // Add selected rows to the nested array
          groupedRows.push(condition)
        } else {
          // Keep unselected rows as they are
          groupedConditions.push(condition)
        }
      })

      // Check if the nested array contains a group condition
      let hasGroup = groupedRows.some((row) => row.rows && row.selectOperation)

      if (hasGroup) {
        // Create a new group of group + single row
        let newGroup = { rows: [], selectOperation }
        groupedRows.forEach((row) => {
          if (row.rows && row.selectOperation) {
            // Add the group condition to the new group
            newGroup.rows.push(row)
          } else {
            // Check if the single row has a select operation
            if (row.selectOperation) {
              // Remove the select operation from the single row
              delete row.selectOperation
            }
            // Create a new group condition with the single row
            newGroup.rows.push({ ...row, selectOperation })
          }
        })
        // Add the new group condition to the grouped conditions array
        groupedConditions.push(newGroup)
      } else {
        // Add the new condition object with the nested array and the select operation
        groupedConditions.push({ rows: groupedRows, selectOperation })
      }

      // Update the conditions array and clear the selected rows
      setConditions(groupedConditions)
      setSelectedRows([])
    } else if (selectedRows.length === 1) {
      // Handle the case where only one row is selected with a group
      let selectedRow = conditions[selectedRows[0]]

      // Check if the selected row is already part of a group
      if (selectedRow.rows && selectedRow.selectOperation) {
        let updatedConditions = conditions.map((condition, index) => {
          if (index === selectedRows[0]) {
            // Remove the select operation from the single row
            return { ...condition, selectOperation: undefined }
          }
          return condition
        })
        setConditions(updatedConditions)
      } else {
        // Create a new group condition with the single row
        let newGroup = { rows: [{ ...selectedRow, selectOperation: undefined }], selectOperation }
        setConditions([...conditions.slice(0, selectedRows[0]), newGroup, ...conditions.slice(selectedRows[0] + 1)])
      }

      // Clear the selected rows
      setSelectedRows([])
    }
  }

  const handleUngroupSelected = () => {
    // Ungroup selected rows that have a nested array and a select operation
    let ungroupedConditions = []
    conditions.forEach((condition, index) => {
      if (selectedRows.includes(index) && condition.rows && condition.selectOperation) {
        // Add the nested rows to the ungrouped conditions array
        ungroupedConditions.push(...condition.rows)
      } else {
        // Keep other rows as they are
        ungroupedConditions.push(condition)
      }
    })
    // Update the conditions array and clear the selected rows
    setConditions(ungroupedConditions)
    setSelectedRows([])
  }

  const handleDeleteSelected = () => {
    // Delete selected rows from the conditions array
    let updatedConditions = conditions.filter((condition, index) => !selectedRows.includes(index))
    // Update the conditions array and clear the selected rows
    setConditions(updatedConditions)
    setSelectedRows([])
  }

  const handleSubmit = () => {
    // Check if there are any conditions added
    if (conditions.length === 0) {
      alert('Please add at least one condition.');
      return;
    }
    // Check if all conditions are filled and selectOperation is not empty
    const isFieldsFilled = conditions.every(condition => {
      if (!condition.source) {
        return false; // Source must be selected
      }
      if (condition.source === 'Request') {
        return condition.requestAttribute && condition.requestValue; // Request requires requestAttribute and value
      } else if (condition.source === 'Identity') {
        return condition.identityAttribute && condition.identityValue; // Identity requires identityAttribute and value
      } 
      // else if (condition.source === 'Location') {
      //   return condition.locationAttribute && condition.locationField && condition.locationValue; // Location requires locationAttribute, locationField, and value
      // }
      return true; // Other sources are considered filled
    });

    if (isFieldsFilled && selectOperation.trim() !== '') {
      // Call the format method and send the data to the parent component
      onData({ conditions: format(conditions, selectOperation) });
    } else {
      alert('Please fill in all fields in conditions and select an operation.');
    }
  }

  const format = (conditions, selectOperation) => {
    // Format the conditions array into a JSON object with the select operation and the rows
    let result = {}
    result[selectOperation] = conditions.map((condition) => {
      if (condition.rows && condition.selectOperation) {
        // Format the nested array and the select operation
        return format(condition.rows, condition.selectOperation)
      } else {
        // Format the normal condition object with the source, attribute, value, and field
        let obj = {}
        obj['Source'] = condition.source || '' // Send empty string if source is not selected
        if (condition.source === 'Request') {
          obj['attribute'] = condition.requestAttribute || '' // Send empty string if request attribute is not selected
          obj['value'] = condition.requestValue || '' // Send empty string if request value is not entered
        } else if (condition.source === 'Identity') {
          obj['attribute'] = condition.identityAttribute || '' // Send empty string if identity attribute is not selected
          obj['value'] = condition.identityValue || '' // Send empty string if identity value is not entered
        } else if (condition.source === 'Location') {
          obj['attribute'] = condition.locationAttribute || '' // Send empty string if location attribute is not selected
          obj['value'] = condition.locationValue || '' // Send empty string if location value is not entered
          obj['locationField'] = condition.locationField || '' // Send empty string if location field is not selected
        }
        return obj
      }
    })
    return result
  }

  const handleChangeInner = (index, i, field, value) => {
    // Update specific field value of a particular condition at given index and i within a nested array
    let updatedConditions = [...conditions]
    updatedConditions[index].rows[i][field] = value
    setConditions(updatedConditions)
  }

  const renderConditionRow = (condition, index, i, isGrouped = false, isInner = false) => {
    // Define a function to determine if the fields should be disabled
    const isDisabled = () => {
      // Add your condition here, for example, if you want to disable all inner fields
      // You can change this condition as per your requirement
      return isInner
    }

    // Render a single condition row based on the condition object and index
    return condition.rows && condition.selectOperation ? (
      // Render a grouped condition row with a nested table and a select operation
      <table style={{ border: '1px solid black', margin: '10px' }}>
        <tbody>
          <tr style={{ border: '1px solid black' }}>
            {!isInner && (
              <td>
                <input
                  type="checkbox"
                  checked={isGrouped ? condition.checked : selectedRows.includes(index)}
                  onChange={() => (isGrouped ? handleChangeInner(index, i, 'checked', !condition.checked) : handleSelectRow(index))}
                />
              </td>
            )}
            <td>
              <select
                value={condition.selectOperation}
                onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}
                disabled={isDisabled()} // Add the disabled attribute
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </td>
            <td>
              {condition.rows.map((row, i) => (
                <div key={i}>{renderConditionRow(row, index, i, true, true)}</div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      // Render a normal condition row with dropdowns and input
      <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
        {!isInner && (
          <input
            type="checkbox"
            checked={isGrouped ? condition.checked : selectedRows.includes(index)}
            onChange={() => (isGrouped ? handleChangeInner(index, i, 'checked', !condition.checked) : handleSelectRow(index))}
          />
        )}
        <select
          value={condition.source}
          onChange={(e) =>
            isGrouped ? handleChangeInner(index, i, 'source', e.target.value) : handleChange(index, 'source', e.target.value)
          }
          disabled={isDisabled()} // Add the disabled attribute
        >
          <option value="">Select Source</option>
          <option value="Request">Request</option>
          <option value="Identity">Identity</option>
          <option value="Location">Location</option>
        </select>
        {condition.source === 'Request' && (
          <div>
          <select
            value={condition.requestAttribute}
            onChange={(e) =>
              isGrouped
                ? handleChangeInner(index, i, 'requestAttribute', e.target.value)
                : handleChange(index, 'requestAttribute', e.target.value)
            }
            disabled={isDisabled()} // Add the disabled attribute
          >
            <option value="">Select Request Attribute</option>
            <option value="requestAttribute1">requestAttribute1</option>
            <option value="requestAttribute2">requestAttribute2</option>
          </select>
          <input
          type="text"
          value={condition.requestValue}
          onChange={(e) =>
            isGrouped ? handleChangeInner(index, i, 'requestValue', e.target.value) : handleChange(index, 'requestValue', e.target.value)
          }
          disabled={isDisabled()} // Add the disabled attribute
        />
          </div>
        )}

        {condition.source === 'Identity' && (
         <div>
         <select
            value={condition.identityAttribute}
            onChange={(e) =>
              isGrouped
                ? handleChangeInner(index, i, 'identityAttribute', e.target.value)
                : handleChange(index, 'identityAttribute', e.target.value)
            }
            disabled={isDisabled()} // Add the disabled attribute
          >
            <option value="">Select Identity Attribute</option>
            <option value="identityAttribute1">identityAttribute1</option>
            <option value="identityAttribute2">identityAttribute2</option>
          </select>
          <input
          type="text"
          value={condition.identityValue}
          onChange={(e) =>
            isGrouped ? handleChangeInner(index, i, 'identityValue', e.target.value) : handleChange(index, 'identityValue', e.target.value)
          }
          disabled={isDisabled()} // Add the disabled attribute
        />
          </div>
        )}
        {condition.source === 'Location' && (
          <div>
            <select
              value={condition.locationAttribute}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(index, i, 'locationAttribute', e.target.value)
                  : handleChange(index, 'locationAttribute', e.target.value)
              }
              disabled={isDisabled()} // Add the disabled attribute
            >
              <option value="">Select Location Attribute</option>
              <option value="locationAttribute1">locationAttribute1</option>
              <option value="locationAttribute2">locationAttribute2</option>
            </select>
            <select
              value={condition.locationField}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(index, i, 'locationField', e.target.value)
                  : handleChange(index, 'locationField', e.target.value)
              }
              disabled={isDisabled()} // Add the disabled attribute
            >
              <option value="">Select Location Field</option>
              <option value="locationField1">locationField1</option>
              <option value="locationField2">locationField2</option>
            </select>
            <textArea
              type="text"
              value={condition.locationValue}
              onChange={(e) =>
                isGrouped ? handleChangeInner(index, i, 'locationValue', e.target.value) : handleChange(index, 'locationValue', e.target.value)
              }
              disabled={isDisabled()} // Add the disabled attribute
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="col-md-12 pad-1 card-rounded">
      <button onClick={handleAddConditionRow}>Add Condition Row</button>
      {isAddClicked ? (
        <table style={{ border: '1px solid black' }}>
          <tbody>
            <tr style={{ border: '1px solid black' }}>
              <td>
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
      ) : null}
      <button style={{ backgroundColor: 'lightblue', color: 'white', margin: '5px' }} onClick={handleGroupSelected}>
        Group Selected
      </button>
      <button style={{ backgroundColor: 'lightblue', color: 'white', margin: '5px' }} onClick={handleUngroupSelected}>
        Un-group Selected
      </button>
      <button style={{ backgroundColor: 'lightblue', color: 'white', margin: '5px' }} onClick={handleDeleteSelected}>
        Delete Selected
      </button>
      <button style={{ backgroundColor: 'lightblue', color: 'white', margin: '5px' }} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  )
}

export default RuleConditionRows
