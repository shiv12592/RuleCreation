
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
