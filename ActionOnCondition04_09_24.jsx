
//////////below iss create rule mode with , search value and suggesstion included 
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
  const [errors, setErrors] = useState([]);

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

  const validateAction = () => {
    let validationErrors = [];

    if (ruleType === "Allow") {
      if (!action.conditionNotMet?.message) {
        validationErrors.push("Message field for 'Allow' is required.");
      }
    } else if (ruleType === "Deny") {
      if (!action.conditionMet?.message) {
        validationErrors.push("Message field for 'Deny' is required.");
      }
    } else if (ruleType === "Auto Provision" || ruleType === "Auto Revoke") {
      const conditionKey =
        ruleType === "Auto Provision" ? "provision" : "revoke";
      if (!action.conditionMet[conditionKey].length) {
        validationErrors.push(
          `At least one action is required for '${ruleType}'.`
        );
      }
      action.conditionMet[conditionKey].forEach((item, index) => {
        if (!item.application) {
          validationErrors.push(
            `Action Row ${index + 1}, application field cannot be empty.`
          );
        }
        if (!item.duration) {
          validationErrors.push(
            `Action Row ${index + 1}, duration field cannot be empty.`
          );
        }
        if (!item.value) {
          validationErrors.push(
            `Action Row ${index + 1}, value field cannot be empty.`
          );
        }
      });
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAction()) {
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
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          )}
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

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const ActionOnCondition = ({ action, onChange, ruleType }) => {
  const handleInputChange = (conditionKey, index, key, value) => {
    const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
    if (regex.test(value) || value === "") {
      const updatedRows = [...action.conditionMet[conditionKey]];
      updatedRows[index] = { ...updatedRows[index], [key]: value };
      onChange({
        ...action,
        conditionMet: {
          ...action.conditionMet,
          [conditionKey]: updatedRows,
        },
      });
    }
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

  const handleValueSuggestionClick = (entlm, conditionKey, index) => {
    const updatedRows = [...action.conditionMet[conditionKey]];
    const entlmValues = updatedRows[index].value || [];
    const existsIndex = entlmValues.findIndex(
      (item) =>
        item.location === entlm.authNamespace && item.value === entlm.entlmDn
    );

    if (existsIndex !== -1) {
      entlmValues.splice(existsIndex, 1);
    } else {
      entlmValues.push({
        location: entlm.authNamespace,
        value: entlm.entlmDn,
        name: entlm.entlmName,
      });
    }

    updatedRows[index] = { ...updatedRows[index], value: entlmValues };
    // Extract distinct locations and store them in application
    const distinctLocations = [...new Set(entlmValues.map((item) => item.location))];
    updatedRows[index].application = distinctLocations;
    onChange({
      ...action,
      conditionMet: {
        ...action.conditionMet,
        [conditionKey]: updatedRows,
      },
    });
  };

  // Auto resize textarea
  const autoResizeTextarea = (element) => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  const renderAutoFields = (conditionKey) =>
    action.conditionMet[conditionKey]?.map((row, index) => (
      <Row key={index} style={{ marginBottom: "10px" }}>
        <Col md={2} style={{ marginRight: "10px" }}>
          <ValueSearch
            handleValueSuggestionClick={(entlm) =>
              handleValueSuggestionClick(entlm, conditionKey, index)
            }
            selectedEntlmArray={row.value || []}
          />
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <textarea
            className="form-control"
            value={Array.isArray(row.application) ? row.application.join("\n") : ""}
            readOnly
            style={{ resize: "vertical" }}
          />
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <label>Days</label>
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <input
            type="text"
            className="form-control"
            value={row.duration || ""}
            onChange={(e) =>
              handleInputChange(conditionKey, index, "duration", e.target.value)
            }
          />
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
              <textarea
                placeholder="Return Message"
                className="form-control"
                value={action.conditionNotMet?.message || ""}
                onChange={(e) =>
                  handleMessageChange("conditionNotMet", e.target.value)
                }
                style={{ resize: "none" }}
                rows={1} // Set the initial rows to 1
                onInput={(e) => autoResizeTextarea(e.target)}
              />
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
              <textarea
                placeholder="Return Message"
                className="form-control"
                value={action.conditionMet?.message || ""}
                onChange={(e) =>
                  handleMessageChange("conditionMet", e.target.value)
                }
                style={{ resize: "none" }}
                rows={1}
                onInput={(e) => autoResizeTextarea(e.target)}
              />
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
};

export default ActionOnCondition;


/////////
///////---------------------------------------------Edit mode-------------------
///////// not included  suggesstion value

import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import ActionOnCondition from "./ActionOnCondition";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleType: "Auto Provision", // Set to Auto Provision to test the provision rows
      action: {
        conditionMet: {
          provision: [
            {
              application: "hgjghk",
              duration: "6",
              value: "jghjhghjh",
            },
            {
              application: "",
              duration: "",
              value: "fgjghk",
            },
          ],
        },
      },
      errors: [],
    };
  }

  handleRuleTypeChange = (e) => {
    const selectedRuleType = e.target.value;
    this.setState({
      ruleType: selectedRuleType,
      action:
        selectedRuleType === "Allow"
          ? { conditionNotMet: { message: "" } }
          : selectedRuleType === "Deny"
          ? { conditionMet: { message: "" } }
          : {
              conditionMet: {
                provision: [],
              },
            },
    });
  };

  handleActionChange = (newAction) => {
    this.setState({ action: newAction });
  };

  addRow = () => {
    const newRow = {
      application: "",
      duration: "",
      value: "",
    };
    this.setState((prevState) => ({
      action: {
        ...prevState.action,
        conditionMet: {
          ...prevState.action.conditionMet,
          provision: [...prevState.action.conditionMet.provision, newRow],
        },
      },
    }));
  };

  validateAction = () => {
    const { ruleType, action } = this.state;
    let validationErrors = [];

    if (ruleType === "Allow") {
      if (!action.conditionNotMet?.message) {
        validationErrors.push("Message field for 'Allow' is required.");
      }
    } else if (ruleType === "Deny") {
      if (!action.conditionMet?.message) {
        validationErrors.push("Message field for 'Deny' is required.");
      }
    } else if (ruleType === "Auto Provision" || ruleType === "Auto Revoke") {
      if (!action.conditionMet.provision.length) {
        validationErrors.push(
          `At least one action is required for '${ruleType}'.`
        );
      }
      action.conditionMet.provision.forEach((item, index) => {
        if (!item.application) {
          validationErrors.push(
            `Action Row ${index + 1}, application field cannot be empty.`
          );
        }
        if (!item.duration) {
          validationErrors.push(
            `Action Row ${index + 1}, duration field cannot be empty.`
          );
        }
        if (!item.value) {
          validationErrors.push(
            `Action Row ${index + 1}, value field cannot be empty.`
          );
        }
      });
    }

    this.setState({ errors: validationErrors });
    return validationErrors.length === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validateAction()) {
      console.log(JSON.stringify(this.state.action));
    }
  };

  render() {
    const { ruleType, action, errors } = this.state;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <label>Select Rule Type</label>
              </Col>
              <Col md={6}>
                <select value={ruleType} onChange={this.handleRuleTypeChange}>
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
                onChange={this.handleActionChange}
                ruleType={ruleType}
              />
            </Row>
            {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") && (
              <Row>
                <Col md={12}>
                  <button type="button" onClick={this.addRow}>
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
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            )}
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
}

export default App;



import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const ActionOnCondition = ({ action, onChange, ruleType }) => {
  const handleInputChange = (index, key, value) => {
    const updatedRows = [...action.conditionMet.provision];
    updatedRows[index] = { ...updatedRows[index], [key]: value };
    onChange({
      ...action,
      conditionMet: {
        ...action.conditionMet,
        provision: updatedRows,
      },
    });
  };

  const handleRemoveRow = (index) => {
    const updatedRows = action.conditionMet.provision.filter(
      (_, i) => i !== index
    );
    onChange({
      ...action,
      conditionMet: {
        ...action.conditionMet,
        provision: updatedRows,
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

  const renderAutoFields = () =>
    action.conditionMet.provision?.map((row, index) => (
      <Row key={index} style={{ marginBottom: "10px" }}>
        <Col md={2} style={{ marginRight: "10px" }}>
          <input
            type="text"
            placeholder="Application"
            className="form-control"
            value={row.application || ""}
            onChange={(e) =>
              handleInputChange(index, "application", e.target.value)
            }
          />
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <label>Days</label>
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <select
            className="form-control"
            value={row.duration || ""}
            onChange={(e) =>
              handleInputChange(index, "duration", e.target.value)
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
        <Col md={2} style={{ marginRight: "10px" }}>
          <input
            type="text"
            placeholder="Value"
            className="form-control"
            value={row.value || ""}
            onChange={(e) => handleInputChange(index, "value", e.target.value)}
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
            </Col>
          </Row>
        )}
        {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") &&
          renderAutoFields()}
      </Col>
    </div>
  );
};

ActionOnCondition.propTypes = {
  action: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  ruleType: PropTypes.string.isRequired,
};

export default ActionOnCondition;
