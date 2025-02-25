////////new filter 

import React, { useState } from "react";
import PropTypes from "prop-types";

const RulesListTable = ({ handleChangeSearch }) => {
  const [advancedFilters, setAdvancedFilters] = useState([
    { field: "", value: "" },
  ]);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const fieldOptions = [
    { value: "ruleNo", label: "Rule No" },
    { value: "state", label: "State" },
    { value: "name", label: "Name" },
    { value: "owner", label: "Owner" },
    { value: "category", label: "Category" },
  ];

  const valueOptions = {
    state: [
      { value: "active", label: "Active" },
      { value: "disabled", label: "Disabled" },
      { value: "inactive", label: "Inactive" },
    ],
    category: [
      { value: "application", label: "Application" },
      { value: "organizational", label: "Organizational" },
    ],
  };

  const handleFilterChange = (index, key, value) => {
    const updatedFilters = [...advancedFilters];
    updatedFilters[index][key] = value;
    
    // Clear value if the field is changed
    if (key === "field") {
      updatedFilters[index].value = "";
    }
    setAdvancedFilters(updatedFilters);
  };

  const removeFilter = (index) => {
    const updatedFilters = advancedFilters.filter((_, i) => i !== index);
    setAdvancedFilters(updatedFilters);
  };

  const addNewFilter = () => {
    setAdvancedFilters([...advancedFilters, { field: "", value: "" }]);
  };

  const clearAllFilters = () => {
    setAdvancedFilters([{ field: "", value: "" }]);
  };

  const handleSearch = () => {
    const queryString = advancedFilters
      .filter(filter => filter.field && filter.value)
      .map(filter => `${filter.field}=${encodeURIComponent(filter.value)}`)
      .join("&");
    handleChangeSearch(queryString);
  };

  return (
    <div>
      {!isAdvancedSearch && (
        <button onClick={() => setIsAdvancedSearch(true)} style={{ backgroundColor: "green", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}>
          Add New Filter
        </button>
      )}
      {isAdvancedSearch && (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>Field</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Value</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {advancedFilters.map((currentFilter, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    <select value={currentFilter.field} onChange={(e) => handleFilterChange(index, "field", e.target.value)} style={{ width: "100%" }}>
                      <option value="">Select Field</option>
                      {fieldOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {valueOptions[currentFilter.field] ? (
                      <select value={currentFilter.value} onChange={(e) => handleFilterChange(index, "value", e.target.value)} style={{ width: "100%" }}>
                        <option value="">Select Value</option>
                        {valueOptions[currentFilter.field].map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" value={currentFilter.value} placeholder="Enter Value" onChange={(e) => handleFilterChange(index, "value", e.target.value)} style={{ width: "100%" }} />
                    )}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    <button onClick={() => removeFilter(index)} style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "10px" }}>
            <button onClick={clearAllFilters} style={{ marginRight: "10px", backgroundColor: "orange", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}>
              Clear All
            </button>
            <button onClick={handleSearch} style={{ backgroundColor: "green", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}>
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

RulesListTable.propTypes = {
  handleChangeSearch: PropTypes.func.isRequired,
};

export default RulesListTable;


///////////////////////////update 2- search filters in tabular formate

import React, { useState } from "react";
import PropTypes from "prop-types";

const RulesListTable = ({
  ruleSearching,
  handleChangeFilter,
  searchEnabled,
  filter,
}) => {
  const [advancedFilters, setAdvancedFilters] = useState([
    { field: "", operator: "", value: "" },
  ]);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const fieldOptions = [
    { value: "Rule No", label: "Rule No" },
    { value: "State", label: "State" },
    { value: "Name", label: "Name" },
    { value: "Owner", label: "Owner" },
    { value: "Category", label: "Category" },
  ];

  const operatorOptions = [
    { value: "Equals", label: "Equals" },
    { value: "Not Equals", label: "Not Equals" },
  ];

  const valueOptions = {
    State: [
      { value: "Active", label: "Active" },
      { value: "Disabled", label: "Disabled" },
      { value: "Inactive", label: "Inactive" },
    ],
    Category: [
      { value: "Application", label: "Application" },
      { value: "Organizational", label: "Organizational" },
    ],
  };

  const addNewFilter = () => {
    setAdvancedFilters([...advancedFilters, { field: "", operator: "", value: "" }]);
  };

  const handleFilterChange = (index, key, value) => {
    const updatedFilters = [...advancedFilters];
    updatedFilters[index][key] = value;

    // Clear dependent fields if the field is changed
    if (key === "field") {
      updatedFilters[index].operator = "";
      updatedFilters[index].value = "";
    }

    setAdvancedFilters(updatedFilters);
    handleChangeFilter(JSON.stringify(updatedFilters));
  };

  const removeFilter = (index) => {
    const updatedFilters = advancedFilters.filter((_, i) => i !== index);
    setAdvancedFilters(updatedFilters);
    handleChangeFilter(JSON.stringify(updatedFilters));
  };

  const clearAllFilters = () => {
    setAdvancedFilters([{ field: "", operator: "", value: "" }]);
    handleChangeFilter("");
  };

  const handleSearch = () => {
    handleChangeSearch(JSON.stringify(advancedFilters));
  };

  const allFiltersFilled = advancedFilters.every(
    (filter) => filter.field && filter.operator && filter.value
  );

  // Dynamically calculate remaining field options for each row
  const getAvailableFields = (currentIndex) => {
    const selectedFields = advancedFilters.map((filter, index) =>
      index !== currentIndex ? filter.field : null
    );
    return fieldOptions.filter((opt) => !selectedFields.includes(opt.value));
  };

  return (
    <div>
      {!isAdvancedSearch && (
        <div>
          <button
            onClick={() => setIsAdvancedSearch(true)}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add New Filter
          </button>
        </div>
      )}

      {isAdvancedSearch && (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>Field</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Operator</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Value</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {advancedFilters.map((currentFilter, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    <select
                      value={currentFilter.field}
                      onChange={(e) => handleFilterChange(index, "field", e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="">Select Field</option>
                      {getAvailableFields(index).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    <select
                      value={currentFilter.operator}
                      onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="">Select Operator</option>
                      {operatorOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {["State", "Category"].includes(currentFilter.field) ? (
                      <select
                        value={currentFilter.value}
                        onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                        style={{ width: "100%" }}
                      >
                        <option value="">Select Value</option>
                        {valueOptions[currentFilter.field]?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={currentFilter.value}
                        placeholder="Enter Value"
                        onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    )}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    <button
                      onClick={() => removeFilter(index)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={clearAllFilters}
              style={{
                marginRight: "10px",
                backgroundColor: "orange",
                color: "white",
                padding: "10px 20px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
            <button
              onClick={handleSearch}
              disabled={!allFiltersFilled}
              style={{
                backgroundColor: allFiltersFilled ? "green" : "gray",
                color: "white",
                padding: "10px 20px",
                border: "none",
                cursor: allFiltersFilled ? "pointer" : "not-allowed",
              }}
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

RulesListTable.propTypes = {
  handleChangeSearch: PropTypes.func.isRequired,
  handleChangeFilter: PropTypes.func.isRequired,
  ruleSearching: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
};

export default RulesListTable;



///////////////////////////update 1-----normal

import React, { useState } from "react";
import PropTypes from "prop-types";

const RulesListTable = ({
  ruleSearching,
  handleChangeFilter,
  searchEnabled,
  filter,
}) => {
  const [advancedFilters, setAdvancedFilters] = useState([
    { field: "", operator: "", value: "" },
  ]);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const fieldOptions = [
    { value: "Rule No", label: "Rule No" },
    { value: "State", label: "State" },
    { value: "Name", label: "Name" },
    { value: "Owner", label: "Owner" },
    { value: "Category", label: "Category" },
  ];

  const operatorOptions = [
    { value: "Equals", label: "Equals" },
    { value: "Not Equals", label: "Not Equals" },
  ];

  const valueOptions = {
    State: [
      { value: "Active", label: "Active" },
      { value: "Disabled", label: "Disabled" },
      { value: "Inactive", label: "Inactive" },
    ],
    Category: [
      { value: "Application", label: "Application" },
      { value: "Organizational", label: "Organizational" },
    ],
  };

  const addNewFilter = () => {
    setAdvancedFilters([...advancedFilters, { field: "", operator: "", value: "" }]);
  };

  const handleFilterChange = (index, key, value) => {
    const updatedFilters = [...advancedFilters];
    updatedFilters[index][key] = value;
    setAdvancedFilters(updatedFilters);

    // Call handleChangeFilter to propagate filter updates to the parent
    handleChangeFilter(JSON.stringify(updatedFilters));
  };

  const removeFilter = (index) => {
    const updatedFilters = advancedFilters.filter((_, i) => i !== index);
    setAdvancedFilters(updatedFilters);
   // Propagate the updated filters to the parent
    handleChangeFilter(JSON.stringify(updatedFilters));
    if (updatedFilters.length === 0) setIsAdvancedSearch(false);
  };

  const handleSearch = () => {
    // Call handleChangeSearch to trigger the search API
    handleChangeSearch(JSON.stringify(advancedFilters));
  };

  return (
    <div>
      {/* Basic Search Input */}
      {!isAdvancedSearch && (
        <div>
          <input
            type="text"
            placeholder="Search Rule"
            value={filter}
            onChange={(e) => handleChangeFilter(e.target.value)}
            disabled={ruleSearching || isAdvancedSearch}
          />
          <button
            onClick={() => {
              setIsAdvancedSearch(true);
            }}
            style={{
              marginLeft: "10px",
              backgroundColor: "green",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Advanced Search
          </button>
        </div>
      )}

      {/* Advanced Search Section */}
      {isAdvancedSearch && (
        <div>
      {advancedFilters.map((currentFilter, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              {/* Field Dropdown */}
              <select
            value={currentFilter.field}
                onChange={(e) => handleFilterChange(index, "field", e.target.value)}
                style={{ marginRight: "10px" }}
              >
                <option value="">Select Field</option>
                {fieldOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Operator Dropdown */}
              <select
            value={currentFilter.operator}
                onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
                style={{ marginRight: "10px" }}
              >
                <option value="">Select Operator</option>
                {operatorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Value Input/Dropdown */}
          {currentFilter.field === "Category" || currentFilter.field === "State" ? (
                <select
              value={currentFilter.value}
                  onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                  style={{ marginRight: "10px" }}
                >
                  <option value="">Select Value</option>
              {valueOptions[currentFilter.field]?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
              value={currentFilter.value}
                  placeholder="Enter Value"
                  onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                  style={{ marginRight: "10px" }}
                />
              )}

              {/* Remove Button */}
              <button
                onClick={() => removeFilter(index)}
                style={{
                  marginRight: "10px",
                  backgroundColor: "red",
                  color: "white",
                  padding: "5px 10px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>

              {/* Add New Filter Button */}
              {index === advancedFilters.length - 1 && (
                <button
                  onClick={addNewFilter}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Add New Filter
                </button>
              )}
            </div>
          ))}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            style={{
              marginTop: "10px",
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
};

RulesListTable.propTypes = {
  handleChangeSearch: PropTypes.func.isRequired,
  handleChangeFilter: PropTypes.func.isRequired,
  ruleSearching: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
};

export default RulesListTable;





//old code used for edit

import { useState } from "react";

const PropTypes = require("prop-types");

// parent file which calles the RulesListTable, RulesListTable sent back the filter value to seach teh rule list by that text,
// now need to do avcanced search as per Image provided where after click on Add New Filter Row will add with three Columns Field, Operator and Value.
// Field should be drop down which contains the Rule no, State, Name, Owner, Category
// operator should have Equals and not Equals dropdown values
// vallue column should contain TextBox for Rule No, Owner , Name and DropDown for CAtegory (Application, Organizational), state(Active, Disabled Inactive)
// do the Ui coding under RulesListTable where AdvancedSearch TAG is mentioned
// when Add New filter selected make searchInput  disable and enable AdvancedSearch,
// make json of all filtred data and pass as string to filter, pass the filter, ruleSearching, handleChangeSearch and handleChnageFilter values back to parent component from AdvancedSerarch tag
const Home = () =>{

    const [filter, setFilter] = useState("");
    const [searchEnabled, setSearchEnabled] = useState(false);
    const [ruleSearching, setRuleSearching] = useState(false);

    const handleChangeSearch = async ()  => {
        setSearchEnabled(  true);
        setRuleSearching(  true);
        if (filter) {
        dispatchLoadCurrentAppsSearchTxt(filter);
        const status = await dispatchSearchHomeAppsList(filter, 1, PAGE_SIZE, role, true);
        if (status) {
          setState(  prevState => ({
        ... prevState,
        currentPage: 0,
          }));
        setCurrentPageBackup(state.currentPage);
        setRuleSearching(  false);
          }
        }
    };

        const handleChangeFilter = (inFilter)  => {
        setFilter(inFilter);
        if (!inFilter) {
        setSearchEnabled( false);
        setState(  prevState  => ({
        ... prevState,
        currentPage: currentPageBackup,
        }));
        dispatchLoadCurrentAppsSearchTxt(null);
        }
    };

    // other code
return (
    <PageWrapper>
        {/* other code  */}
            <RulesListTable
                rulesList= {rulesList}
                total={allRules.total}
                currentPage={state.currentPage}
                handLePageChange={handLePageChange}
                filter={filter}
                handLeChangeSearch={handLeChangeSearch}
                handleChangeFilter ={handleChangeFilter }
                ruleSearching={ruleSearching}
                searchEnabled={searchEnabled}
            />
            {/* other code  */}
     </PageWrapper>

)
};


const RulesListTable = () =>{
    const {
        ruleSearching, handLeChangeSearch, handLePageChange, handleChangeFilter, filter,
    } = props;

    return(
        <div>
                <SearchInput>
                    type="text",
                    placeholder="Search Rule",
                    value={filter},
                    onSubmit={handleChangeSearch},
                    onChange={handleChangeFilter},
                    searching={ruleSearching}
                </SearchInput>
        </div>
    )
}
RulesListTable.prototype = {
    handLeChangeSearch: PropTypes.func.isRequired,
    handleChangeFilter: PropTypes.func.isRequired,
    ruleSearching: PropTypes.bool.isRequired,
    searchEnabled: PropTypes.bool.isRequired,
    filter: PropTypes.string.isRequired,
}
