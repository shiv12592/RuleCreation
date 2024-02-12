import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUsers, searchApps } from "../actions"; // import your actions
import { Container, Row, Col, Form, ProgressBar, Button } from "react-bootstrap"; // import bootstrap components

const RuleCategoryChange = ({ onRuleChange }) => {
  // get data from redux store
  const appsSearchList = useSelector(getSearchedApps);
  const usersList = useSelector(getUsers);

  // create local state for input fields and labels
  const [category, setCategory] = useState("");
  const [carId, setCarId] = useState("");
  const [ruleOwner, setRuleOwner] = useState("");
  const [carIdLabel, setCarIdLabel] = useState("");
  const [ruleOwnerLabel, setRuleOwnerLabel] = useState("");

  // create a dispatch function
  const dispatch = useDispatch();

  // handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    // reset other fields
    setCarId("");
    setRuleOwner("");
    setCarIdLabel("");
    setRuleOwnerLabel("");
  };

  // handle car id change
  const handleCarIdChange = (e) => {
    setCarId(e.target.value);
    // dispatch search apps action
    dispatch(searchApps(e.target.value));
  };

  // handle car id select
  const handleCarIdSelect = (app) => {
    // set car id label
    setCarIdLabel(`${app.applName} (${app.applId})`);
    // set rule owner label based on category
    if (category === "Application policies" || category === "") {
      setRuleOwnerLabel(app.techOwnerFullName);
    }
    // clear car id input
    setCarId("");
    // dispatch load users action
    dispatch(loadUsers(app.applId));
  };

  // handle rule owner change
  const handleRuleOwnerChange = (e) => {
    setRuleOwner(e.target.value);
    // dispatch search apps action
    dispatch(searchApps(e.target.value));
  };

  // handle rule owner select
  const handleRuleOwnerSelect = (user) => {
    // set rule owner label
    setRuleOwnerLabel(user.techOwnerFullName);
    // clear rule owner input
    setRuleOwner("");
  };

  // handle car id label clear
  const handleCarIdLabelClear = () => {
    setCarIdLabel("");
  };

  // handle rule owner label clear
  const handleRuleOwnerLabelClear = () => {
    setRuleOwnerLabel("");
    // set default rule owner based on category
    if (category === "Organizational policies") {
      setRuleOwnerLabel("Patrick Jeniffer");
    }
  };

  // handle rule change
  const handleRuleChange = () => {
    // create a rule object
    const rule = {
      category,
      carId: carIdLabel,
      ruleOwner: ruleOwnerLabel,
    };
    // pass the rule to the parent component
    onRuleChange(rule);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            <option value="Application policies">Application policies</option>
            <option value="Organizational policies">Organizational policies</option>
          </Form.Control>
        </Col>
        <Col>
          <Form.Label>Car Id</Form.Label>
          <Form.Control
            type="text"
            value={carId}
            onChange={handleCarIdChange}
            placeholder="Search by car id"
          />
          {carIdLabel && (
            <div className="label-container">
              <span className="label-text">{carIdLabel}</span>
              <Button variant="light" onClick={handleCarIdLabelClear}>
                X
              </Button>
            </div>
          )}
          {appsSearchList.status === "loading" && <ProgressBar animated now={100} />}
          {appsSearchList.data && (
            <ul className="suggestion-list">
              {appsSearchList.data.map((app) => (
                <li
                  key={app.applId}
                  onClick={() => handleCarIdSelect(app)}
                  className="suggestion-item"
                >
                  {app.applName} ({app.applId})
                </li>
              ))}
            </ul>
          )}
        </Col>
        <Col>
          <Form.Label>Rule Owner</Form.Label>
          <Form.Control
            type="text"
            value={ruleOwner}
            onChange={handleRuleOwnerChange}
            placeholder="Search by rule owner"
          />
          {ruleOwnerLabel && (
            <div className="label-container">
              <span className="label-text">{ruleOwnerLabel}</span>
              <Button variant="light" onClick={handleRuleOwnerLabelClear}>
                X
              </Button>
            </div>
          )}
          {usersList.status === "loading" && <ProgressBar animated now={100} />}
          {usersList.data && (
            <ul className="suggestion-list">
              {usersList.data.map((user) => (
                <li
                  key={user.techOwnerFullName}
                  onClick={() => handleRuleOwnerSelect(user)}
                  className="suggestion-item"
                >
                  {user.techOwnerFullName}
                </li>
              ))}
            </ul>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={handleRuleChange}>Submit</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RuleCategoryChange;
