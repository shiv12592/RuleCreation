import "./styles.css";
import React, { useState } from "react";
import RuleConditionRows from "./RuleConditionRows";

export default function App() {
  const [jsonData, setJsonData] = useState(null);
  const [conditionData, setConditionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConditionData = (data) => {
    setConditionData(data);
  };

  const handleSubmit = () => {
    const errorMessages = validateData(conditionData);
    if (errorMessages.length === 0) {
      const jsonString = JSON.stringify(conditionData, null, 2);
      setJsonData(jsonString);
      setErrorMessage("");
    } else {
      setErrorMessage(errorMessages.join("\n"));
    }
  };

  const validateData = (data) => {
    if (!data || !data.conditions) return [];

    let errors = [];

    const traverse = (obj, path = [], index = 0) => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          traverse(obj[key], [...path, key], index);
        } else {
          if (obj[key] === "") {
            errors.push(
              `Value for <${key}> under ${
                obj.Source
                  ? `${obj.Source} Condition Row Number ${index + 1}`
                  : "condition"
              } should not be empty.`
            );
          }
        }
      }
    };

    if (data.conditions.AND) {
      data.conditions.AND.forEach((condition, index) =>
        traverse(condition, ["conditions", "AND"], index)
      );
    }
    if (data.conditions.OR) {
      data.conditions.OR.forEach((condition, index) =>
        traverse(condition, ["conditions", "OR"], index)
      );
    }

    return errors;
  };

  return (
    <div>
      <h5>Start editing to see some magic happen!</h5>
      <div className="container">
        <RuleConditionRows onData={handleConditionData} />
      </div>
      <div className="container">
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {errorMessage && (
        <div style={{ color: "red" }}>
          <h5>Error:</h5>
          <p>{errorMessage}</p>
        </div>
      )}
      {jsonData && (
        <div>
          <h5>JSON Data:</h5>
          <pre>{jsonData}</pre>
        </div>
      )}
    </div>
  );
}
