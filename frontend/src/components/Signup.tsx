import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import image from "../Assets/signup.png";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import jwt from "jsonwebtoken";
import { createAuthHeaders } from "../utils/token";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the icons

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNo: Yup.string()
    .matches(/^\d{10}$/, "PhoneNo number must be 10 digits")
    .required("PhoneNo number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const Signup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/app/dashboard");
    }
  }, []);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL

  // State to handle password visibility
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await api.post(`${Local.CREATE_USER}`, values);
      console.log(response?.data);
      if (response.status === 201 || response.status === 200) {
        toast.success(response?.data?.message);
        navigate("/login");
        if (token) {
          // API path to handle the token
          await api.post(
            `${Local.ADD_FRIEND_SIGNUP}`,
            { receiverfriendId: response?.data?.user?.id },
            createAuthHeaders(token)
          );
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "60%" }}>
        {/* Image Column */}
        <div className="d-flex col-6 p-0">
          <img
            src={image}
            className="img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Signup"
          />
        </div>

        {/* Form Column */}
        <div className="col-6 bg-white p-3">
          <div style={{ marginTop: "50px", marginLeft: "70px" }}>
            <h2 className="row-12 mb-4" style={{ marginLeft: "21px" }}>
              Sign Up
            </h2>
            <hr
              className="ms-4 border-2"
              style={{ width: "20px", color: "#B18D4B" }}
            />{" "}
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phoneNo: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="row g-3 p-4 w-100">
                  {/* First Name */}
                  <div className="col-6">
                    <label className="mb-2">First Name</label>
                    <Field name="firstName" className="form-control" />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="col-6">
                    <label className="mb-2">Last Name</label>
                    <Field name="lastName" className="form-control" />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label className="mb-2">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* PhoneNo */}
                  <div className="col-12">
                    <label className="mb-2">Enter Phone No.</label>
                    <Field name="phoneNo" className="form-control" />
                    <ErrorMessage
                      name="phoneNo"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <label className="mb-2">Password</label>
                    <div style={{ position: "relative" }}>
                      <Field
                        name="password"
                        type={showPasswords.password ? "text" : "password"}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("password")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {showPasswords.password ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="col-12">
                    <label className="mb-2">Confirm Password</label>
                    <div style={{ position: "relative" }}>
                      <Field
                        name="confirmPassword"
                        type={
                          showPasswords.confirmPassword ? "text" : "password"
                        }
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {showPasswords.confirmPassword ? (
                          <FaEye />
                        ) : (
                          <FaEyeSlash />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Login Link */}
                  <div className="col-12">
                    <a href="/login" className="mb-2">
                      Login
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary col-4 p-2">
                      Sign Up
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-0">@2024 Lorem ipsum dolor sit amet</div>
    </div>
  );
};

export default Signup;
