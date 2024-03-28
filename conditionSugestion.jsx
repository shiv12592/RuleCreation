import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchApps } from 'path/to/your/actions'; // Import your action creator for searching apps
import { getSearchedApps } from 'path/to/your/selectors'; // Import your selector for searched apps
import debounce from 'lodash/debounce'; // Import lodash debounce for input debouncing

const RuleConditionRows = () => {
  const dispatch = useDispatch();
  const appSearchList = useSelector(getSearchedApps);
  const [conditions, setConditions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOperation, setSelectOperation] = useState('AND');
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [locationValues, setLocationValues] = useState([]);
  const [inputRequestText, setInputRequestText] = useState('');
  const [showRequestSuggestions, setShowRequestSuggestions] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const handleAddConditionRow = () => {
    setConditions([...conditions, { source: 'Request', requestAttribute: '', value: '' }]);
    setIsAddClicked(true);
  };

  const handleChange = (index, field, value) => {
    let updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };

  const handleRequestInputChange = (e) => {
    setInputRequestText(e.target.value);
    debounceRequestInputChange(e.target.value);
  };

  const debounceRequestInputChange = useCallback(
    debounce((value) => {
      setIsRequestLoading(true);
      dispatch(searchApps(value)).then(() => {
        setIsRequestLoading(false);
        setShowRequestSuggestions(value !== '');
      });
    }, 300),
    []
  );

  const handleRequestSelection = (app) => {
    setInputRequestText('');
    setShowRequestSuggestions(false);
    handleChange(index, 'value', app.applId); // Assuming 'index' is the index of the "Request" row
  };

  const handleClearRequest = () => {
    setInputRequestText('');
    handleChange(index, 'value', ''); // Assuming 'index' is the index of the "Request" row
  };

  const renderConditionRow = (condition, index, i, isGrouped = false, isInner = false) => {
    // Your existing code for rendering condition rows
  };

  return (
    <div className="col-md-12 pad-1 card-rounded">
      <button onClick={handleAddConditionRow}>Add Condition Row</button>
      {isAddClicked ? (
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
      ) : null}
      <button style={{ backgroundColor: 'lightblue', color: 'white', margin: '5px' }} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default RuleConditionRows;



----------------------------



const renderConditionRow = (condition, index, i, isGrouped = false, isInner = false) => {
  // Define a function to determine if the fields should be disabled
  const isDisabled = () => {
    // Add your condition here, for example, if you want to disable all inner fields
    // You can change this condition as per your requirement
    return isInner;
  };

  // Render a single condition row based on the condition object and index
  return condition.rows && condition.selectOperation ? (
    // Render a grouped condition row with a nested table and a select operation
    <table style={{ border: '1px solid black', margin: '10px' }}>
      <tbody>
        {/* Render other grouped condition row elements */}
      </tbody>
    </table>
  ) : (
    // Render a normal condition row with dropdowns and input
    <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
      {/* Render other normal condition row elements */}
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
            {/* Add options for request attributes */}
            <option value="requestAttribute1">Request Attribute 1</option>
            <option value="requestAttribute2">Request Attribute 2</option>
          </select>
          <input
            type="text"
            value={inputRequestText}
            onChange={handleRequestInputChange}
            onBlur={() => setShowRequestSuggestions(false)}
            disabled={isDisabled()} // Add the disabled attribute
          />
          {showRequestSuggestions && (
            <ul>
              {appSearchList.map((app) => (
                <li key={app.applId} onClick={() => handleRequestSelection(app)}>
                  {app.applId}
                </li>
              ))}
            </ul>
          )}
          {condition.value && (
            <div>
              Selected Value: {condition.value}
              <button onClick={handleClearRequest}>Clear</button>
            </div>
          )}
        </div>
      )}
      {/* Render other condition row elements based on different sources */}
    </div>
  );
};
