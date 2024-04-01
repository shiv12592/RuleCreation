import React, { useState, useCallback } from "react";
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
  const [selectedEntitlment, setSelectedEntitlment] = useState("");
  const [inputEntitlmnetText, setInputEntilmnetText] = useState("");
  const [isEntitilmentLoading, setIsEntitilmentLoading] = useState(false);
  const [showEntitlmentSuggestions, setShowEntitlmentSuggestions] =
    useState(false);

  const handleEntlmentInputChange = (e) => {
    setInputEntilmnetText(e.target.value);
    debounceInputChange(e.target.value);
  };

  const debounceInputChange = useCallback(
    debounce((value) => {
      setIsEntitilmentLoading(true);
      dispatch(searchEntitilements(value)).then(() => {
        setIsEntitilmentLoading(false);
      });
      setShowEntitlmentSuggestions(value !== "");
    }, 300),
    []
  );

  const handleEntlmentSuggestionClick = (app) => {
    setSelectedEntitlment(app.id);
    setInputEntilmnetText("");
    setShowEntitlmentSuggestions(false);
    const updatedConditions = conditions.map((condition) => {
      if (
        condition.source === "Request" &&
        condition.requestAttribute === "entitlement"
      ) {
        return {
          ...condition,
          requestValue: app.id,
        };
      }
      return condition;
    });
    setConditions(updatedConditions);
  };

  const handleClearSelecetedEntitlment = () => {
    setSelectedEntitlment("");
    const updatedConditions = conditions.map((condition) => {
      if (
        condition.source === "Request" &&
        condition.requestAttribute === "entitlement"
      ) {
        return {
          ...condition,
          requestValue: "",
        };
      }
      return condition;
    });
    setConditions(updatedConditions);
  };

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
          <div className="row">
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

            {condition.requestAttribute === "entitlement" ? (
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
            ) : (
              <input
                type="text"
                value={condition.requestValue}
                onChange={(e) =>
                  isGrouped
                    ? handleChangeInner(
                        index,
                        i,
                        "requestValue",
                        e.target.value
                      )
                    : handleChange(index, "requestValue", e.target.value)
                }
                disabled={isDisabled()}
              />
            )}
          </div>
        )}

        {condition.source === "Identity" && (
          <div>
            <select
              value={condition.identityAttribute}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(
                      index,
                      i,
                      "identityAttribute",
                      e.target.value
                    )
                  : handleChange(index, "identityAttribute", e.target.value)
              }
              disabled={isDisabled()}
            >
              <option value="">Select Identity Attribute</option>
              <option value="country code">country code</option>
              <option value="department number">department number</option>
            </select>
            <input
              type="text"
              value={condition.identityValue}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(index, i, "identityValue", e.target.value)
                  : handleChange(index, "identityValue", e.target.value)
              }
              disabled={isDisabled()}
            />
          </div>
        )}
        {condition.source === "Location" && (
          <div>
            <select
              value={condition.locationAttribute}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(
                      index,
                      i,
                      "locationAttribute",
                      e.target.value
                    )
                  : handleChange(index, "locationAttribute", e.target.value)
              }
              disabled={isDisabled()}
            >
              <option value="">Select Location Attribute</option>
              <option value="RACF">RACF</option>
              <option value="CAS">CAS</option>
            </select>
            <select
              value={condition.locationField}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(index, i, "locationField", e.target.value)
                  : handleChange(index, "locationField", e.target.value)
              }
              disabled={isDisabled()}
            >
              <option value="">Select Location Field</option>
              <option value="memberOf">memberOf</option>
              <option value="racfConnect">racfConnect</option>
            </select>
            <input
              type="text"
              value={condition.locationValue}
              onChange={(e) =>
                isGrouped
                  ? handleChangeInner(index, i, "locationValue", e.target.value)
                  : handleChange(index, "locationValue", e.target.value)
              }
              disabled={isDisabled()}
            />
          </div>
        )}
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
    </div>
  );
};

export default RuleConditionRows;
