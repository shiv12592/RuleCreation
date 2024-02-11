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
  const [searching, setSearching] = useState(false);

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
        setRuleOwnerSuggestions([]); // Clear suggestions as the search box is disabled
      }
      props.onCategoryChange(selectedCategory);
    },
    [props]
  );

  const handleCarIdChange = useCallback(
    debounce(async (e) => {
      const input = e.target.value;
      setCarId(input);
      setSearching(true);
      try {
        await dispatch(searchApps(input));
      } catch (error) {
        console.error(error);
      }
      setSearching(false);
    }, 300),
    [dispatch]
  );

  const handleCarIdSelect = useCallback(
    (app) => {
      setCarId(`${app.applName} (${app.applId})`);
      setCarIdSuggestions([]);
      if (category === 'Application Policies') {
        setRuleOwner(app.techOwnerFullName);
      }
      props.onCarIdSelect(app);
    },
    [category, props]
  );

  const handleCarIdClear = useCallback(() => {
    setCarId('');
    setRuleOwner('');
    setCarIdSuggestions([]);
    props.onCarIdClear();
  }, [props]);

  const handleRuleOwnerChange = useCallback(
    debounce(async (e) => {
      const input = e.target.value;
      setRuleOwner(input);
      setSearching(true);
      try {
        await dispatch(loadUsers(input));
      } catch (error) {
        console.error(error);
      }
      setSearching(false);
    }, 300),
    [dispatch]
  );

  const handleRuleOwnerClear = useCallback(() => {
    setRuleOwner('');
    setRuleOwnerSuggestions([]);
    props.onRuleOwnerClear();
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
            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px', width: '200px' }}
            disabled={category === 'Organizational Policies'}
          />
          {searching && <CircularProgress style={{ marginLeft: '5px' }} />}
          {carId && (
            <button
              onClick={handleCarIdClear}
              style={{
                marginLeft: '5px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              X
            </button>
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
            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px', width: '200px' }}
            disabled={category === 'Organizational Policies'}
          />
          {searching && <CircularProgress style={{ marginLeft: '5px' }} />}
          {ruleOwner && (
            <button
              onClick={handleRuleOwnerClear}
              style={{
                marginLeft: '5px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              X
            </button>
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
              borderRadius: '5px',
            }}
          >
            {ruleOwnerSuggestions.map((user) => (
              <li
                key={user.applId}
                style={{ padding: '10px', cursor: 'pointer' }}
              >
                {user.techOwnerFullName}
              </li>
            ))}
          </ul>
        )}
      </label>

      {category === 'Organizational Policies' && ruleOwner && (
        <label style={{ display: 'flex', flexDirection: 'column', margin: '10px', border: '2px solid blue', borderRadius: '5px', padding: '5px' }}>
          Selected Rule Owner: {ruleOwner}
        </label>
      )}
    </>
  );
};

export default MyComponent;
