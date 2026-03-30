import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

const MasterForm = ({
  title = "Master Form",
  schema,
  defaultValues = {},
  onSubmit,
  loading = false,
  fields = [],
  submitLabel = "Save",
  updateLabel = "Update",
  isUpdate = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>

          {fields.map((field) => (
            <Grid key={field.name} size={{ xs: 12, sm: field.sm || 6 }}>

              {/* SWITCH FIELD */}
              {field.type === "switch" ? (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!value}
                          onChange={(e) => onChange(e.target.checked)}
                          disabled={loading}
                        />
                      }
                      label={field.label}
                    />
                  )}
                />
              ) : field.type === "select" ? (

                /* SELECT FIELD */
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      select
                      label={field.label}
                      fullWidth
                      value={value ?? ""}
                      onChange={onChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]?.message}
                      disabled={loading}
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              ) : (

                /* TEXT FIELD */
                <TextField
                  label={field.label}
                  type={field.type || "text"}
                  fullWidth
                  {...register(field.name)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  disabled={loading}
                  inputProps={field.inputProps || {}}
                  onInput={(e) => {
                    if (field.numericOnly) {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }
                    if (field.maxLength) {
                      e.target.value = e.target.value.slice(0, field.maxLength);
                    }
                  }}
                />
              )}
            </Grid>
          ))}

          {/* BUTTONS */}
          <Grid size={{ xs: 12 }} sx={{ mt: 3, display: "flex", gap: 2 }}>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading
                ? "Saving..."
                : isUpdate
                ? updateLabel
                : submitLabel}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>

          </Grid>

        </Grid>
      </form>
    </Paper>
  );
};

export default MasterForm;