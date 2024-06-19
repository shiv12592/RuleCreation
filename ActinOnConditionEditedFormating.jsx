import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import ActionOnCondition from "./ActionOnCondition";

export default function App() {
  const [ruleType, setRuleType] = useState("");
  const [action, setAction] = useState({
    conditionMet: {
      provision: [],
      revoke: [],
    },
    conditionNotMet: {
      message: "",
    },
  });
  const [errors, setErrors] = useState({});

  const handleRuleTypeChange = (e) => {
    const selectedRuleType = e.target.value;
    setRuleType(selectedRuleType);

    // Reset action based on selected ruleType
    if (selectedRuleType === "Allow") {
      setAction({ conditionNotMet: { message: "" } });
    } else if (selectedRuleType === "Deny") {
      setAction({ conditionMet: { message: "" } });
    } else {
      setAction({
        conditionMet: {
          provision: [],
          revoke: [],
        },
      });
    }
  };

  const handleActionChange = (newAction) => {
    setAction(newAction);
  };

  const addRow = () => {
    const newRow = {
      application: "",
      duration: "",
      value: "",
      op: "",
    };
    if (ruleType === "Auto Provision") {
      setAction((prevState) => ({
        ...prevState,
        conditionMet: {
          ...prevState.conditionMet,
          provision: [...prevState.conditionMet.provision, newRow],
        },
      }));
    } else if (ruleType === "Auto Revoke") {
      setAction((prevState) => ({
        ...prevState,
        conditionMet: {
          ...prevState.conditionMet,
          revoke: [...prevState.conditionMet.revoke, newRow],
        },
      }));
    }
  };

  const validate = () => {
    let validationErrors = {};

    if (ruleType === "Allow") {
      if (!action.conditionNotMet?.message) {
        validationErrors.conditionNotMet = "This field is required.";
      }
    } else if (ruleType === "Deny") {
      if (!action.conditionMet?.message) {
        validationErrors.conditionMet = "Message is required.";
      }
    } else if (ruleType === "Auto Provision" || ruleType === "Auto Revoke") {
      const conditionKey =
        ruleType === "Auto Provision" ? "provision" : "revoke";
      if (!action.conditionMet[conditionKey].length) {
        validationErrors[conditionKey] = "At least one row is required.";
      } else {
        action.conditionMet[conditionKey].forEach((row, index) => {
          if (!row.application) {
            validationErrors[`${conditionKey}${index}_application`] =
              "Application is required.";
          }
          if (!row.duration) {
            validationErrors[`${conditionKey}${index}_duration`] =
              "Duration is required.";
          }
          if (!row.value) {
            validationErrors[`${conditionKey}${index}_value`] =
              "Value is required.";
          }
          if (!row.op) {
            validationErrors[`${conditionKey}${index}_op`] =
              "Operation is required.";
          }
        });
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Process the form submission
      console.log("Form submitted:", action);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <Col md={12}>
          <Row
            style={{
              marginBottom: "10px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Col md={12}>
              <label>Select Rule Type</label>
            </Col>
            <Col md={12}>
              <select
                value={ruleType}
                onChange={handleRuleTypeChange}
                className="form-control"
              >
                <option value="">Select</option>
                <option value="Allow">Allow</option>
                <option value="Deny">Deny</option>
                <option value="Auto Provision">Auto Provision</option>
                <option value="Auto Revoke">Auto Revoke</option>
              </select>
            </Col>
          </Row>
          <ActionOnCondition
            action={action}
            onChange={handleActionChange}
            ruleType={ruleType}
            errors={errors}
          />
          {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") && (
            <Row>
              <Col md={12}>
                <button
                  type="button"
                  onClick={addRow}
                  className="btn btn-primary"
                >
                  Add Another Row
                </button>
              </Col>
            </Row>
          )}
          <Row>
            <Col md={12}>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div>
                <h3>JSON Output:</h3>
                <pre>{JSON.stringify(action, null, 2)}</pre>
              </div>
            </Col>
          </Row>
        </Col>
      </form>
    </div>
  );
}



import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const ActionOnCondition = ({ action, onChange, ruleType, errors }) => {
  const handleInputChange = (conditionKey, index, key, value) => {
    const updatedRows = [...action.conditionMet[conditionKey]];
    updatedRows[index] = { ...updatedRows[index], [key]: value };
    onChange({
      ...action,
      conditionMet: {
        ...action.conditionMet,
        [conditionKey]: updatedRows,
      },
    });
  };

  const handleRemoveRow = (conditionKey, index) => {
    const updatedRows = action.conditionMet[conditionKey].filter(
      (_, i) => i !== index
    );
    onChange({
      ...action,
      conditionMet: {
        ...action.conditionMet,
        [conditionKey]: updatedRows,
      },
    });
  };

  const handleMessageChange = (conditionKey, value) => {
    onChange({
      ...action,
      [conditionKey]: {
        ...action[conditionKey],
        message: value,
      },
    });
  };

  const renderAutoFields = (conditionKey) =>
    action.conditionMet[conditionKey]?.map((row, index) => (
      <Row
        key={index}
        style={{
          marginBottom: "10px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <Col md={12}>
          <Row style={{ marginBottom: "10px" }}>
            <Col md={2}>
              <input
                type="text"
                placeholder="Application"
                className="form-control"
                value={row.application || ""}
                onChange={(e) =>
                  handleInputChange(
                    conditionKey,
                    index,
                    "application",
                    e.target.value
                  )
                }
              />
              {errors[`${conditionKey}${index}_application`] && (
                <span className="text-danger">
                  {errors[`${conditionKey}${index}_application`]}
                </span>
              )}
            </Col>
            <Col md={2}>
              <label>Days</label>
              <select
                className="form-control"
                value={row.duration || ""}
                onChange={(e) =>
                  handleInputChange(
                    conditionKey,
                    index,
                    "duration",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                {Array.from({ length: 180 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              {errors[`${conditionKey}${index}_duration`] && (
                <span className="text-danger">
                  {errors[`${conditionKey}${index}_duration`]}
                </span>
              )}
            </Col>
            <Col md={2}>
              <input
                type="text"
                placeholder="Value"
                className="form-control"
                value={row.value || ""}
                onChange={(e) =>
                  handleInputChange(
                    conditionKey,
                    index,
                    "value",
                    e.target.value
                  )
                }
              />
              {errors[`${conditionKey}${index}_value`] && (
                <span className="text-danger">
                  {errors[`${conditionKey}${index}_value`]}
                </span>
              )}
            </Col>
            <Col md={2}>
              <select
                className="form-control"
                value={row.op || ""}
                onChange={(e) =>
                  handleInputChange(conditionKey, index, "op", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="add">Add</option>
                <option value="remove">Remove</option>
              </select>
              {errors[`${conditionKey}${index}_op`] && (
                <span className="text-danger">
                  {errors[`${conditionKey}${index}_op`]}
                </span>
              )}
            </Col>
            <Col md={2} className="text-right">
              <button
                type="button"
                onClick={() => handleRemoveRow(conditionKey, index)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    ));

  return (
    <div>
      {ruleType === "Allow" && (
        <Row
          key="conditionNotMet"
          style={{
            marginBottom: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <Col md={12}>
            <Row>
              <Col md={2}>
                <label>Return Message</label>
              </Col>
              <Col md={10}>
                <input
                  type="text"
                  placeholder="Return Message"
                  className="form-control"
                  value={action.conditionNotMet?.message || ""}
                  onChange={(e) =>
                    handleMessageChange("conditionNotMet", e.target.value)
                  }
                />
                {errors.conditionNotMet && (
                  <span className="text-danger">{errors.conditionNotMet}</span>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {ruleType === "Deny" && (
        <Row
          key="conditionMet"
          style={{
            marginBottom: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <Col md={12}>
            <Row>
              <Col md={2}>
                <label>Condition Met</label>
              </Col>
              <Col md={10}>
                <input
                  type="text"
                  placeholder="Return Message"
                  className="form-control"
                  value={action.conditionMet?.message || ""}
                  onChange={(e) =>
                    handleMessageChange("conditionMet", e.target.value)
                  }
                />
                {errors.conditionMet && (
                  <span className="text-danger">{errors.conditionMet}</span>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {ruleType === "Auto Provision" && renderAutoFields("provision")}
      {ruleType === "Auto Revoke" && renderAutoFields("revoke")}
    </div>
  );
};

ActionOnCondition.propTypes = {
  action: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  ruleType: PropTypes.string.isRequired,
  errors: PropTypes.object,
};

export default ActionOnCondition;
