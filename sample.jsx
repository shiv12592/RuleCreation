return (
    <Container className="border p-3">
        <Row>
            <Col>
                <Button variant="dark" onClick={addCondition}>Add Condition</Button>
                <Button variant="dark" onClick={addGroupCondition}>Add Group Condition</Button>
            </Col>
        </Row>

        {conditions.map((condition, index) => (
            <Row key={index} className="border my-3">
                <Col md={3}>
                    {index > 0 && <Form.Group>
                        <Form.Label>Select Operation</Form.Label>
                        <Form.Select value={condition.selectOperation} onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}>
                            {selectOperationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </Form.Select>
                    </Form.Group>}
                    {condition.type === "nestedGroup" &&
                        <Button variant="dark" onClick={() => addNestedCondition(index)}>Add Nested Condition</Button>
                    }
                    {condition.type === "groupCondition" &&
                        <>
                            <Button variant="dark" onClick={() => addNestedCondition(index)}>Add Nested Condition</Button>
                            <Button variant="dark" onClick={() => addNestedGroup(index)}>Add Nested Group</Button>
                        </>
                    }
                </Col>
                <Col md={9}>
                    {condition.conditions.map((nestedCondition, nestedIndex) => (
                        <Row key={nestedIndex} className={nestedIndex > 0 ? "border-top border-dashed" : ""}>
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
                                {/* ... (continue with other condition types) */}
                            </Col>
                            {/* Include other columns for additional fields in nested conditions */}
                            <Col md={3}>
                                <Button variant="secondary" style={{ color: 'red', textDecoration: 'underline' }} onClick={() => removeNestedCondition(index, nestedIndex)}>Remove Row</Button>
                            </Col>
                        </Row>
                    ))}
                    {condition.type === "nestedGroup" &&
                        <Button variant="dark" onClick={() => addNestedCondition(index)}>Add Nested Condition</Button>
                    }
                    {condition.type === "groupCondition" &&
                        <Button variant="dark" onClick={() => removeGroupCondition(index)}>Remove Group</Button>
                    }
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


=====================


    {/* ... (continue with other condition types) */}
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
{/* ... (continue with other condition types) */}
