import React, { useState } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

// Define the initial data for the select options
const selectCondition = ["select", "Request", "group"];
const requestAttribute = ["select", "rqAtt1", "reqAtt2"];
const groupAttrbute = ["select", "grpAtt1", "grpAtt2"];
const reqOp = ["select", "equal", "noEqual"];
const grOp = ["select", "and", "or", "not"];
const operation = ["select", "AND", "OR"];

// Define a custom component for each condition row
const ConditionRow = ({ data, index, onChange, onRemove }) => {
  // Destructure the data object
  const {
    selectCondition,
    requestAttribute,
    reqOp,
    reqValue,
    groupAttrbute,
    grOp,
    grValue,
    checked,
  } = data;

  // Handle the change of any input in the row
  const handleChange = (e) => {
    // Get the name and value of the input
    const { name, value } = e.target;
    // Call the onChange prop with the index and the updated data
    onChange(index, { ...data, [name]: value });
  };

  // Handle the change of the checkbox in the row
  const handleCheck = (e) => {
    // Get the checked status of the checkbox
    const { checked } = e.target;
    // Call the onChange prop with the index and the updated data
    onChange(index, { ...data, checked });
  };

  // Handle the click of the remove button in the row
  const handleRemove = () => {
    // Call the onRemove prop with the index
    onRemove(index);
  };

  // Return the JSX for the row
  return (
    <Row className="margin-1-tb line-border">
      <Col md={1}>
        <input
          type="checkbox"
          name="checked"
          checked={checked}
          onChange={handleCheck}
        />
      </Col>
      <Col md={2}>
        <label className="margin-1-lr">Source</label>
        <select
          name="selectCondition"
          value={selectCondition}
          onChange={handleChange}
        >
          {selectCondition.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Col>
      {selectCondition === "Request" && (
        <>
          <Col md={3}>
            <label className="margin-1-lr">Attribute</label>
            <select
              name="requestAttribute"
              value={requestAttribute}
              onChange={handleChange}
            >
              {requestAttribute.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Col>
          <Col md={2}>
            <label className="margin-1-lr">Request Op</label>
            <select name="reqOp" value={reqOp} onChange={handleChange}>
              {reqOp.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Col>
          <Col md={3}>
            <label className="margin-1-lr">Value</label>
            <input
              type="text"
              name="reqValue"
              value={reqValue}
              onChange={handleChange}
              placeholder="reqValue"
            />
          </Col>
        </>
      )}
      {selectCondition === "group" && (
        <>
          <Col md={3}>
            <label className="margin-1-lr">Attribute</label>
            <select
              name="groupAttrbute"
              value={groupAttrbute}
              onChange={handleChange}
            >
              {groupAttrbute.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Col>
          <Col md={2}>
            <label className="margin-1-lr">Group Op</label>
            <select name="grOp" value={grOp} onChange={handleChange}>
              {grOp.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Col>
          <Col md={3}>
            <label className="margin-1-lr">Value</label>
            <input
              type="text"
              name="grValue"
              value={grValue}
              onChange={handleChange}
              placeholder="grValue"
            />
          </Col>
        </>
      )}
      <Col md={1}>
        <Button
          className="rounded"
          variant="danger"
          onClick={handleRemove}
        >
          Remove
        </Button>
      </Col>
    </Row>
  );
};

// Define a custom component for each operation row
const OperationRow = ({ data, index, onChange }) => {
  // Destructure the data object
  const { operation } = data;

  // Handle the change of the select input in the row
  const handleChange = (e) => {
    // Get the value of the input
    const { value } = e.target;
    // Call the onChange prop with the index and the updated data
    onChange(index, { ...data, operation: value });
  };

  // Return the JSX for the row
  return (
    <Row className="margin-1-tb border-dash">
      <Col md={3}>
        <label className="margin-1-lr">Select Operation</label>
        <select name="operation" value={operation} onChange={handleChange}>
          {operation.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  );
};

// Define the main component for the rule creation
const MyComponent = () => {
  // Define the state for the rows data
  const [rows, setRows] = useState([]);

  // Define the state for the selected condition
  const [selectedCondition, setSelectedCondition] = useState("select");

  // Handle the change of the selected condition
  const handleConditionChange = (e) => {
    // Get the value of the input
    const { value } = e.target;
    // Set the selected condition state
    setSelectedCondition(value);
  };

  // Handle the click of the add row button
  const handleAddRow = () => {
    // Check if the selected condition is valid
    if (selectedCondition !== "select") {
      // Create a new row object with the selected condition and default values
      const newRow = {
        selectCondition: selectedCondition,
        requestAttribute: "select",
        reqOp: "select",
        reqValue: "",
        groupAttrbute: "select",
        grOp: "select",
        grValue: "",
        checked: false,
      };
      // Add the new row to the rows state
      setRows([...rows, newRow]);
      // Reset the selected condition state
      setSelectedCondition("select");
    }
  };

  // Handle the change of any row data
  const handleRowChange = (index, data) => {
    // Update the rows state with the new data
    setRows(rows.map((row, i) => (i === index ? data : row)));
  };

  // Handle the remove of any row
  const handleRowRemove = (index) => {
    // Remove the row from the rows state
    setRows(rows.filter((row, i) => i !== index));
  };

  // Handle the click of the group button
  const handleGroup = () => {
    // Get the indexes of the checked rows
    const checkedIndexes = rows
      .map((row, i) => (row.checked ? i : -1))
      .filter((i) => i !== -1);
    // Check if there are at least two checked rows
    if (checkedIndexes.length > 1) {
      // Create a new row object with the checked rows as an array
      const newRow = {
        selectCondition: "group",
        rows: checkedIndexes.map((i) => rows[i]),
      };
      // Remove the checked rows from the rows state and insert the new row
      setRows(
        rows
          .filter((row, i) => !row.checked)
          .concat(newRow)
          .sort((a, b) => a.index - b.index)
      );
    }
  };

  // Handle the click of the ungroup button
  const handleUngroup = (index) => {
    // Get the row data at the given index
    const row = rows[index];
    // Check if the row is a group
    if (row.selectCondition === "group") {
      // Remove the row from the rows state and insert the rows in the group
      setRows(
        rows
          .filter((row, i) => i !== index)
          .concat(row.rows)
          .sort((a, b) => a.index - b.index)
      );
    }
  };

// Handle the click of the submit button
  const handleSubmit = () => {
    // Convert the rows data into JSON format
    const jsonData = rows.map((row) => {
      // Check if the row is a group
      if (row.selectCondition === "group") {
        // Return an array of the rows in the group
        return row.rows.map((subRow) => ({
          selectCondition: subRow.selectCondition,
          requestAttribute: subRow.requestAttribute,
          reqOp: subRow.reqOp,
          reqValue: subRow.reqValue,
          groupAttrbute: subRow.groupAttrbute,
          grOp: subRow.grOp,
          grValue: subRow.grValue,
        }));
      } else {
        // Return an object with the row data
        return {
          selectCondition: row.selectCondition,
          requestAttribute: row.requestAttribute,
          reqOp: row.reqOp,
          reqValue: row.reqValue,
          groupAttrbute: row.groupAttrbute,
          grOp: row.grOp,
          grValue: row.grValue,
        };
      }
    });
    // Display the JSON data in the console
    console.log(jsonData);
  };

  // Return the JSX for the main component
  return (
    <div className="col-md-12">
      <Container className="col-md-12">
        <Row className="border-dash-tb margin-1-t margin-1-b">
          <label className="margin-1-lr">Add Condition</label>
          <select
            name="selectCondition"
            value={selectedCondition}
            onChange={handleConditionChange}
          >
            {selectCondition.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button
            className="rounded"
            variant="primary"
            onClick={handleAddRow}
          >
            Add Row
          </Button>
        </Row>
        {rows.map((row, index) => (
          <div key={index}>
            {row.selectCondition === "group" ? (
              <>
                <Button
                  className="rounded"
                  variant="warning"
                  onClick={() => handleUngroup(index)}
                >
                  Ungroup
                </Button>
                {row.rows.map((subRow, subIndex) => (
                  <ConditionRow
                    key={subIndex}
                    data={subRow}
                    index={subIndex}
                    onChange={handleRowChange}
                    onRemove={handleRowRemove}
                  />
                ))}
              </>
            ) : (
              <ConditionRow
                data={row}
                index={index}
                onChange={handleRowChange}
                onRemove={handleRowRemove}
              />
            )}
            {index < rows.length - 1 && (
              <OperationRow
                data={row}
                index={index}
                onChange={handleRowChange}
              />
            )}
          </div>
        ))}
        <Button
          className="rounded"
          variant="success"
          onClick={handleGroup}
        >
          Group
        </Button>
        <Button
          className="rounded"
          variant="info"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Container>
    </div>
  );
};

                              
