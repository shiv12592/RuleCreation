update in editPlain class
-------------------------------------------------------------------------------------------
  import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { searchDepartments } from "./action";
import { getSearchedDepartments } from "./selectors";

const DepartmentSearch = ({ handleDepartmentSuggestionClick, departments }) => {
  const dispatch = useDispatch();
  const departmentList = useSelector(getSearchedDepartments);
  const [inputDepartmentText, setInputDepartmentText] = useState("");
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  useEffect(() => {
    // Fetch department details based on the IDs from the parent
    if (departments && departments.length > 0) {
      const fetchDepartmentDetails = async () => {
        setIsDepartmentLoading(true);
        const departmentDetails = [];
        for (const departmentId of departments) {
          const response = await dispatch(searchDepartments(departmentId));
          const departmentName = response.data.name; // Assuming the API response contains a 'name' field
          departmentDetails.push({ id: departmentId, name: departmentName });
        }
        setSelectedDepartments(departmentDetails);
        setIsDepartmentLoading(false);
        setShowDepartmentSuggestions(true);
      };
      fetchDepartmentDetails();
    }
  }, [departments, dispatch]);

  const handleDepartmentInputChange = (e) => {
    setInputDepartmentText(e.target.value);
    debounceInputChange(e.target.value);
  };

  const debounceInputChange = useCallback(
    debounce((value) => {
      setIsDepartmentLoading(true);
      dispatch(searchDepartments(value)).then(() => {
        setIsDepartmentLoading(false);
        setShowDepartmentSuggestions(true); // Show suggestions when data is loaded
      });
    }, 300),
    []
  );

  const handleRemoveDepartment = (departmentId) => {
    // Call the parent function to handle removing the department
    handleDepartmentSuggestionClick(departmentId);

    // Update local state in the child component
    const updatedDepartments = selectedDepartments.filter((department) => department.id !== departmentId);
    setSelectedDepartments(updatedDepartments);
  };

  return (
    <div>
      <div>
        {selectedDepartments.map((department) => (
          <div key={department.id}>
            {department.id} - {department.name}
            <button onClick={() => handleRemoveDepartment(department.id)}>Remove</button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={inputDepartmentText}
        onChange={handleDepartmentInputChange}
        placeholder="Search by Department and select"
        style={{
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      {isDepartmentLoading && <div>Loading...</div>}
    </div>
  );
};

export default DepartmentSearch;


update in createRule class
 -- -------------------------------------------------------------------------------------------

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DepartmentSearch from "./DepartmentSearch";

const RuleConditionRows = () => {
  const dispatch = useDispatch();
  const [conditions, setConditions] = useState([]);

  const handleAddConditionRow = () => {
    setConditions([...conditions, {}]);
  };

const handleDepartmentSuggestionClick = (department, index) => {
  const updatedConditions = [...conditions];
  const departmentValues = updatedConditions[index].requestValue || [];
  
  // Check if the department ID already exists in requestValue
  const existsIndex = departmentValues.findIndex((id) => id === department.id);
  
  if (existsIndex !== -1) {
    // Remove the department ID if it exists
    departmentValues.splice(existsIndex, 1);
  } else {
    // Add the department ID if it doesn't exist
    departmentValues.push(department.id);
  }

  updatedConditions[index].requestValue = departmentValues;
  setConditions(updatedConditions);
};

  const renderConditionRow = (condition, index) => {
    if (condition.requestAttribute === "department no") {
      return (
        <div>
          <DepartmentSearch
            handleDepartmentSuggestionClick={(department) =>
              handleDepartmentSuggestionClick(department, index)
            }
          />
        </div>
      );
    }
    // Render other condition rows as before
  };

  return (
    <div className="col-md-12 pad-1 card-rounded">
      <button onClick={handleAddConditionRow}>Add Condition Row</button>
      {conditions.map((condition, index) => (
        <div key={index}>{renderConditionRow(condition, index)}</div>
      ))}
    </div>
  );
};

export default RuleConditionRows;
===============

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { searchDepartments } from "./action";
import { getSearchedDepartments } from "./selectors";

const DepartmentSearch = ({ handleDepartmentSuggestionClick }) => {
  const dispatch = useDispatch();
  const departmentList = useSelector(getSearchedDepartments);
  const [inputDepartmentText, setInputDepartmentText] = useState("");
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const handleDepartmentInputChange = (e) => {
    setInputDepartmentText(e.target.value);
    debounceInputChange(e.target.value);
  };

  const debounceInputChange = useCallback(
    debounce((value) => {
      setIsDepartmentLoading(true);
      dispatch(searchDepartments(value)).then(() => {
        setIsDepartmentLoading(false);
        setShowDepartmentSuggestions(true); // Show suggestions when data is loaded
      });
    }, 300),
    []
  );

const handleDepartmentSet = (department) => {
  // Call the parent function to handle adding the department
  handleDepartmentSuggestionClick(department);
  
  // Update local state in the child component
  setSelectedDepartments([...selectedDepartments, department]);
  setInputDepartmentText(""); // Clear input after selection
  setShowDepartmentSuggestions(false); // Close suggestions after selection
};

const handleRemoveDepartment = (department) => {
  // Call the parent function to handle removing the department
  handleDepartmentSuggestionClick(department);
  
  // Update local state in the child component
  const updatedDepartments = selectedDepartments.filter((item) => item.id !== department.id);
  setSelectedDepartments(updatedDepartments);
};

  return (
    <div>
      <input
        type="text"
        value={inputDepartmentText}
        onChange={handleDepartmentInputChange}
        placeholder="Search by Department and select"
        style={{
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      {showDepartmentSuggestions && departmentList.data && (
        <div className="suggestions">
          {departmentList.data.map((department) => (
            <div
              className="suggestion"
              key={department.id}
              onClick={() => handleDepartmentSet(department)}
            >
              ({department.id})
            </div>
          ))}
        </div>
      )}
      {isDepartmentLoading && <div>Loading...</div>}
      
<div>
  {selectedDepartments.map((department) => (
    <div key={department.id}>
      {department.id}{" "}
      <button onClick={() => handleRemoveDepartment(department)}>Remove</button>
    </div>
  ))}
</div>
  
  );
};

export default DepartmentSearch;


-----------------============================old deprt search in same file=================
const handleEntlmentSuggestionClick = (app) => {
  const selectedId = app.id;
  setInputEntilmnetText(""); // Clear the input text
  setShowEntitlmentSuggestions(false); // Hide the suggestion list

  const updatedConditions = conditions.map((condition, index) => {
    if (condition.source === "Request") {
      let newValue = selectedId;
      // Add the selected ID to the existing requestValue array if it's not the first selection
      if (condition.requestAttribute === "entitlement" && condition.requestValue) {
        newValue = [...condition.requestValue, selectedId];
      } else {
        newValue = [selectedId];
      }
      return {
        ...condition,
        requestValue: newValue,
      };
    }
    return condition;
  });

  setConditions(updatedConditions);
};

const handleClearSelecetedEntitlment = (indexToRemove) => {
  const updatedConditions = conditions.map((condition, index) => {
    if (condition.source === "Request" && Array.isArray(condition.requestValue)) {
      const updatedValue = condition.requestValue.filter((_, i) => i !== indexToRemove);
      return {
        ...condition,
        requestValue: updatedValue,
      };
    }
    return condition;
  });

  setConditions(updatedConditions);
};


const handleEntlmentSuggestionClick = (app) => {
  const selectedId = app.id;
  setInputEntilmnetText(""); // Clear the input text
  setShowEntitlmentSuggestions(false); // Hide the suggestion list

  const updatedConditions = conditions.map((condition, index) => {
    if (condition.source === "Request") {
      let newValue = selectedId;
      // Add the selected ID to the existing requestValue array if it's not the first selection
      if (condition.requestAttribute === "entitlement" && condition.requestValue) {
        newValue = [...condition.requestValue, selectedId];
      } else {
        newValue = [selectedId];
      }
      return {
        ...condition,
        requestValue: newValue,
      };
    }
    return condition;
  });

  setConditions(updatedConditions);
};

------------------

 <input
                    type="text"
                    value={inputEntitlmnetText}
                    onChange={handleEntlmentInputChange}
                    placeholder="Search by ID and select"
                    style={{
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />

  {showEntitlmentSuggestions && appSearchList.data && (
  <div className="suggestions">
    {appSearchList.data.map((app) => (
      <div className="suggestion" key={app.id}>
        <span>({app.id})</span>
        <button onClick={() => handleEntlmentSuggestionClick(app)}>Add</button>
      </div>
    ))}
  </div>
)}
<div>
  {Array.isArray(condition.requestValue) &&
    condition.requestValue.map((id, idx) => (
      <div key={idx} className="selected-value" style={{ borderColor: "blue" }}>
        {id}
        <button onClick={() => handleClearSelecetedEntitlment(idx)}>X</button>
      </div>
    ))}
</div>
