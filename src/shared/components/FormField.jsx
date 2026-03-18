import TextField from '@mui/material/TextField';

const FormField = ({ name, label, type, register, errors }) => (
  <TextField
    label={label}
    type={type}
    fullWidth
    {...register(name)}
    error={!!errors[name]}
    helperText={errors[name]?.message}
  />
);