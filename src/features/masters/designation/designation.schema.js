import * as yup from "yup";

export const designationSchema = yup.object().shape({
  desigTitle: yup.string().required("Title is required"),

  desigReportTo: yup
    .string()
    .required("Report To is required"),

  desigSubordinate: yup.string().required("Required"),

  desigLevel: yup.string().required("Required"),

  designationReqId: yup.string().required("Required"),

  desigAbb: yup.string().required("Required"),

  jobDescription: yup.string().required("Required"),

  groupId: yup.string().required("Required"),

  status: yup.boolean()
});