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

import { departmentSchema } from "./department.schema";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "./departmentService";

import { getDepartmentColumns } from "./department.columns";

const DepartmentPage = () => {
  const gridRef = useRef(null);

  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCols, setSelectedCols] = useState([]);
  const [colDialog, setColDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirm, setConfirm] = useState({ open: false, type: "", data: null });

  const isEdit = Boolean(editingId);

  const emptyForm = { name: "", status: true };
  const [formValues, setFormValues] = useState(emptyForm);

  // ---------------- FETCH ----------------
  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data || []);
    } catch {
      showMessage("Failed to load departments", "error");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ---------------- ACTION ----------------
  const ActionRenderer = useCallback(
    (props) => {
      const row = props.data;
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => handleEdit(row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(row.departmentId)}>
            Delete
          </Button>
        </Stack>
      );
    },
    []
  );

  const columnDefs = useMemo(() => getDepartmentColumns(ActionRenderer), [ActionRenderer]);

  useEffect(() => {
    setSelectedCols(columnDefs.filter((c) => c.field).map((c) => c.field));
  }, [columnDefs]);

  // ---------------- CONFIRM ----------------
  const handleConfirm = async () => {
    const { type, data } = confirm;
    setLoading(true);

    try {
      if (type === "save") {
        await createDepartment(data);
        showMessage("✔ Department saved successfully");
      }
      if (type === "update") {
        await updateDepartment(editingId, data);
        showMessage("✔ Department updated successfully");
      }
      if (type === "delete") {
        await deleteDepartment(data);
        showMessage("✔ Department deleted successfully");
      }
      if (type === "reset") {
        handleReset(true);
      }

      await fetchDepartments();

      if (type === "save" || type === "update") {
        handleReset(true);
      }
    } catch (err) {
      console.error(err);
      showMessage("❌ Operation failed", "error");
    }

    setLoading(false);
    setConfirm({ open: false, type: "", data: null });
  };

  // ---------------- SUBMIT ----------------
  const onSubmit = (data) => {
    try {
      const normalizedName = data.name.trim().toLowerCase();

      const isDuplicate = departments.some((d) => {
        const deptName = d.name?.toLowerCase();

        if (editingId) {
          return deptName === normalizedName && d.departmentId !== editingId;
        }

        return deptName === normalizedName;
      });

      if (isDuplicate) {
        throw new Error("Department already exists");
      }

      const sanitized = {
        ...data,
        name: data.name.trim(),
      };

      setConfirm({
        open: true,
        type: isEdit ? "update" : "save",
        data: sanitized
      });

    } catch (err) {
      showMessage(`❌ ${err.message}`, "error");
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.departmentId);
    setFormValues({
      name: row.name,
      status: row.status
    });
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
    <Box sx={{ p: 4, background: "#f4f6f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          {isEdit ? "Edit Department" : "Add Department"}
        </Typography>

        <MasterForm
          key={editingId || "new"}
          schema={departmentSchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          isUpdate={isEdit}
          loading={loading}
          fields={[
            { name: "name", label: "Department Name", type: "text" },
            { name: "status", label: "Active", type: "switch" }
          ]}
        />

        <Box mt={4} display="flex" justifyContent="space-between">
          <Typography variant="h6">Department List</Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setColDialog(true)}>Columns</Button>
            <Button onClick={() => gridRef.current.exportCSV()}>CSV</Button>
            <Button onClick={() => gridRef.current.exportExcel()}>Excel</Button>
            <Button onClick={() => gridRef.current.exportPDF()}>PDF</Button>
          </Stack>
        </Box>

        <MasterGrid
          ref={gridRef}
          rowData={departments}
          columnDefs={columnDefs}
          exportFileName="Department"
          selectedColumns={selectedCols}
        />
      </Paper>

      {/* Confirm Dialog */}
      <Dialog open={confirm.open}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={1.5}>
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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentPage;