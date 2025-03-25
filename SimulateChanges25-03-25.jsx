// src/components/CreateRule.jsx
import React, { useState } from 'react';
import NewWindow from 'react-new-window';
import SimulationPopUp from './SimulationPopUp';
import RuleConditionRows from './RuleConditionRows';

function CreateRule() {
  // Hold the condition JSON produced by RuleConditionRows
  const [conditionData, setConditionData] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);

  // Callback to receive JSON data from RuleConditionRows
  const handleConditionData = (data) => {
    setConditionData(data);
  };

  const handleSimulate = () => {
    // When simulate is clicked, open the SimulationPopUp.
    // If no data has been produced yet, you can provide a default.
    setShowSimulation(true);
  };

  return (
    <div>
      <h1>Create Rule Page</h1>
      {/* Render the condition builder above the buttons */}
      <div className="container">
        <RuleConditionRows onData={handleConditionData} />
      </div>

      {conditionData && (
  <div>
    <h5>JSON Data:</h5>
    <pre>{JSON.stringify(conditionData, null, 2)}</pre>
  </div>
)}
      <button onClick={handleSimulate} style={{ marginRight: '8px' }}>
        Simulate
      </button>
      <button>Save</button>
      <button>Create Rule</button>
      <button>Execute</button>

      {/* Render SimulationPopUp in a new window */}
      {showSimulation && (
        <NewWindow
          title="Simulation Popup"
          onUnload={() => setShowSimulation(false)}
          features={{ width: 800, height: 600 }}
          onOpen={(win) => {
            // Inject the SimulationPopUp CSS into the new window.
            const link = win.document.createElement('link');
            link.rel = 'stylesheet';
            // Adjust the path as needed so the CSS is accessible from the new window.
            link.href = '/SimulationPopUp.css';
            win.document.head.appendChild(link);
          }}
        >
          <SimulationPopUp
            isOpen={true}
            onClose={() => setShowSimulation(false)}
            // Pass the produced condition JSON (or a default)
            condition={conditionData || { ecn: 'someEcnValue', simulate: true }}
          />
        </NewWindow>
      )}
    </div>
  );
}

export default CreateRule;



// src/components/SimulationPopUp.jsx
import React, { useState, useEffect } from 'react';
import './SimulationPopUp.css';
import {
  simulateCounts,
  simulateResults,
  simulateResultsExport,
} from '../store/actionCreators';

function SimulationPopUp({ isOpen, onClose, condition }) {
  const [countsData, setCountsData] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Changes');
  const [resultList, setResultList] = useState([]);
  const [filters, setFilters] = useState({
    entitlementName: '',
    userName: '',
    empIdOrExtNumber: '',
    lastName: '',
    ruleScript: '',
  });
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1); // assume backend returns total pages

  // Load summary counts when pop-up opens
  useEffect(() => {
    if (isOpen) {
      fetchSimulateCounts();
    }
  }, [isOpen]);

  const fetchSimulateCounts = async () => {
    try {
      const data = await simulateCounts(condition);
      setCountsData(data);
    } catch (error) {
      console.error('Error fetching simulateCounts:', error);
    }
  };

  // When "View Details" is clicked, call simulateResults using POST
  const handleViewDetails = async () => {
    setViewDetails(true);
    // Include the selected filter (e.g., changeType) in the filters object
    const newFilter = { ...filters, changeType: selectedFilter };
    await fetchSimulateResults(newFilter, 1);
  };

  const fetchSimulateResults = async (filterCriteria = filters, page = pageNo) => {
    try {
      // simulateResults is now a POST call that sends filter, condition, pageNo, and pageSize in the body
      const data = await simulateResults(filterCriteria, condition, page, pageSize);
      if (data && Array.isArray(data)) {
        setResultList(data);
        // Optionally, update totalPages if your API provides that info; otherwise default to 1
        setTotalPages(1);
      } else {
        setResultList([]);
      }
    } catch (error) {
      console.error('Error fetching simulateResults:', error);
    }
  };

  // Export using POST to retrieve CSV data
  const handleExport = async () => {
    try {
      const payload = { ...condition, changeType: selectedFilter };
      // Using fetch with POST to call simulateResultsExport
      const response = await fetch(`http://localhost:3011/v1/simulateResultsExport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'simulate_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleClearFilter = async () => {
    const clearedFilters = {
      entitlementName: '',
      userName: '',
      empIdOrExtNumber: '',
      lastName: '',
      ruleScript: '',
    };
    setFilters(clearedFilters);
    await fetchSimulateResults(clearedFilters, 1);
    setPageNo(1);
  };

  const handleApplyFilter = async () => {
    await fetchSimulateResults(filters, 1);
    setPageNo(1);
  };

  const handlePageChange = async (newPage) => {
    setPageNo(newPage);
    await fetchSimulateResults(filters, newPage);
  };

  if (!isOpen) return null;

  return (
    <div className="simulation-popup-backdrop">
      <div className="simulation-popup-content">
        <button className="close-button" onClick={onClose}>X</button>

        {/* Simulation Counts Table */}
        <h2>Simulation Counts</h2>
        {countsData ? (
          <table className="simulation-table">
            <tbody>
              <tr>
                <td>Affected Users</td>
                <td>{countsData.affectedUsersCount}</td>
              </tr>
              <tr>
                <td>Affected Entitlements</td>
                <td>{countsData.affectedEntitlementsCount}</td>
              </tr>
              <tr>
                <td>Access to be Added</td>
                <td>{countsData.accessToAdd}</td>
              </tr>
              <tr>
                <td>Access to be Removed</td>
                <td>{countsData.accessToRemove}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}

        {/* Dropdown for Changes and "View Details" Button */}
        <div style={{ marginBottom: '16px' }}>
          <label>Changes:</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{ marginLeft: '8px', marginRight: '8px' }}
          >
            <option>All Changes</option>
            <option>Access Adds</option>
            <option>Access Removes</option>
          </select>
          <button onClick={handleViewDetails}>View Details</button>
        </div>

        {/* Detailed Results Table */}
        {viewDetails && (
          <>
            <table className="simulation-table">
              <thead>
                <tr>
                  <th>Entitlement Name</th>
                  <th>User Name</th>
                  <th>Emp ID/Ext</th>
                  <th>Last Name</th>
                  <th>Rule Script</th>
                </tr>
              </thead>
              <tbody>
                {/* Filter Input Row */}
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Filter"
                      value={filters.entitlementName}
                      onChange={(e) => setFilters({ ...filters, entitlementName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Filter"
                      value={filters.userName}
                      onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Filter"
                      value={filters.empIdOrExtNumber}
                      onChange={(e) => setFilters({ ...filters, empIdOrExtNumber: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Filter"
                      value={filters.lastName}
                      onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Filter"
                      value={filters.ruleScript}
                      onChange={(e) => setFilters({ ...filters, ruleScript: e.target.value })}
                    />
                  </td>
                </tr>
                {/* Buttons Row: Clear Filter & Results */}
                <tr>
                  <td colSpan="3"></td>
                  <td colSpan="2" style={{ textAlign: 'right' }}>
                    <button onClick={handleClearFilter}>Clear Filter</button>
                    <button onClick={handleApplyFilter}>Results</button>
                  </td>
                </tr>
                {/* Data Rows */}
                {resultList && resultList.length > 0 ? (
                  resultList.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.entitlementName}</td>
                      <td>{item.userName}</td>
                      <td>{item.empIdOrExtNumber}</td>
                      <td>{item.lastName}</td>
                      <td>{item.ruleScript}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No Results Found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button disabled={pageNo <= 1} onClick={() => handlePageChange(pageNo - 1)}>Prev</button>
              <span style={{ margin: '0 8px' }}>Page {pageNo} of {totalPages}</span>
              <button disabled={pageNo >= totalPages} onClick={() => handlePageChange(pageNo + 1)}>Next</button>
            </div>

            {/* Export Button */}
            <div style={{ marginTop: '16px' }}>
              <button onClick={handleExport}>Export</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SimulationPopUp;


/* src/components/SimulationPopUp.css */

/* Basic styles for the pop-up container */
.simulation-popup-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .simulation-popup-content {
    background: #fff;
    width: 80%;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 8px;
    padding: 16px;
    position: relative;
  }
  
  /* Basic table styling */
  .simulation-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
  }
  
  .simulation-table th,
  .simulation-table td {
    border: 1px solid #ccc;
    padding: 8px;
  }
  
  .simulation-table thead {
    background-color: #f2f2f2;
  }
  
  /* Buttons */
  .simulation-popup-buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  .simulation-popup-buttons button {
    padding: 6px 12px;
    cursor: pointer;
  }
  
  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #ccc;
    border: none;
    cursor: pointer;
  }
  


// src/store/actionCreators.js
import qs from 'qs';
import { ACTIONS, apiUrl } from './constants';

// This is a placeholder for your actual loadResource logic.
// Replace with your real function or fetch/axios calls as needed.
// src/store/actionCreators.js
// src/store/actionCreators.js

// const LoadResource = async ({ action, apiUrl, path, datapath }) => {
//     console.log('Fetching URL:', apiUrl);
//     try {
//       const response = await fetch(apiUrl, { mode: 'cors' });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const json = await response.json();
//       console.log('Received JSON:', json);
//       return json.data;
//     } catch (err) {
//       console.error('LoadResource error:', err);
//       return null;
//     }
//   };

const LoadResource = async ({ action, apiUrl, method = 'GET', body, path, datapath }) => {
    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method !== 'GET' ? body : undefined,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      return json.data;
    } catch (err) {
      console.error('LoadResource error:', err);
      return null;
    }
  };
  
  

// export const simulateCounts = (condition, forceFetch = false) => {
//   // Convert condition to query string
//   const queryString = qs.stringify({ ...condition });
//   return LoadResource({
//     action: ACTIONS.searchHomeRules,
//     apiUrl: `${apiUrl}v1/simulate?${queryString}`,
//     forceFetch,
//     path: ['simulateCountsList', 'all', 'search'],
//     datapath: ['simulateCountsList', 'all', 'search', 'data'],
//   });
// };
export const simulateCounts = (condition, forceFetch = false) => {
    return LoadResource({
      action: ACTIONS.searchHomeRules,
      apiUrl: `${apiUrl}v1/simulate`, // No query string here
      method: 'POST',
      body: JSON.stringify(condition),
      forceFetch,
      path: ['simulateCountsList', 'all', 'search'],
      datapath: ['simulateCountsList', 'all', 'search', 'data'],
    });
  };
  
  
// export const simulateResults = (filter, condition, pageno, pagesize, forceFetch = false) => {
//   const queryString = qs.stringify({ pageno, pagesize, ...condition, ...filter });
//   return LoadResource({
//     action: ACTIONS.searchHomeRules,
//     apiUrl: `${apiUrl}v1/simulateResults?${queryString}`,
//     forceFetch,
//     path: ['simulateResultsList', 'all', 'search'],
//     datapath: ['simulateResultsList', 'all', 'search', 'data'],
//   });
// };
export const simulateResults = (filter, condition, pageno, pagesize, forceFetch = false) => {
  const payload = { ...condition, ...filter, pageno, pagesize };
  return LoadResource({
    action: ACTIONS.searchHomeRules,
    apiUrl: `${apiUrl}v1/simulateResults`,
    method: 'POST',
    body: JSON.stringify(payload),
    forceFetch,
    path: ['simulateResultsList', 'all', 'search'],
    datapath: ['simulateResultsList', 'all', 'search', 'data'],
  });
};


// export const simulateResultsExport = (condition, forceFetch = false) => {
//   const queryString = qs.stringify({ export: true, ...condition });
//   return LoadResource({
//     action: ACTIONS.searchHomeRules,
//     apiUrl: `${apiUrl}v1/simulateResultsExport?${queryString}`,
//     forceFetch,
//     path: ['simulateResultsExportList', 'all', 'search'],
//     datapath: ['simulateResultsExportList', 'all', 'search', 'data'],
//   });
// };
export const simulateResultsExport = (condition, forceFetch = false) => {
  const payload = { export: true, ...condition };
  return LoadResource({
    action: ACTIONS.searchHomeRules,
    apiUrl: `${apiUrl}v1/simulateResultsExport`,
    method: 'POST',
    body: JSON.stringify(payload),
    forceFetch,
    path: ['simulateResultsExportList', 'all', 'search'],
    datapath: ['simulateResultsExportList', 'all', 'search', 'data'],
  });
};


// src/store/constants.js

// Example root URL for your API. Adjust to match your server port.
export const apiUrl = 'http://localhost:3011/';

export const ACTIONS = {
  searchHomeRules: 'search-home-rules',
  loadsimulateCountsList: 'load-simulate-counts',
  loadsimulateResultsList: 'load-simulate-result',
  loadsimulateResultsExportList: 'load-simulate-result-export',
};

export const initialState = {
  simulateCountsList: {},
  simulateResultsList: {},
  simulateResultsExport: {},
};


// src/store/selectors.js

// Example structure if your store slice is called "rules" in combineReducers
export const getsimulateCountsList = ({ rules }) => rules.simulateCountsList || {};
export const getsimulateResultsList = ({ rules }) => rules.simulateResultsList || {};
export const getsimulateResultsExport = ({ rules }) => rules.simulateResultsExport || {};



// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3011; // or any port you prefer

app.use(cors());

// Mock data for simulateCounts
// Suppose these come from your real DB in production
const mockSimulateCounts = {
  affectedUsersCount: 10,
  affectedEntitlementsCount: 2,
  accessToAdd: 3,
  accessToRemove: 1,
};

// Mock data for simulateResults (detailed list)
let mockSimulateResults = [
  {
    entitlementName: 'PRC-AXP-EH-1a-puller-paas-iq',
    userName: 'Tony Stark',
    empIdOrExtNumber: '1234567',
    lastName: 'Nick Fury',
    ruleScript: 'Add',
  },
  {
    entitlementName: 'PRC-AXP-EH-2a-puller-paas-iq',
    userName: 'Steve Rogers',
    empIdOrExtNumber: '2345678',
    lastName: 'Nick Fury',
    ruleScript: 'Add',
  },
  {
    entitlementName: 'PRC-AXP-EH-3a-puller-paas-iq',
    userName: 'Natasha Romanoff',
    empIdOrExtNumber: '3456789',
    lastName: 'Nick Fury',
    ruleScript: 'Add',
  },
  {
    entitlementName: 'request_service_3_a_requestee E3',
    userName: 'Mickey Mouse',
    empIdOrExtNumber: '9876543',
    lastName: 'Walt Disney',
    ruleScript: 'Remove',
  },
  {
    entitlementName: 'request_service_3_a_requestee E3',
    userName: 'Donald Duck',
    empIdOrExtNumber: '6789123',
    lastName: 'Walt Disney',
    ruleScript: 'Remove',
  },
];

// // Endpoint for simulate counts
// app.get('/v1/simulate', (req, res) => {
//   // parse any query params if needed
//   // e.g. condition = req.query
//   // Return the mockSimulateCounts
//   res.json({
//     success: true,
//     data: mockSimulateCounts,
//   });
// });
// Endpoint for simulate counts (now expecting a POST)
app.use(express.json());

// Change this endpoint to POST
app.post('/v1/simulate', (req, res) => {
  console.log('Received condition:', req.body);
  res.json({
    success: true,
    data: mockSimulateCounts,  // Or process req.body and send desired data
  });
});

// Endpoint for simulate results (view details)
app.get('/v1/simulateResults', (req, res) => {
  // parse query for pageno, pagesize, filter, etc.
  // e.g. const { pageno, pagesize, ...condition } = req.query;
  // For simplicity, returning all mockSimulateResults
  // If you want to handle filtering or pagination, you can do so here.

  // Example: filter by userName
  // if (req.query.userName) {
  //   ...
  // }

  res.json({
    success: true,
    data: mockSimulateResults,
  });
});

// Endpoint for simulate results export
app.get('/v1/simulateResultsExport', (req, res) => {
  // parse query for export, condition, etc.
  // In a real scenario, you’d generate CSV and send it as a file download
  // For the mock, just return the same data or a CSV string
  const csvHeader = 'Entitlement Name,User Name,Emp ID/Ext,Last Name,Rule Script\n';
  const csvRows = mockSimulateResults
    .map(
      (row) =>
        `${row.entitlementName},${row.userName},${row.empIdOrExtNumber},${row.lastName},${row.ruleScript}`
    )
    .join('\n');
  const csvContent = csvHeader + csvRows;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="simulate_export.csv"');
  res.send(csvContent);
});

app.listen(port, () => {
  console.log(`Mock server is running on http://localhost:${port}`);
});

