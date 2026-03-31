export const getDesignationColumns = (ActionRenderer) => [
  { headerName: "ID", field: "designationId", width: 90 },

  { headerName: "Title", field: "desigTitle", flex: 1.5 },
  { headerName: "Report To", field: "desigReportTo", flex: 1 },
  { headerName: "Subordinate", field: "desigSubordinate", flex: 1.2 },
  { headerName: "Level", field: "desigLevel", flex: 1 },
  { headerName: "Req ID", field: "designationReqId", flex: 1 },
  { headerName: "Abbreviation", field: "desigAbb", flex: 1 },
  { headerName: "Job Description", field: "jobDescription", flex: 2 },
  {
    headerName: "Status",
    field: "status",
    valueFormatter: (p) => (p.value ? "Active" : "Inactive"),
    flex: 1
  },
  { headerName: "Group", field: "groupId", flex: 1 },

  {
    headerName: "Actions",
    cellRenderer: ActionRenderer,
    width: 180,
    pinned: "right",
    sortable: false,
    filter: false
  }
];