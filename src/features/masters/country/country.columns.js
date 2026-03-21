export const getCountryColumns = (ActionRenderer) => [
  { headerName: "ID", field: "countryId", width: 100 },

  {
    headerName: "Country Code",
    field: "code",
    flex: 1
  },

  {
    headerName: "Country Name",
    field: "name",
    flex: 1.5
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