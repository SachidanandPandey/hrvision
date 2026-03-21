import React, { useEffect, useMemo, useState, useRef } from "react";
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
  DialogActions
} from "@mui/material";

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

  const emptyForm = {
    countryId: "",
    name: "",
    status: true
  };

  const [formValues, setFormValues] = useState(emptyForm);

  // ✅ Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // ✅ Dialog
  const [confirm, setConfirm] = useState({
    open: false,
    type: "", // save | update | delete | reset
    data: null
  });

  // ---------------- FETCH ----------------

  const fetchStates = async () => {
    const res = await getStates();
    setStates(res.data || []);
  };

  const fetchCountries = async () => {
    const res = await getCountries();
    setCountries(res.data || []);
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  // ---------------- SUBMIT ----------------

  const onSubmit = (data) => {
    setConfirm({
      open: true,
      type: editingId ? "update" : "save",
      data
    });
  };

  // ---------------- CONFIRM ACTION ----------------

  const handleConfirm = async () => {
    const { type, data } = confirm;

    try {
      if (type === "save") {
        await createState({ ...data, countryId: Number(data.countryId) });
        showMessage("State saved successfully");
      }

      if (type === "update") {
        await updateState(editingId, {
          ...data,
          countryId: Number(data.countryId)
        });
        showMessage("State updated successfully");
      }

      if (type === "delete") {
        await deleteState(confirm.data);
        showMessage("State deleted successfully");
      }

      if (type === "reset") {
        handleReset(true);
        showMessage("Form reset successfully");
      }

      fetchStates();
      handleReset(true);

    } catch (e) {
      showMessage("Something went wrong", "error");
    }

    setConfirm({ open: false, type: "", data: null });
  };

  // ---------------- MESSAGE ----------------

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ---------------- EDIT ----------------

  const handleEdit = (row) => {
    setEditingId(row.id);

    setFormValues({
      countryId: row.countryId,
      name: row.name,
      status: row.status
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- RESET ----------------

  const handleReset = (force = false) => {
    if (!force) {
      setConfirm({ open: true, type: "reset" });
      return;
    }

    setEditingId(null);
    setFormValues({ ...emptyForm });
  };

  // ---------------- DELETE ----------------

  const handleDelete = (id) => {
    setConfirm({ open: true, type: "delete", data: id });
  };

  // ---------------- ACTION COLUMN ----------------

  const ActionRenderer = (props) => {
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
  };

  const columnDefs = useMemo(
    () => getStateColumns(countries, ActionRenderer),
    [countries]
  );

  // ---------------- EXPORT ----------------

  const exportCSV = () => {
    gridRef.current?.exportCSV();
    showMessage("CSV exported successfully");
  };

  const exportExcel = () => {
    gridRef.current?.exportExcel();
    showMessage("Excel exported successfully");
  };

  // ---------------- SEARCH ----------------

  const onSearch = (e) => {
    gridRef.current?.setSearch(e.target.value);
  };

  // ---------------- CONFIRM TEXT ----------------

  const confirmText = {
    save: "Are you sure you want to save this state?",
    update: "Are you sure you want to update this state?",
    delete: "Are you sure you want to delete this state?",
    reset: "Are you sure you want to reset the form?"
  };

  return (

    <Box sx={{ p: 4, background: "#f4f6f9", minHeight: "100vh" }}>

      <Paper sx={{ p: 3 }}>

        {/* FORM */}

        <Typography variant="h6" mb={2}>
          {editingId ? "Edit State" : "Add State"}
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
              {editingId ? (
                <>
                  <Button variant="contained" type="submit">
                    Update
                  </Button>

                  <Button variant="outlined" onClick={handleReset}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" type="submit">
                    Save
                  </Button>

                  <Button variant="outlined" onClick={handleReset}>
                    Reset
                  </Button>
                </>
              )}
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
              onChange={onSearch}
            />

            <Button variant="outlined" onClick={exportCSV}>
              Export CSV
            </Button>

            <Button variant="outlined" onClick={exportExcel}>
              Export Excel
            </Button>
          </Stack>
        </Box>

        {/* GRID */}

        <MasterGrid
          ref={gridRef}
          rowData={states}
          columnDefs={columnDefs}
        />

      </Paper>

      {/* CONFIRM DIALOG */}

      <Dialog open={confirm.open}>
        <DialogTitle>Confirm Action</DialogTitle>

        <DialogContent>
          {confirmText[confirm.type]}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirm({ open: false })}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleConfirm}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default StatePage;