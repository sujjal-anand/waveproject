import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import changePasswordimage from "../Assets/changepassword.png";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const handlePassword = async (postData: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await api.put(
        `${Local.CHANGE_PASSWORD}`,
        postData,
        createAuthHeaders(token)
      );
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    }
  } else {
    console.error("Token is missing. Please log in.");
  }
};

const Changepassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const token = localStorage.getItem("token");
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(6, "New Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "New Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .notOneOf(
        [Yup.ref("oldPassword")],
        "New Password cannot be the same as Old Password"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Submitted data:", values);
    handlePassword(values);
    navigate("/app/dashboard");
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const renderPasswordField = (
    name: keyof typeof initialValues,
    placeholder: string,
    showPassword: boolean
  ) => (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
    >
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        style={{
          width: "400px", // Fixed width for input fields
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #CCC",
          marginRight: "10px",
        }}
      />
      <button
        type="button"
        onClick={() => togglePasswordVisibility(name)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // To stack the heading above the box
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Back Button and Heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px", // Adds spacing between the heading and the box
          width: "65%", // Ensures alignment with the form box
          maxWidth: "800px", // Optional: limit max width for better design
          marginRight: "355px",
        }}
      >
        <button
          style={{
            border: "none",
            background: "none",
            fontSize: "34px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={() => {
            navigate("/app/dashboard");
          }}
        >
          &#x2190;
        </button>
        <h2 style={{ fontSize: "24px", margin: 0 }}>Change Password</h2>
      </div>

      {/* Form and Image Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%", // Full available width of the parent container
          maxWidth: "1200px", // Reduce the max width for the form container
          display: "flex", // Use flex to place the image and form next to each other
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "80%", marginTop: "20px" }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                {/* Old Password */}
                {renderPasswordField(
                  "oldPassword",
                  "Old Password",
                  showPasswords.oldPassword
                )}
                <ErrorMessage name="oldPassword" component="div" />

                {/* New Password */}
                {renderPasswordField(
                  "newPassword",
                  "New Password",
                  showPasswords.newPassword
                )}
                <ErrorMessage name="newPassword" component="div" />

                {/* Confirm Password */}
                {renderPasswordField(
                  "confirmPassword",
                  "Confirm Password",
                  showPasswords.confirmPassword
                )}
                <ErrorMessage name="confirmPassword" component="div" />

                {/* Submit Button */}
                <div style={{ marginTop: "20px" }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#3E5677",
                      width: "205px", // Fixed width for the button
                      height: "50px",
                      borderRadius: "10px",
                      color: "#fff",
                      border: "none",
                      fontSize: "16px",
                      cursor: "pointer",
                      marginLeft: "205px",
                    }}
                  >
                    Update
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Image on the right side */}
        <div
          style={{ width: "40%", display: "flex", justifyContent: "center" }}
        >
          <img
            src={changePasswordimage}
            alt=""
            style={{
              width: "80%", // Adjust image width inside the container
              height: "300px", // Keep the image aspect ratio intact
              borderRadius: "10px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Changepassword;
