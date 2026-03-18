import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Button,
  Paper,
  Typography,
  Box,
  Stack,
  TextField
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

  // ---------------- SAVE / UPDATE ----------------

  const onSubmit = async (data) => {

    const payload = {
      ...data,
      countryId: Number(data.countryId)
    };

    if (editingId)
      await updateState(editingId, payload);
    else
      await createState(payload);

    handleReset();
    fetchStates();
  };

  // ---------------- EDIT ----------------

  const handleEdit = (row) => {

    setEditingId(row.id);

    setFormValues({
      countryId: row.countryId,
      name: row.name,
      status: row.status
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // ---------------- RESET ----------------

  const handleReset = () => {
    setEditingId(null);
    setFormValues(emptyForm);
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id) => {
    await deleteState(id);
    fetchStates();
  };

  // ---------------- GRID ACTION ----------------

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

  const exportExcel = () => {
    gridRef.current?.exportDataAsExcel();
  };

  // ---------------- SEARCH ----------------

  const onSearch = (e) => {
    gridRef.current?.setGridOption(
      "quickFilterText",
      e.target.value
    );
  };

  return (

    <Box sx={{ p: 4, background: "#f4f6f9", minHeight: "100vh" }}>

      <Paper sx={{ p: 3 }}>

        {/* FORM */}

        <Typography variant="h6" mb={2}>
          {editingId ? "Edit State" : "Add State"}
        </Typography>

        <MasterForm
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
              <Button variant="contained" type="submit">
                {editingId ? "Update" : "Save"}
              </Button>

              <Button variant="outlined" onClick={handleReset}>
                {editingId ? "Cancel" : "Reset"}
              </Button>
            </Stack>
          }
        />

        {/* GRID HEADER */}

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography variant="h6">
            State List
          </Typography>

          <Stack direction="row" spacing={2}>

            <TextField
              size="small"
              placeholder="Search..."
              onChange={onSearch}
            />

            <Button
              variant="outlined"
              onClick={exportExcel}
            >
              Export
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

    </Box>
  );
};

export default StatePage;