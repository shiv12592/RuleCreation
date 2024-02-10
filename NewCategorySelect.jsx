import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { searchApps, loadUsers } from './api.js';

const MyComponent = (props) => {
  const [category, setCategory] = useState('');
  const [carId, setCarId] = useState('');
  const [ruleOwner, setRuleOwner] = useState('');
  const [carIdSuggestions, setCarIdSuggestions] = useState([]);
  const [ruleOwnerSuggestions, setRuleOwnerSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const appsSearchList = useSelector(getSearchedApps);
  const usersList = useSelector(getUsers);

  useEffect(() => {
    // update the loading state based on the appsSearchList status
    if (appsSearchList.status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [appsSearchList.status]);

  useEffect(() => {
    // update the loading state based on the usersList status
    if (usersList.status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [usersList.status]);

  useEffect(() => {
    if (appsSearchList.data) {
      setState((prevState) => ({
        ...prevState,
        appSearchList: appsSearchList.data,
      }));
    }
  }, [appsSearchList]);

  const handleCategoryChange = useCallback(
    (e) => {
      setCategory(e.target.value);
      if (e.target.value === 'Organizational Policies') {
        setRuleOwner('Patrick Jeniffer');
      }
      props.onCategoryChange(e.target.value); // pass the category value to the parent component
    },
    [props]
  );

  const handleCarIdChange = useCallback(
    async (e) => {
      const input = e.target.value;
      setCarId(input);
      try {
        await dispatch(searchApps(input));
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, carId]
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
    setCarIdSuggestions([]);
    setRuleOwner('');
    props.onCarIdClear(); // notify the parent component that the car id is cleared
  }, [props]);

  const handleRuleOwnerChange = useCallback(
    async (e) => {
      const input = e.target.value;
      setRuleOwner(input);
      try {
        await dispatch(loadUsers(input));
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, ruleOwner]
  );

  const handleRuleOwnerSelect = useCallback(
    (user) => {
      setRuleOwner(user.techOwnerFullName);
      setRuleOwnerSuggestions([]);
      props.onRuleOwnerSelect(user); // pass the selected user object to the parent component
    },
    [props]
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
          {loading && <span style={{ marginLeft: '5px' }}>Loading...</span>}
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
          {appsSearchList.data.map((app) => (
            <li
              key={app.applId}
              onClick={() => handleCarIdSelect(app)}
              style={{ padding: '10px', cursor: 'pointer' }}
            >
              {app.applName} ({app.applId}) - {app.techOwnerFullName}
            </li>
          ))}
        </ul>
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
          {loading && <span style={{ marginLeft: '5px' }}>Loading...</span>}
          {ruleOwner && (
            <button
              onClick={handleRuleOwnerClear}
              style={{
                marginLeft:
                  '5px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
              X
            </button>
          )}
        </div>
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
            <li key={user.ecn} onClick={() => handleRuleOwnerSelect(user)} style={{ padding: '10px', cursor: 'pointer' }}>
              {user.techOwnerFullName} ({user.ecn}) - {user.managerName} ({user.managerEcn})
            </li>
          ))}
        </ul>
      </label>
    </>
  )
}

export default MyComponent
