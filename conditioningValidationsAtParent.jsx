import "./styles.css";
import React, { useState } from "react";
import RuleConditionRows from "./RuleConditionRows";

export default function App() {
  const [jsonData, setJsonData] = useState(null);
  const [conditionData, setConditionData] = useState(null);
  const [errorRequestMessages, setErrorRequestMessages] = useState([]);

  const handleConditionData = (data) => {
    setConditionData(data);
  };

  const handleSubmit = () => {
    const errorMessages = validateData(conditionData);
    if (errorMessages.length === 0) {
      const jsonString = JSON.stringify(conditionData, null, 2);
      setJsonData(jsonString);
      setErrorRequestMessages([]);
    } else {
      setErrorRequestMessages(errorMessages);
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
    <div>
      <h5>Start editing to see some magic happen!</h5>
      <div className="container">
        <RuleConditionRows onData={handleConditionData} />
      </div>
      <div className="container">
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {errorRequestMessages.length > 0 && (
        <div style={{ color: "red" }}>
          <h5>Error:</h5>
          {errorRequestMessages.map((error, index) => (
            <p key={index}>{`Error ${index + 1}: ${error}`}</p>
          ))}
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
