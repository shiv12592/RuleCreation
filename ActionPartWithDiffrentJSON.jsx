import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import ActionOnCondition from "./ ActionOnCondition";

export default function ActionPart() {
    const [ruleType, setRuleType] = useState("");
    const [action, setAction] = useState([]); // Initialize as an array for actions
    const [allowDenyAction, setAllowDenyAction] = useState({
        conditionMet: "",
    }); // State for Allow/Deny actions
    const [errors, setErrors] = useState([]);

    const handleRuleTypeChange = (e) => {
        const selectedRuleType = e.target.value;
        setRuleType(selectedRuleType);

        // Reset action or allowDenyAction based on selected ruleType
        if (selectedRuleType === "Allow" || selectedRuleType === "Deny") {
            setAllowDenyAction({ conditionMet: ""}); // Clear for Allow/Deny
            setAction([]); // Reset action array for other rule types
        } else {
            setAction([]); // Clear action for Auto Provision/Auto Revoke
        }
    };

    const handleActionChange = (newAction) => {
        if (ruleType === "Allow" || ruleType === "Deny") {
            setAllowDenyAction(newAction); // Update the object for Allow/Deny
        } else {
            setAction(newAction); // Update the array for Auto Provision/Auto Revoke
        }
    };

    const addRow = () => {
        const newRow = {
            application: "",
            duration: "",
            value: ""
        };
        setAction((prevState) => [...prevState, newRow]); // Add a new row to the array
    };

    const validateAction = () => {
        let validationErrors = [];

        if (ruleType === "Allow" || ruleType === "Deny") {
            if (!allowDenyAction.conditionMet) {
                validationErrors.push("Condition Met cannot be empty.");
            }
        } else if (ruleType === "Auto Provision" || ruleType === "Auto Revoke") {
            if (!action.length) {
                validationErrors.push(`At least one action is required for '${ruleType}'.`);
            }
            action.forEach((item, index) => {
                if (!item.application) {
                    validationErrors.push(`Action Row ${index + 1}, application field cannot be empty.`);
                }
                if (!item.duration) {
                    validationErrors.push(`Action Row ${index + 1}, duration field cannot be empty.`);
                }
                if (!item.value) {
                    validationErrors.push(`Action Row ${index + 1}, value field cannot be empty.`);
                }
            });
        }

        setErrors(validationErrors);
        return validationErrors.length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateAction()) {
            if (ruleType === "Allow" || ruleType === "Deny") {
                console.log(JSON.stringify(allowDenyAction)); // Output for Allow/Deny
            } else {
                console.log(JSON.stringify(action)); // Output for Auto Provision/Auto Revoke
            }
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <Col md={12}>
                    <Row>
                        <Col md={6}>
                            <label>Select Rule Type</label>
                        </Col>
                        <Col md={6}>
                            <select value={ruleType} onChange={handleRuleTypeChange}>
                                <option value="">Select</option>
                                <option value="Allow">Allow</option>
                                <option value="Deny">Deny</option>
                                <option value="Auto Provision">Auto Provision</option>
                                <option value="Auto Revoke">Auto Revoke</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <ActionOnCondition
                            action={ruleType === "Allow" || ruleType === "Deny" ? allowDenyAction : action}
                            onChange={handleActionChange}
                            ruleType={ruleType}
                        />
                    </Row>
                    {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") && (
                        <Row>
                            <Col md={12}>
                                <button type="button" onClick={addRow}>
                                    Add Another Row
                                </button>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col md={12}>
                            <button type="submit">Submit</button>
                        </Col>
                    </Row>
                    {errors.length > 0 && (
                        <Row>
                            <Col md={12}>
                                <div className="text-danger">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index} style={{ color: 'red' }}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <div>
                            <h3>JSON Output:</h3>
                            <pre>
                                {ruleType === "Allow" || ruleType === "Deny"
                                    ? JSON.stringify(allowDenyAction, null, 2)
                                    : JSON.stringify(action, null, 2)}
                            </pre>
                        </div>
                    </Row>
                </Col>
            </form>
        </div>
    );
}


import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const ActionOnCondition = ({ action, onChange, ruleType }) => {
    // Handle input change for Allow/Deny action, updating the nested "message" field
    const handleInputChange = (key, value) => {
        const updatedAction = { [key]: { message: value } };
        onChange(updatedAction); // Update the object for Allow/Deny
    };

    // Handle input change for Auto Provision/Auto Revoke actions, updating rows in an array
    const handleArrayInputChange = (index, key, value) => {
        const updatedRows = [...action];
        updatedRows[index] = { ...updatedRows[index], [key]: value };
        onChange(updatedRows); // Update the array for Auto Provision/Auto Revoke
    };

    // Remove a row for Auto Provision/Auto Revoke actions
    const handleRemoveRow = (index) => {
        const updatedRows = action.filter((_, i) => i !== index);
        onChange(updatedRows); // Remove row from the array
    };

    // Render Allow fields (Condition Not Met)
    const renderAllowFields = () => (
        <Row style={{ marginBottom: "10px" }}>
            <Col md={5}>
                <label>Condition Not Met Message</label>
                <input
                    type="text"
                    className="form-control"
                    value={action.conditionNotMet?.message || ""}
                    onChange={(e) => handleInputChange("conditionNotMet", e.target.value)}
                />
            </Col>
        </Row>
    );

    // Render Deny fields (Condition Met)
    const renderDenyFields = () => (
        <Row style={{ marginBottom: "10px" }}>
            <Col md={5}>
                <label>Condition Met Message</label>
                <input
                    type="text"
                    className="form-control"
                    value={action.conditionMet?.message || ""}
                    onChange={(e) => handleInputChange("conditionMet", e.target.value)}
                />
            </Col>
        </Row>
    );

    // Render Auto Provision/Auto Revoke fields
    const renderAutoFields = () =>
        action.map((row, index) => (
            <Row key={index} style={{ marginBottom: "10px" }}>
                <Col md={2}>
                    <input
                        type="text"
                        placeholder="Application"
                        className="form-control"
                        value={row.application || ""}
                        onChange={(e) =>
                            handleArrayInputChange(index, "application", e.target.value)
                        }
                    />
                </Col>
                <Col md={2}>
                    <label>Days</label>
                </Col>
                <Col md={2}>
                    <select
                        className="form-control"
                        value={row.duration || ""}
                        onChange={(e) =>
                            handleArrayInputChange(index, "duration", e.target.value)
                        }
                    >
                        <option value="">Select</option>
                        {Array.from({ length: 180 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </Col>
                <Col md={2}>
                    <input
                        type="text"
                        placeholder="Value"
                        className="form-control"
                        value={row.value || ""}
                        onChange={(e) => handleArrayInputChange(index, "value", e.target.value)}
                    />
                </Col>
                <Col md={1}>
                    <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="btn btn-danger"
                    >
                        Remove
                    </button>
                </Col>
            </Row>
        ));

    return (
        <div className="row">
            <Col md={12}>
                {ruleType === "Allow"
                    ? renderAllowFields()
                    : ruleType === "Deny"
                        ? renderDenyFields()
                        : (ruleType === "Auto Provision" || ruleType === "Auto Revoke") && renderAutoFields()}
            </Col>
        </div>
    );
};

ActionOnCondition.propTypes = {
    action: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    onChange: PropTypes.func.isRequired,
    ruleType: PropTypes.string.isRequired,
};

export default ActionOnCondition;





