import React, { useState } from "react";
import PropTypes from "prop-types";

const RulesListTable = ({
  ruleSearching,
  handLeChangeSearch,
  handleChangeFilter,
  searchEnabled,
  filter,
}) => {
  const [advancedFilters, setAdvancedFilters] = useState([]);
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
    setIsAdvancedSearch(true);
  };

  const handleFilterChange = (index, key, value) => {
    const updatedFilters = [...advancedFilters];
    updatedFilters[index][key] = value;
    setAdvancedFilters(updatedFilters);
    handleChangeFilter(JSON.stringify(updatedFilters));
  };

  const removeFilter = (index) => {
    const updatedFilters = advancedFilters.filter((_, i) => i !== index);
    setAdvancedFilters(updatedFilters);
    handleChangeFilter(JSON.stringify(updatedFilters));
    if (updatedFilters.length === 0) setIsAdvancedSearch(false);
  };

  return (
    <div>
      {!isAdvancedSearch && (
        <div>
          <input
            type="text"
            placeholder="Search Rule"
            value={filter}
            onChange={(e) => handleChangeFilter(e.target.value)}
            disabled={ruleSearching || isAdvancedSearch}
          />
        </div>
      )}

      <div>
        {isAdvancedSearch && (
          <div>
            {advancedFilters.map((filter, index) => (
              <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
                {/* Field Dropdown */}
                <select
                  value={filter.field}
                  onChange={(e) => handleFilterChange(index, "field", e.target.value)}
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
                  value={filter.operator}
                  onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
                  style={{ marginLeft: "10px" }}
                >
                  <option value="">Select Operator</option>
                  {operatorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Value Input/Dropdown */}
                {filter.field === "Category" || filter.field === "State" ? (
                  <select
                    value={filter.value}
                    onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                    style={{ marginLeft: "10px" }}
                  >
                    <option value="">Select Value</option>
                    {valueOptions[filter.field]?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={filter.value}
                    placeholder="Enter Value"
                    onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                    style={{ marginLeft: "10px" }}
                  />
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFilter(index)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button onClick={addNewFilter} style={{ marginTop: "10px" }}>
              Add New Filter
            </button>
          </div>
        )}

        {!isAdvancedSearch && (
          <button
            onClick={() => {
              setIsAdvancedSearch(true);
              setAdvancedFilters([]);
            }}
            style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}
          >
            Advanced Search
          </button>
        )}
      </div>
    </div>
  );
};

RulesListTable.propTypes = {
  handLeChangeSearch: PropTypes.func.isRequired,
  handleChangeFilter: PropTypes.func.isRequired,
  ruleSearching: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
};

export default RulesListTable;
