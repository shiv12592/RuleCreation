// import React and useState hook
import React, { useState } from 'react';

// define the AddRequest component
const AddRequest = ({ onChange, requestData }) => {
  // use state to keep track of the request attributes
  const [attributes, setAttributes] = useState(requestData || []);

  // define the options for the select elements
  const attributeOptions = ['attr1', 'attr2', 'attr3'];
  const operationOptions = ['add', 'delete', 'update'];

  // define a function to handle adding a new attribute
  const handleAddAttribute = () => {
    // create a new attribute object with default values
    const newAttribute = {
      attribute: '',
      operation: '',
      value: ''
    };
    // update the state with the new attribute
    setAttributes([...attributes, newAttribute]);
    // invoke the onChange prop with the new attribute array
    onChange([...attributes, newAttribute]);
  };

  // define a function to handle removing an attribute
  const handleRemoveAttribute = (index) => {
    // filter out the attribute at the given index
    const newAttributes = attributes.filter((attr, i) => i !== index);
    // update the state with the new attribute array
    setAttributes(newAttributes);
    // invoke the onChange prop with the new attribute array
    onChange(newAttributes);
  };

  // define a function to handle changing an attribute value
  const handleChangeAttribute = (index, key, value) => {
    // create a copy of the attribute array
    const newAttributes = [...attributes];
    // update the attribute at the given index with the new value
    newAttributes[index][key] = value;
    // update the state with the new attribute array
    setAttributes(newAttributes);
    // invoke the onChange prop with the new attribute array
    onChange(newAttributes);
  };

  // return the JSX element for the component
  return (
    <div className="add-request">
      <h3>Add Request</h3>
      {attributes.map((attr, i) => (
        <div className="attribute-row" key={i}>
          <select
            value={attr.attribute}
            onChange={(e) =>
              handleChangeAttribute(i, 'attribute', e.target.value)
            }
          >
            <option value="">Select Attribute</option>
            {attributeOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          {attr.attribute && (
            <select
              value={attr.operation}
              onChange={(e) =>
                handleChangeAttribute(i, 'operation', e.target.value)
              }
            >
              <option value="">Select Operation</option>
              {operationOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {attr.operation && (
            <input
              type="text"
              value={attr.value}
              onChange={(e) =>
                handleChangeAttribute(i, 'value', e.target.value)
              }
            />
          )}
          <button onClick={() => handleRemoveAttribute(i)}>
            Remove Request
          </button>
        </div>
      ))}
      <button onClick={handleAddAttribute}>Add Request Attribute</button>
    </div>
  );
};

// export the component
export default AddRequest;
