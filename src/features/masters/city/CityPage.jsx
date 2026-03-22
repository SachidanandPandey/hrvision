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

import { citySchema } from "./city.schema";
import { getCities, getStates, createCity, updateCity, deleteCity } from "./cityService";

import { getCityColumns } from "./city.columns";

const CityPage = () => {
  const gridRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  // Column selection
  const [selectedCols, setSelectedCols] = useState([]);
  const [colDialog, setColDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirm, setConfirm] = useState({ open: false, type: "", data: null });

  const isEdit = Boolean(editingId);

  const emptyForm = { name: "", zipCode: "", stateId: null, isMetro: false, status: true };
  const [formValues, setFormValues] = useState(emptyForm);

  // ---------------- STATE MAP ----------------
  const stateMap = useMemo(() => {
    const map = {};
    states.forEach((s) => (map[s.id] = s.name));
    return map;
  }, [states]);

  // ---------------- FETCH ----------------
  const fetchCities = async () => {
    try {
      const res = await getCities();
      setCities(res.data || []);
    } catch {
      showMessage("Failed to load cities", "error");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await getStates();
      setStates(res.data || []);
    } catch {
      showMessage("Failed to load states", "error");
    }
  };

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, []);

  // ---------------- ACTION ----------------
  const ActionRenderer = useCallback(
    (props) => {
      const row = props.data;
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => handleEdit(row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(row.id)}>Delete</Button>
        </Stack>
      );
    },
    []
  );

  const columnDefs = useMemo(() => getCityColumns(stateMap, ActionRenderer), [stateMap, ActionRenderer]);

  // Default select all columns
  useEffect(() => {
    setSelectedCols(columnDefs.filter((c) => c.field).map((c) => c.field));
  }, [columnDefs]);

  // ---------------- CONFIRM ----------------
  const handleConfirm = async () => {
    const { type, data } = confirm;
    setLoading(true);

    try {
      if (type === "save") {
        await createCity({ ...data, stateId: Number(data.stateId) });
        showMessage("✔ City saved successfully");
      }
      if (type === "update") {
        await updateCity(editingId, { ...data, stateId: Number(data.stateId) });
        showMessage("✔ City updated successfully");
      }
      if (type === "delete") {
        await deleteCity(data);
        showMessage("✔ City deleted successfully");
      }
      if (type === "reset") {
        handleReset(true);
      }

      await fetchCities();

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

  // ---------------- FORM ----------------
  const onSubmit = (data) => {
    setConfirm({ open: true, type: isEdit ? "update" : "save", data });
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormValues({ name: row.name, zipCode: row.zipCode, stateId: row.stateId, isMetro: row.isMetro, status: row.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => setConfirm({ open: true, type: "delete", data: id });

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

  const showMessage = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  return (
    <Box sx={{ p: 4, background: "#f4f6f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>{isEdit ? "Edit City" : "Add City"}</Typography>

        <MasterForm
          key={editingId || "new"}
          schema={citySchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          isUpdate={isEdit}
          loading={loading}
          fields={[
            { name: "name", label: "City Name", type: "text" },
            { name: "zipCode", label: "Zip Code", type: "text" },
            { name: "stateId", label: "State", type: "select", options: states.map((s) => ({ value: s.id, label: s.name })) },
            { name: "isMetro", label: "Metro", type: "switch" },
            { name: "status", label: "Active", type: "switch" }
          ]}
          submitLabel="Save"
          updateLabel="Update"
        />

        <Box mt={4} display="flex" justifyContent="space-between">
          <Typography variant="h6">City List</Typography>
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
          rowData={cities}
          columnDefs={columnDefs}
          exportFileName="City"
          selectedColumns={selectedCols}
        />
      </Paper>

      {/* Column Selection Dialog */}
      <Dialog open={colDialog} onClose={() => setColDialog(false)}>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          {columnDefs.filter((c) => c.field).map((col) => (
            <Box key={col.field}>
              <input
                type="checkbox"
                checked={selectedCols.includes(col.field)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCols([...selectedCols, col.field]);
                  else setSelectedCols(selectedCols.filter((c) => c !== col.field));
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
      <Dialog open={confirm.open} maxWidth="xs" fullWidth>
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
                : "Reset the form?"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false })}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : confirm.type === "delete" ? "Delete" : confirm.type === "update" ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CityPage;