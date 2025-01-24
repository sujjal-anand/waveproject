import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  // Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .min(3, "Name must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const response = await api.post(`${Local.ADMIN_SIGNUP}`, values);
      toast.success("Admin Created successfully");
      navigate("/adminLogin");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }

    setIsSubmitted(true);
    resetForm();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4">Register</h2>

                {isSubmitted && (
                  <div className="alert alert-success" role="alert">
                    Registration successful!
                  </div>
                )}

                <Formik
                  initialValues={{
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ touched, errors }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className={`form-control ${
                            touched.email && errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          New Password <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="password"
                          name="password"
                          className={`form-control ${
                            touched.password && errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="password"
                          name="confirmPassword"
                          className={`form-control ${
                            touched.confirmPassword && errors.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Confirm Password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="text"
                          name="fullName"
                          className={`form-control ${
                            touched.fullName && errors.fullName
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Full Name"
                        />
                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 mb-3"
                      >
                        Register Now
                      </button>

                      <p className="text-center mb-0">
                        If you already have an account{" "}
                        <a href="/adminLogin" className="text-decoration-none">
                          Login
                        </a>
                      </p>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
