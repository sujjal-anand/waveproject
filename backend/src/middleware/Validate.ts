import * as yup from "yup";
import { Request, Response, NextFunction } from "express";

const userSchema = yup.object().shape({
  firstname: yup.string().required("First Name is required"),
  lastname: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .required("Phone is required"),
  gender: yup.string().required("Gender is required"),
  usertype: yup.string().required("User type is required"),
  hobbies: yup.array().of(yup.string()).optional(),
});

export const validateUser = async (req: any, res: any, next: any) => {
  try {
    await userSchema.validate(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({
      message: "Validation error",
      details: err.errors,
    });
  }
};
