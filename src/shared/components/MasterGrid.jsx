import React, {
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle
} from "react";

import { AgGridReact } from "ag-grid-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MasterGrid = forwardRef(
  (
    {
      rowData = [],
      columnDefs = [],
      exportFileName = "Report",
      selectedColumns = []
    },
    ref
  ) => {
    const gridApiRef = useRef(null);

    const defaultColDef = useMemo(
      () => ({
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
        minWidth: 120
      }),
      []
    );

    const onGridReady = (params) => {
      gridApiRef.current = params.api;
    };

    // ✅ File name
    const getFileName = (type) => {
      const date = new Date().toISOString().replace(/[:.]/g, "-");
      return `${exportFileName}_${date}.${type}`;
    };

    // ✅ Get data
    const getAllData = () => {
      const data = [];
      gridApiRef.current?.forEachNode((node) => {
        data.push(node.data);
      });
      return data;
    };

    // ✅ Columns for export
    const getExportColumns = () => {
      const allCols =
        gridApiRef.current
          ?.getColumnDefs()
          ?.filter((col) => col.field && col.headerName !== "#") || [];

      if (!selectedColumns || selectedColumns.length === 0) {
        return allCols;
      }

      return allCols.filter((col) =>
        selectedColumns.includes(col.field)
      );
    };

    useImperativeHandle(ref, () => ({
      // ✅ CSV (CUSTOM)
      exportCSV: () => {
        const cols = getExportColumns();
        const data = getAllData();

        if (!data.length) return;

        const headers = ["#", ...cols.map((c) => c.headerName)];

        const rows = data.map((row, i) => [
          i + 1,
          ...cols.map((col) => {
            let val = row[col.field];

            if (col.field === "status") {
              val = val ? "Active" : "Inactive";
            }

            if (typeof val === "string") {
              val = `"${val.replace(/"/g, '""')}"`;
            }

            return val ?? "";
          })
        ]);

        const csv = [
          headers.join(","),
          ...rows.map((r) => r.join(","))
        ].join("\n");

        const blob = new Blob([csv], {
          type: "text/csv;charset=utf-8;"
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = getFileName("csv");
        link.click();
      },

      // ✅ EXCEL
      exportExcel: () => {
        const cols = getExportColumns();
        const data = getAllData();

        const formatted = data.map((row) => {
          const obj = {};
          cols.forEach((col) => {
            let val = row[col.field];
            if (col.field === "status") {
              val = val ? "Active" : "Inactive";
            }
            obj[col.headerName] = val;
          });
          return obj;
        });

        const ws = XLSX.utils.json_to_sheet(formatted);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, exportFileName);

        XLSX.writeFile(wb, getFileName("xlsx"));
      },

      // ✅ PDF
      exportPDF: () => {
        const doc = new jsPDF();
        const cols = getExportColumns();
        const data = getAllData();

        if (!data.length) return;

        const headers = cols.map((c) => c.headerName);

        const rows = data.map((row, i) => [
          i + 1,
          ...cols.map((col) => {
            let val = row[col.field];
            if (col.field === "status") {
              val = val ? "Active" : "Inactive";
            }
            return val;
          })
        ]);

        autoTable(doc, {
          head: [["#", ...headers]],
          body: rows
        });

        doc.save(getFileName("pdf"));
      },

      // ✅ SEARCH
      setSearch: (value) => {
        gridApiRef.current?.setGridOption("quickFilterText", value);
      }
    }));

    return (
      <div className="ag-theme-quartz" style={{ height: 500 }}>
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
          paginationPageSize={20}
        />
      </div>
    );
  }
);

export default MasterGrid;