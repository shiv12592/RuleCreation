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
    if (validateData(conditionData)) {
      const jsonString = JSON.stringify(conditionData, null, 2);
      setJsonData(jsonString);
      setErrorMessage("");
    }
  };

  const validateData = (data) => {
    if (!data || !data.conditions) return true; // No data to validate

    const errors = [];

    const traverse = (obj, context = []) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          traverse(obj[key], [...context, key]);
        } else {
          if (obj[key] === "") {
            errors.push(
              `Value for <${key}> should not be empty at ${context.join(
                " -> "
              )}`
            );
          }
        }
      }
    };

    traverse(data);

    if (errors.length > 0) {
      setErrorMessage(errors.join("\n"));
      return false;
    }

    return true;
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

