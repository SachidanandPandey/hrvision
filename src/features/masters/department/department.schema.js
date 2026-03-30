import * as yup from "yup";

export const departmentSchema = yup.object().shape({
  name: yup.string().required("Department Name is required"),
  status: yup.boolean()
});