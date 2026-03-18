import * as yup from "yup";

export const stateSchema = yup.object().shape({
  countryId: yup
    .number()
    .typeError("Country is required")
    .required("Country is required"),

  name: yup.string().required("State Name is required"),

  status: yup.boolean(),
});