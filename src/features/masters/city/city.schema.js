import * as yup from "yup";

export const citySchema = yup.object().shape({
  name: yup.string().required("City Name is required"),

  zipCode: yup.string().required("Zip Code is required"),

  stateId: yup
    .number()
    .typeError("State is required")
    .required("State is required"),

  isMetro: yup.boolean(),

  status: yup.boolean()
});