import React, { useState } from 'react'

const RuleConditionRows = () => {
  const [conditions, setConditions] = useState([])
  const [groupedConditions, setGroupedConditions] = useState([])
  const [selectOperation, setSelectOperation] = useState('AND')
  const [selectedGroupIds, setSelectedGroupIds] = useState([])

  const sources = ['request', 'identity', 'location']
  const attributes = {
    request: ['requestAtt1', 'requestAtt2'],
    identity: ['identityAttr1', 'identityAttr2'],
    location: ['locationAttr1', 'locationAttr2']
  }

  const addConditionRow = () => {
    setConditions([...conditions, { source: '', attribute: '', value: '', isChecked: false }])
  }

  const handleSourceChange = (index, value) => {
    const newConditions = [...conditions]
    newConditions[index].source = value
    newConditions[index].attribute = attributes[value][0] // Default to first attribute
    setConditions(newConditions)
  }

  const handleAttributeChange = (index, value) => {
    const newConditions = [...conditions]
    newConditions[index].attribute = value
    setConditions(newConditions)
  }

  const handleValueChange = (index, value) => {
    const newConditions = [...conditions]
    newConditions[index].value = value
    setConditions(newConditions)
  }

  const handleCheckboxChange = (index) => {
    const newConditions = [...conditions]
    newConditions[index].isChecked = !newConditions[index].isChecked
    setConditions(newConditions)
  }

  const handleGroupCheckboxChange = (groupId) => {
    setSelectedGroupIds((prevSelectedGroupIds) => {
      if (prevSelectedGroupIds.includes(groupId)) {
        return prevSelectedGroupIds.filter((id) => id !== groupId)
      } else {
        return [...prevSelectedGroupIds, groupId]
      }
    })
  }

  const groupSelected = () => {
    const selectedConditions = conditions.filter((condition) => condition.isChecked)
    const unselectedConditions = conditions.filter((condition) => !condition.isChecked)
    setGroupedConditions([...groupedConditions, { id: Date.now(), operation: selectOperation, conditions: selectedConditions }])
    setConditions(unselectedConditions)
  }

  const ungroupSelected = () => {
    const groupsToUngroup = groupedConditions.filter((group) => selectedGroupIds.includes(group.id))
    const remainingGroups = groupedConditions.filter((group) => !selectedGroupIds.includes(group.id))
    const ungroupedConditions = groupsToUngroup.flatMap((group) => group.conditions)
    setGroupedConditions(remainingGroups)
    setConditions([...conditions, ...ungroupedConditions])
    setSelectedGroupIds([])
  }

  const deleteSelected = () => {
    const remainingConditions = conditions.filter((condition) => !condition.isChecked)
    setConditions(remainingConditions)
  }

  const handleGroupOperationChange = (groupId, value) => {
    const updatedGroups = groupedConditions.map((group) => {
      if (group.id === groupId) {
        return { ...group, operation: value }
      }
      return group
    })
    setGroupedConditions(updatedGroups)
  }

  const submitData = () => {
    const allData = { conditions, groupedConditions }
    console.log(JSON.stringify(allData, null, 2))
  }

  return (
    <div>
      <button onClick={addConditionRow}>Add Condition Row</button>
      <table>
        <tbody>
          {conditions.map((condition, index) => (
            <tr key={index}>
              {index === 0 && (
                <td rowSpan={conditions.length + groupedConditions.length}>
                  <select value={selectOperation} onChange={(e) => setSelectOperation(e.target.value)}>
                    {['AND', 'OR', 'NOT'].map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </td>
              )}
              <td>
                <input type="checkbox" checked={condition.isChecked || false} onChange={() => handleCheckboxChange(index)} />
              </td>
              <td>
                <select value={condition.source} onChange={(e) => handleSourceChange(index, e.target.value)}>
                  <option value="">Select Source</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select value={condition.attribute} onChange={(e) => handleAttributeChange(index, e.target.value)}>
                  <option value="">Select Attribute</option>
                  {condition.source &&
                    attributes[condition.source].map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                </select>
              </td>
              <td>
                <input type="text" value={condition.value} onChange={(e) => handleValueChange(index, e.target.value)} />
              </td>
            </tr>
          ))}
          {groupedConditions.map((group, groupIndex) => (
            <tr key={group.id}>
              <td>
                <input type="checkbox" onChange={() => handleGroupCheckboxChange(group.id)} />
              </td>
              <td>
                <select value={group.operation} onChange={(e) => handleGroupOperationChange(group.id, e.target.value)}>
                  {['AND', 'OR', 'NOT'].map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </td>
              <td colSpan="3">
                <strong>{group.operation} Group:</strong>
                <table>
                  <tbody>
                    {group.conditions.map((condition, cIndex) => (
                      <tr key={cIndex}>
                        <td>{condition.source}</td>
                        <td>{condition.attribute}</td>
                        <td>{condition.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={groupSelected}>Group Selected</button>
      <button onClick={deleteSelected}>Delete Selected</button>
      <button onClick={submitData}>Submit</button>
      <button onClick={ungroupSelected}>Ungroup</button>
    </div>
  )
}

export default RuleConditionRows
----------------------------------------------------


    conditionsData: {
      conditions: [
        {
          source: 'identity',
          attribute: 'identityAttr1',
          value: 'fsdrfgf',
          isChecked: false
        },
        {
          source: 'location',
          attribute: 'locationAttr1',
          value: 'sdfsd',
          isChecked: false
        },
        {
          source: 'request',
          attribute: 'requestAtt1',
          value: 'dfds',
          isChecked: false
        }
      ],
      groupedConditions: [
        {
          id: 1709739397208,
          operation: 'OR',
          conditions: [
            {
              source: 'request',
              attribute: 'requestAtt1',
              value: '',
              isChecked: true
            },
            {
              source: 'identity',
              attribute: 'identityAttr1',
              value: '',
              isChecked: true
            }
          ]
        }
      ]
    }
  }
