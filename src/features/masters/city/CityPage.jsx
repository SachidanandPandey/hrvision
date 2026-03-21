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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MasterForm from "../../../shared/components/MasterForm";
import MasterGrid from "../../../shared/components/MasterGrid";

import { citySchema } from "./city.schema";
import {
  getCities,
  getStates,
  createCity,
  updateCity,
  deleteCity
} from "./cityService";

import { getCityColumns } from "./city.columns";

const CityPage = () => {
  const gridRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const emptyForm = {
    name: "",
    zipCode: "",
    stateId: "",
    isMetro: false,
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

  // ---------------- STATE MAP ----------------
  const stateMap = useMemo(() => {
    const map = {};
    states.forEach((s) => {
      map[s.id] = s.name;
    });
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

  // ---------------- ACTION RENDERER ----------------
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
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </Button>
      </Stack>
    );
  }, []);

  const columnDefs = useMemo(
    () => getCityColumns(stateMap, ActionRenderer),
    [stateMap, ActionRenderer]
  );

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
        await updateCity(editingId, {
          ...data,
          stateId: Number(data.stateId)
        });
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
    setConfirm({
      open: true,
      type: isEdit ? "update" : "save",
      data
    });
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormValues({
      name: row.name,
      zipCode: row.zipCode,
      stateId: row.stateId,
      isMetro: row.isMetro,
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

  // ---------------- EXPORT PDF ----------------
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("City List Report", 14, 10);
    doc.text(new Date().toLocaleString(), 14, 16);

    const data = gridRef.current?.getData() || [];

    const rows = data.map((d, i) => [
      i + 1,
      d.name,
      d.zipCode,
      stateMap[d.stateId] || "",
      d.isMetro ? "Yes" : "No",
      d.status ? "Active" : "Inactive"
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["#", "City", "Zip", "State", "Metro", "Status"]],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }
    });

    doc.save("cities.pdf");
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
          {isEdit ? "Edit City" : "Add City"}
        </Typography>

        <MasterForm
          key={editingId || "new"}
          schema={citySchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          fields={[
            { name: "name", label: "City Name", type: "text" },
            { name: "zipCode", label: "Zip Code", type: "text" },
            {
              name: "stateId",
              label: "State",
              type: "select",
              options: [
                { value: "", label: "Select State" },
                ...states.map((s) => ({
                  value: s.id,
                  label: s.name
                }))
              ]
            },
            { name: "isMetro", label: "Metro", type: "switch" },
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
          <Typography variant="h6">City List</Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button onClick={() => gridRef.current.exportCSV()}>
              CSV
            </Button>
            <Button onClick={() => gridRef.current.exportExcel()}>
              Excel
            </Button>
            <Button onClick={exportPDF}>
              PDF
            </Button>
          </Stack>
        </Box>

        <MasterGrid
          ref={gridRef}
          rowData={cities}
          columnDefs={columnDefs}
          countryMap={stateMap} // ✅ IMPORTANT FIX
        />
      </Paper>

      {/* CONFIRM DIALOG */}
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

export default CityPage;