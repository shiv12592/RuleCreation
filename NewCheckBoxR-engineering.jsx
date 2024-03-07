const renderConditionRow = (condition, index) => {
    if (condition.rows && condition.selectOperation) {
      return (
        <table key={index}>
          <tbody>
            <tr>
              <td>Select Operation: {condition.selectOperation}</td>
              <td>
                {condition.rows.map((row, rowIndex) => (
                  <div key={rowIndex}>{renderConditionRow(row, rowIndex)}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )
    } else {
      return (
        <div key={index}>
          <p>Source: {condition.Source}</p>
          {condition.Source === 'Request' && (
            <>
              <p>Request Attribute: {condition.requestAttribute}</p>
              <p>Request Value: {condition.requestValue}</p>
            </>
          )}
          {condition.Source === 'Identity' && (
            <>
              <p>Identity Attribute: {condition.identityAttribute}</p>
              <p>Identity Value: {condition.identityValue}</p>
            </>
          )}
        </div>
      )
    }
  }
