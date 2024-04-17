//--------------in edit pag------------------

export class EditRulePlain extends Component {
	static propTypes={
		ruleDetails: PropTypes.object.isrequired,
	};
	state = {
    DepartmentArray: [];
	}

  updateDepartmentsArray = (updatedArray) => {
    this.setState({ departmentsArray: updatedArray });
  };

handleDepartmentSuggestionClick = (department) => {
  const { DepartmentArray } = this.state
  const existsIndex = DepartmentArray.findIndex((id) => id === department.id);

  if (existsIndex !== -1) {
    this.setState((prevId) => ({
      DepartmentArray:prevId.DepartmentArray.filter((id) => id !== department.id),
    }))

  } else {
    this.setState((prevId) => ({
      DepartmentArray:[ ...prevId.DepartmentArray, department.id],
    }))
  }
};
render() {
		const {
		
	} = this.state;
  const { ruleDetails } = this.props;
return (
<div>
<Container >
	<Row>
		<DepartmentSearch
				handleDepartmentSuggestionClick={this.handleDepartmentSuggestionClick}
				departments = {ruleDetails.Departments}
        selectedDepartments = {ruleDetails.Departments.map((department)=> ({
           id:department.id,
           name:department.name,
        }))}
        updateDepartmentsArray={this.updateDepartmentsArray}

			/>
	</Row>
</Container>
</div>
);
}
}

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { searchDepartments } from "./action";
import { getSearchedDepartments } from "./selectors";

const DepartmentSearch = ({ handleDepartmentSuggestionClick, selectedDepartments, 
  updateDepartmentsArray }) => {
  const dispatch = useDispatch();
  const departmentList = useSelector(getSearchedDepartments);
  const [inputDepartmentText, setInputDepartmentText] = useState("");
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);
  const [selectedDepartmentsState, setSelectedDepartments] = useState(selectedDepartments);

  const handleDepartmentInputChange = (e) => {
    setInputDepartmentText(e.target.value);
    debounceInputChange(e.target.value);
  };

  const debounceInputChange = useCallback(
    debounce((value) => {
      setIsDepartmentLoading(true);
      dispatch(searchDepartments(value)).then(() => {
        setIsDepartmentLoading(false);
        setShowDepartmentSuggestions(true);
      });
    }, 300),
    []
  );

  const handleDepartmentSet = (department) => {
    handleDepartmentSuggestionClick(department);
    setInputDepartmentText("");
    setShowDepartmentSuggestions(false);
    setSelectedDepartments([...selectedDepartmentsState, department]);
  };

  const handleRemoveDepartment = (departmentId) => {
    handleDepartmentSuggestionClick({ id: departmentId }); // Simulate department object for removal
    setSelectedDepartments((prevDepartments) =>
      prevDepartments.filter((department) => department.id !== departmentId)
    );
  };

  useEffect(() => {
    // Update parent's state when selectedDepartmentsState changes
    updateDepartmentsArray(selectedDepartmentsState);
  }, [selectedDepartmentsState, updateDepartmentsArray]);
  return (
    <div>
      <input
        type="text"
        value={inputDepartmentText}
        onChange={handleDepartmentInputChange}
        placeholder="Search by Department and select"
        style={{
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      {showDepartmentSuggestions && departmentList.data && (
        <div className="suggestions">
          {departmentList.data.map((department) => (
            <div
              className="suggestion"
              key={department.id}
              onClick={() => handleDepartmentSet(department)}
            >
              ({department.id})
            </div>
          ))}
        </div>
      )}
      {isDepartmentLoading && <div>Loading...</div>}
      <div>
        {selectedDepartments.map((department) => (
          <div key={department.id}>
            {department.id} - {department.name}
            <button onClick={() => handleRemoveDepartment(department.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSearch;

//-------------updated in edit page only getting updated array-------------

import React, { Component } from "react";
import PropTypes from "prop-types";
import DepartmentSearch from "./DepartmentSearch";

class EditRulePlain extends Component {
  static propTypes = {
    ruleDetails: PropTypes.object.isRequired,
  };

  state = {
    departmentsArray: [],
  };

  updateDepartmentsArray = (updatedArray) => {
    this.setState({ departmentsArray: updatedArray });
  };

  render() {
    const { ruleDetails } = this.props;
    return (
      <div>
        <DepartmentSearch
          selectedDepartments = {ruleDetails.Departments.map((department)=> ({
                   id:department.id,
                   name:department.name,
                }))}
          updateDepartmentsArray={this.updateDepartmentsArray}
        />
      </div>
    );
  }
}

export default EditRulePlain;

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { searchDepartments } from "./action";
import { getSearchedDepartments } from "./selectors";

const DepartmentSearch = ({ updateDepartmentsArray, selectedDepartments }) => {
  const dispatch = useDispatch();
  const departmentList = useSelector(getSearchedDepartments);
  const [inputDepartmentText, setInputDepartmentText] = useState("");
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);
  const [localSelectedDepartments, setLocalSelectedDepartments] = useState(selectedDepartments);

  useEffect(() => {
    // Update local state when selectedDepartments prop changes
    setLocalSelectedDepartments(selectedDepartments);
  }, [selectedDepartments]);

  const handleDepartmentInputChange = (e) => {
    setInputDepartmentText(e.target.value);
    debounceInputChange(e.target.value);
  };

  const debounceInputChange = useCallback(
    debounce((value) => {
      setIsDepartmentLoading(true);
      dispatch(searchDepartments(value)).then(() => {
        setIsDepartmentLoading(false);
        setShowDepartmentSuggestions(true);
      });
    }, 300),
    []
  );

  const handleDepartmentSuggestionClick = (department) => {
    const existsIndex = localSelectedDepartments.findIndex((item) => item.id === department.id);

    if (existsIndex !== -1) {
      setLocalSelectedDepartments((prevDepartments) =>
        prevDepartments.filter((item) => item.id !== department.id)
      );
      updateDepartmentsArray(localSelectedDepartments.filter((item) => item.id !== department.id));
    } else {
      setLocalSelectedDepartments((prevDepartments) => [...prevDepartments, department]);
      updateDepartmentsArray([...localSelectedDepartments, department]);
    }
  };

  const handleRemoveDepartment = (departmentId) => {
    setLocalSelectedDepartments((prevDepartments) =>
      prevDepartments.filter((department) => department.id !== departmentId)
    );
    updateDepartmentsArray(localSelectedDepartments.filter((item) => item.id !== departmentId));
  };

  return (
    <div>
      <input
        type="text"
        value={inputDepartmentText}
        onChange={handleDepartmentInputChange}
        placeholder="Search by Department and select"
        style={{
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      {showDepartmentSuggestions && departmentList.data && (
        <div className="suggestions">
          {departmentList.data.map((department) => (
            <div
              className="suggestion"
              key={department.id}
              onClick={() => handleDepartmentSuggestionClick(department)}
            >
              ({department.id})
            </div>
          ))}
        </div>
      )}
      {isDepartmentLoading && <div>Loading...</div>}
      <div>
        {localSelectedDepartments.map((department) => (
          <div key={department.id}>
            {department.id} - {department.name}
            <button onClick={() => handleRemoveDepartment(department.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSearch;
