import React, { forwardRef, useRef, useMemo, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";
import * as XLSX from "xlsx";

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

      // ✅ CSV Export
      exportCSV: () => {
        gridApiRef.current?.exportDataAsCsv();
      },

      // ✅ Excel Export
      exportExcel: () => {
        const data = [];
        gridApiRef.current?.forEachNode((node) => {
          data.push(node.data);
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "States");

        XLSX.writeFile(workbook, "states.xlsx");
      },

      // ✅ SEARCH
      setSearch: (value) => {
        gridApiRef.current?.setGridOption("quickFilterText", value);
      },

      // ✅ GET DATA (for PDF)
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
          animateRows
        />
      </div>
    );
  }
);

export default MasterGrid;