import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback
} from "react";

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

import { countrySchema } from "./country.schema";
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry
} from "./countryService";

import { getCountryColumns } from "./country.columns";

const CountryPage = () => {
  const gridRef = useRef(null);

  const [countries, setCountries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCols, setSelectedCols] = useState([]);
  const [colDialog, setColDialog] = useState(false);

  const emptyForm = {
    code: "",
    name: "",
    status: true
  };

  const [formValues, setFormValues] = useState(emptyForm);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [confirm, setConfirm] = useState({
    open: false,
    type: "",
    data: null
  });

  const isEdit = Boolean(editingId);

  // ---------------- FETCH ----------------
  const fetchCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.data || []);
    } catch {
      showMessage("Failed to load countries", "error");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // ---------------- ACTION ----------------
  const ActionRenderer = useCallback((props) => {
    const row = props.data;

    return (
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleEdit(row)}
        >
          Edit
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handleDelete(row.countryId)}
        >
          Delete
        </Button>
      </Stack>
    );
  }, []);

  const columnDefs = useMemo(
    () => getCountryColumns(ActionRenderer),
    [ActionRenderer]
  );

  // ✅ default select all
  useEffect(() => {
    setSelectedCols(
      columnDefs.filter((c) => c.field).map((c) => c.field)
    );
  }, [columnDefs]);

  // ---------------- CONFIRM ----------------
  const handleConfirm = async () => {
    const { type, data } = confirm;
    setLoading(true);

    try {
      if (type === "save") {
        await createCountry(data);
        showMessage("✔ Country saved successfully");
      }

      if (type === "update") {
        await updateCountry(editingId, data);
        showMessage("✔ Country updated successfully");
      }

      if (type === "delete") {
        await deleteCountry(data);
        showMessage("✔ Country deleted successfully");
      }

      if (type === "reset") {
        handleReset(true);
      }

      await fetchCountries();

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
    setConfirm({
      open: true,
      type: isEdit ? "update" : "save",
      data
    });
  };

  const handleEdit = (row) => {
    setEditingId(row.countryId);
    setFormValues({
      code: row.code,
      name: row.name,
      status: row.status
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setConfirm({ open: true, type: "delete", data: id });
  };

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

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 4, background: "#f4f6f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          {isEdit ? "Edit Country" : "Add Country"}
        </Typography>

        {/* FORM */}
        <MasterForm
          key={editingId || "new"}
          schema={countrySchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          fields={[
            { name: "code", label: "Country Code", type: "text" },
            { name: "name", label: "Country Name", type: "text" },
            { name: "status", label: "Active", type: "switch" }
          ]}
          extraButtons={
            <Stack direction="row" spacing={2}>
              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? (
                  <CircularProgress size={20} />
                ) : isEdit ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>

              <Button variant="outlined" onClick={handleReset}>
                {isEdit ? "Cancel" : "Reset"}
              </Button>
            </Stack>
          }
        />

        {/* GRID HEADER */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Typography variant="h6">Country List</Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button onClick={() => setColDialog(true)}>
              Columns
            </Button>

            <Button onClick={() => gridRef.current.exportCSV()}>
              CSV
            </Button>

            <Button onClick={() => gridRef.current.exportExcel()}>
              Excel
            </Button>

            <Button onClick={() => gridRef.current.exportPDF()}>
              PDF
            </Button>
          </Stack>
        </Box>

        <MasterGrid
          ref={gridRef}
          rowData={countries}
          columnDefs={columnDefs}
          exportFileName="Country"
          selectedColumns={selectedCols}
        />
      </Paper>

      {/* COLUMN DIALOG */}
      <Dialog open={colDialog} onClose={() => setColDialog(false)}>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          {columnDefs
            .filter((c) => c.field)
            .map((col) => (
              <Box key={col.field}>
                <input
                  type="checkbox"
                  checked={selectedCols.includes(col.field)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCols([...selectedCols, col.field]);
                    } else {
                      setSelectedCols(
                        selectedCols.filter((c) => c !== col.field)
                      );
                    }
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

      {/* ✅ SAME CONFIRM DIALOG AS CITY */}
      <Dialog open={confirm.open} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Action</DialogTitle>

        <DialogContent>
          <Box display="flex" alignItems="center" gap={1.5}>
            {confirm.type === "delete" && (
              <WarningAmberIcon color="error" />
            )}

            <Typography>
              {confirm.type === "delete"
                ? "This action cannot be undone. Delete this record?"
                : confirm.type === "update"
                ? "Do you want to update this record?"
                : confirm.type === "save"
                ? "Do you want to save this record?"
                : "Do you want to reset the form?"}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirm({ open: false })}>
            Cancel
          </Button>

          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <CircularProgress size={20} />
            ) : confirm.type === "delete" ? (
              "Delete"
            ) : confirm.type === "update" ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CountryPage;