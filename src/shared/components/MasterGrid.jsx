import React, { forwardRef, useRef, useMemo, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";

const MasterGrid = forwardRef(
  ({ rowData = [], columnDefs = [] }, ref) => {

    const gridApiRef = useRef(null);

    const defaultColDef = useMemo(() => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      flex: 1,
      minWidth: 120
    }), []);

    const onGridReady = (params) => {
      gridApiRef.current = params.api;
      params.api.sizeColumnsToFit();
    };

    useImperativeHandle(ref, () => ({

      // ✅ CSV Export (FREE)
      exportCSV: () => {
        gridApiRef.current?.exportDataAsCsv();
      },

      // ✅ SEARCH
      setSearch: (value) => {
        gridApiRef.current?.setGridOption("quickFilterText", value);
      },

      // ✅ GET DATA (for Excel & PDF)
      getData: () => {
        const data = [];
        gridApiRef.current?.forEachNode((node) => {
          data.push(node.data);
        });
        return data;
      }

    }));

    return (
      <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
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
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows
        />
      </div>
    );
  }
);

export default MasterGrid;