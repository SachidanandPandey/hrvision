export const getDepartmentColumns = (ActionRenderer) => [
  {
    headerName: "ID",
    field: "departmentId",
    width: 120,
  },
  {
    headerName: "Department Name",
    field: "name",
    flex: 2,
  },
  {
    headerName: "Status",
    field: "status",
    valueFormatter: (p) => (p.value ? "Active" : "Inactive"),
    flex: 1,
  },
  {
    headerName: "Actions",
    cellRenderer: ActionRenderer,
    width: 200,
    pinned: "right",
  },
];