const handleEntlmentSuggestionClick = (app) => {
  const selectedId = app.id;
  setInputEntilmnetText(""); // Clear the input text
  setShowEntitlmentSuggestions(false); // Hide the suggestion list

  const updatedConditions = conditions.map((condition, index) => {
    if (condition.source === "Request") {
      let newValue = selectedId;
      // Add the selected ID to the existing requestValue array if it's not the first selection
      if (condition.requestAttribute === "entitlement" && condition.requestValue) {
        newValue = [...condition.requestValue, selectedId];
      } else {
        newValue = [selectedId];
      }
      return {
        ...condition,
        requestValue: newValue,
      };
    }
    return condition;
  });

  setConditions(updatedConditions);
};

const handleClearSelecetedEntitlment = (indexToRemove) => {
  const updatedConditions = conditions.map((condition, index) => {
    if (condition.source === "Request" && Array.isArray(condition.requestValue)) {
      const updatedValue = condition.requestValue.filter((_, i) => i !== indexToRemove);
      return {
        ...condition,
        requestValue: updatedValue,
      };
    }
    return condition;
  });

  setConditions(updatedConditions);
};


const handleEntlmentSuggestionClick = (app) => {
  const selectedId = app.id;
  setInputEntilmnetText(""); // Clear the input text
  setShowEntitlmentSuggestions(false); // Hide the suggestion list

  const updatedConditions = conditions.map((condition, index) => {
    if (condition.source === "Request") {
      let newValue = selectedId;
      // Add the selected ID to the existing requestValue array if it's not the first selection
      if (condition.requestAttribute === "entitlement" && condition.requestValue) {
        newValue = [...condition.requestValue, selectedId];
      } else {
        newValue = [selectedId];
      }
      return {
        ...condition,
        requestValue: newValue,
      };
    }
    return condition;
  });

  setConditions(updatedConditions);
};

------------------

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
      <div className="suggestion" key={app.id}>
        <span>({app.id})</span>
        <button onClick={() => handleEntlmentSuggestionClick(app)}>Add</button>
      </div>
    ))}
  </div>
)}
<div>
  {Array.isArray(condition.requestValue) &&
    condition.requestValue.map((id, idx) => (
      <div key={idx} className="selected-value" style={{ borderColor: "blue" }}>
        {id}
        <button onClick={() => handleClearSelecetedEntitlment(idx)}>X</button>
      </div>
    ))}
</div>
