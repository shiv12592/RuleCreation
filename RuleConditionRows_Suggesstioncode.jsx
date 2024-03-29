import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchApps, getSearchedApps } from "./redux/actions"; // Assuming you have actions set up for Redux

const RuleConditionRows = () => {
  const dispatch = useDispatch();
  const appSearchList = useSelector(getSearchedApps);
  const [conditions, setConditions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOperation, setSelectOperation] = useState("AND");
  const [isAddClicked, setIsAddClicked] = useState(false);

  // Car ID Input Box Code Snippet
  const [carId, setCarId] = useState("");
  const [inputCarIdText, setInputCarIdText] = useState("");
  const [isCarIdLoading, setIsCarIdLoading] = useState(false);
  const [showCarIdSuggestions, setShowCarIdSuggestions] = useState(false);

  const handleCarIdInputChange = (e) => {
    setInputCarIdText(e.target.value);
    debounceCarIdInputChange(e.target.value);
  };

  const debounceCarIdInputChange = useCallback(
    debounce((value) => {
      setIsCarIdLoading(true);
      dispatch(searchApps(value)).then(() => {
        setIsCarIdLoading(false);
      });
      setShowCarIdSuggestions(e.target.value !== "");
    }, 300),
    []
  );

  const handleCarIdSelection = (app) => {
    setCarId(app.id);
    setInputCarIdText("");
    setShowCarIdSuggestions(false);
  };

  const handleClearCarId = () => {
    setCarId("");
  };
  // End Car ID Input Box Code Snippet

  const handleAddConditionRow = () => {
    setConditions([...conditions, {}]);
    setIsAddClicked(true);
  };

  const handleChange = (index, field, value) => {
    let updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
    if (field === "locationField" && conditions[index].source === "Location") {
      updatedConditions[index]["locationField"] = value;
      setConditions(updatedConditions);
    }
  };

  const format = (conditions, selectOperation) => {
    let result = {};
    result[selectOperation] = conditions.map((condition) => {
      if (condition.rows && condition.selectOperation) {
        return format(condition.rows, condition.selectOperation);
      } else {
        let obj = {};
        obj["Source"] = condition.source || "";
        if (condition.source === "Request") {
          obj["requestAttribute"] = condition.requestAttribute || "";
          obj["requestValue"] = condition.value || "";
          obj["suggestionValue"] = condition.suggestionValue || ""; // Add this line for suggestion value
        } else if (condition.source === "Identity") {
          obj["identityAttribute"] = condition.identityAttribute || "";
          obj["identityValue"] = condition.value || "";
        } else if (condition.source === "Location") {
          obj["locationAttribute"] = condition.locationAttribute || "";
          obj["locationValue"] = condition.value || "";
          obj["locationField"] = condition.locationField || "";
        }
        return obj;
      }
    });
    return result;
  };

  const handleChangeInner = (index, i, field, value) => {
    let updatedConditions = [...conditions];
    updatedConditions[index].rows[i][field] = value;
    setConditions(updatedConditions);
    if (
      field === "locationField" &&
      conditions[index].rows[i].source === "Location"
    ) {
      updatedConditions[index].rows[i]["locationField"] = value;
      setConditions(updatedConditions);
    }
  };

  const renderConditionRow = (
    condition,
    index,
    i,
    isGrouped = false,
    isInner = false
  ) => {
    const isDisabled = () => {
      return isInner;
    };

    return condition.rows && condition.selectOperation ? (
      <table style={{ border: "1px solid black", margin: "10px" }}>
        <tbody>
          <tr style={{ border: "1px solid black" }}>
            {!isInner && (
              <td>
                <input
                  type="checkbox"
                  checked={
                    isGrouped ? condition.checked : selectedRows.includes(index)
                  }
                  onChange={() =>
                    isGrouped
                      ? handleChangeInner(
                          index,
                          i,
                          "checked",
                          !condition.checked
                        )
                      : handleSelectRow(index)
                  }
                />
              </td>
            )}
            <td>
              <label>Select Operation</label>
              <select
                value={condition.selectOperation}
                onChange={(e) =>
                  handleChange(index, "selectOperation", e.target.value)
                }
                disabled={isDisabled()}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </td>
            <td>
              {condition.rows.map((row, i) => (
                <div key={i}>
                  {renderConditionRow(row, index, i, true, true)}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      <div
        style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
      >
        {!isInner && (
          <input
            type="checkbox"
            checked={
              isGrouped ? condition.checked : selectedRows.includes(index)
            }
            onChange={() =>
              isGrouped
                ? handleChangeInner(index, i, "checked", !condition.checked)
                : handleSelectRow(index)
            }
          />
        )}
        <select
          value={condition.source}
          onChange={(e) =>
            isGrouped
              ? handleChangeInner(index, i, "source", e.target.value)
              : handleChange(index, "source", e.target.value)
          }
          disabled={isDisabled()}
        >
          <option value="">Select Source</option>
          <option value="Request">Request</option>
          <option value="Identity">Identity</option>
          <option value="Location">Location</option>
        </select>
        {condition.source === "Request" && (
          <select
            value={condition.requestAttribute}
            onChange={(e) =>
              isGrouped
                ? handleChangeInner(
                    index,
                    i,
                    "requestAttribute",
                    e.target.value
                  )
                : handleChange(index, "requestAttribute", e.target.value)
            }
            disabled={isDisabled()}
          >
            <option value="">Select Request Attribute</option>
            <option value="requesttee">requesttee</option>
            <option value="entitlement">entitlement</option>
          </select>
        )}

        {/* Add-New-Change 3: Add new field of input box for select suggestion and display selected value */}
        {condition.source === "Request" && condition.requestAttribute === "entitlement" && (
          <div>
            <input
              type="text"
              value={condition.suggestionValue}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(
                      index,
                      i,
                      "suggestionValue",
                      e.target.value
                    )
                  : handleChange(index, "suggestionValue", e.target.value)
              }
              placeholder="Select Suggestion"
              disabled={isDisabled()}
            />
            <div>Selected Value: {condition.suggestionValue}</div>
          </div>
        )}

        {/* Add-New-Change 4: Display selected value if not entitlement */}
        {condition.source === "Request" && condition.requestAttribute !== "entitlement" && (
          <div>Selected Value: {condition.value}</div>
        )}

        <input
          type="text"
          value={condition.value}
          onChange={(e) =>
            isGrouped
              ? handleChangeInner(index, i, "value", e.target.value)
              : handleChange(index, "value", e.target.value)
          }
          placeholder="Enter Value"
          disabled={isDisabled()}
        />
        <button onClick={() => handleRemoveCondition(index)}>Remove</button>
      </div>
    );
  };

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
      {/* Grouping, ungrouping, and delete buttons remain the same */}
      {/* Submit button remains the same */}
    </div>
  );
};

export default RuleConditionRows;

-----------------------------

<div>
  <input
    type="text"
    value={inputCarIdText}
    onChange={(e) => setInputCarIdText(e.target.value)}
    placeholder="Search by name or ID and select"
    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
  />
  {showCarIdSuggestions && appSearchList.data && (
    <div className="suggestions">
      {appSearchList.data.map((app) => (
        <div
          className="suggestion"
          key={app.id}
          onClick={() => {
            setCarId(app.id); // Set the selected car ID directly
            setInputCarIdText(''); // Clear the input text after selection
            // Update condition.suggestionValue directly
            handleChange(index, "suggestionValue", app.id);
          }}
        >
          ({app.id}) - {app.techOwnerFullName}
        </div>
      ))}
    </div>
  )}

  {/* Display selected car ID and 'X' button */}
  <div>
    {carId && (
      <div className="selected-value" style={{ borderColor: 'blue' }}>
        {carId}
        <button onClick={() => {
          setCarId(''); // Clear the selected car ID
          // Clear the suggestionValue when clearing the selected carId
          handleChange(index, "suggestionValue", '');
        }}>X</button>
      </div>
    )}
  </div>
</div>
