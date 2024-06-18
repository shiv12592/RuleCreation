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
        validationErrors[conditionKey] = "At least one action is required.";
      }
      action.conditionMet[conditionKey].forEach((item, index) => {
        if (!item.application || !item.duration || !item.value) {
          validationErrors[`${conditionKey}${index}`] =
            "All fields are required.";
        }
      });
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(JSON.stringify(action));
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
              action={action}
              onChange={handleActionChange}
              ruleType={ruleType}
              errors={errors}
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
          <Row>
            <div>
              <h3>JSON Output:</h3>
              <pre>{JSON.stringify(action, null, 2)}</pre>
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
      <Row key={index} style={{ marginBottom: "10px" }}>
        <Col md={2} style={{ marginRight: "10px" }}>
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
          {errors[`application_${index}`] && (
            <span className="text-danger">
              {errors[`application_${index}`]}
            </span>
          )}
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <label>Days</label>
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <select
            className="form-control"
            value={row.duration || ""}
            onChange={(e) =>
              handleInputChange(conditionKey, index, "duration", e.target.value)
            }
          >
            <option value="">Select</option>
            {Array.from({ length: 180 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors[`duration_${index}`] && (
            <span className="text-danger">{errors[`duration_${index}`]}</span>
          )}
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <input
            type="text"
            placeholder="Value"
            className="form-control"
            value={row.value || ""}
            onChange={(e) =>
              handleInputChange(conditionKey, index, "value", e.target.value)
            }
          />
          {errors[`value_${index}`] && (
            <span className="text-danger">{errors[`value_${index}`]}</span>
          )}
        </Col>
        <Col md={1}>
          <button
            type="button"
            onClick={() => handleRemoveRow(conditionKey, index)}
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
        {ruleType === "Allow" && (
          <Row
            key="conditionNotMet"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Col md={2} style={{ marginRight: "10px" }}>
              Return Message
            </Col>
            <Col md={8}>
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
        )}
        {ruleType === "Deny" && (
          <Row
            key="conditionMet"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Col md={2} style={{ marginRight: "10px" }}>
              Condition Met
            </Col>
            <Col md={8}>
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
        )}
        {ruleType === "Auto Provision" && renderAutoFields("provision")}
        {ruleType === "Auto Revoke" && renderAutoFields("revoke")}
      </Col>
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
