import React, { useState } from 'react'
import { Button, Form, Row, Col, Container } from 'react-bootstrap'

const MyComponent2 = () => {
  // Define the initial state for the conditions
  const [conditions, setConditions] = useState([])

  // Define the handler for adding a condition
  const addCondition = () => {
    // Add a new condition object to the state array
    setConditions([
      ...conditions,
      {
        type: 'condition',
        selectCondition: 'select',
        requestAttribute: 'select',
        requestOp: 'select',
        requestValue: '',
        groupAttribute: 'select',
        groupOp: 'select',
        groupValue: '',
        identityAttribute: 'select',
        identityOp: 'select',
        identityValue: '',
        locationAttribute: 'select',
        locationOp: 'select',
        locationValue: ''
      }
    ])
  }

  // Define the handler for adding a group condition
  const addGroupCondition = () => {
    // Add a new group condition object to the state array
    setConditions([
      ...conditions,
      {
        type: 'groupCondition',
        conditions: [
          {
            selectCondition: 'select',
            requestAttribute: 'select',
            requestOp: 'select',
            requestValue: '',
            groupAttribute: 'select',
            groupOp: 'select',
            groupValue: '',
            identityAttribute: 'select',
            identityOp: 'select',
            identityValue: '',
            locationAttribute: 'select',
            locationOp: 'select',
            locationValue: ''
          }
        ],
        selectOperation: 'select'
      }
    ])
  }

  // Define the handler for adding a nested group
  const addNestedGroup = (index) => {
    let newConditions = [...conditions]
    newConditions[index].conditions.push({
      type: 'nestedGroup',
      conditions: [
        {
          selectCondition: 'select',
          requestAttribute: 'select',
          requestOp: 'select',
          requestValue: '',
          groupAttribute: 'select',
          groupOp: 'select',
          groupValue: '',
          identityAttribute: 'select',
          identityOp: 'select',
          identityValue: '',
          locationAttribute: 'select',
          locationOp: 'select',
          locationValue: ''
        }
      ],
      selectOperation: 'select'
    })
    setConditions(newConditions)
  }

  // Define the handler for adding a nested condition
  const addNestedCondition = (index) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Add a new nested condition object to the conditions array of the group condition object at the given index
    newConditions[index].conditions.push({
      selectCondition: 'select',
      requestAttribute: 'select',
      requestOp: 'select',
      requestValue: '',
      groupAttribute: 'select',
      groupOp: 'select',
      groupValue: '',
      identityAttribute: 'select',
      identityOp: 'select',
      identityValue: '',
      locationAttribute: 'select',
      locationOp: 'select',
      locationValue: ''
    })
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for adding a nested condition
  const addInnerNestedCondition = (index, nestedIndex) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Add a new nested condition object to the conditions array of the group condition object at the given index
    newConditions[index].conditions[nestedIndex].conditions.push({
      selectCondition: 'select',
      requestAttribute: 'select',
      requestOp: 'select',
      requestValue: '',
      groupAttribute: 'select',
      groupOp: 'select',
      groupValue: '',
      identityAttribute: 'select',
      identityOp: 'select',
      identityValue: '',
      locationAttribute: 'select',
      locationOp: 'select',
      locationValue: ''
    })
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for submitting the form
  const handleSubmit = () => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Loop through the conditions and remove the unnecessary fields
    newConditions.forEach((condition) => {
      if (condition.type === 'condition') {
        // Get the selected condition value
        let selectedCondition = condition.selectCondition
        // Loop through the selectConditionFields object
        for (let [key, value] of Object.entries(selectConditionFields)) {
          // If the key is not equal to the selected condition value, delete the fields from the condition object
          if (key !== selectedCondition) {
            value.forEach((field) => delete condition[field])
          }
        }
      } else if (condition.type === 'groupCondition') {
        condition.conditions.forEach((nestedCondition) => {
          // Get the selected condition value
          let selectedCondition = nestedCondition.selectCondition
          // Loop through the selectConditionFields object
          for (let [key, value] of Object.entries(selectConditionFields)) {
            // If the key is not equal to the selected condition value, delete the fields from the nested condition object
            if (key !== selectedCondition) {
              value.forEach((field) => delete nestedCondition[field])
            }
          }
        })
        // Handle innerNestedConditions within nestedGroup
        condition.conditions.forEach((nestedCondition) => {
          if (nestedCondition.type === 'nestedGroup') {
            nestedCondition.conditions.forEach((innerNestedCondition) => {
              let innerSelectedCondition = innerNestedCondition.selectCondition
              // Loop through the selectConditionFields object for innerNestedCondition
              for (let [key, value] of Object.entries(selectConditionFields)) {
                // If the key is not equal to the selected condition value, delete the fields from the innerNestedCondition object
                if (key !== innerSelectedCondition) {
                  value.forEach((field) => delete innerNestedCondition[field])
                }
              }
            })
          }
        })
      }
    })
    // Log the new state array as JSON to the console

    const jsondata = JSON.stringify(newConditions, null, 2)
    console.log(jsondata)
  }

  // Define the handler for changing the value of a field in a condition
  const handleChange = (index, field, value) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Update the value of the field in the condition object at the given index
    newConditions[index][field] = value
    // If the field is selectCondition, reset the other fields to their initial values
    if (field === 'selectCondition') {
      newConditions[index].requestAttribute = 'select'
      newConditions[index].requestOp = 'select'
      newConditions[index].requestValue = ''
      newConditions[index].groupAttribute = 'select'
      newConditions[index].groupOp = 'select'
      newConditions[index].groupValue = ''
      newConditions[index].identityAttribute = 'select'
      newConditions[index].identityOp = 'select'
      newConditions[index].identityValue = ''
      newConditions[index].locationAttribute = 'select'
      newConditions[index].locationOp = 'select'
      newConditions[index].locationValue = ''
    }
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for changing the value of a field in a nested condition
  const handleNestedChange = (index, nestedIndex, field, value) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Update the value of the field in the nested condition object at the given indexes
    newConditions[index].conditions[nestedIndex][field] = value
    // If the field is selectCondition, reset the other fields to their initial values
    if (field === 'selectCondition') {
      newConditions[index].conditions[nestedIndex].requestAttribute = 'select'
      newConditions[index].conditions[nestedIndex].requestOp = 'select'
      newConditions[index].conditions[nestedIndex].requestValue = ''
      newConditions[index].conditions[nestedIndex].groupAttribute = 'select'
      newConditions[index].conditions[nestedIndex].groupOp = 'select'
      newConditions[index].conditions[nestedIndex].groupValue = ''
      newConditions[index].conditions[nestedIndex].identityAttribute = 'select'
      newConditions[index].conditions[nestedIndex].identityOp = 'select'
      newConditions[index].conditions[nestedIndex].identityValue = ''
      newConditions[index].conditions[nestedIndex].locationAttribute = 'select'
      newConditions[index].conditions[nestedIndex].locationOp = 'select'
      newConditions[index].conditions[nestedIndex].locationValue = ''
    }
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for changing the value of a field in a nested condition
  const handleInnerNestedConditionChange = (index, nestedIndex, innerNestedIndex, field, value) => {
    // Make a copy of the state array
    let newConditions = [...conditions]

    // Ensure the necessary array levels exist
    if (!newConditions[index]?.conditions || !newConditions[index].conditions[nestedIndex]?.innerNestedCondition) {
      // Initialize arrays if they don't exist
      newConditions[index].conditions = newConditions[index].conditions || []
      newConditions[index].conditions[nestedIndex] = newConditions[index].conditions[nestedIndex] || {}
      newConditions[index].conditions[nestedIndex].innerNestedCondition =
        newConditions[index].conditions[nestedIndex].innerNestedCondition || []
    }

    // Update the value of the field in the inner nested condition object at the given indexes
    newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex][field] = value

    if (field === 'selectCondition') {
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].requestAttribute = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].requestOp = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].requestValue = ''
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].groupAttribute = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].groupOp = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].groupValue = ''
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].identityAttribute = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].identityOp = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].identityValue = ''
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].locationAttribute = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].locationOp = 'select'
      newConditions[index].conditions[nestedIndex].conditions[innerNestedIndex].locationValue = ''
    }
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for removing a condition
  const removeCondition = (index) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Remove the condition object at the given index
    newConditions.splice(index, 1)
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for removing a group condition
  const removeGroupCondition = (index) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Remove the group condition object at the given index
    newConditions.splice(index, 1)
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for removing a group condition
  const removeNestedGroupCondition = (index, nestedIndex) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Remove the group condition object at the given index
    newConditions[index].conditions.splice(nestedIndex, 1)
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for removing a nested condition
  const removeInnerNestedCondition = (index, nestedIndex, innerNestedCondition) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Remove the nested condition object at the given indexes
    newConditions[index].conditions[nestedIndex].conditions.splice(innerNestedCondition, 1)
    // Set the new state array
    setConditions(newConditions)
  }

  // Define the handler for removing a nested condition
  const removeNestedCondition = (index, nestedIndex) => {
    // Make a copy of the state array
    let newConditions = [...conditions]
    // Remove the nested condition object at the given indexes
    newConditions[index].conditions.splice(nestedIndex, 1)
    // Set the new state array
    setConditions(newConditions)
  }
  // Define the options for the select fields
  const selectConditionOptions = ['select', 'Request', 'group', 'identity', 'location']
  const requestAttributeOptions = ['select', 'rqAtt1', 'reqAtt2']
  const groupAttributeOptions = ['select', 'grpAtt1', 'grpAtt2']
  const identityAttributeOptions = ['select', 'idAtt1', 'idAtt2']
  const locationAttributeOptions = ['select', 'locAtt1', 'locAtt2']
  const requestOpOptions = ['select', 'equal', 'noEqual']
  const groupOpOptions = ['select', 'and', 'or', 'not']
  const identityOpOptions = ['select', 'is', 'isNot']
  const locationOpOptions = ['select', 'in', 'notIn']
  const selectOperationOptions = ['select', 'AND', 'OR']

  // Define an object that maps the selectCondition values to the corresponding fields
  const selectConditionFields = {
    Request: ['requestAttribute', 'requestOp', 'requestValue'],
    group: ['groupAttribute', 'groupOp', 'groupValue'],
    identity: ['identityAttribute', 'identityOp', 'identityValue'],
    location: ['locationAttribute', 'locationOp', 'locationValue']
  }

  return (
    <div>
      <Container>
        <Row style={{ border: '1px solid #000', padding: '10px' }}>
          <Col md={12}>
            <Button variant="dark" onClick={addCondition}>
              Add Condition
            </Button>
            <Button variant="dark" onClick={addGroupCondition}>
              Add Group Condition
            </Button>
          </Col>
        </Row>

        {conditions.map((condition, index) =>
          condition.type === 'condition' ? (
            <Row key={index} style={{ border: '1px dashed #000', padding: '10px' }}>
              <Col md={3}>
                {index > 0 && (
                  <Form.Group>
                    <Form.Label>Select Operation</Form.Label>
                    <Form.Select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                      {selectOperationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <Form.Group>
                  <Form.Label>Source</Form.Label>
                  <Form.Select value={condition.selectCondition} onChange={(e) => handleChange(index, 'selectCondition', e.target.value)}>
                    {selectConditionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                {condition.selectCondition === 'Request' && (
                  <>
                    <Form.Group>
                      <Form.Label>Request Attribute</Form.Label>
                      <Form.Select
                        value={condition.requestAttribute}
                        onChange={(e) => handleChange(index, 'requestAttribute', e.target.value)}>
                        {requestAttributeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Request Operation</Form.Label>
                      <Form.Select value={condition.requestOp} onChange={(e) => handleChange(index, 'requestOp', e.target.value)}>
                        {requestOpOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Request Value</Form.Label>
                      <Form.Control
                        type="text"
                        value={condition.requestValue}
                        onChange={(e) => handleChange(index, 'requestValue', e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </Col>
              <Col md={3}>
                {condition.selectCondition === 'group' && (
                  <>
                    <Form.Group>
                      <Form.Label>Group Attribute</Form.Label>
                      <Form.Select value={condition.groupAttribute} onChange={(e) => handleChange(index, 'groupAttribute', e.target.value)}>
                        {groupAttributeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Group Operation</Form.Label>
                      <Form.Select value={condition.groupOp} onChange={(e) => handleChange(index, 'groupOp', e.target.value)}>
                        {groupOpOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Group Value</Form.Label>
                      <Form.Control
                        type="text"
                        value={condition.groupValue}
                        onChange={(e) => handleChange(index, 'groupValue', e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </Col>
              <Col md={3}>
                {condition.selectCondition === 'identity' && (
                  <>
                    <Form.Group>
                      <Form.Label>Identity Attribute</Form.Label>
                      <Form.Select
                        value={condition.identityAttribute}
                        onChange={(e) => handleChange(index, 'identityAttribute', e.target.value)}>
                        {identityAttributeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Identity Operation</Form.Label>
                      <Form.Select value={condition.identityOp} onChange={(e) => handleChange(index, 'identityOp', e.target.value)}>
                        {identityOpOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Identity Value</Form.Label>
                      <Form.Control
                        type="text"
                        value={condition.identityValue}
                        onChange={(e) => handleChange(index, 'identityValue', e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </Col>
              <Col md={3}>
                {condition.selectCondition === 'location' && (
                  <>
                    <Form.Group>
                      <Form.Label>Location Attribute</Form.Label>
                      <Form.Select
                        value={condition.locationAttribute}
                        onChange={(e) => handleChange(index, 'locationAttribute', e.target.value)}>
                        {locationAttributeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Location Operation</Form.Label>
                      <Form.Select value={condition.locationOp} onChange={(e) => handleChange(index, 'locationOp', e.target.value)}>
                        {locationOpOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Location Value</Form.Label>
                      <Form.Control
                        type="text"
                        value={condition.locationValue}
                        onChange={(e) => handleChange(index, 'locationValue', e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </Col>
              <Col md={3}>
                <Button variant="secondary" style={{ color: 'red', textDecoration: 'underline' }} onClick={() => removeCondition(index)}>
                  Remove Condition
                </Button>
              </Col>
            </Row>
          ) : (
            // Handle group condition rendering here
            <Row key={index} style={{ border: '3px double #000', padding: '10px' }}>
              <Col md={3}>
                {index > 0 && (
                  <Form.Group>
                    <Form.Label>Select Operation</Form.Label>
                    <Form.Select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                      {selectOperationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <Button variant="dark" onClick={() => addNestedCondition(index)}>
                  Add Nested Condition
                </Button>
                <Button variant="dark" onClick={() => addNestedGroup(index)}>
                  Add Nested Group Condition
                </Button>
              </Col>
              <Col md={9}>
                {condition.conditions.map((nestedCondition, nestedIndex) => (
                  <div key={nestedIndex}>
                    {/* Check condition.type for each nestedCondition */}
                    {nestedCondition.type === 'nestedGroup' ? (
                      <Row style={{ border: '2px groove #000', padding: '10px' }}>
                        <Col md={3}>
                          {nestedIndex > 0 && (
                            <Form.Group>
                              <Form.Label>Select Operation</Form.Label>
                              <Form.Select
                                value={nestedCondition.selectOperation}
                                onChange={(e) => handleNestedChange(index, nestedIndex, 'selectOperation', e.target.value)}>
                                {selectOperationOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          )}
                          <Button variant="dark" onClick={() => addInnerNestedCondition(index, nestedIndex)}>
                            Add InnerGroup Nested Condition
                          </Button>
                        </Col>
                        <Col md={9}>
                          {nestedCondition.conditions.map((innerNestedCondition, innerNestedIndex) => (
                            <Row
                              key={innerNestedIndex}
                              style={innerNestedIndex > 0 ? { border: '1px dotted #00FF00', padding: '10px' } : {}}>
                              {/* ... (existing code for inner nested condition) */}
                              <Col md={3}>
                                {innerNestedIndex > 0 && (
                                  <Form.Group>
                                    <Form.Label>Select Operation</Form.Label>
                                    <Form.Select
                                      value={innerNestedCondition.selectOperation}
                                      onChange={(e) =>
                                        handleInnerNestedConditionChange(
                                          index,
                                          nestedIndex,
                                          innerNestedIndex,
                                          'selectOperation',
                                          e.target.value
                                        )
                                      }>
                                      {selectOperationOptions.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                )}
                                <Form.Group>
                                  <Form.Label>Source</Form.Label>
                                  <Form.Select
                                    value={innerNestedCondition.selectCondition}
                                    onChange={(e) =>
                                      handleInnerNestedConditionChange(
                                        index,
                                        nestedIndex,
                                        innerNestedIndex,
                                        'selectCondition',
                                        e.target.value
                                      )
                                    }>
                                    {selectConditionOptions.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                {innerNestedCondition.selectCondition === 'Request' && (
                                  <>
                                    <Form.Group>
                                      <Form.Label>Request Attribute</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.requestAttribute}
                                        onChange={(e) =>
                                          handleInnerNestedConditionChange(
                                            index,
                                            nestedIndex,
                                            innerNestedIndex,
                                            'requestAttribute',
                                            e.target.value
                                          )
                                        }>
                                        {requestAttributeOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Request Operation</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.requestOp}
                                        onChange={(e) => handleChange(index, 'requestOp', e.target.value)}>
                                        {requestOpOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Request Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={innerNestedCondition.requestValue}
                                        onChange={(e) => handleChange(index, 'requestValue', e.target.value)}
                                      />
                                    </Form.Group>
                                  </>
                                )}
                              </Col>
                              <Col md={3}>
                                {innerNestedCondition.selectCondition === 'group' && (
                                  <>
                                    <Form.Group>
                                      <Form.Label>Group Attribute</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.groupAttribute}
                                        onChange={(e) =>
                                          handleInnerNestedConditionChange(
                                            index,
                                            nestedIndex,
                                            innerNestedIndex,
                                            'groupAttribute',
                                            e.target.value
                                          )
                                        }>
                                        {groupAttributeOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Group Operation</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.groupOp}
                                        onChange={(e) => handleChange(index, 'groupOp', e.target.value)}>
                                        {groupOpOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Group Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={innerNestedCondition.groupValue}
                                        onChange={(e) => handleChange(index, 'groupValue', e.target.value)}
                                      />
                                    </Form.Group>
                                  </>
                                )}
                              </Col>
                              <Col md={3}>
                                {innerNestedCondition.selectCondition === 'identity' && (
                                  <>
                                    <Form.Group>
                                      <Form.Label>Identity Attribute</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.identityAttribute}
                                        onChange={(e) =>
                                          handleInnerNestedConditionChange(
                                            index,
                                            nestedIndex,
                                            innerNestedIndex,
                                            'identityAttribute',
                                            e.target.value
                                          )
                                        }>
                                        {identityAttributeOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Identity Operation</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.identityOp}
                                        onChange={(e) => handleChange(index, 'identityOp', e.target.value)}>
                                        {identityOpOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Identity Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={innerNestedCondition.identityValue}
                                        onChange={(e) => handleChange(index, 'identityValue', e.target.value)}
                                      />
                                    </Form.Group>
                                  </>
                                )}
                              </Col>
                              <Col md={3}>
                                {innerNestedCondition.selectCondition === 'location' && (
                                  <>
                                    <Form.Group>
                                      <Form.Label>Location Attribute</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.locationAttribute}
                                        onChange={(e) =>
                                          handleInnerNestedConditionChange(
                                            index,
                                            nestedIndex,
                                            innerNestedIndex,
                                            'locationAttribute',
                                            e.target.value
                                          )
                                        }>
                                        {locationAttributeOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Location Operation</Form.Label>
                                      <Form.Select
                                        value={innerNestedCondition.locationOp}
                                        onChange={(e) => handleChange(index, 'locationOp', e.target.value)}>
                                        {locationOpOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                      <Form.Label>Location Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={innerNestedCondition.locationValue}
                                        onChange={(e) => handleChange(index, 'locationValue', e.target.value)}
                                      />
                                    </Form.Group>
                                  </>
                                )}
                              </Col>
                              <Col md={3}>
                                <Button
                                  variant="secondary"
                                  style={{ color: 'red', textDecoration: 'underline' }}
                                  onClick={() => removeInnerNestedCondition(index, nestedIndex, innerNestedIndex)}>
                                  Remove Row under nested grp
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <Button
                            variant="dark"
                            style={{ color: 'red', textDecoration: 'underline' }}
                            onClick={() => removeNestedGroupCondition(index, nestedIndex)}>
                            Remove Nested Group
                          </Button>
                        </Col>
                      </Row>
                    ) : (
                      <Row key={nestedIndex} style={nestedIndex > 0 ? { border: '1px dotted #FF0000', padding: '10px' } : {}}>
                        <Col md={3}>
                          {nestedIndex > 0 && (
                            <Form.Group>
                              <Form.Label>Select Operation</Form.Label>
                              <Form.Select
                                value={nestedCondition.selectOperation}
                                onChange={(e) => handleNestedChange(index, nestedIndex, 'selectOperation', e.target.value)}>
                                {selectOperationOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          )}
                          <Form.Group>
                            <Form.Label>Source</Form.Label>
                            <Form.Select
                              value={nestedCondition.selectCondition}
                              onChange={(e) => handleNestedChange(index, nestedIndex, 'selectCondition', e.target.value)}>
                              {selectConditionOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'Request' && (
                            <>
                              <Form.Group>
                                <Form.Label>Request Attribute</Form.Label>
                                <Form.Select
                                  value={nestedCondition.requestAttribute}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'requestAttribute', e.target.value)}>
                                  {requestAttributeOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Request Operation</Form.Label>
                                <Form.Select
                                  value={nestedCondition.requestOp}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'requestOp', e.target.value)}>
                                  {requestOpOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Request Value</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={nestedCondition.requestValue}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'requestValue', e.target.value)}
                                />
                              </Form.Group>
                            </>
                          )}
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'group' && (
                            <>
                              <Form.Group>
                                <Form.Label>Group Attribute</Form.Label>
                                <Form.Select
                                  value={nestedCondition.groupAttribute}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'groupAttribute', e.target.value)}>
                                  {groupAttributeOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Group Operation</Form.Label>
                                <Form.Select
                                  value={nestedCondition.groupOp}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'groupOp', e.target.value)}>
                                  {groupOpOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Group Value</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={nestedCondition.groupValue}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'groupValue', e.target.value)}
                                />
                              </Form.Group>
                            </>
                          )}
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'identity' && (
                            <>
                              <Form.Group>
                                <Form.Label>Identity Attribute</Form.Label>
                                <Form.Select
                                  value={nestedCondition.identityAttribute}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'identityAttribute', e.target.value)}>
                                  {identityAttributeOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Identity Operation</Form.Label>
                                <Form.Select
                                  value={nestedCondition.identityOp}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'identityOp', e.target.value)}>
                                  {identityOpOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Identity Value</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={nestedCondition.identityValue}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'identityValue', e.target.value)}
                                />
                              </Form.Group>
                            </>
                          )}
                        </Col>
                        <Col md={3}>
                          {nestedCondition.selectCondition === 'location' && (
                            <>
                              <Form.Group>
                                <Form.Label>Location Attribute</Form.Label>
                                <Form.Select
                                  value={nestedCondition.locationAttribute}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'locationAttribute', e.target.value)}>
                                  {locationAttributeOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Location Operation</Form.Label>
                                <Form.Select
                                  value={nestedCondition.locationOp}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'locationOp', e.target.value)}>
                                  {locationOpOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Location Value</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={nestedCondition.locationValue}
                                  onChange={(e) => handleNestedChange(index, nestedIndex, 'locationValue', e.target.value)}
                                />
                              </Form.Group>
                            </>
                          )}
                        </Col>
                        <Col md={3}>
                          <Button
                            variant="secondary"
                            style={{ color: 'red', textDecoration: 'underline' }}
                            onClick={() => removeNestedCondition(index, nestedIndex)}>
                            Remove Nested Condition
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </div>
                ))}
                <Button variant="dark" style={{ color: 'red', textDecoration: 'underline' }} onClick={() => removeGroupCondition(index)}>
                  Remove Group
                </Button>
              </Col>
            </Row>
          )
        )}
        <Row>
          <Col>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default MyComponent2
