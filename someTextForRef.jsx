When the SimulationPopUp opens, it immediately calls the simulateCounts API at /v1/simulate using a POST request, sending the condition object (e.g., { ecn: 'someEcnValue', simulate: true }) to fetch summary count data (like affected users, entitlements, etc.).
When the user clicks the "View Details" button, the simulateResults API is triggered at /v1/simulateResults via a GET request. This call passes additional filter criteria (such as entitlementName, userName, pageNo, and pageSize) along with the original condition to retrieve detailed simulation results.
Clicking the "Export" button invokes the simulateResultsExport API at /v1/simulateResultsExport through a GET request, sending the condition data plus an export flag so that the server returns a CSV file for download.
The condition data is built and continuously updated in the CreateRule page by the RuleConditionRows component, ensuring that the most recent rules configuration is sent to the backend.
Each API call occurs at specific user interaction stages: opening the popup triggers the summary count call, viewing details retrieves the detailed list, and exporting initiates the CSV download.

  User Story 1
Title: View Summary Counts on Popup Open
Description:
As a Rule Creator, I want the SimulationPopUp to immediately fetch summary count data (e.g., affected users, entitlements) via a POST request when it opens, so that I can quickly assess the overall impact of my rule.

Acceptance Criteria:

Opening the SimulationPopUp automatically calls /v1/simulate with the condition object in the request body.
The UI displays summary data (affectedUsersCount, affectedEntitlementsCount, etc.) in a table.
If the API call fails or returns an error, an appropriate error message is shown instead of the table.
User Story 2
Title: Retrieve Detailed Results on “View Details”
Description:
As a Rule Creator, I want to load a detailed list of impacted users/entitlements by clicking the “View Details” button, so that I can review specific items and validate my rule logic more thoroughly.

Acceptance Criteria:

Clicking “View Details” triggers a GET request to /v1/simulateResults, sending filter parameters (entitlementName, userName, etc.) and pagination (pageNo, pageSize).
The UI displays a scrollable table of detailed results (e.g., userName, lastName, ruleScript).
If filters are updated or cleared, the table re-fetches and shows updated results.
An error message appears if the API call fails.
User Story 3
Title: Export Detailed Results as CSV
Description:
As a Rule Creator, I want to export the currently viewed simulation results to a CSV file by clicking “Export,” so that I can share the data with other stakeholders or analyze it offline.

Acceptance Criteria:

Clicking “Export” sends a GET request to /v1/simulateResultsExport, including the condition data plus an export flag (e.g., export=true).
The server returns a CSV file (simulate_export.csv) that downloads automatically.
The CSV contains all relevant columns (Entitlement Name, User Name, Emp ID/Ext, Last Name, Rule Script).
If the export call fails, no file is downloaded, and the user sees an error notification.
User Story 4
Title: Maintain Updated Condition Data
Description:
As a Rule Creator, I want the CreateRule page (and its RuleConditionRows component) to continuously update the condition data, so that any changes I make are accurately passed to the simulation APIs.

Acceptance Criteria:

Each modification to the condition rows (add, remove, group, etc.) updates the condition object in real time.
The condition object is always the version used for the simulate, simulateResults, and simulateResultsExport API calls.
If no conditions exist, the API call should still succeed or return a valid default response.
A JSON preview (optional) can show the current condition state for clarity.
User Story 5
Title: Trigger API Calls at the Correct User Interactions
Description:
As a Rule Creator, I want each API call (simulateCounts, simulateResults, simulateResultsExport) to happen exactly when I perform the associated action (popup open, “View Details,” “Export”), so that I only see relevant data at each stage.

Acceptance Criteria:

/v1/simulate is called once when the popup opens, returning summary counts.
/v1/simulateResults is called only after clicking “View Details,” using any entered filters.
/v1/simulateResultsExport is triggered only upon clicking “Export,” initiating a CSV download.
No extra or duplicate calls occur unless the user repeats an action (e.g., re-clicking “View Details” after clearing filters).

