import React, { useState } from 'react';

const MyComponent = () => {
    // Define the initial state for the conditions
    const [conditions, setConditions] = useState([]);

    // Define the handler for adding a condition
    const addCondition = () => {
        // Add a new condition object to the state array
        setConditions([...conditions, { type: 'condition', selectCondition: 'select', requestAttribute: 'select', requestOp: 'select', requestValue: '', groupAttribute: 'select', groupOp: 'select', groupValue: '', identityAttribute: 'select', identityOp: 'select', identityValue: '', locationAttribute: 'select', locationOp: 'select', locationValue: '' }]);
    };

    // Define the handler for adding a group condition
    const addGroupCondition = () => {
        // Add a new group condition object to the state array
        setConditions([...conditions, { type: 'groupCondition', conditions: [{ selectCondition: 'select', requestAttribute: 'select', requestOp: 'select', requestValue: '', groupAttribute: 'select', groupOp: 'select', groupValue: '', identityAttribute: 'select', identityOp: 'select', identityValue: '', locationAttribute: 'select', locationOp: 'select', locationValue: '' }], selectOperation : "select" }]);
    };

    // Define the handler for submitting the form
    const handleSubmit = () => {
        // Make a copy of the state array
        let newConditions = [...conditions];
        // Loop through the conditions and remove the unnecessary fields
        newConditions.forEach(condition => {
            if (condition.type === 'condition') {
                // Get the selected condition value
                let selectedCondition = condition.selectCondition;
                // Loop through the selectConditionFields object
                for (let [key, value] of Object.entries(selectConditionFields)) {
                    // If the key is not equal to the selected condition value, delete the fields from the condition object
                    if (key !== selectedCondition) {
                        value.forEach(field => delete condition[field]);
                    }
                }
            } else if (condition.type === 'groupCondition') {
                condition.conditions.forEach(nestedCondition => {
                    // Get the selected condition value
                    let selectedCondition = nestedCondition.selectCondition;
                    // Loop through the selectConditionFields object
                    for (let [key, value] of Object.entries(selectConditionFields)) {
                        // If the key is not equal to the selected condition value, delete the fields from the nested condition object
                        if (key !== selectedCondition) {
                            value.forEach(field => delete nestedCondition[field]);
                        }
                    }
                });
            }
        });
        // Log the new state array as JSON to the console
        console.log(JSON.stringify(newConditions));
    };

    // Define the handler for changing the value of a field in a condition
    const handleChange = (index, field, value) => {
        // Make a copy of the state array
        let newConditions = [...conditions];
        // Update the value of the field in the condition object at the given index
        newConditions[index][field] = value;
        // If the field is selectCondition, reset the other fields to their initial values
        if (field === 'selectCondition') {
            newConditions[index].requestAttribute = 'select';
            newConditions[index].requestOp = 'select';
            newConditions[index].requestValue = '';
            newConditions[index].groupAttribute = 'select';
            newConditions[index].groupOp = 'select';
            newConditions[index].groupValue = '';
            newConditions[index].identityAttribute = 'select';
            newConditions[index].identityOp = 'select';
            newConditions[index].identityValue = '';
            newConditions[index].locationAttribute = 'select';
            newConditions[index].locationOp = 'select';
            newConditions[index].locationValue = '';
        }
        // Set the new state array
        setConditions(newConditions);
    };

    // Define the handler for changing the value of a field in a nested condition
    const handleNestedChange = (index, nestedIndex, field, value) => {
        // Make a copy of the state array
        let newConditions = [...conditions];
        // Update the value of the field in the nested condition object at the given indexes
        newConditions[index].conditions[nestedIndex][field] = value;
        // If the field is selectCondition, reset the other fields to their initial values
        if (field === 'selectCondition') {
            newConditions[index].conditions[nestedIndex].requestAttribute = 'select';
            newConditions[index].conditions[nestedIndex].requestOp = 'select';
            newConditions[index].conditions[nestedIndex].requestValue = '';
            newConditions[index].conditions[nestedIndex].groupAttribute = 'select';
            newConditions[index].conditions[nestedIndex].groupOp = 'select';
            newConditions[index].conditions[nestedIndex].groupValue = '';
            newConditions[index].conditions[nestedIndex].identityAttribute = 'select';
            newConditions[index].conditions[nestedIndex].identityOp = 'select';
            newConditions[index].conditions[nestedIndex].identityValue = '';
            newConditions[index].conditions[nestedIndex].locationAttribute = 'select';
            newConditions[index].conditions[nestedIndex].locationOp = 'select';
            newConditions[index].conditions[nestedIndex].locationValue = '';
        }
        // Set the new state array
        setConditions(newConditions);
    };

    // Define the handler for adding a nested condition
    const addNestedCondition = (index) => {
        // Make a copy of the state array
        let newConditions = [...conditions];
        // Add a new nested condition object to the conditions array of the group condition object at the given index
        newConditions[index].conditions.push({ selectCondition: 'select', requestAttribute: 'select', requestOp: 'select', requestValue: '', groupAttribute: 'select', groupOp: 'select', groupValue: '', identityAttribute: 'select', identityOp: 'select', identityValue: '', locationAttribute: 'select', locationOp: 'select', locationValue: '' });
        // Set the new state array
        setConditions(newConditions);
    };

    // Define the handler for removing a condition
    const removeCondition = (index) => {
        // Make a copy of the state array
        let newConditions = [...conditions];
        // Remove the condition object at the given index
        newConditions.splice(index, 1);
        // Set the new state array
        setConditions(newConditions);
    };

    // Define the handler for removing a group condition
    const removeGroupCondition = (index) => {
        // Make a copy of the state array
        let newConditions = [...conditions];
        // Remove the group condition object at the given index
        newConditions.splice(index, 1);
        // Set the new state array
        setConditions(newConditions);
    };

    // Define the handler for removing a nested condition
    const removeNestedCondition = (index, nestedIndex) => {
        // Make a copy of the state array
        let newConditions = [...conditions];
        // Remove the nested condition object at the given indexes
        newConditions[index].conditions.splice(nestedIndex, 1);
        // Set the new state array
        setConditions(newConditions);
    };

    // Define the options for the select fields
    const selectConditionOptions = ['select', 'Request', 'group', 'identity', 'location'];
    const requestAttributeOptions = ['select', 'rqAtt1', 'reqAtt2'];
    const groupAttributeOptions = ['select', 'grpAtt1', 'grpAtt2'];
    const identityAttributeOptions = ['select', 'idAtt1', 'idAtt2'];
    const locationAttributeOptions = ['select', 'locAtt1', 'locAtt2'];
    const requestOpOptions = ['select', 'equal', 'noEqual'];
    const groupOpOptions = ['select', 'and', 'or', 'not'];
    const identityOpOptions = ['select', 'is', 'isNot'];
    const locationOpOptions = ['select', 'in', 'notIn'];
    const selectOperationOptions = ['select', 'AND', 'OR'];

    // Define an object that maps the selectCondition values to the corresponding fields
    const selectConditionFields = {
        Request: ['requestAttribute', 'requestOp', 'requestValue'],
        group: ['groupAttribute', 'groupOp', 'groupValue'],
        identity: ['identityAttribute', 'identityOp', 'identityValue'],
        location: ['locationAttribute', 'locationOp', 'locationValue']
    };
return (
    <div>
        <button onClick={addCondition}>Add Condition</button>
        <button onClick={addGroupCondition}>Add Group Condition</button>

        {conditions.map((condition, index) => (
            condition.type === "condition" ? 
            <div key={index}>
                {index > 0 && <div>Select Operation : <select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                    {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select></div>}
                Source : <select value={condition.selectCondition} onChange={(e) => handleChange(index, 'selectCondition', e.target.value)}>
                    {selectConditionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                {condition.selectCondition === 'Request' && <>
                    Request Attribute : <select value={condition.requestAttribute} onChange={(e) => handleChange(index, 'requestAttribute', e.target.value)}>
                        {requestAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Request Operation : <select value={condition.requestOp} onChange={(e) => handleChange(index, 'requestOp', e.target.value)}>
                        {requestOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Request Value : <input type="text" value={condition.requestValue} onChange={(e) => handleChange(index, 'requestValue', e.target.value)} />
                </>}
                {condition.selectCondition === 'group' && <>
                    Group Attribute : <select value={condition.groupAttribute} onChange={(e) => handleChange(index, 'groupAttribute', e.target.value)}>
                        {groupAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Group Operation : <select value={condition.groupOp} onChange={(e) => handleChange(index, 'groupOp', e.target.value)}>
                        {groupOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Group Value : <input type="text" value={condition.groupValue} onChange={(e) => handleChange(index, 'groupValue', e.target.value)} />
                </>}
                {condition.selectCondition === 'identity' && <>
                    Identity Attribute : <select value={condition.identityAttribute} onChange={(e) => handleChange(index, 'identityAttribute', e.target.value)}>
                        {identityAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Identity Operation : <select value={condition.identityOp} onChange={(e) => handleChange(index, 'identityOp', e.target.value)}>
                        {identityOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Identity Value : <input type="text" value={condition.identityValue} onChange={(e) => handleChange(index, 'identityValue', e.target.value)} />
                </>}
                {condition.selectCondition === 'location' && <>
                    Location Attribute : <select value={condition.locationAttribute} onChange={(e) => handleChange(index, 'locationAttribute', e.target.value)}>
                        {locationAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Location Operation : <select value={condition.locationOp} onChange={(e) => handleChange(index, 'locationOp', e.target.value)}>
                        {locationOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    Location Value : <input type="text" value={condition.locationValue} onChange={(e) => handleChange(index, 'locationValue', e.target.value)} />
                </>}
                <button onClick={() => removeCondition(index)}>Remove Row</button>
            </div> :
            // Handle group condition rendering here
            <div key={index}>
                {index > 0 && <div>Select Operation : <select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                    {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select></div>}
                <button onClick={() => addNestedCondition(index)}>Add Condition</button>
                {condition.conditions.map((nestedCondition, nestedIndex) => (
                    <div key={nestedIndex}>
                        {nestedIndex > 0 && <div>Select Operation : <select value={nestedCondition.selectOperation} onChange={(e) => handleNestedChange(index, nestedIndex, 'selectOperation', e.target.value)}>
                            {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select></div>}
                        Source : <select value={nestedCondition.selectCondition} onChange={(e) => handleNestedChange(index, nestedIndex, 'selectCondition', e.target.value)}>
                            {selectConditionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        {nestedCondition.selectCondition === 'Request' && <>
                            Request Attribute : <select value={nestedCondition.requestAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'requestAttribute', e.target.value)}>
                                {requestAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Request Operation : <select value={nestedCondition.requestOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'requestOp', e.target.value)}>
                                {requestOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Request Value : <input type="text" value={nestedCondition.requestValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'requestValue', e.target.value)} />
                        </>}
                        {nestedCondition.selectCondition === 'group' && <>
                            Group Attribute : <select value={nestedCondition.groupAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'groupAttribute', e.target.value)}>
                                {groupAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Group Operation : <select value={nestedCondition.groupOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'groupOp', e.target.value)}>
                                {groupOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Group Value : <input type="text" value={nestedCondition.groupValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'groupValue', e.target.value)} />
                        </>}
                        {nestedCondition.selectCondition === 'identity' && <>
                            Identity Attribute : <select value={nestedCondition.identityAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'identityAttribute', e.target.value)}>
                                {identityAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Identity Operation : <select value={nestedCondition.identityOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'identityOp', e.target.value)}>
                                {identityOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Identity Value : <input type="text" value={nestedCondition.identityValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'identityValue', e.target.value)} />
                        </>}
                        {nestedCondition.selectCondition === 'location' && <>
                            Location Attribute : <select value={nestedCondition.locationAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'locationAttribute', e.target.value)}>
                                {locationAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Location Operation : <select value={nestedCondition.locationOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'locationOp', e.target.value)}>
                                {locationOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            Location Value : <input type="text" value={nestedCondition.locationValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'locationValue', e.target.value)} />
                        </>}
                        <button onClick={() => removeNestedCondition(index, nestedIndex)}>Remove Row</button>
                    </div>
                ))}
                <button onClick={() => removeGroupCondition(index)}>Remove Group</button>
            </div>
        ))}

        <button onClick={handleSubmit}>Submit</button>
    </div>
);
};