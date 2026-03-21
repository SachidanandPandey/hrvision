import React, {
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle
} from "react";
import { AgGridReact } from "ag-grid-react";
import * as XLSX from "xlsx";

const MasterGrid = forwardRef(
  ({ rowData = [], columnDefs = [], loading = false, countryMap = {} }, ref) => {
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
    };

    useImperativeHandle(ref, () => ({
      exportCSV: () => {
        gridApiRef.current?.exportDataAsCsv();
      },

      exportExcel: () => {
        const data = [];
        gridApiRef.current?.forEachNode((node) => {
          const d = node.data;
          data.push({
            ID: d.id,
            Country: countryMap[d.countryId] || "",
            Name: d.name,
            Status: d.status ? "Active" : "Inactive"
          });
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "States");
        XLSX.writeFile(wb, "states.xlsx");
      },

      setSearch: (value) => {
        gridApiRef.current?.setGridOption("quickFilterText", value);
      },

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
          paginationPageSize={20}                           // default number of rows per page
          paginationPageSizeSelector={[10, 20, 50, 100]}   // only these options in dropdown
          
          animateRows
          overlayLoadingTemplate={"<span>Loading...</span>"}
          loadingOverlayComponentParams={{ loadingMessage: "Loading..." }}
        />
      </div>
    );
  }
);

export default MasterGrid;