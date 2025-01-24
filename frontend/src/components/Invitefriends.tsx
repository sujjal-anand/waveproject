import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Invitefriends = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([
    { id: Date.now(), values: {}, isValid: false },
  ]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const initialValues = {
    fullname: "",
    emails: "",
    message: "",
  };

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Fullname is required"),
    emails: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleAddForm = () => {
    setForms([...forms, { id: Date.now(), values: {}, isValid: false }]);
  };
  const handleRemoveForm = (index: any) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  const handleFormChange = (index: any, values: any, isValid: any) => {
    const updatedForms = [...forms];
    updatedForms[index] = { ...updatedForms[index], values, isValid };
    setForms(updatedForms);
  };

  const handleSubmitAll = async () => {
    const token = localStorage.getItem("token");

    // Check if all forms are valid
    const allValid = forms.every((form) => form.isValid);
    if (!allValid) {
      toast.error("Please fill out all forms correctly before submitting.");
      return;
    }

    const allData = forms.map((form) => form.values);

    if (token) {
      setIsLoading(true); // Set loading to true when submitting

      try {
        const response = await api.post(
          `${Local.INVITE_FRIEND}`,
          allData,
          createAuthHeaders(token)
        );
        toast.success("Friends invited");
        navigate("/app/friends");
      } catch (error: any) {
        console.log(error);
        toast.error("Error:", error.response?.data.message || error.message);
      } finally {
        setIsLoading(false); // Set loading to false after submission
      }
    } else {
      console.error("Token is missing. Please log in.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
      >
        <span
          style={{
            fontSize: "24px",
            marginRight: "10px",
            cursor: "pointer",
            color: "#333",
          }}
          onClick={() => navigate(-1)}
        >
          ←
        </span>
        <h2 style={{ fontSize: "24px", margin: 0, color: "#333" }}>Friends</h2>
      </div>

      <p style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}>
        Invite some friends, show them your Waves, and let's see what they can
        do!
      </p>

      {/* Main White Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* Forms Container */}
        <div style={{ marginBottom: "20px" }}>
          {forms.map((form, index) => (
            <div
              key={form.id}
              style={{
                marginBottom: index === forms.length - 1 ? "0" : "24px",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#666",
                  marginBottom: "16px",
                }}
              >
                Friend #{index + 1}
              </h4>
              <Formik
                initialValues={form.values}
                validationSchema={validationSchema}
                validateOnChange
                validateOnBlur
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(false);
                  handleFormChange(index, values, true); // Update form data when submitted
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                }) => (
                  <Form
                    onBlur={() =>
                      handleFormChange(
                        index,
                        values,
                        Object.keys(errors).length === 0
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            color: "#555",
                            fontSize: "14px",
                          }}
                        >
                          Full Name
                        </label>
                        <Field
                          type="text"
                          name="fullname"
                          placeholder="Full Name"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                          }}
                        />
                        <ErrorMessage name="fullname" component="div" />
                      </div>

                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            color: "#555",
                            fontSize: "14px",
                          }}
                        >
                          Email Address
                        </label>
                        <Field
                          type="email"
                          name="emails"
                          placeholder="Email"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                          }}
                        />
                        <ErrorMessage name="emails" component="div" />
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          color: "#555",
                          fontSize: "14px",
                        }}
                      >
                        Message
                      </label>
                      <Field
                        as="textarea"
                        name="message"
                        placeholder="Message"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          fontSize: "14px",
                          minHeight: "100px",
                          resize: "vertical",
                        }}
                      />
                      <ErrorMessage name="message" component="div" />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ))}
        </div>

        {/* Buttons Container */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={handleAddForm}
            style={{
              color: "#666",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "0",
            }}
          >
            + Add More
          </button>

          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={isLoading} // Disable button while loading
            style={{
              backgroundColor: "#475569",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  border: "4px solid #f3f3f3", // Light gray
                  borderTop: "4px solid #3498db", // Blue
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  animation: "spin 2s linear infinite",
                }}
              ></div>
            ) : (
              "Invite Friends"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invitefriends;
