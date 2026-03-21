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

import { stateSchema } from "./state.schema";
import {
  getStates,
  getCountries,
  createState,
  updateState,
  deleteState
} from "./stateService";

import { getStateColumns } from "./state.columns";

const StatePage = () => {
  const gridRef = useRef(null);

  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const emptyForm = { countryId: "", name: "", status: true };
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

  // ---------------- COUNTRY MAP ----------------
  const countryMap = useMemo(() => {
    const map = {};
    countries.forEach((c) => {
      map[c.countryId] = c.name;
    });
    return map;
  }, [countries]);

  // ---------------- FETCH ----------------
  const fetchStates = async () => {
    try {
      const res = await getStates();
      setStates(res.data || []);
    } catch {
      showMessage("Failed to load states", "error");
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.data || []);
    } catch {
      showMessage("Failed to load countries", "error");
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  // ---------------- ACTION RENDERER ----------------
  const ActionRenderer = useCallback(
    (props) => {
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
            color="error"
            variant="outlined"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </Stack>
      );
    },
    []
  );

  const columnDefs = useMemo(
    () => getStateColumns(countryMap, ActionRenderer),
    [countryMap, ActionRenderer]
  );

  // ---------------- CONFIRM HANDLER ----------------
  const handleConfirm = async () => {
    const { type, data } = confirm;
    setLoading(true);

    try {
      if (type === "save") {
        await createState({
          ...data,
          countryId: Number(data.countryId)
        });
        showMessage("✔ State saved successfully");
      }

      if (type === "update") {
        await updateState(editingId, {
          ...data,
          countryId: Number(data.countryId)
        });
        showMessage("✔ State updated successfully");
      }

      if (type === "delete") {
        await deleteState(data);
        showMessage("✔ State deleted successfully");
      }

      if (type === "reset") {
        handleReset(true);
      }

      await fetchStates();

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
      countryId: row.countryId,
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

  // ---------------- EXPORT PDF ----------------
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("State List Report", 14, 10);
    doc.text(new Date().toLocaleString(), 14, 16);

    const data = gridRef.current?.getData() || [];

    const rows = data.map((d, i) => [
      i + 1,
      countryMap[d.countryId] || "",
      d.name,
      d.status ? "Active" : "Inactive"
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["#", "Country", "State", "Status"]],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }
    });

    doc.save("states.pdf");
  };

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const t = setTimeout(() => {
      gridRef.current?.setSearch(search);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // ---------------- MESSAGE ----------------
  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 4, background: "#f4f6f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          {isEdit ? "Edit State" : "Add State"}
        </Typography>

        <MasterForm
          key={editingId || "new"}
          schema={stateSchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          fields={[
            {
              name: "countryId",
              label: "Country",
              type: "select",
              options: [
                { value: "", label: "Select Country" },
                ...countries.map((c) => ({
                  value: c.countryId,
                  label: c.name
                }))
              ]
            },
            { name: "name", label: "State Name", type: "text" },
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
          <Typography variant="h6">State List</Typography>

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
          rowData={states}
          columnDefs={columnDefs}
          countryMap={countryMap}
        />
      </Paper>

      {/* CONFIRM DIALOG */}
      <Dialog
        open={confirm.open}
        maxWidth="xs"
        fullWidth
        onClose={() =>
          !loading && setConfirm({ open: false, type: "", data: null })
        }
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Confirm Action
        </DialogTitle>

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

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              setConfirm({ open: false, type: "", data: null })
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={confirm.type === "delete" ? "error" : "primary"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : confirm.type === "delete" ? (
              "Delete"
            ) : confirm.type === "update" ? (
              "Update"
            ) : confirm.type === "save" ? (
              "Save"
            ) : (
              "Yes"
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

export default StatePage;