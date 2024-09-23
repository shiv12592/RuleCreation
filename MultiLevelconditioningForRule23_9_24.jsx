import './App.css';
import RuleConditionRows from "./RuleConditionRows";
import {useState} from "react";

export default function App() {
    const [jsonData, setJsonData] = useState(null);
    const [conditionData, setConditionData] = useState(null);
    const [errorRequestMessages, setErrorMessages] = useState([]);

    const handleConditionData = (data) => {
        setConditionData(data);
    };

    const handleSubmit = () => {
        const errorMessages = validateData(conditionData);
        if (errorMessages.length === 0) {
            const jsonString = JSON.stringify(conditionData, null, 2);
            setJsonData(jsonString);
            setErrorMessages([]);
        } else {
            setErrorMessages(errorMessages);
        }
    };
    const validateData = (data) => {
        if (!data) return [];

        let errors = [];

        const traverse = (obj, path = [], index = 0) => {
            for (const key in obj) {
                if (Array.isArray(obj[key]) && obj[key].length === 0) {
                    errors.push(
                        `Array for <${key}> under ${
                            obj.Source
                                ? `${obj.Source} Condition Row Number ${index + 1}`
                                : "condition"
                        } should not be empty.`
                    );
                } else if (typeof obj[key] === "object" && obj[key] !== null) {
                    traverse(obj[key], [...path, key], index);
                } else if (obj[key] === "") {
                    errors.push(
                        `Value for <${key}> under ${
                            obj.Source
                                ? `${obj.Source} Condition Row Number ${index + 1}`
                                : "condition"
                        } should not be empty.`
                    );
                }
            }
        };

        if (data.AND) {
            data.AND.forEach((condition, index) =>
                traverse(condition, ["AND"], index)
            );
        }
        if (data.OR) {
            data.OR.forEach((condition, index) => traverse(condition, ["OR"], index));
        }

        return errors;
    };
    return (
        <div style={{ border: '1px solid black', padding:'20px' }}>
            <div className="container" style={{ border: '1px solid black', padding:'20px' }}>
                <RuleConditionRows onData={handleConditionData} />
            </div>
            <div className="container" style={{ border: '1px solid black' }}>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            {errorRequestMessages.length > 0 && (
                <div style={{ color: "red", border: '1px solid black',padding:'20px'  }}>
                    <h5>Error:</h5>
                    {errorRequestMessages.map((error, index) => (
                        <p key={index}>{`Error ${index + 1}: ${error}`}</p>
                    ))}
                </div>
            )}
            {jsonData && (
                <div style={{ border: '1px solid black' }}>
                    <h5>JSON Data:</h5>
                    <pre>{jsonData}</pre>
                </div>
            )}
        </div>
    );
}



///////////////////////child 
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const RuleConditionRows = ({ onData }) => {
    const [conditions, setConditions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectOperation, setSelectOperation] = useState("AND");
    const [isAddClicked, setIsAddClicked] = useState(false);

    useEffect(() => {
        onData(format(conditions, selectOperation));
    }, [conditions, selectOperation, onData]);

    const handleAddConditionRow = () => {
        setConditions([...conditions, {}]);
        setIsAddClicked(true);
    };

    const handleChange = (index, field, value) => {
        let updatedConditions = [...conditions];
        if (field === "locationValue" && value.includes("\n")) {
            const newValueArray = value
                .split("\n")
                .filter((val) => val.trim() !== "");
            updatedConditions[index][field] = newValueArray;
        } else {
            updatedConditions[index][field] = value;
        }
        setConditions(updatedConditions);
    };

    const handleSelectRow = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((i) => i !== index));
        } else {
            setSelectedRows([...selectedRows, index]);
        }
    };

    const handleGroupSelected = () => {
        if (selectedRows.length > 1) {
            let groupedConditions = [];
            let groupedRows = [];
            conditions.forEach((condition, index) => {
                if (selectedRows.includes(index)) {
                    groupedRows.push(condition);
                } else {
                    groupedConditions.push(condition);
                }
            });

            let hasGroup = groupedRows.some((row) => row.rows && row.selectOperation);

            if (hasGroup) {
                let newGroup = { rows: [], selectOperation };
                groupedRows.forEach((row) => {
                    if (row.rows && row.selectOperation) {
                        newGroup.rows.push(row);
                    } else {
                        if (row.selectOperation) {
                            delete row.selectOperation;
                        }
                        newGroup.rows.push({ ...row, selectOperation });
                    }
                });
                groupedConditions.push(newGroup);
            } else {
                groupedConditions.push({ rows: groupedRows, selectOperation });
            }

            setConditions(groupedConditions);
            setSelectedRows([]);
        } else if (selectedRows.length === 1) {
            let selectedRow = conditions[selectedRows[0]];

            if (selectedRow.rows && selectedRow.selectOperation) {
                let updatedConditions = conditions.map((condition, index) => {
                    if (index === selectedRows[0]) {
                        return { ...condition, selectOperation: undefined };
                    }
                    return condition;
                });
                setConditions(updatedConditions);
            } else {
                let newGroup = {
                    rows: [{ ...selectedRow, selectOperation: undefined }],
                    selectOperation,
                };
                setConditions([
                    ...conditions.slice(0, selectedRows[0]),
                    newGroup,
                    ...conditions.slice(selectedRows[0] + 1),
                ]);
            }

            setSelectedRows([]);
        }
    };

    const handleUngroupSelected = () => {
        let ungroupedConditions = [];
        conditions.forEach((condition, index) => {
            if (
                selectedRows.includes(index) &&
                condition.rows &&
                condition.selectOperation
            ) {
                ungroupedConditions.push(...condition.rows);
            } else {
                ungroupedConditions.push(condition);
            }
        });
        setConditions(ungroupedConditions);
        setSelectedRows([]);
    };

    const handleDeleteSelected = () => {
        let updatedConditions = conditions.filter(
            (condition, index) => !selectedRows.includes(index)
        );
        setConditions(updatedConditions);
        setSelectedRows([]);
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
                    obj["attribute"] = condition.requestAttribute || "";
                    obj["value"] = condition.requestValue || [];
                } else if (condition.source === "Identity") {
                    obj["attribute"] = condition.identityAttribute || "";
                    obj["value"] = condition.identityValue || "";
                } else if (condition.source === "Location") {
                    obj["attribute"] = condition.locationAttribute || "";
                    obj["value"] = condition.locationValue || "";
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
    };

    const handleRequestValueChange = (index, value) => {
        let updatedConditions = [...conditions];
        if (!Array.isArray(updatedConditions[index].requestValue)) {
            updatedConditions[index].requestValue = []; // Initialize as an array
        }
        if (!updatedConditions[index].requestValue.includes(value)) {
            updatedConditions[index].requestValue.push(value);
        }
        setConditions(updatedConditions);
    };


    const handleRemoveRequestValue = (index, value) => {
        let updatedConditions = [...conditions];
        updatedConditions[index].requestValue = updatedConditions[
            index
            ].requestValue.filter((val) => val !== value);
        setConditions(updatedConditions);
    };

    const renderConditionRow = (
        condition,
        index,
        i,
        isGrouped = false,
        level = 0 // Add a level parameter to track the nesting level
    ) => {
        // Allow editing up to two levels deep
        const isDisabled = () => {
            return level > 2; // Disable fields only if nesting is deeper than 2 levels
        };
        const isConditionDisabled = () => {
            return level > 1; // Disable fields only if nesting is deeper than 2 levels
        };


        return condition.rows && condition.selectOperation ? (
            <table style={{ border: "1px solid black", margin: "10px" }}>
                <tbody>
                <tr style={{ border: "1px solid black" }}>
                    {!isGrouped && (
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
                        <select
                            value={condition.selectOperation}
                            onChange={(e) =>
                                // handleChange(index, "selectOperation", e.target.value)
                                isGrouped
                                    ? handleChangeInner(index, i, "selectOperation", e.target.value)
                                    : handleChange(index, "selectOperation", e.target.value)
                            }
                            disabled={isConditionDisabled()}
                        >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                        </select>
                    </td>
                    <td>
                        {condition.rows.map((row, i) => (
                            <div key={i}>
                                {renderConditionRow(row, index, i, true, level + 1)} {/* Increment level */}
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
                {!isGrouped && (
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
                    <div>
                        <select
                            value={condition.requestAttribute}
                            onChange={(e) =>
                                isGrouped
                                    ? handleChangeInner(index, i, "requestAttribute", e.target.value)
                                    : handleChange(index, "requestAttribute", e.target.value)
                            }
                            disabled={isDisabled()}
                        >
                            <option value="">Select Request Attribute</option>
                            <option value="accountOperation">accountOperation</option>
                            <option value="band">band</option>
                        </select>
                        {condition.requestAttribute === "accountOperation" ? (
                            <div>
                                <select
                                    value={condition.requestValue}
                                    onChange={(e) =>
                                        handleRequestValueChange(index, e.target.value)
                                    }
                                    disabled={isDisabled()}
                                >
                                    <option value="">Select</option>
                                    <option value="add">add</option>
                                    <option value="remove">remove</option>
                                    <option value="reject">reject</option>
                                    <option value="cancel">cancel</option>
                                    <option value="update">update</option>
                                </select>
                                {/*<div>*/}
                                {/*    {Array.isArray(condition.requestValue) && condition.requestValue.map((val, idx) => (*/}
                                {/*        <div*/}
                                {/*            key={idx}*/}
                                {/*            style={{ display: "flex", alignItems: "center" }}*/}
                                {/*        >*/}
                                {/*            <span>{val}</span>*/}
                                {/*            <Button*/}
                                {/*                variant="danger"*/}
                                {/*                size="sm"*/}
                                {/*                onClick={() => handleRemoveRequestValue(index, val)}*/}
                                {/*                style={{ marginLeft: "10px" }}*/}
                                {/*            >*/}
                                {/*                Remove*/}
                                {/*            </Button>*/}
                                {/*        </div>*/}
                                {/*    ))}*/}

                                {/*</div>*/}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={condition.requestValue}
                                onChange={(e) =>
                                    isGrouped
                                        ? handleChangeInner(index, i, "requestValue", e.target.value)
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
                                    ? handleChangeInner(index, i, "identityAttribute", e.target.value)
                                    : handleChange(index, "identityAttribute", e.target.value)
                            }
                            disabled={isDisabled()}
                        >
                            <option value="">Select Identity Attribute</option>
                            <option value="identityAttribute1">identityAttribute1</option>
                            <option value="identityAttribute2">identityAttribute2</option>
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
                                    ? handleChangeInner(index, i, "locationAttribute", e.target.value)
                                    : handleChange(index, "locationAttribute", e.target.value)
                            }
                            disabled={isDisabled()}
                        >
                            <option value="">Select Location Attribute</option>
                            <option value="locationAttribute1">locationAttribute1</option>
                            <option value="locationAttribute2">locationAttribute2</option>
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
                            <option value="locationField1">locationField1</option>
                            <option value="locationField2">locationField2</option>
                        </select>
                        <textarea
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
            <button className="btn btn-primary mb-2" onClick={handleAddConditionRow}>
                Add Condition Row
            </button>
            {isAddClicked ? (
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <td>
                            <select
                                className="form-control"
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
                className="btn btn-info m-1"
                onClick={handleGroupSelected}
            >
                Group Selected
            </button>
            <button
                className="btn btn-info m-1"
                onClick={handleUngroupSelected}
            >
                Un-group Selected
            </button>
            <button
                className="btn btn-danger m-1"
                onClick={handleDeleteSelected}
            >
                Delete Selected
            </button>
        </div>
    );

};

export default RuleConditionRows;
