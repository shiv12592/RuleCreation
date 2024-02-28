// import React and Component from react library
import React, { Component } from "react";

// define the EditRulePlain class component that extends Component
export class EditRulePlain extends Component {
  // define the propTypes and defaultProps as static properties
  static propTypes = {
    ruleDetails: PropTypes.object.isRequired,
  };
  static defaultProps = {};

  // define the constructor that takes props as an argument
  constructor(props) {
    // call the super constructor with props
    super(props);
    // initialize the state with the following properties
    this.state = {
      ruleDescription: "",
      errorMessage: null,
      newCategory: "",
      newCarId: "",
      newRuleOwner: "",
      requestData: [],
    };
  }

  // define the componentDidMount lifecycle method
  componentDidMount() {
    // get the ruleDetails and dispatchInitialize from props
    const { ruleDetails, dispatchInitialize } = this.props;
    // get the category, carId, owner, and requestData from ruleDetails
    const { category, carId, owner, requestData } = ruleDetails;
    // update the state with the values from ruleDetails
    this.setState({
      newCategory: category,
      newCarId: carId,
      newRuleOwner: owner,
      requestData: requestData,
    });
  }

  // define the handleCategoryChange method that takes updatedValues as an argument
  handleCategoryChange = (updatedValues) => {
    // update the state with the updatedValues
    this.setState(updatedValues);
  };

  // define the handleChange method that takes e and index as arguments
  handleChange = (e, index) => {
    // get the name and value from e.target
    const { name, value } = e.target;
    // make a copy of the requestData array from state
    const list = [...this.state.requestData];
    // update the list element at the given index with the name and value
    list[index][name] = value;
    // update the state with the modified list
    this.setState({ requestData: list });
  };

  // define the handleAdd method
  handleAdd = () => {
    // update the state by appending a new object with empty values to the requestData array
    this.setState({
      requestData: [
        ...this.state.requestData,
        { attribute: "", operation: "", value: "" },
      ],
    });
  };

  // define the handleRemove method that takes index as an argument
  handleRemove = (index) => {
    // make a copy of the requestData array from state
    const list = [...this.state.requestData];
    // remove the element at the given index from the list
    list.splice(index, 1);
    // update the state with the modified list
    this.setState({ requestData: list });
  };

  // define the render method
  render() {
    // get the newCategory, newCarId, newRuleOwner, and requestData from state
    const { newCategory, newCarId, newRuleOwner, requestData } = this.state;
    // return the JSX element
    return (
      <div>
        <Container className="col-md-12 pad-1 card-rounded margin-1-b">
          <Row>
            <RuleCategoryChangeEditApproval
              category={newCategory}
              carId={newCarId}
              ruleOwner={newRuleOwner}
              onChange={this.handleCategoryChange}
            />
          </Row>
        </Container>
        <Container>
          <div className="App">
            <h3>Request Form</h3>
            {requestData.map((item, i) => (
              <div key={i}>
                <select
                  name="attribute"
                  value={item.attribute}
                  onChange={(e) => this.handleChange(e, i)}
                >
                  <option value="">Select an attribute</option>
                  <option value="attr1">attr1</option>
                  <option value="attr2">attr2</option>
                  <option value="attr3">attr3</option>
                </select>
                {item.attribute && (
                  // only show the operation select if attribute is selected
                  <select
                    name="operation"
                    value={item.operation}
                    onChange={(e) => this.handleChange(e, i)}
                  >
                    <option value="">Select an operation</option>
                    <option value="add">add</option>
                    <option value="delete">delete</option>
                    <option value="update">update</option>
                  </select>
                )}
                {item.operation && (
                  // only show the value input if operation is selected
                  <input
                    name="value"
                    value={item.value}
                    onChange={(e) => this.handleChange(e, i)}
                    placeholder="Enter a value"
                  />
                )}
                {requestData.length > 1 && (
                  // only show the remove button if there are more than one rows
                  <button onClick={() => this.handleRemove(i)}>
                    Remove Request
                  </button>
                )}
              </div>
            ))}
            <button onClick={this.handleAdd}>Add Request</button>
            <div>
              <h3>Request Data</h3>
              <pre>{JSON.stringify(requestData, null, 2)}</pre>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

// export the EditRule component as a reduxForm with formOptions
export const EditRule = reduxForm(formOptions)(EditRulePlain);
