// ... (previous code)

// Define the handler for adding a nested group
const addNestedGroup = (index) => {
  // Make a copy of the state array
  let newConditions = [...conditions];
  // Add a new group condition object with an empty conditions array to the conditions array of the group condition object at the given index
  newConditions[index].conditions.push({ type: 'groupCondition', conditions: [], selectOperation: 'select' });
  // Set the new state array
  setConditions(newConditions);
};

// ... (previous code)

// Use the react-bootstrap components in the return part
return (
  <Container className="border p-3 col-md-12">
    <Row>
      <Col>
        <Button variant="dark" onClick={addCondition}>Add Condition</Button>
        <Button variant="dark" onClick={addGroupCondition}>Add Group Condition</Button>
      </Col>
    </Row>

    {conditions.map((condition, index) => (
      condition.type === 'condition' ? (
        <Row key={index} className="border my-3">
          {/* ... (previous code) */}
        </Row>
      ) : (
        // Handle group condition rendering here
        <Row key={index} className="border my-3">
          <Col md={3}>
            {index > 0 && (
              <Form.Group>
                <Form.Label>Select Operation</Form.Label>
                <Form.Select
                  value={condition.selectOperation}
                  onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}
                >
                  {selectOperationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Button variant="dark" onClick={() => addNestedCondition(index)}>
              Add Condition
            </Button>
            <Button variant="dark" onClick={() => addNestedGroup(index)}>
              Add Nested Group
            </Button>
          </Col>
          <Col md={9}>
            {condition.conditions.map((nestedCondition, nestedIndex) => (
              nestedCondition.type === 'condition' ? (
                // Render nested condition
                <Row key={nestedIndex} className={nestedIndex > 0 ? 'border-top border-dashed' : ''}>
                  {/* ... (previous code) */}
                  <Col md={3}>
                    <Button
                      variant="secondary"
                      style={{ color: 'red', textDecoration: 'underline' }}
                      onClick={() => removeNestedCondition(index, nestedIndex)}
                    >
                      Remove Row
                    </Button>
                  </Col>
                </Row>
              ) : (
                // Render nested group condition
                <Row key={nestedIndex} className={nestedIndex > 0 ? 'border-top border-dashed' : ''}>
                  {/* ... (similar code as in the outer conditions.map()) */}
                  <Col md={3}>
                    <Button
                      variant="secondary"
                      style={{ color: 'red', textDecoration: 'underline' }}
                      onClick={() => removeNestedGroup(index, nestedIndex)}
                    >
                      Remove Nested Group
                    </Button>
                  </Col>
                </Row>
              )
            ))}
            <Button variant="dark" onClick={() => removeGroupCondition(index)}>
              Remove Group
            </Button>
          </Col>
        </Row>
      )
    ))}
    <Row>
      <Col>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Col>
    </Row>
  </Container>
);
