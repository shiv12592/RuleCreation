import React, { useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';

const MyComponent2 = () => {

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
    setConditions([...conditions, { type: 'groupCondition', conditions: [{ selectCondition: 'select', requestAttribute: 'select', requestOp: 'select', requestValue: '', groupAttribute: 'select', groupOp: 'select', groupValue: '', identityAttribute: 'select', identityOp: 'select', identityValue: '', locationAttribute: 'select', locationOp: 'select', locationValue: '' }], selectOperation: "select" }]);
  };

  // Define the handler for adding a nested group
  const addNestedGroup = (index) => {
    let newConditions = [...conditions];
    newConditions[index].conditions.push({
      type: 'nestedGroup',
      conditions: [{ selectCondition: 'select', requestAttribute: 'select', requestOp: 'select', requestValue: '', groupAttribute: 'select', groupOp: 'select', groupValue: '', identityAttribute: 'select', identityOp: 'select', identityValue: '', locationAttribute: 'select', locationOp: 'select', locationValue: '' }],
      selectOperation: "select"
    });
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

    const jsondata = JSON.stringify(newConditions, null, 2);
    console.log((jsondata));
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
    <Container className="border p-3">
      <Row>
        <Col>
          <Button variant="dark" onClick={addCondition}>Add Condition</Button>
          <Button variant="dark" onClick={addGroupCondition}>Add Group Condition</Button>
        </Col>
      </Row>

      {conditions.map((condition, index) => (
        condition.type === "condition" ?
          <Row key={index} className="border my-3">
            <Col md={3}>
              {index > 0 && <Form.Group>
                <Form.Label>Select Operation</Form.Label>
                <Form.Select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                  {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </Form.Select>
              </Form.Group>}
              <Form.Group>
                <Form.Label>Source</Form.Label>
                <Form.Select value={condition.selectCondition} onChange={(e) => handleChange(index, 'selectCondition', e.target.value)}>
                  {selectConditionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              {condition.selectCondition === 'Request' && <>
                <Form.Group>
                  <Form.Label>Request Attribute</Form.Label>
                  <Form.Select value={condition.requestAttribute} onChange={(e) => handleChange(index, 'requestAttribute', e.target.value)}>
                    {requestAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Request Operation</Form.Label>
                  <Form.Select value={condition.requestOp} onChange={(e) => handleChange(index, 'requestOp', e.target.value)}>
                    {requestOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Request Value</Form.Label>
                  <Form.Control type="text" value={condition.requestValue} onChange={(e) => handleChange(index, 'requestValue', e.target.value)} />
                </Form.Group>
              </>}
            </Col>
            <Col md={3}>
              {condition.selectCondition === 'group' && <>
                <Form.Group>
                  <Form.Label>Group Attribute</Form.Label>
                  <Form.Select value={condition.groupAttribute} onChange={(e) => handleChange(index, 'groupAttribute', e.target.value)}>
                    {groupAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Group Operation</Form.Label>
                  <Form.Select value={condition.groupOp} onChange={(e) => handleChange(index, 'groupOp', e.target.value)}>
                    {groupOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Group Value</Form.Label>
                  <Form.Control type="text" value={condition.groupValue} onChange={(e) => handleChange(index, 'groupValue', e.target.value)} />
                </Form.Group>
              </>}
            </Col>
            <Col md={3}>
              {condition.selectCondition === 'identity' && <>
                <Form.Group>
                  <Form.Label>Identity Attribute</Form.Label>
                  <Form.Select value={condition.identityAttribute} onChange={(e) => handleChange(index, 'identityAttribute', e.target.value)}>
                    {identityAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Identity Operation</Form.Label>
                  <Form.Select value={condition.identityOp} onChange={(e) => handleChange(index, 'identityOp', e.target.value)}>
                    {identityOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Identity Value</Form.Label>
                  <Form.Control type="text" value={condition.identityValue} onChange={(e) => handleChange(index, 'identityValue', e.target.value)} />
                </Form.Group>
              </>}
            </Col>
            <Col md={3}>
              {condition.selectCondition === 'location' && <>
                <Form.Group>
                  <Form.Label>Location Attribute</Form.Label>
                  <Form.Select value={condition.locationAttribute} onChange={(e) => handleChange(index, 'locationAttribute', e.target.value)}>
                    {locationAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Location Operation</Form.Label>
                  <Form.Select value={condition.locationOp} onChange={(e) => handleChange(index, 'locationOp', e.target.value)}>
                    {locationOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Location Value</Form.Label>
                  <Form.Control type="text" value={condition.locationValue} onChange={(e) => handleChange(index, 'locationValue', e.target.value)} />
                </Form.Group>
              </>}
            </Col>
            <Col md={3}>
              <Button variant="secondary" style={{ color: 'red', textDecoration: 'underline' }} onClick={() => removeCondition(index)}>Remove Row</Button>
            </Col>
          </Row>:
            // Handle group condition rendering here
            <Row key={index} className="border my-3">
            {console.log('check condtion type----',condition)}
              <Col md={3}>
                {index > 0 && <Form.Group>
                  <Form.Label>Select Operation</Form.Label>
                  <Form.Select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                    {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Form.Select>
                </Form.Group>}
                <Button variant="dark" onClick={() => addNestedCondition(index)}>Add Condition</Button>
                <Button variant="dark" onClick={() => addNestedGroup(index)}>Add Nested Group Condition</Button>
              </Col>
              <Col md={9}>
                {condition.conditions.map((nestedCondition, nestedIndex) => (
                  <div key={nestedIndex}>
                    {/* Check condition.type for each nestedCondition */}
                    {nestedCondition.type === "nestedGroup" ?
                      <Row className="border my-3">
                        <Col md={3}>
                          {nestedIndex > 0 && <Form.Group>
                            <Form.Label>Select Operation</Form.Label>
                            <Form.Select value={nestedCondition.selectOperation} onChange={(e) => handleNestedChange(index, nestedIndex, 'selectOperation', e.target.value)}>
                              {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </Form.Select>
                          </Form.Group>}
                          <Button variant="dark" onClick={() => addNestedCondition(index)}>Add Condition</Button>
                        </Col>
                        <Col md={9}>
                          {nestedCondition.conditions.map((innerNestedCondition, innerNestedIndex) => (
                            <Row key={innerNestedIndex} className={innerNestedIndex > 0 ? "border-top border-dashed" : ""}>
                              {/* ... (existing code for inner nested condition) */}
                            </Row>
                          ))}
                          <Button variant="dark" onClick={() => removeGroupCondition(index)}>Remove Nested Group</Button>
                        </Col>
                      </Row> :
                      <Row key={nestedIndex} className={nestedIndex > 0 ? "border-top border-dashed" : ""}>
                      {console.log('check condtion type----',nestedCondition)}
                        <Col md={3}>
                          {nestedIndex > 0 && <Form.Group>
                            <Form.Label>Select Operation</Form.Label>
                            <Form.Select value={nestedCondition.selectOperation} onChange={(e) => handleNestedChange(index, nestedIndex, 'selectOperation', e.target.value)}>
                              {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </Form.Select>
                          </Form.Group>}
                          <Form.Group>
                            <Form.Label>Source</Form.Label>
                            <Form.Select value={nestedCondition.selectCondition} onChange={(e) => handleNestedChange(index, nestedIndex, 'selectCondition', e.target.value)}>
                              {selectConditionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'Request' && <>
                            <Form.Group>
                              <Form.Label>Request Attribute</Form.Label>
                              <Form.Select value={nestedCondition.requestAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'requestAttribute', e.target.value)}>
                                {requestAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Request Operation</Form.Label>
                              <Form.Select value={nestedCondition.requestOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'requestOp', e.target.value)}>
                                {requestOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Request Value</Form.Label>
                              <Form.Control type="text" value={nestedCondition.requestValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'requestValue', e.target.value)} />
                            </Form.Group>
                          </>}
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'group' && <>
                            <Form.Group>
                              <Form.Label>Group Attribute</Form.Label>
                              <Form.Select value={nestedCondition.groupAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'groupAttribute', e.target.value)}>
                                {groupAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Group Operation</Form.Label>
                              <Form.Select value={nestedCondition.groupOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'groupOp', e.target.value)}>
                                {groupOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Group Value</Form.Label>
                              <Form.Control type="text" value={nestedCondition.groupValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'groupValue', e.target.value)} />
                            </Form.Group>
                          </>}
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'identity' && <>
                            <Form.Group>
                              <Form.Label>Identity Attribute</Form.Label>
                              <Form.Select value={nestedCondition.identityAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'identityAttribute', e.target.value)}>
                                {identityAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Identity Operation</Form.Label>
                              <Form.Select value={nestedCondition.identityOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'identityOp', e.target.value)}>
                                {identityOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Identity Value</Form.Label>
                              <Form.Control type="text" value={nestedCondition.identityValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'identityValue', e.target.value)} />
                            </Form.Group>
                          </>}
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'location' && <>
                            <Form.Group>
                              <Form.Label>Location Attribute</Form.Label>
                              <Form.Select value={nestedCondition.locationAttribute} onChange={(e) => handleNestedChange(index, nestedIndex, 'locationAttribute', e.target.value)}>
                                {locationAttributeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Location Operation</Form.Label>
                              <Form.Select value={nestedCondition.locationOp} onChange={(e) => handleNestedChange(index, nestedIndex, 'locationOp', e.target.value)}>
                                {locationOpOptions.map(option => <option key={option} value={option}>{option}</option>)}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Location Value</Form.Label>
                              <Form.Control type="text" value={nestedCondition.locationValue} onChange={(e) => handleNestedChange(index, nestedIndex, 'locationValue', e.target.value)} />
                            </Form.Group>
                          </>}
                        </Col>
                        <Col md={3}>
                          <Button variant="secondary" style={{ color: 'red', textDecoration: 'underline' }} onClick={() => removeNestedCondition(index, nestedIndex)}>Remove Row</Button>
                        </Col>
                      </Row>
                    }
                  </div>
                ))}
                <Button variant="dark" onClick={() => removeGroupCondition(index)}>Remove Group</Button>
              </Col>
            </Row>
      ))}
      <Row>
        <Col>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MyComponent2;