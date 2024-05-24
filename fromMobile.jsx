import React, { useState } from 'react';
import { Button, Table, Form, Col, Container, Row } from 'react-bootstrap';

const RuleConditionRows = ({ onData }) => {
  const [conditions, setConditions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOperation, setSelectOperation] = useState('AND');
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleAddConditionRow = () => {
    setConditions([...conditions, {}]);
    setIsAddClicked(true);
    setIsSubmitDisabled(false);
  };

  const handleChange = (index, field, value) => {
    let updatedConditions = [...conditions];
    if (field === 'locationValue' && value.includes('\n')) {
      const newValueArray = value.split('\n').filter((val) => val.trim() !== '');
      updatedConditions[index][field] = newValueArray;
    } else {
      updatedConditions[index][field] = value;
    }
    setConditions(updatedConditions);
    setIsSubmitDisabled(false);
  };

  const handleSelectRow = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleGroupSelected = () => {
    if (selectedRows.length > 1) {
      let groupedConditions = [];
      let groupedRows = [];
      conditions.forEach((condition, index) => {
        if (selectedRows.includes(index)) {
          groupedRows.push(condition);
        } else {
          groupedConditions.push(condition);
        }
      });

      let hasGroup = groupedRows.some((row) => row.rows && row.selectOperation);

      if (hasGroup) {
        let newGroup = { rows: [], selectOperation };
        groupedRows.forEach((row) => {
          if (row.rows && row.selectOperation) {
            newGroup.rows.push(row);
          } else {
            if (row.selectOperation) {
              delete row.selectOperation;
            }
            newGroup.rows.push({ ...row, selectOperation });
          }
        });
        groupedConditions.push(newGroup);
      } else {
        groupedConditions.push({ rows: groupedRows, selectOperation });
      }

      setConditions(groupedConditions);
      setSelectedRows([]);
    } else if (selectedRows.length === 1) {
      let selectedRow = conditions[selectedRows[0]];

      if (selectedRow.rows && selectedRow.selectOperation) {
        let updatedConditions = conditions.map((condition, index) => {
          if (index === selectedRows[0]) {
            return { ...condition, selectOperation: undefined };
          }
          return condition;
        });
        setConditions(updatedConditions);
      } else {
        let newGroup = { rows: [{ ...selectedRow, selectOperation: undefined }], selectOperation };
        setConditions([...conditions.slice(0, selectedRows[0]), newGroup, ...conditions.slice(selectedRows[0] + 1)]);
      }

      setSelectedRows([]);
    }
  };

  const handleUngroupSelected = () => {
    let ungroupedConditions = [];
    conditions.forEach((condition, index) => {
      if (selectedRows.includes(index) && condition.rows && condition.selectOperation) {
        ungroupedConditions.push(...condition.rows);
      } else {
        ungroupedConditions.push(condition);
      }
    });
    setConditions(ungroupedConditions);
    setSelectedRows([]);
  };

  const handleDeleteSelected = () => {
    let updatedConditions = conditions.filter((condition, index) => !selectedRows.includes(index));
    setConditions(updatedConditions);
    setSelectedRows([]);
  };

  const handleSubmit = () => {
    if (conditions.length === 0) {
      alert('Please add at least one condition.');
      return;
    }
    const isFieldsFilled = conditions.every((condition) => {
      if (!condition.source) {
        return false;
      }
      if (condition.source === 'Request') {
        return condition.requestAttribute && condition.requestValue;
      } else if (condition.source === 'Identity') {
        return condition.identityAttribute && condition.identityValue;
      }
      return true;
    });

    if (isFieldsFilled && selectOperation.trim() !== '') {
      onData({ conditions: format(conditions, selectOperation) });
      setIsSubmitDisabled(true);
    } else {
      alert('Please fill in all fields in conditions and select an operation.');
    }
  };

  const format = (conditions, selectOperation) => {
    let result = {};
    result[selectOperation] = conditions.map((condition) => {
      if (condition.rows && condition.selectOperation) {
        return format(condition.rows, condition.selectOperation);
      } else {
        let obj = {};
        obj['Source'] = condition.source || '';
        if (condition.source === 'Request') {
          obj['attribute'] = condition.requestAttribute || '';
          obj['value'] = condition.requestValue || '';
        } else if (condition.source === 'Identity') {
          obj['attribute'] = condition.identityAttribute || '';
          obj['value'] = condition.identityValue || '';
        } else if (condition.source === 'Location') {
          obj['attribute'] = condition.locationAttribute || '';
          obj['value'] = condition.locationValue || '';
          obj['locationField'] = condition.locationField || '';
        }
        return obj;
      }
    });
    return result;
  };

  const handleChangeInner = (index, i, field, value) => {
    let updatedConditions = [...conditions];
    updatedConditions[index].rows[i][field] = value;
    setConditions(updatedConditions);
    setIsSubmitDisabled(false);
  };

  const renderConditionRow = (condition, index, i, isGrouped = false, isInner = false, level = 1) => {
    const isDisabled = (level) => {
      return level > 3;
    };

    return condition.rows && condition.selectOperation ? (
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
                disabled={isDisabled(level)}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </td>
            <td>
              {condition.rows.map((row, i) => (
                <div key={i}>{renderConditionRow(row, index, i, true, true, level + 1)}</div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
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
          onChange={(e) => (isGrouped ? handleChangeInner(index, i, 'source', e.target.value) : handleChange(index, 'source', e.target.value))}
          disabled={isDisabled(level)}
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
                isGrouped ? handleChangeInner(index, i, 'requestAttribute', e.target.value) : handleChange(index, 'requestAttribute', e.target.value)
              }
              disabled={isDisabled(level)}
            >
              <option value="">Select Request Attribute</option>
              <option value="requestAttribute1">requestAttribute1</option>
              <option value="requestAttribute2">requestAttribute2</option>
            </select>
            <input
              type="text"
              value={condition.requestValue}
              onChange={(e) => (isGrouped ? handleChangeInner(index, i, 'requestValue', e.target.value) : handleChange(index, 'requestValue', e.target.value))}
              disabled={isDisabled(level)}
            />
          </div>
        )}

        {condition.source === 'Identity' && (
          <div>
            <select
              value={condition.identityAttribute}
              onChange={(e) =>
                isGrouped ? handleChangeInner(index, i, 'identityAttribute', e.target.value) : handleChange(index, 'identityAttribute', e.target.value)
              }
              disabled={isDisabled(level)}





>
              <option value="">Select Identity Attribute</option>
              <option value="identityAttribute1">identityAttribute1</option>
              <option value="identityAttribute2">identityAttribute2</option>
            </select>
            <input
              type="text"
              value={condition.identityValue}
              onChange={(e) => (isGrouped ? handleChangeInner(index, i, 'identityValue', e.target.value) : handleChange(index, 'identityValue', e.target.value))}
              disabled={isDisabled(level)}
            />
          </div>
        )}
        {condition.source === 'Location' && (
          <div>
            <select
              value={condition.locationAttribute}
              onChange={(e) =>
                isGrouped ? handleChangeInner(index, i, 'locationAttribute', e.target.value) : handleChange(index, 'locationAttribute', e.target.value)
              }
              disabled={isDisabled(level)}
            >
              <option value="">Select Location Attribute</option>
              <option value="locationAttribute1">locationAttribute1</option>
              <option value="locationAttribute2">locationAttribute2</option>
            </select>
            <select
              value={condition.locationField}
              onChange={(e) =>
                isGrouped ? handleChangeInner(index, i, 'locationField', e.target.value) : handleChange(index, 'locationField', e.target.value)
              }
              disabled={isDisabled(level)}
            >
              <option value="">Select Location Field</option>
              <option value="locationField1">locationField1</option>
              <option value="locationField2">locationField2</option>
            </select>
            <textarea
              value={condition.locationValue}
              onChange={(e) =>
                isGrouped ? handleChangeInner(index, i, 'locationValue', e.target.value) : handleChange(index, 'locationValue', e.target.value)
              }
              disabled={isDisabled(level)}
            />
          </div>
        )}
      </div>
    );
  };

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
      <button style={{ backgroundColor: 'lightblue', color: 'white', margin: '5px' }} onClick={handleSubmit} disabled={isSubmitDisabled}>
        Submit
      </button>
    </div>
  );
};

export default RuleConditionRows;