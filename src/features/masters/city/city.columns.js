export const getCityColumns = (stateMap, ActionRenderer) => [
  { headerName: "ID", field: "id", width: 90 },

  {
    headerName: "City Name",
    field: "name",
    flex: 1.5
  },

  {
    headerName: "Zip Code",
    field: "zipCode",
    flex: 1
  },

  {
    headerName: "State",
    field: "stateId",
    valueFormatter: (p) => stateMap[p.value] || "",
    flex: 1.5
  },

  {
    headerName: "Metro",
    field: "isMetro",
    valueFormatter: (p) => (p.value ? "Yes" : "No"),
    flex: 1
  },

  {
    headerName: "Status",
    field: "status",
    valueFormatter: (p) => (p.value ? "Active" : "Inactive"),
    flex: 1
  },

  {
    headerName: "Actions",
    cellRenderer: ActionRenderer,
    width: 180,
    pinned: "right",
    sortable: false,
    filter: false
  }
];