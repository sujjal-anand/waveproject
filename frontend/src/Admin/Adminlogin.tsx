import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Local } from "../environment/env";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";

const Adminlogin = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const response = await api.post(`${Local.ADMIN_LOGIN}`, values);
      toast.success("Admin Login successfully");
      localStorage.setItem("adminToken", response?.data?.token);
      navigate("/adminDashboard");
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
                <h2 className="text-center mb-4">Login</h2>

                {isSubmitted && (
                  <div className="alert alert-success" role="alert">
                    Login successful!
                  </div>
                )}

                <Formik
                  initialValues={{
                    email: "",
                    password: "",
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
                          Password <span className="text-danger">*</span>
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

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 mb-3"
                      >
                        Login{" "}
                      </button>

                      <p className="text-center mb-0">
                        Not having a account{" "}
                        <a href="/adminSignup" className="text-decoration-none">
                          Signup
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

export default Adminlogin;
