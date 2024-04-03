import React, { useState } from "react";
import { useDispatch } from "react-redux";
import EntitlementSearch from "./EntitlementSearch";

const RuleConditionRows = () => {
  const dispatch = useDispatch();
  const [conditions, setConditions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOperation, setSelectOperation] = useState("AND");
  const [isAddClicked, setIsAddClicked] = useState(false);

  // Other functions and states remain unchanged

  const handleEntlmentSuggestionClick = (app, index) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].requestValue = app.id;
    setConditions(updatedConditions);
  };

  const handleAddConditionRow = () => {
    setConditions([...conditions, {}]);
    setIsAddClicked(true);
  };

  const renderConditionRow = (condition, index) => {
    // Render other condition rows
    if (condition.requestAttribute === "entitlement") {
      return (
        <div>
          <input
            type="text"
            value={condition.requestValue}
            readOnly // Make the input read-only
          />
          <EntitlementSearch
            handleEntlmentSuggestionClick={(app) =>
              handleEntlmentSuggestionClick(app, index)
            }
          />
        </div>
      );
    }
    // Render other condition rows as before
  };

  // Other functions and components remain unchanged

  return (
    <div className="col-md-12 pad-1 card-rounded">
      {/* Add Condition Row button */}
      {/* Group/Un-group/Delete Selected buttons */}
      {/* Render conditions and EntitlementSearch component */}
    </div>
  );
};

export default RuleConditionRows;



import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { searchApps } from "../redux/actions";
import { getSearchedApps } from "../redux/selectors";

const EntitlementSearch = ({ handleEntlmentSuggestionClick }) => {
  const dispatch = useDispatch();
  const appSearchList = useSelector(getSearchedApps);
  const [inputEntitlmnetText, setInputEntilmnetText] = useState("");
  const [isEntitilmentLoading, setIsEntitilmentLoading] = useState(false);
  const [showEntitlmentSuggestions, setShowEntitlmentSuggestions] = useState(
    false
  );

  const handleEntlmentInputChange = (e) => {
    setInputEntilmnetText(e.target.value);
    debounceInputChange(e.target.value);
  };

  const debounceInputChange = useCallback(
    debounce((value) => {
      setIsEntitilmentLoading(true);
      dispatch(searchApps(value)).then(() => {
        setIsEntitilmentLoading(false);
        setShowEntitlmentSuggestions(true); // Show suggestions when data is loaded
      });
    }, 300),
    []
  );

  return (
    <div>
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
            <div
              className="suggestion"
              key={app.id}
              onClick={() => handleEntlmentSuggestionClick(app)}
            >
              ({app.id})
            </div>
          ))}
        </div>
      )}
      {isEntitilmentLoading && <div>Loading...</div>}
    </div>
  );
};

export default EntitlementSearch;
