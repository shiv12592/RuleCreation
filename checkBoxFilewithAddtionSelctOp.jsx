import React, { useState } from 'react'

const RuleConditionRows = () => {
  // initial state for the conditions which holds all data after submit
  const [conditions, setConditions] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectOperation, setSelectOperation] = useState('AND')

  const handleAddConditionRow = () => {
    // Add a new condition row with default values
    setConditions((prevConditions) => [
      ...prevConditions,
      {
        source: 'select',
        identityAttribute: 'select',
        requestAttribute: 'select',
        locationAttribute: 'select',
        value: ''
      }
    ])
  }

  const handleChange = (index, field, value) => {
    // Update the condition row with the given index, field and value
    setConditions((prevConditions) =>
      prevConditions.map((condition, i) => {
        if (i === index) {
          return { ...condition, [field]: value }
        } else {
          return condition
        }
      })
    )
  }

  const handleSelectRow = (index) => {
    // Toggle the selection of the condition row with the given index
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((i) => i !== index)
      } else {
        return [...prevSelectedRows, index]
      }
    })
  }

  const handleGroupSelected = () => {
    // Group selected conditions
    const groupedCondition = {
      selectOperation: 'AND',
      conditions: selectedRows.map((index) => conditions[index])
    }

    setConditions((prevConditions) => [...prevConditions.filter((_, index) => !selectedRows.includes(index)), groupedCondition])

    setSelectedRows([])
  }

  const handleUngroupSelected = () => {
    // Ungroup selected grouped condition
    if (selectedRows.length === 1) {
      const ungroupedConditions = conditions[selectedRows[0]].conditions

      setConditions((prevConditions) => [...prevConditions.filter((_, index) => index !== selectedRows[0]), ...ungroupedConditions])

      setSelectedRows([])
    }
  }

  const handleDeleteSelected = () => {
    // Delete selected conditions or groups
    setConditions((prevConditions) => prevConditions.filter((_, index) => !selectedRows.includes(index)))

    setSelectedRows([])
  }

  const handleSubmit = () => {
    console.log(JSON.stringify({ [selectOperation]: conditions }, null, 2))
    // Implement further actions as needed for submission of data.
  }

  const renderConditionRow = (condition, index, isGrouped = false) => {
    // Render a single condition row based on the condition object and index
    return (
      <div key={index} style={{ border: '1px solid #000', padding: 10 }}>
        {!isGrouped && <input type="checkbox" checked={selectedRows.includes(index)} onChange={() => handleSelectRow(index)} />}
        {condition.selectOperation ? (
          // Render a grouped condition row with a nested table
          <div>
            <label>Select Operation</label>
            <select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
            <table>
              <tbody>
                {condition.conditions.map((subCondition, subIndex) => (
                  <tr key={subIndex}>
                    <td>{renderConditionRow(subCondition, subIndex, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Render a normal condition row with dropdowns and input
          <div>
            <label>Source</label>
            <select value={condition.source} onChange={(e) => handleChange(index, 'source', e.target.value)}>
              <option value="select">select</option>
              <option value="Request">Request</option>
              <option value="Identity">Identity</option>
              <option value="Location">Location</option>
            </select>
            {condition.source === 'Request' && (
              <div>
                <label>Request Attribute</label>
                <select value={condition.requestAttribute} onChange={(e) => handleChange(index, 'requestAttribute', e.target.value)}>
                  <option value="select">select</option>
                  <option value="requestAttribute1">requestAttribute1</option>
                  <option value="requestAttribute2">requestAttribute2</option>
                </select>
              </div>
            )}
            {condition.source === 'Identity' && (
              <div>
                <label>Identity Attribute</label>
                <select value={condition.identityAttribute} onChange={(e) => handleChange(index, 'identityAttribute', e.target.value)}>
                  <option value="select">select</option>
                  <option value="identityAttribute1">identityAttribute1</option>
                  <option value="identityAttribute2">identityAttribute2</option>
                </select>
              </div>
            )}
            {condition.source === 'Location' && (
              <div>
                <label>Location Attribute</label>
                <select value={condition.locationAttribute} onChange={(e) => handleChange(index, 'locationAttribute', e.target.value)}>
                  <option value="select">select</option>
                  <option value="locationAttribute1">locationAttribute1</option>
                  <option value="locationAttribute2">locationAttribute2</option>
                </select>
              </div>
            )}
            <label>Value</label>
            <input type="text" value={condition.value} onChange={(e) => handleChange(index, 'value', e.target.value)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="col-md-12 pad-1 card-rounded">
      <button onClick={handleAddConditionRow}>Add Condition Row</button>
      <table>
        <tbody>
          <tr>
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
