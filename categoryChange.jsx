import React, { useState } from 'react'

const MyComponent = (props) => {
  const [category, setCategory] = useState('')
  const [carId, setCarId] = useState('')
  const [ruleOwner, setRuleOwner] = useState('')
  const [carIdSuggestions, setCarIdSuggestions] = useState([])
  const [ruleOwnerSuggestions, setRuleOwnerSuggestions] = useState([])

  const appsSearchList = [
    // ... (your appsSearchList data)
    {
      applId: '373266400',
      applName: 'REJECTED PAYABLES APPLICATION',
      techOwnerFullName: 'Dion Huntington'
    },
    {
      applId: '500000810',

      applName: 'Acquisition Business Card application pages hosted on AMS',
      techOwnerFullName: 'Philip J Lundrigan'
    },
    {
      applId: '151358770',
      applName: 'PLACEHOLDER APPLICATION 52 DO NOT USE'
    },
    {
      applId: '373266068',
      applName: 'Client Information Applications',
      techOwnerFullName: 'Roswell Fagg'
    },
    {
      applId: '151358762',
      applName: 'PLACEHOLDER APPLICATION 50 DO NOT USE'
    },
    {
      applId: '151358850',
      applName: 'PLACEHOLDER APPLICATION 72 DO NOT USE'
    },
    {
      applid: '373266458',
      applName: 'CUSTOMER FOCUSED SALES APPLICATION INTERNATIONAL'
    },
    {
      applId: '600001296',
      applName: 'Fraud Application Strategy Capabilities',
      techOwnerFullName: 'Nidhi K Агора mitialState'
    }
  ]

  const usersList = [
    // ... (your usersList data)
    {
      email: 'Shivshankar.KailasJayswal@aexp.com',
      ecn: '07043281',
      techOwnerFullName: 'Shivshankar Jayswal',
      managerName: 'Patrick Jenifer',
      managerEcn: '0118748'
    },
    {
      email: 'SHIVSINGH.RANA@aexp.com',
      ecn: '6577465',
      techOwnerFullName: 'SHIVSINGH RANA',
      managerName: 'Tarun Nohla',
      managerEcn: '6098757'
    },
    {
      email: 'Shivshankar.Reddy1@aexp.com',
      ecn: '7115091',
      techOwnerFullName: 'Shivshankar Reddy',
      managerName: 'HIMANSHU BHATT',
      managerEcn: '6488506'
    }
  ]

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    if (e.target.value === 'Organizational Policies') {
      setRuleOwner('Patrick Jeniffer')
    }
    props.onCategoryChange(e.target.value) // pass the category value to the parent component
  }

  const handleCarIdChange = (e) => {
    let input = e.target.value
    setCarId(input)
    let suggestions = appsSearchList.filter((app) => app.applName.toLowerCase().includes(input.toLowerCase()))
    setCarIdSuggestions(suggestions)
  }

  const handleCarIdSelect = (app) => {
    setCarId(`${app.applName} (${app.applId})`)
    setCarIdSuggestions([])
    if (category === 'Application Policies') {
      setRuleOwner(app.techOwnerFullName)
    }
    props.onCarIdSelect(app) // pass the selected app object to the parent component
  }

  const handleCarIdClear = () => {
    setCarId('')
    setCarIdSuggestions([])
    setRuleOwner('')
    props.onCarIdClear() // notify the parent component that the car id is cleared
  }

  const handleRuleOwnerChange = (e) => {
    let input = e.target.value
    setRuleOwner(input)
    let suggestions = usersList.filter((user) => user.techOwnerFullName.toLowerCase().includes(input.toLowerCase()))
    setRuleOwnerSuggestions(suggestions)
  }

  const handleRuleOwnerSelect = (user) => {
    setRuleOwner(user.techOwnerFullName)
    setRuleOwnerSuggestions([])
    props.onRuleOwnerSelect(user) // pass the selected user object to the parent component
  }

  const handleRuleOwnerClear = () => {
    setRuleOwner('')
    setRuleOwnerSuggestions([])
    props.onRuleOwnerClear() // notify the parent component that the rule owner is cleared
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
      <label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
        Category
        <select value={category} onChange={handleCategoryChange} style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
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
          {carId && (
            <button
              onClick={handleCarIdClear}
              style={{ marginLeft: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
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
          {carIdSuggestions.map((app) => (
            <li key={app.applId} onClick={() => handleCarIdSelect(app)} style={{ padding: '10px', cursor: 'pointer' }}>
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
          {ruleOwner && (
            <button
              onClick={handleRuleOwnerClear}
              style={{ marginLeft: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
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
    </div>
  )
}

export default MyComponent

//////////parent/////////////
import React from 'react';
import MyComponent from './MyComponent';

const ParentComponent = () => {
  const handleCategoryChange = (value) => {
    // do something with the category value
    console.log(value);
  };

  const handleCarIdSelect = (app) => {
    // do something with the selected app object
    console.log(app);
  };

  const handleCarIdClear = () => {
    // do something when the car id is cleared
    console.log('Car ID cleared');
  };

  const handleRuleOwnerSelect = (user) => {
    // do something with the selected user object
    console.log(user);
  };

  const handleRuleOwnerClear = () => {
    // do something when the rule owner is cleared
    console.log('Rule Owner cleared');
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <MyComponent 
        onCategoryChange={handleCategoryChange}
        onCarIdSelect={handleCarIdSelect}
        onCarIdClear={handleCarIdClear}
        onRuleOwnerSelect={handleRuleOwnerSelect}
        onRuleOwnerClear={handleRuleOwnerClear}
      />
    </div>
  );
};

export default ParentComponent;
