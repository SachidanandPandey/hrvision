import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";

import {
  Button,
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import MasterForm from "../../../shared/components/MasterForm";
import MasterGrid from "../../../shared/components/MasterGrid";

import { designationSchema } from "./designation.schema";
import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation
} from "./designationService";

import { getDesignationColumns } from "./designation.columns";

const DesignationPage = () => {
  const gridRef = useRef(null);

  const [dataList, setDataList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCols, setSelectedCols] = useState([]);
  const [colDialog, setColDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirm, setConfirm] = useState({ open: false, type: "", data: null });

  const isEdit = Boolean(editingId);

  const emptyForm = {
    desigTitle: "",
    desigReportTo: "",
    desigSubordinate: "",
    desigLevel: "",
    designationReqId: "",
    desigAbb: "",
    jobDescription: "",
    groupId: "",
    status: true
  };

  const [formValues, setFormValues] = useState(emptyForm);

  // ---------------- FETCH ----------------
  const fetchData = async () => {
    try {
      const res = await getDesignations();
      setDataList(res.data || []);
    } catch {
      showMessage("Failed to load data", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- ACTION ----------------
  const ActionRenderer = useCallback((props) => {
    const row = props.data;
    return (
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={() => handleEdit(row)}>Edit</Button>
        <Button size="small" color="error" onClick={() => handleDelete(row.designationId)}>
          Delete
        </Button>
      </Stack>
    );
  }, []);

  const columnDefs = useMemo(
    () => getDesignationColumns(ActionRenderer),
    [ActionRenderer]
  );

  useEffect(() => {
    setSelectedCols(columnDefs.filter((c) => c.field).map((c) => c.field));
  }, [columnDefs]);

  // ---------------- CONFIRM ----------------
  const handleConfirm = async () => {
    const { type, data } = confirm;
    setLoading(true);

    try {
      if (type === "save") {
        await createDesignation(formatNumbers(data));
        showMessage("✔ Saved successfully");
      }
      if (type === "update") {
        await updateDesignation(editingId, formatNumbers(data));
        showMessage("✔ Updated successfully");
      }
      if (type === "delete") {
        await deleteDesignation(data);
        showMessage("✔ Deleted successfully");
      }
      if (type === "reset") {
        handleReset(true);
      }

      await fetchData();

      if (type === "save" || type === "update") {
        handleReset(true);
      }
    } catch {
      showMessage("❌ Operation failed", "error");
    }

    setLoading(false);
    setConfirm({ open: false, type: "", data: null });
  };

  const formatNumbers = (d) => ({
    ...d,
    desigReportTo: Number(d.desigReportTo),
    desigLevel: Number(d.desigLevel),
    designationReqId: Number(d.designationReqId),
    groupId: Number(d.groupId)
  });

  // ---------------- SUBMIT ----------------
  const onSubmit = (data) => {
    try {
      const name = data.desigTitle.trim().toLowerCase();

      const isDuplicate = dataList.some((d) => {
        const existing = d.desigTitle?.toLowerCase();

        if (editingId) {
          return existing === name && d.designationId !== editingId;
        }

        return existing === name;
      });

      if (isDuplicate) {
        throw new Error("Designation already exists");
      }

      setConfirm({
        open: true,
        type: isEdit ? "update" : "save",
        data: data
      });

    } catch (err) {
      showMessage(`❌ ${err.message}`, "error");
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.designationId);
    setFormValues(row);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) =>
    setConfirm({ open: true, type: "delete", data: id });

  const handleReset = (force = false) => {
    if (!force) {
      setConfirm({ open: true, type: "reset" });
      return;
    }
    setEditingId(null);
    setFormValues(emptyForm);
  };

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const t = setTimeout(() => {
      gridRef.current?.setSearch(search);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const showMessage = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  return (
   // <Box sx={{ p: 4, background: "#f4f6f9", minHeight: "100vh" }}>
   <Box  sx={{  background: "#f4f6f9",    height: "100%",   }}
>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          {isEdit ? "Edit Designation" : "Add Designation"}
        </Typography>

        <MasterForm
          key={editingId || "new"}
          schema={designationSchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          isUpdate={isEdit}
          loading={loading}
          fields={[
            { name: "desigTitle", label: "Title", type: "text" },
            { name: "desigReportTo", label: "Report To", type: "text", numericOnly: true },
            { name: "desigSubordinate", label: "Subordinate", type: "text" },
            { name: "desigLevel", label: "Level", type: "text", numericOnly: true },
            { name: "designationReqId", label: "Req ID", type: "text", numericOnly: true },
            { name: "desigAbb", label: "Abbreviation", type: "text" },
            { name: "jobDescription", label: "Job Description", type: "text" },
            { name: "groupId", label: "Group ID", type: "text", numericOnly: true },
            { name: "status", label: "Active", type: "switch" }
          ]}
        />

        <Box mt={4} display="flex" justifyContent="space-between">
          <Typography variant="h6">Designation List</Typography>

          <Stack direction="row" spacing={2}>
            <TextField size="small" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={() => setColDialog(true)}>Columns</Button>
            <Button onClick={() => gridRef.current.exportCSV()}>CSV</Button>
            <Button onClick={() => gridRef.current.exportExcel()}>Excel</Button>
            <Button onClick={() => gridRef.current.exportPDF()}>PDF</Button>
          </Stack>
        </Box>

        <MasterGrid
          ref={gridRef}
          rowData={dataList}
          columnDefs={columnDefs}
          exportFileName="Designation"
          selectedColumns={selectedCols}
        />
      </Paper>

      {/* Column Dialog */}
      <Dialog open={colDialog} onClose={() => setColDialog(false)}>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          {columnDefs.filter((c) => c.field).map((col) => (
            <Box key={col.field}>
              <input
                type="checkbox"
                checked={selectedCols.includes(col.field)}
                onChange={(e) => {
                  if (e.target.checked)
                    setSelectedCols((prev) => [...prev, col.field]);
                  else
                    setSelectedCols((prev) =>
                      prev.filter((c) => c !== col.field)
                    );
                }}
              />
              {col.headerName}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirm.open}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={1}>
            {confirm.type === "delete" && <WarningAmberIcon color="error" />}
            <Typography>
              {confirm.type === "delete"
                ? "Delete this record?"
                : confirm.type === "update"
                ? "Update this record?"
                : confirm.type === "save"
                ? "Save this record?"
                : "Reset form?"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false })}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DesignationPage;