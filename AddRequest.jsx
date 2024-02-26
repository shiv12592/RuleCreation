import React, { useState } from "react";

function App() {
  // initialize the state with an empty array
  const [requestData, setRequestData] = useState([]);

  // handle the change of the select and input fields
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...requestData];
    list[index][name] = value;
    setRequestData(list);
  };

  // handle the click of the add request button
  const handleAdd = () => {
    // add a new object with empty values to the state array
    setRequestData([
      ...requestData,
      { attribute: "", operation: "", value: "" },
    ]);
  };

  // handle the click of the remove request button
  const handleRemove = (index) => {
    // remove the object at the given index from the state array
    const list = [...requestData];
    list.splice(index, 1);
    setRequestData(list);
  };

  // render the form elements based on the state array
  return (
    <div className="App">
      <h3>Request Form</h3>
      {requestData.map((item, i) => (
        <div key={i}>
          <select
            name="attribute"
            value={item.attribute}
            onChange={(e) => handleChange(e, i)}
          >
            <option value="">Select an attribute</option>
            <option value="attr1">attr1</option>
            <option value="attr2">attr2</option>
            <option value="attr3">attr3</option>
          </select>
          {item.attribute && ( // only show the operation select if attribute is selected
            <select
              name="operation"
              value={item.operation}
              onChange={(e) => handleChange(e, i)}
            >
              <option value="">Select an operation</option>
              <option value="add">add</option>
              <option value="delete">delete</option>
              <option value="update">update</option>
            </select>
          )}
          {item.operation && ( // only show the value input if operation is selected
            <input
              name="value"
              value={item.value}
              onChange={(e) => handleChange(e, i)}
              placeholder="Enter a value"
            />
          )}
          {requestData.length > 1 && ( // only show the remove button if there are more than one rows
            <button onClick={() => handleRemove(i)}>Remove Request</button>
          )}
        </div>
      ))}
      <button onClick={handleAdd}>Add Request</button>
      <div>
        <h3>Request Data</h3>
        <pre>{JSON.stringify(requestData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
