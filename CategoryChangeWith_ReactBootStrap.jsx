import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSearchedApps, getUsers, loadUsers, searchApps } from './actions'; // Import actions accordingly
import { Form, Col, InputGroup, Button } from 'react-bootstrap'; // Import react-bootstrap components

const RuleCategoryChange = ({ onChange }) => {
    const dispatch = useDispatch();
    const appsSearchList = useSelector(getSearchedApps);
    const usersList = useSelector(getUsers);

    const [category, setCategory] = useState('');
    const [carId, setCarId] = useState('');
    const [ruleOwner, setRuleOwner] = useState('');
    const [inputCarIdText, setInputCarIdText] = useState('');
    const [inputRuleOwnerText, setInputRuleOwnerText] = useState('');
    const [showCarIdSuggestions, setShowCarIdSuggestions] = useState(false);
    const [showRuleOwnerSuggestions, setShowRuleOwnerSuggestions] = useState(false);

    // Handle category change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        if (e.target.value === 'Organizational Policies') {
            setRuleOwner('Patrick Jeniffer');
        }
        // Send selected values back to parent component
        onChange({ category: e.target.value, carId, ruleOwner });
    };

    // Handle car id input change
    const handleCarIdInputChange = (e) => {
        setInputCarIdText(e.target.value);
        // Dispatch action to load users based on input text
        dispatch(loadUsers(e.target.value));
        // Show suggestions if input text is not empty
        setShowCarIdSuggestions(e.target.value !== '');
    };

    // Handle car id selection from suggestions
    const handleCarIdSelection = (app) => {
        // Set car id and rule owner values based on selected app
        setCarId(`${app.applName} (${app.applId})`);
        setRuleOwner(app.techOwnerFullName);
        // Clear input text and hide suggestions
        setInputCarIdText('');
        setShowCarIdSuggestions(false);
        // Send selected values back to parent component
        onChange({ category, carId: `${app.applName} (${app.applId})`, ruleOwner: app.techOwnerFullName });
    };

    // Handle rule owner input change
    const handleRuleOwnerInputChange = (e) => {
        setInputRuleOwnerText(e.target.value);
        // Dispatch action to search apps based on input text
        dispatch(searchApps(e.target.value));
        // Show suggestions if input text is not empty
        setShowRuleOwnerSuggestions(e.target.value !== '');
    };

    // Handle rule owner selection from suggestions
    const handleRuleOwnerSelection = (user) => {
        // Set rule owner value based on selected user
        setRuleOwner(user.techOwnerFullName);
        // Clear input text and hide suggestions
        setInputRuleOwnerText('');
        setShowRuleOwnerSuggestions(false);
        // Send selected values back to parent component
        onChange({ category, carId, ruleOwner: user.techOwnerFullName });
    };

    // Handle clear button for car id
    const handleClearCarId = () => {
        // Reset car id and rule owner values
        setCarId('');
        setRuleOwner('');
        // Send selected values back to parent component
        onChange({ category, carId: '', ruleOwner: '' });
    };

    // Handle clear button for rule owner
    const handleClearRuleOwner = () => {
        // Reset rule owner value
        setRuleOwner('');
        // Send selected values back to parent component
        onChange({ category, carId, ruleOwner: '' });
    };

    return (
        <div>
            {/* Category Row */}
            <Form.Row>
                <Form.Group as={Col} md="2">
                    <Form.Label>Category</Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Control
                        as="select"
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">--Select--</option>
                        <option value="Application Policies">Application Policies</option>
                        <option value="Organizational Policies">Organizational Policies</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>

            {/* Car ID Row */}
            <Form.Row>
                <Form.Group as={Col} md="2">
                    <Form.Label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
                        Car ID
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            value={inputCarIdText}
                            onChange={handleCarIdInputChange}
                            placeholder="Search by name or ID and select"
                        />
                        {/* Show suggestions if available */}
                        {showCarIdSuggestions && usersList.data && (
                            <div className="suggestions" style={{ overflowY: 'scroll', maxHeight: '200px' }}>
                                {usersList.data.map((app) => (
                                    <div
                                        className="suggestion"
                                        key={app.applId}
                                        onClick={() => handleCarIdSelection(app)}
                                    >
                                        {app.applName} ({app.applId}) - {app.techOwnerFullName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    {/* Show selected car id value with clear button */}
                    {carId && (
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={carId}
                                readOnly
                                style={{ borderColor: 'blue' }}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={handleClearCarId}>
                                    X
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )}
                </Form.Group>
            </Form.Row>

            {/* Rule Owner Row */}
            <Form.Row>
                <Form.Group as={Col} md="2">
                    <Form.Label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
                        Rule Owner
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            value={inputRuleOwnerText}
                            onChange={handleRuleOwnerInputChange}
                            placeholder="Search by name or ID and select"
                        />
                        {/* Show suggestions if available */}
                        {showRuleOwnerSuggestions && appsSearchList.data && (
                            <div className="suggestions" style={{ overflowY: 'scroll', maxHeight: '200px' }}>
                                {appsSearchList.data.map((user) => (
                                    <div
                                        className="suggestion"
                                        key={user.ecn}
                                        onClick={() => handleRuleOwnerSelection(user)}
                                    >
                                        {user.applId}-{user.techOwnerFullName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    {/* Show selected rule owner value with clear button */}
                    {ruleOwner && (
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={ruleOwner}
                                readOnly
                                style={{ borderColor: 'blue' }}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={handleClearRuleOwner}>
                                    X
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )}
                </Form.Group>
            </Form.Row>
        </div>
    );
};

export default RuleCategoryChange;
