import * as yup from "yup";

export const countrySchema = yup.object().shape({
  code: yup.string().required("Country Code is required"),
  name: yup.string().required("Country Name is required"),
  status: yup.boolean()
});