import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { searchApps, loadUsers } from './api.js';

const MyComponent = (props) => {
  const [category, setCategory] = useState('');
  const [carId, setCarId] = useState('');
  const [ruleOwner, setRuleOwner] = useState('');
  const [carIdSuggestions, setCarIdSuggestions] = useState([]);
  const [ruleOwnerSuggestions, setRuleOwnerSuggestions] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const dispatch = useDispatch();
  const appsSearchList = useSelector(getSearchedApps);
  const usersList = useSelector(getUsers);

  useEffect(() => {
    setLoadingApps(!!appsSearchList.data);
  }, [appsSearchList.data]);

  useEffect(() => {
    setLoadingUsers(!!usersList.data);
  }, [usersList.data]);

  useEffect(() => {
    if (appsSearchList.data) {
      setCarIdSuggestions(appsSearchList.data);
    }
  }, [appsSearchList.data]);

  useEffect(() => {
    if (usersList.data) {
      setRuleOwnerSuggestions(usersList.data);
    }
  }, [usersList.data]);

  const handleCategoryChange = useCallback(
    (e) => {
      const selectedCategory = e.target.value;
      setCategory(selectedCategory);
      if (selectedCategory === 'Organizational Policies') {
        setRuleOwner('Patrick Jeniffer');
      }
      props.onCategoryChange(selectedCategory); // pass the category value to the parent component
    },
    [props]
  );

  const handleCarIdChange = useCallback(
    async (e) => {
      const input = e.target.value;
      setCarId(input);
      try {
        setLoadingApps(true); // Start loading
        await dispatch(searchApps(input));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingApps(false); // Finish loading
      }
    },
    [dispatch]
  );

  const handleCarIdSelect = useCallback(
    (app) => {
      setCarId(`${app.applName} (${app.applId})`);
      setCarIdSuggestions([]);
      if (category === 'Application Policies') {
        setRuleOwner(app.techOwnerFullName);
      }
      props.onCarIdSelect(app); // pass the selected app object to the parent component
    },
    [category, props]
  );

  const handleCarIdClear = useCallback(() => {
    setCarId('');
    setRuleOwner('');
    setCarIdSuggestions([]);
    props.onCarIdClear(); // notify the parent component that the car id is cleared
  }, [props]);

  const handleRuleOwnerChange = useCallback(
    async (e) => {
      const input = e.target.value;
      setRuleOwner(input);
      try {
        setLoadingUsers(true); // Start loading
        await dispatch(loadUsers(input));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUsers(false); // Finish loading
      }
    },
    [dispatch]
  );

  const handleRuleOwnerClear = useCallback(() => {
    setRuleOwner('');
    setRuleOwnerSuggestions([]);
    props.onRuleOwnerClear(); // notify the parent component that the rule owner is cleared
  }, [props]);

  return (
    <>
      <label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
        Category
        <select
          value={category}
          onChange={handleCategoryChange}
          style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
        >
          <option value="">--Select--</option>
          <option value="Application Policies">Application Policies</option>
          <option value="Organizational Policies">Organizational Policies</option>
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
        Car ID
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={carId}
            onChange={handleCarIdChange}
            placeholder="Search by name or ID and select"
            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          {loadingApps && <div className="spinner"></div>}
          {carId && (
            <div style={{ marginLeft: '5px', border: '1px solid blue', borderRadius: '5px', padding: '5px' }}>
              {carId}
              <button onClick={handleCarIdClear} style={{ marginLeft: '5px', cursor: 'pointer' }}>X</button>
            </div>
          )}
        </div>
        {carIdSuggestions.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            {carIdSuggestions.map((app) => (
              <li
                key={app.applId}
                onClick={() => handleCarIdSelect(app)}
                style={{ padding: '10px', cursor: 'pointer' }}
              >
                {app.applName} ({app.applId}) - {app.techOwnerFullName}
              </li>
            ))}
          </ul>
        )}
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
        Rule Owner
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={ruleOwner}
            onChange={handleRuleOwnerChange}
            placeholder="Search by Owner Name"
            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          {loadingUsers && <div className="spinner"></div>}
          {ruleOwner && (
            <div style={{ marginLeft: '5px', border: '1px solid blue', borderRadius: '5px', padding: '5px' }}>
              {ruleOwner}
              <button onClick={handleRuleOwnerClear} style={{ marginLeft: '5px', cursor: 'pointer' }}>X</button>
            </div>
          )}
        </div>
        {ruleOwnerSuggestions.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}>
            {ruleOwnerSuggestions.map((user) => (
              <li key={user.applId} style={{ padding: '10px', cursor: 'pointer' }}>
                {user.techOwnerFullName} 
              </li>
            ))}
          </ul>
        )}
      </label>
    </>
  )
}

export default MyComponent;
