import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import image from "../Assets/signup.png";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAuthHeaders } from "../utils/token";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the icons
import { Oval } from "react-loader-spinner"; // Import the loader

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/app/dashboard");
    }
  }, []);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [fadeOut, setFadeOut] = useState(false); // Fade-out state

  const verifyToken = async (value: any) => {
    if (token) {
      try {
        const response = await api.post(
          `${Local.ADD_FRIEND_LOGIN}`,
          { email: value },
          createAuthHeaders(token)
        );
        toast.success("Friend added successfully");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Token verification failed"
        );
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true); // Show the loader
      setFadeOut(false); // Reset fadeOut before showing
      try {
        const response = await api.post(`${Local.LOGIN_USER}`, values);

        // If login is successful, verify the token
        if (response.status === 200) {
          localStorage.setItem("token", response?.data?.token);
          await verifyToken(values?.email); // Verify token after successful login
          navigate("/app/dashboard");
          toast.success(response?.data?.message || "Login successful");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Login failed");
      } finally {
        // Hide loader after 3-4 seconds
        setTimeout(() => {
          setFadeOut(true); // Trigger fade-out
          setTimeout(() => setIsLoading(false), 500); // Hide loader after fade-out animation
        }, 3000); // 3 seconds
      }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Image Column */}
        <div className="d-flex col-6 p-0" style={{ height: "100vh" }}>
          <img
            src={image}
            className="img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="s"
          />
        </div>

        {/* Form Column */}
        <div className="col-6 bg-white p-3">
          <div style={{ marginTop: "130px", marginLeft: "50px" }}>
            <h2 className="row-12 mb-4" style={{ marginLeft: "21px" }}>
              Login Your Account
            </h2>
            <hr
              className="ms-4 border-2"
              style={{ width: "20px", color: "#B18D4B" }}
            />
            <form onSubmit={formik.handleSubmit} className="row g-3 p-4">
              {/* Email */}
              <div className="col-12">
                <label htmlFor="email" className="mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control w-75 ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                ) : null}
              </div>

              {/* Password */}
              <div className="col-12 position-relative  w-75 ">
                <label htmlFor="password" className="mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"} // Toggle input type based on visibility
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "65%",
                    right: "15px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
                {formik.touched.password && formik.errors.password ? (
                  <div className="invalid-feedback">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>

              {/* Signup Link */}
              <div className="col-12">
                <a href="/" className="mb-2">
                  Signup
                </a>
              </div>

              {/* Login Button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary col-4 p-2">
                  Login
                </button>
              </div>
            </form>

            {/* Show loader with fade-in and fade-out animation */}
            {isLoading && !fadeOut && (
              <div className="d-flex justify-content-center mt-3">
                <Oval
                  height={50}
                  width={50}
                  color="#B18D4B"
                  secondaryColor="#9B8A6C"
                  strokeWidth={4}
                  strokeWidthSecondary={2}
                />
              </div>
            )}
            {fadeOut && (
              <div
                className="d-flex justify-content-center mt-3 fade-out-loader"
                style={{ opacity: 0, transition: "opacity 0.5s ease" }}
              >
                <Oval
                  height={50}
                  width={50}
                  color="#B18D4B"
                  secondaryColor="#9B8A6C"
                  strokeWidth={4}
                  strokeWidthSecondary={2}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-0">@2024 Lorem ipsum dolor sit amet</div>
    </div>
  );
};

export default Login;
