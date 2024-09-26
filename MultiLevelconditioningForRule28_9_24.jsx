import React, {useState, useEffect, useRef} from "react";
import DepartmentSearch from "./DepartmentSearch";

const RuleConditionRows = ({ onData }) => {
    const [conditions, setConditions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectOperation, setSelectOperation] = useState("AND");
    const [isAddClicked, setIsAddClicked] = useState(false);

    const firstUpdate = useRef(true);  // Create a ref to track the first render

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;  // Set to false after first render
            return;  // Skip the first call
        }
        onData(format(conditions, selectOperation));
    }, [conditions, selectOperation, onData]);

    const handleAddConditionRow = () => {
        setConditions([...conditions, {}]);
        setIsAddClicked(true);
    };

    const handleChange = (index, field, value) => {
        let updatedConditions = [...conditions];
            updatedConditions[index][field] = value;
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
                }
                return obj;
            }
        });
        return result;
    };

    const handleChangeInner = (outerIndex, innerIndex, field, value) => {
        let updatedConditions = [...conditions];
        if (updatedConditions[outerIndex].rows && updatedConditions[outerIndex].rows[innerIndex]) {
            updatedConditions[outerIndex].rows[innerIndex][field] = value;
        }
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

    const handleDepartmentSuggestionClick = (department, index, innerIndex) => {
        const updatedConditions = [...conditions];

        console.log('Index:', index);
        console.log('Inner Index:', innerIndex); // This will show undefined for level 1 selections

        // If no innerIndex, handle it as a level 1 selection
        if (innerIndex === undefined) {
            const departmentValue = updatedConditions[index].identityValue || [];

            const existsIndex = departmentValue.findIndex(d => d.id === department.id);
            if (existsIndex !== -1) {
                // Remove department if already exists
                departmentValue.splice(existsIndex, 1);
            } else {
                // Add department if not exists
                departmentValue.push(department);
            }

            // Update level 1 condition
            updatedConditions[index].identityValue = departmentValue;
        }
        // If innerIndex is defined, handle it as a level 2 selection
        else {
            if (!updatedConditions[index].rows || !updatedConditions[index].rows[innerIndex]) {
                console.error(`No row found at inner index ${innerIndex} for condition ${index}`);
                return;
            }

            const departmentValue = updatedConditions[index].rows[innerIndex].identityValue || [];
            const existsIndex = departmentValue.findIndex(d => d.id === department.id);
            if (existsIndex !== -1) {
                // Remove department if already exists
                departmentValue.splice(existsIndex, 1);
            } else {
                // Add department if not exists
                departmentValue.push(department);
            }

            // Update the nested condition
            updatedConditions[index].rows[innerIndex].identityValue = departmentValue;
        }

        // Set updated conditions
        setConditions(updatedConditions);
    };

    const handleRemoveDepartment = (department, outerIndex, innerIndex) => {
        const updatedConditions = [...conditions];

        if (innerIndex === undefined) {
            // Handle removal at level 1
            const departmentValue = updatedConditions[outerIndex].identityValue || [];
            const updatedDepartments = departmentValue.filter(dep => dep.id !== department.id);
            updatedConditions[outerIndex].identityValue = updatedDepartments;
        } else {
            // Handle removal at level 2
            const departmentValue = updatedConditions[outerIndex].rows[innerIndex].identityValue || [];
            const updatedDepartments = departmentValue.filter(dep => dep.id !== department.id);
            updatedConditions[outerIndex].rows[innerIndex].identityValue = updatedDepartments;
        }

        setConditions(updatedConditions);
    };

    const renderConditionRow = (condition, outerIndex, innerIndex, isGrouped = false, level = 0) => {
        const isDisabled = (level) => {
            return level >= 3; // Disable all fields for Level 3 and beyond
        };

        return condition.rows && condition.selectOperation ? (
            <table style={{ border: "1px solid red", margin: "10px", width: "100%" }}>
                <tbody>
                <tr style={{ border: "1px solid black" }}>
                    {!isGrouped && (
                        <td>
                            <input
                                type="checkbox"
                                checked={isGrouped ? condition.checked : selectedRows.includes(outerIndex)}
                                onChange={() =>
                                    isGrouped
                                        ? handleChangeInner(outerIndex, innerIndex, "checked", !condition.checked)
                                        : handleSelectRow(outerIndex)
                                }
                            />
                        </td>
                    )}
                    <td style={{ width: '10%' }}>
                        <select
                            value={condition.selectOperation}
                            onChange={(e) =>
                                isGrouped
                                    ? handleChangeInner(outerIndex, innerIndex, "selectOperation", e.target.value)
                                    : handleChange(outerIndex, "selectOperation", e.target.value)
                            }
                            disabled={isDisabled(level)} // Editable for Level 0, 1, 2
                        >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                        </select>
                    </td>
                    <td style={{ width: '90%' }}>
                        {condition.rows.map((row, i) => (
                            <div key={i}>
                                {renderConditionRow(row, outerIndex, i, true, level + 1)} {/* Increment level */}
                            </div>
                        ))}
                    </td>
                </tr>
                </tbody>
            </table>
        ) : (
            <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                {!isGrouped && (
                    <input
                        type="checkbox"
                        checked={isGrouped ? condition.checked : selectedRows.includes(outerIndex)}
                        onChange={() =>
                            isGrouped
                                ? handleChangeInner(outerIndex, innerIndex, "checked", !condition.checked)
                                : handleSelectRow(outerIndex)
                        }
                    />
                )}
                <select
                    value={condition.source}
                    onChange={(e) =>
                        isGrouped
                            ? handleChangeInner(outerIndex, innerIndex, "source", e.target.value)
                            : handleChange(outerIndex, "source", e.target.value)
                    }
                    disabled={isDisabled(level)} // Editable for Level 0, 1, 2
                >
                    <option value="">Select Source</option>
                    <option value="Request">Request</option>
                    <option value="Identity">Identity</option>
                </select>
                {condition.source === "Request" && (
                    <div>
                        <select
                            value={condition.requestAttribute}
                            onChange={(e) =>
                                isGrouped
                                    ? handleChangeInner(outerIndex, innerIndex, "requestAttribute", e.target.value)
                                    : handleChange(outerIndex, "requestAttribute", e.target.value)
                            }
                            disabled={isDisabled(level)} // Editable for Level 0, 1, 2
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
                                        isGrouped
                                            ? handleChangeInner(outerIndex, innerIndex, "requestValue", e.target.value)
                                            : handleRequestValueChange(outerIndex, e.target.value)
                                    }
                                    disabled={isDisabled(level)} // Editable for Level 0, 1, 2
                                >
                                    <option value="">Select</option>
                                    <option value="add">add</option>
                                    <option value="remove">remove</option>
                                    <option value="reject">reject</option>
                                    <option value="cancel">cancel</option>
                                    <option value="update">update</option>
                                </select>
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={condition.requestValue}
                                onChange={(e) =>
                                    isGrouped
                                        ? handleChangeInner(outerIndex, innerIndex, "requestValue", e.target.value)
                                        : handleChange(outerIndex, "requestValue", e.target.value)
                                }
                                disabled={isDisabled(level)} // Editable for Level 0, 1, 2
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
                                    ? handleChangeInner(outerIndex, innerIndex, "identityAttribute", e.target.value)
                                    : handleChange(outerIndex, "identityAttribute", e.target.value)
                            }
                            disabled={isDisabled(level)} // Editable for Level 0, 1, 2
                        >
                            <option value="">Select Identity Attribute</option>
                            <option value="nationality">nationality</option>
                            <option value="department">department</option>
                        </select>
                        {condition.identityAttribute === 'department' ? (
                            <DepartmentSearch
                                handleDepartmentSuggestionClick={(department) => handleDepartmentSuggestionClick(department, outerIndex, innerIndex)}
                                selectedDepartments={condition.identityValue || []}
                                onRemoveDepartment={(department) => handleRemoveDepartment(department, outerIndex, innerIndex)}
                                disabled={isDisabled(level)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={condition.identityValue}
                                onChange={(e) =>
                                    isGrouped
                                        ? handleChangeInner(outerIndex, innerIndex, "identityValue", e.target.value)
                                        : handleChange(outerIndex, "identityValue", e.target.value)
                                }
                                disabled={isDisabled(level)} // Editable for Level 0, 1, 2
                            />
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="col-md-12 pad-1 card-rounded" style={{ width: '100%' }}>
            <button className="btn btn-primary mb-2" onClick={handleAddConditionRow}>
                Add Condition Row
            </button>
            {isAddClicked ? (
                <table style={{ width: '100%' }}>
                    <tbody>
                    <tr>
                        <td style={{ width: '10%' }}>
                            <select
                                className="form-control"
                                value={selectOperation}
                                onChange={(e) => setSelectOperation(e.target.value)}
                            >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                            </select>
                        </td>
                        <td style={{ width: '90%' }}>
                            {conditions.map((condition, index) => (
                                <div key={index}>{renderConditionRow(condition, index)}</div>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
            ) : null}
            <div className="mt-3">
                <button className="btn btn-info m-1" onClick={handleGroupSelected}>
                    Group Selected
                </button>
                <button className="btn btn-info m-1" onClick={handleUngroupSelected}>
                    Un-group Selected
                </button>
                <button className="btn btn-danger m-1" onClick={handleDeleteSelected}>
                    Delete Selected
                </button>
            </div>
        </div>
    );

};

export default RuleConditionRows;
