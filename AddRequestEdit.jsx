// AddRequest.js
import React, { useState } from "react";

export default function AddRequest({ onChange }) {
  // initialize the state with an empty array
  const [requestData, setRequestData] = useState([]);

  // handle the change of the select and input fields
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...requestData];
    list[index][name] = value;
    setRequestData(list);
    onChange(list); // pass the updated list to the parent component
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
    onChange(list); // pass the updated list to the parent component
  };

  // render the form elements based on the state array
  return (
    <div className="AddRequest">
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
    </div>
  );
}

// EditRulePlain.js
import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import AddRequest from "./AddRequest";
import RuleCategoryChangeEditApproval from "./RuleCategoryChangeEditApproval";
import { Container, Row } from "react-bootstrap";

export class EditRulePlain extends Component {
  static propTypes = {
    ruleDetails: PropTypes.object.isRequired,
  };
  static defaultProps = {};
  state = {
    ruleDescription: "",
    errorMessage: null,
    newCategory: "",
    newCarId: "",
    newRuleOwner: "",
    requestData: [],
  };
  constructor(props) {
    super(props);
    this.handleRequestData = this.handleRequestData.bind(this); // bind the handleRequestData method
  }

  componentDidMount() {
    const { ruleDetails } = this.props;
    const ruleCategory = ruleDetails.category;
    const carId = ruleDetails.carId;
    const ruleOwner = ruleDetails.owner;
    this.setState({
      newCategory: ruleCategory,
      newCarId: carId,
      newRuleOwner: ruleOwner,
      requestData: ruleDetails.requestData, // set the initial requestData from the props
    });
  }

  handleCategoryChange = (updatedValues) => {
    this.setState(updatedValues);
  };

  handleRequestData = (updatedList) => {
    // this method will receive the updated list from the AddRequest component
    this.setState({ requestData: updatedList }); // update the state with the new list
  };

  render() {
    const { formFields } = this.props;
    const { newCategory, newCarId, newRuleOwner } = this.state;
    return (
      <div>
        <Container className="col-md-12 pad-1 card-rounded margin-1-b">
          <Row>
            <AddRequest onChange={this.handleRequestData} />
            <RuleCategoryChangeEditApproval
              category={newCategory}
              carId={newCarId}
              ruleOwner={newRuleOwner}
              onChange={this.handleCategoryChange}
            />
          </Row>
        </Container>
      </div>
    );
  }
}
export const EditRule = reduxForm(formOptions)(EditRulePlain);
