import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { searchEntitilements } from "../redux/actions";
import { getSearchedApps } from "../redux/selectors";

const RuleConditionRows = () => {
  const [conditions, setConditions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOperation, setSelectOperation] = useState("AND");
  const [isAddClicked, setIsAddClicked] = useState(false);
  const dispatch = useDispatch();
  const appSearchList = useSelector(getSearchedApps);
  const [selectedEntitlment, setSeelectedEntitlment] = useState("");
  const [inputEntitlmnetText, setInputEntilmnetText] = useState("");
  const [isEntitilmentLoading, setIsEntitilmentLoading] = useState(false);
  const [showEntitlmentSuggestions, setShowEntitlmentSuggestions] = useState(false);

  const handleAddConditionRow = () => {
    setConditions([...conditions, {}]);
    setIsAddClicked(true);
  };

  const handleEntlmentInputChange = (e) => {
    const text = e.target.value;
    setInputEntilmnetText(text);
    dispatch(searchEntitilements(text));
    setIsEntitilmentLoading(true);
  };

  const handleEntlmentSuggestionClick = (app) => {
    setSeelectedEntitlment(app.name);
    setInputEntilmnetText("");
    setShowEntitlmentSuggestions(false);
    setIsEntitilmentLoading(false);
    const index = conditions.findIndex(condition => condition.requestAttribute === "entitlement");
    if (index !== -1) {
      const updatedConditions = [...conditions];
      updatedConditions[index].requestValue = app.name;
      setConditions(updatedConditions);
    }
  };

  const handleClearSelecetedEntitlment = () => {
    setSeelectedEntitlment("");
    const index = conditions.findIndex(condition => condition.requestAttribute === "entitlement");
    if (index !== -1) {
      const updatedConditions = [...conditions];
      updatedConditions[index].requestValue = "";
      setConditions(updatedConditions);
    }
  };

  const debouncedSearch = debounce((text) => {
    dispatch(searchEntitilements(text));
    setIsEntitilmentLoading(true);
  }, 300);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputEntilmnetText(text);
    debouncedSearch(text);
    setShowEntitlmentSuggestions(true);
  };

  // Other functions remain unchanged

  return (
    <div className="col-md-12 pad-1 card-rounded">
      <button onClick={handleAddConditionRow}>Add Condition Row</button>
      {isAddClicked ? (
        <table style={{ border: "1px solid black" }}>
          <tbody>
            <tr style={{ border: "1px solid black" }}>
              <td>
                <label>Select Operation</label>
                <select
                  value={selectOperation}
                  onChange={(e) => setSelectOperation(e.target.value)}
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </td>
              <td>
                {conditions.map((condition, index) => (
                  <div key={index}>{renderConditionRow(condition, index)}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      ) : null}
      <button
        style={{ backgroundColor: "lightblue", color: "white", margin: "5px" }}
        onClick={handleGroupSelected}
      >
        Group Selected
      </button>
      <button
        style={{ backgroundColor: "lightblue", color: "white", margin: "5px" }}
        onClick={handleUngroupSelected}
      >
        Un-group Selected
      </button>
      <button
        style={{ backgroundColor: "lightblue", color: "white", margin: "5px" }}
        onClick={handleDeleteSelected}
      >
        Delete Selected
      </button>
      <button
        style={{ backgroundColor: "lightblue", color: "white", margin: "5px" }}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default RuleConditionRows;


------------------
<div>
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
                </div>
                {isEntitilmentLoading && <div>Loading...</div>}
                <div>
                  {selectedEntitlment && (
                    <div
                      className="selected-value"
                      style={{ borderColor: "blue" }}
                    >
                      {selectedEntitlment}
                      <button onClick={handleClearSelecetedEntitlment}>
                        X
                      </button>
                    </div>
                  )}
                </div>
              </div>
       
