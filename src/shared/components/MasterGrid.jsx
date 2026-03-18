import React, { forwardRef, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const MasterGrid = forwardRef(
  ({ rowData = [], columnDefs = [] }, ref) => {

    const gridRef = useRef();

    const defaultColDef = useMemo(() => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      flex: 1,
      minWidth: 120
    }), []);

    const onGridReady = (params) => {
      gridRef.current = params.api;
      if (ref) ref.current = params.api;
      params.api.sizeColumnsToFit();
    };

    return (

      <div
        className="ag-theme-quartz"
        style={{
          height: 500,
          width: "100%",
          marginTop: 10
        }}
      >

        <AgGridReact
          onGridReady={onGridReady}
          rowData={rowData}
          columnDefs={[
            {
              headerName: "#",
              valueGetter: "node.rowIndex + 1",
              width: 70
            },
            ...columnDefs
          ]}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
          animateRows
        />

      </div>
    );
  }
);

export default MasterGrid;