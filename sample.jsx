import React, { useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';

const MyComponent = () => {
    const [conditions, setConditions] = useState([]);

    // ... (existing code)

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

    // ... (rest of the existing code)

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
                        {/* ... (existing code for condition) */}
                    </Row> :
                    condition.type === "nestedGroup" ?
                        <Row key={index} className="border my-3">
                            <Col md={3}>
                                {index > 0 && <Form.Group>
                                    <Form.Label>Select Operation</Form.Label>
                                    <Form.Select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                                        {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                    </Form.Select>
                                </Form.Group>}
                                <Button variant="dark" onClick={() => addNestedCondition(index)}>Add Condition</Button>
                            </Col>
                            <Col md={9}>
                                {condition.conditions.map((nestedCondition, nestedIndex) => (
                                    <Row key={nestedIndex} className={nestedIndex > 0 ? "border-top border-dashed" : ""}>
                                        {/* ... (existing code for nested condition) */}
                                    </Row>
                                ))}
                                <Button variant="dark" onClick={() => removeGroupCondition(index)}>Remove Group</Button>
                            </Col>
                        </Row> :
                        // Handle group condition rendering here
                        <Row key={index} className="border my-3">
                            {/* ... (existing code for group condition) */}
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

export default MyComponent;
