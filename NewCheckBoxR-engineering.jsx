
for belo you need to pass default data as ,,

   const [conditions, setConditions] = useState([
    //   {
    //     Source: 'Request',
    //     requestAttribute: '',
    //     requestValue: 'sdfsd',
    //     selectOperation: 'AND'
    //   },
    //   {
    //     Source: 'Identity',
    //     identityAttribute: '',
    //     identityValue: 'dfvsd',
    //     selectOperation: 'AND'
    //   },
    //   {
    //     rows: [
    //       {
    //         Source: 'Request',
    //         requestAttribute: '',
    //         requestValue: 'basjdghasjf',
    //         selectOperation: 'AND'
    //       },
    //       {
    //         Source: 'Identity',
    //         identityAttribute: '',
    //         identityValue: 'sdfsd',
    //         selectOperation: 'AND'
    //       }
    //     ],
    //     selectOperation: 'OR'
    //   }
  ])



  const handleSubmit = () => {
    // Submit all added conditions and display them in JSON format in the console
    console.log('wihtout formate-------------', JSON.stringify({ conditions, selectOperation }, null, 2))
    console.log('with formate-------------', JSON.stringify({ conditions: format(conditions, selectOperation) }, null, 2))
  }



const renderConditionRow = (condition, index, isGrouped = false, isInner = false) => {
    // Define a function to determine if the fields should be disabled
    const isDisabled = () => {
      // Add your condition here, for example, if you want to disable all inner fields
      // You can change this condition as per your requirement
      return isInner
    }

    // Render a single condition row based on the condition object and index
    return condition.rows && condition.selectOperation ? (
      // Render a grouped condition row with a nested table and a select operation
      <table style={{ border: '1px solid black', margin: '10px' }} key={index}>
        <tbody>
          <tr style={{ border: '1px solid black' }}>
            {!isInner && (
              <td>
                <input
                  type="checkbox"
                  checked={isGrouped ? condition.checked : selectedRows.includes(index)}
                  onChange={() => (isGrouped ? handleChangeInner(index, null, 'checked', !condition.checked) : handleSelectRow(index))}
                />
              </td>
            )}
            <td>
              <label>Select Operation</label>
              <select
                value={condition.selectOperation}
                onChange={(e) => handleChange(index, 'selectOperation', e.target.value)}
                disabled={isDisabled()} // Add the disabled attribute
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </td>
            <td>
              {condition.rows.map((row, i) => (
                <div key={i}>{renderConditionRow(row, i, true, true)}</div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      // Render a normal condition row with dropdowns and input
      <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }} key={index}>
        {!isInner && (
          <input
            type="checkbox"
            checked={isGrouped ? condition.checked : selectedRows.includes(index)}
            onChange={() => (isGrouped ? handleChangeInner(index, null, 'checked', !condition.checked) : handleSelectRow(index))}
          />
        )}
        <select
          value={condition.Source}
          onChange={(e) => handleChange(index, 'Source', e.target.value)}
          disabled={isDisabled()} // Add the disabled attribute
        >
          <option value="">Select Source</option>
          <option value="Request">Request</option>
          <option value="Identity">Identity</option>
          <option value="Location">Location</option>
        </select>
        {condition.Source === 'Request' && (
          <select
            value={condition.requestAttribute}
            onChange={(e) => handleChange(index, 'requestAttribute', e.target.value)}
            disabled={isDisabled()} // Add the disabled attribute
          >
            <option value="">Select Request Attribute</option>
            <option value="requestAttribute1">requestAttribute1</option>
            <option value="requestAttribute2">requestAttribute2</option>
          </select>
        )}

        {condition.Source === 'Identity' && (
          <select
            value={condition.identityAttribute}
            onChange={(e) => handleChange(index, 'identityAttribute', e.target.value)}
            disabled={isDisabled()} // Add the disabled attribute
          >
            <option value="">Select Identity Attribute</option>
            <option value="identityAttribute1">identityAttribute1</option>
            <option value="identityAttribute2">identityAttribute2</option>
          </select>
        )}
        {condition.Source === 'Location' && (
          <div>
            <select
              value={condition.locationAttribute}
              onChange={(e) => handleChange(index, 'locationAttribute', e.target.value)}
              disabled={isDisabled()} // Add the disabled attribute
            >
              <option value="">Select Location Attribute</option>
              <option value="locationAttribute1">locationAttribute1</option>
              <option value="locationAttribute2">locationAttribute2</option>
            </select>
            <select
              value={condition.locationField}
              onChange={(e) => handleChange(index, 'locationField', e.target.value)}
              disabled={isDisabled()} // Add the disabled attribute
            >
              <option value="">Select Location Field</option>
              <option value="locationField1">locationField1</option>
              <option value="locationField2">locationField2</option>
            </select>
            <textarea
              value={condition.requestValue}
              onChange={(e) => handleChange(index, 'requestValue', e.target.value)}
              disabled={isDisabled()} // Add the disabled attribute
            />
          </div>
        )}
        <input
          type="text"
          value={condition.requestValue || condition.identityValue || condition.locationValue}
          onChange={(e) => handleChange(index, 'requestValue', e.target.value)}
          disabled={isDisabled()} // Add the disabled attribute
        />
      </div>
    )
  }



without format------------------------
{
  "conditions": [
    {
      "Source": "Request",
      "requestAttribute": "",
      "requestValue": "sdfsd",
      "selectOperation": "AND"
    },
    {
      "Source": "Identity",
      "identityAttribute": "",
      "identityValue": "dfvsd",
      "selectOperation": "AND"
    },
    {
      "rows": [
        {
          "Source": "Request",
          "requestAttribute": "",
          "requestValue": "basjdghasjf",
          "selectOperation": "AND"
        },
        {
          "Source": "Identity",
          "identityAttribute": "",
          "identityValue": "sdfsd",
          "selectOperation": "AND"
        }
      ],
      "selectOperation": "OR"
    },
    {
      "Source": "Request",
      "requestAttribute": "requestAttribute2",
      "requestValue": "modified data"
    }
  ],
  "selectOperation": "AND"
}

 with formate------------- {
  "conditions": {
    "AND": [
      {
        "Source": "Request",
        "requestAttribute": "",
        "requestValue": "sdfsd"
      },
      {
        "Source": "Identity",
        "identityAttribute": "",
        "identityValue": "dfvsd"
      },
      {
        "OR": [
          {
            "Source": "Request",
            "requestAttribute": "",
            "requestValue": "basjdghasjf"
          },
          {
            "Source": "Identity",
            "identityAttribute": "",
            "identityValue": "sdfsd"
          }
        ]
      },
      {
        "Source": "Request",
        "requestAttribute": "requestAttribute2",
        "requestValue": "modified data"
      }
    ]
  }
}
----------------object map


                {Object.keys(conditions).map((key, index) => (
                  <div key={index}>
                    {conditions[key].map((condition, index2) => (
                      <div key={`${index}-${index2}`}>{renderConditionRow(condition, index2)}</div>
                    ))}
                  </div>
                ))}



-------------------------------------groups formating missing------------------

useEffect(() => {
    // Default data
    const defaultData = {
      conditions: {
        AND: [
          {
            Source: 'Request',
            requestAttribute: '',
            requestValue: 'sdfsd'
          },
          {
            Source: 'Identity',
            identityAttribute: '',
            identityValue: 'dfvsd'
          },
          {
            OR: [
              {
                Source: 'Request',
                requestAttribute: '',
                requestValue: 'basjdghasjf'
              },
              {
                Source: 'Identity',
                identityAttribute: '',
                identityValue: 'sdfsd'
              }
            ]
          },
          {
            Source: 'Request',
            requestAttribute: 'requestAttribute2',
            requestValue: 'modified data'
          }
        ]
      },
      selectOperation: 'AND'
    }

    // Reformatting function
    const reformatData = (data) => {
      const reformattedConditions = []

      const traverseConditions = (conditions, selectOperation) => {
        Object.entries(conditions).forEach(([operation, items]) => {
          if (Array.isArray(items)) {
            // If it's an array, add each item with the selectOperation
            reformattedConditions.push(...items.map((item) => ({ ...item, selectOperation })))
          } else {
            // If it's an object, recurse into it with its selectOperation
            traverseConditions(items, operation)
          }
        })
      }

      traverseConditions(data.conditions, data.selectOperation)
      console.log('refromated code-------', JSON.stringify(reformattedConditions, null, 2))
      return {
        conditions: reformattedConditions,
        selectOperation: data.selectOperation || 'AND' // Default selectOperation
      }
    }

    // Format the default data
    const formattedData = reformatData(defaultData)

    // Set the formatted data to state
    setConditions(formattedData.conditions)
    setSelectOperation(formattedData.selectOperation)
    setIsAddClicked(true) // Set isAddClicked to true to render the conditions
  }, [])


--------------------reformating code----------

const reFormat = (formattedObject) => {
  // Helper function to process each condition
  const processCondition = (condition) => {
    // Check if the condition is a nested structure
    if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
      const keys = Object.keys(condition);
      if (keys.includes('Source')) {
        // Base condition without nested selectOperation
        let obj = { source: condition['Source'] || null };
        if (obj.source === 'Request') {
          obj.requestAttribute = condition['requestAttribute'] || null;
          obj.value = condition['requestValue'] || null;
        } else if (obj.source === 'Identity') {
          obj.identityAttribute = condition['identityAttribute'] || null;
          obj.value = condition['identityValue'] || null;
        } else if (obj.source === 'Location') {
          obj.locationAttribute = condition['locationAttribute'] || null;
          obj.value = condition['locationValue'] || null;
          obj.locationField = condition['locationField'] || null;
        }
        return obj;
      } else {
        // Nested conditions with selectOperation
        const selectOperation = keys[0];
        return {
          rows: condition[selectOperation].map(processCondition),
          selectOperation: selectOperation
        };
      }
    }
    return null; // In case the condition is not an object
  };

  // Start processing from the root selectOperation
  const rootSelectOperation = Object.keys(formattedObject)[0];
  const conditions = formattedObject[rootSelectOperation].map(processCondition);

  return {
    conditions: conditions.filter(condition => condition !== null), // Filter out any null entries
    selectOperation: rootSelectOperation
  };
};



tested formates-----
   conditions, selectOperation--- {
  "conditions": [
    {
      "source": "Request",
      "value": "nmnbm bn"
    },
    {
      "rows": [
        {
          "rows": [
            {
              "source": "Request",
              "value": "bnb b"
            },
            {
              "source": "Identity",
              "value": "bnbnb",
              "identityAttribute": "identityAttribute2"
            }
          ],
          "selectOperation": "OR"
        },
        {
          "rows": [
            {
              "source": "Identity",
              "value": "xvxcvb",
              "identityAttribute": "identityAttribute2"
            },
            {
              "source": "Identity",
              "value": "by cvc"
            }
          ],
          "selectOperation": "AND"
        }
      ],
      "selectOperation": "AND"
    }
  ],
  "selectOperation": "AND"
}
index.js:8 formattedConditions---- {
  "conditions": {
    "AND": [
      {
        "Source": "Request",
        "requestAttribute": "",
        "requestValue": "nmnbm bn"
      },
      {
        "AND": [
          {
            "OR": [
              {
                "Source": "Request",
                "requestAttribute": "",
                "requestValue": "bnb b"
              },
              {
                "Source": "Identity",
                "identityAttribute": "identityAttribute2",
                "identityValue": "bnbnb"
              }
            ]
          },
          {
            "AND": [
              {
                "Source": "Identity",
                "identityAttribute": "identityAttribute2",
                "identityValue": "xvxcvb"
              },
              {
                "Source": "Identity",
                "identityAttribute": "",
                "identityValue": "by cvc"
              }
            ]
          }
        ]
      }
    ]
  }
}
index.js:8 reconstructedConditions {
  "conditions": [
    {
      "source": "Request",
      "requestAttribute": null,
      "value": "nmnbm bn"
    },
    {
      "rows": [
        {
          "rows": [
            {
              "source": "Request",
              "requestAttribute": null,
              "value": "bnb b"
            },
            {
              "source": "Identity",
              "identityAttribute": "identityAttribute2",
              "value": "bnbnb"
            }
          ],
          "selectOperation": "OR"
        },
        {
          "rows": [
            {
              "source": "Identity",
              "identityAttribute": "identityAttribute2",
              "value": "xvxcvb"
            },
            {
              "source": "Identity",
              "identityAttribute": null,
              "value": "by cvc"
            }
          ],
          "selectOperation": "AND"
        }
      ],
      "selectOperation": "AND"
    }
  ],
  "selectOperation": "AND"
}


----------------object handling----------
const reFormat = (formattedObject) => {
  // Validate the input is an object and has the expected structure
  if (!formattedObject || typeof formattedObject !== 'object') {
    throw new Error('Invalid input: formattedObject must be an object');
  }

  const rootSelectOperation = Object.keys(formattedObject)[0];
  const conditionsArray = formattedObject[rootSelectOperation];

  if (!Array.isArray(conditionsArray)) {
    throw new Error(`Invalid input: formattedObject.${rootSelectOperation} must be an array`);
  }

  // Helper function to process each condition
  const processCondition = (condition) => {
    // Check if the condition is a nested structure
    if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
      const keys = Object.keys(condition);
      if (keys.includes('Source')) {
        // Base condition without nested selectOperation
        let obj = { source: condition['Source'] || null };
        if (obj.source === 'Request') {
          obj.requestAttribute = condition['requestAttribute'] || null;
          obj.value = condition['requestValue'] || null;
        } else if (obj.source === 'Identity') {
          obj.identityAttribute = condition['identityAttribute'] || null;
          obj.value = condition['identityValue'] || null;
        } else if (obj.source === 'Location') {
          obj.locationAttribute = condition['locationAttribute'] || null;
          obj.value = condition['locationValue'] || null;
          obj.locationField = condition['locationField'] || null;
        }
        return obj;
      } else {
        // Nested conditions with selectOperation
        const selectOperation = keys[0];
        return {
          rows: condition[selectOperation].map(processCondition),
          selectOperation: selectOperation
        };
      }
    }
    return null; // In case the condition is not an object
  };

  // Process the conditions and filter out any null entries
  const processedConditions = conditionsArray.map(processCondition).filter(condition => condition !== null);

  return {
    conditions: processedConditions,
    selectOperation: rootSelectOperation
  };
};
