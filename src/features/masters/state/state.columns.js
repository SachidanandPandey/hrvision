export const getStateColumns = (countryMap, ActionRenderer) => [
  { headerName: "ID", field: "id", width: 90 },

  {
    headerName: "Country",
    field: "countryId",
    valueFormatter: (p) => countryMap[p.value] || "",
    flex: 1
  },

  { headerName: "State Name", field: "name", flex: 1.5 },

  {
    headerName: "Status",
    field: "status",
    valueFormatter: (p) => (p.value ? "Active" : "Inactive"),
    flex: 1
  },

  {
    headerName: "Actions",
    cellRenderer: ActionRenderer,
    width: 170,
    pinned: "right",
    sortable: false,
    filter: false
  }
];