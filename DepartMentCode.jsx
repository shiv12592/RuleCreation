
const DepartmentSearch = ({ handleDepartmentSuggestionClick, handleDepartmentRemove }) => {
  // Existing code...

  const handleRemoveDepartment = (index) => {
    const removedDepartment = selectedDepartments[index];
    handleDepartmentRemove(removedDepartment); // Call parent function to remove department
    const updatedDepartments = [...selectedDepartments];
    updatedDepartments.splice(index, 1);
    setSelectedDepartments(updatedDepartments);
  };

  return (
    <div>
      {/* Existing code... */}
      <div>
        {selectedDepartments.map((department, index) => (
          <div key={index}>
            {department.id}{" "}
            <button onClick={() => handleRemoveDepartment(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};


const RuleConditionRows = () => {
  // Existing code...

  const handleDepartmentSuggestionClick = (department, index) => {
    // Existing code...
  };

  const handleDepartmentRemove = (removedDepartment) => {
    const updatedConditions = conditions.map((condition) => {
      if (condition.requestAttribute === "department no") {
        const updatedRequestValue = condition.requestValue.filter(
          (id) => id !== removedDepartment.id
        );
        return { ...condition, requestValue: updatedRequestValue };
      }
      return condition;
    });
    setConditions(updatedConditions);
  };

  // Existing code...

  return (
    <div className="col-md-12 pad-1 card-rounded">
      {/* Add Condition Row button */}
      {/* Group/Un-group/Delete Selected buttons */}
      {conditions.map((condition, index) => (
        <div key={index}>{renderConditionRow(condition, index)}</div>
      ))}
    </div>
  );
};

=======================

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
    departmentValues.push(department.id);
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

  const handleDepartmentSuggestionClick = (department) => {
    setSelectedDepartments([...selectedDepartments, department]);
    setInputDepartmentText(""); // Clear input after selection
    setShowDepartmentSuggestions(false); // Close suggestions after selection
  };

  const handleRemoveDepartment = (index) => {
    const updatedDepartments = [...selectedDepartments];
    updatedDepartments.splice(index, 1);
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
              onClick={() => handleDepartmentSuggestionClick(department)}
            >
              ({department.id})
            </div>
          ))}
        </div>
      )}
      {isDepartmentLoading && <div>Loading...</div>}
      <div>
        {selectedDepartments.map((department, index) => (
          <div key={index}>
            {department.id}{" "}
            <button onClick={() => handleRemoveDepartment(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSearch;


=============================================
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
