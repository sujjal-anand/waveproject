import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import "../Styling/Myprofile.css";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "../main";

const fetchUserDetail = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await api.get(
      `${Local.GET_USER_DETAILS}`,
      createAuthHeaders(token)
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    return response.data;
  }
};

const Myprofile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);
  const handleFileChange = async (event: any) => {
    const profilePhoto = event.target.files[0];
    if (profilePhoto) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(profilePhoto.type)) {
        toast.error("Only JPG and PNG images are allowed");
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(profilePhoto);
      img.src = objectUrl;

      img.onload = async () => {
        const targetWidth = 300;
        const targetHeight = 300;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const sourceX = (img.width - targetWidth) / 2;
        const sourceY = (img.height - targetHeight) / 2;

        ctx?.drawImage(
          img,
          sourceX,
          sourceY,
          targetWidth,
          targetHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );

        canvas.toBlob(async (blob) => {
          if (blob) {
            const fileExtension = profilePhoto.name.split(".").pop();
            const fileName = `profilePhoto.${fileExtension}`;

            const formData = new FormData();
            formData.append("profilePhoto", blob, fileName);

            const token = localStorage.getItem("token");
            if (token) {
              try {
                const response = await api.put(
                  `${Local.UPDATE_USER_PICTURE}`,
                  formData,
                  createAuthHeaders(token)
                );

                if (response.status === 200) {
                  console.log("Image upload successful");
                  toast.success("Profile photo updated successfully");

                  // Debug query client
                  console.log("Invalidating query...");
                  console.log(queryClient);

                  // Invalidate query
                  queryClient.invalidateQueries({
                    queryKey: ["userDetail"],
                  });

                  console.log("Query invalidated");
                }
              } catch (error: any) {
                toast.error(
                  "Error: " + (error.response?.data || error.message)
                );
              }
            } else {
              toast.error("Authentication token is missing. Please log in.");
            }
          }
        }, profilePhoto.type);
      };
    }
  };

  const [activeTab, setActiveTab] = useState<any>("basicDetails");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDetail"],
    queryFn: fetchUserDetail,
  });

  console.log("<<<", data?.user?.socialSecurity);

  const basicDetailsSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be a 10-digit number")
      .required("Phone number is required"),
    socialSecurity: Yup.string()
      .matches(/^[0-9]{9}$/, "Must be a 9-digit number")
      .required("Social Security number is required"),
  });

  const personalDetailsSchema = Yup.object({
    addressOne: Yup.string().required("Address Line 1 is required"),
    addressTwo: Yup.string(),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string()
      .matches(/^[0-9]{6}$/, "Must be a 6-digit number")
      .required("Zip Code is required"),
    dob: Yup.date().nullable().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
    maritalStatus: Yup.string().required("Marital status is required"),
    social: Yup.string(),
    kids: Yup.number()
      .min(0, "Number of kids cannot be negative")
      .required("Number of kids is required"),
  });

  const handleBasicDetailsSubmit = async (values: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.put(
          `${Local.UPDATE_USER}`,
          values,
          createAuthHeaders(token)
        );
        console.log("Response:", response.data);
        toast.success("Profile Updated Successfully");
      } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
      }
    } else {
      console.error("Token is missing. Please log in.");
    }
  };

  const handlePersonalDetailsSubmit = async (values: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.put(
          `${Local.UPDATE_USER}`,
          values,
          createAuthHeaders(token)
        );
        console.log("Response:", response.data);
        toast.success("Profile Updated Successfully");
      } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
      }
    } else {
      console.error("Token is missing. Please log in.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  return (
    <div>
      <p
        className="h5 pb-3 d-flex bg-secondary-subtle"
        onClick={() => navigate("/app/dashboard")}
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 26 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="me-4 pt-1"
        >
          <path
            d="M25.3467 10.4067C25.3467 10.9899 24.9133 11.472 24.3509 11.5483L24.1946 11.5588L1.15258 11.5588C0.516294 11.5588 0.000482559 11.043 0.000482559 10.4067C0.000482559 9.82341 0.433908 9.34138 0.99625 9.26509L1.15258 9.25458L24.1946 9.25458C24.8309 9.25458 25.3467 9.77039 25.3467 10.4067Z"
            fill="#292929"
            fillOpacity="0.8"
          />
          <path
            d="M11.2588 18.8446C11.7097 19.2935 11.7112 20.023 11.2623 20.4739C10.8541 20.8838 10.2142 20.9223 9.76242 20.5886L9.63296 20.4774L0.339355 11.2237C-0.0717716 10.8144 -0.109172 10.1721 0.227171 9.72034L0.339287 9.59096L9.63289 0.335757C10.0837 -0.113233 10.8132 -0.111723 11.2622 0.339131C11.6704 0.748998 11.7062 1.38912 11.3706 1.83946L11.2588 1.96844L2.78547 10.4078L11.2588 18.8446Z"
            fill="#292929"
            fillOpacity="0.8"
          />
        </svg>
        Profile
      </p>

      <div className="mx-2 mt-2 rounded">
        <div className="d-flex justify-content-between align-items-center cw-clr py-4 rounded-top-2">
          <h1
            className="fw-bold mx-auto cw-clr"
            style={{
              fontSize: "3rem",
              letterSpacing: "2rem",
              fontWeight: "900",
              fontFamily: "Impact, sans-serif",
            }}
          >
            My Profile
          </h1>
          {/* Label styled as a button */}
          <label
            htmlFor="fileInput"
            className="btn btn-info"
            style={{
              background: "#FFFFFF",
              width: "205px",
              height: "50px",
              borderRadius: "10px",
              marginRight: "20px",
              opacity: "0.9",
              border: "2px solid white",
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <p
              style={{
                color: "black",
                fontSize: "14px",
                textAlign: "center",
                margin: 0,
                fontWeight: "550",
              }}
            >
              Change Picture
            </p>
          </label>
          {/* Hidden file input */}
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="photo ms-5 mb-0 main-img-div">
        <div className="d-flex photo">
          {data?.user?.profilePhoto && (
            <img
              src={`${Local.BASE_URL}${data?.user?.profilePhoto}`}
              alt="User Profile"
              className="rounded-circle border"
              style={{ width: "111px", height: "106px" }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
          )}
          {!data?.user?.profilePhoto && (
            <img
              src={`https://api.dicebear.com/5.x/initials/svg?seed=${data?.user?.firstName} ${data?.user?.lastName}`}
              alt="User Profile"
              className="rounded-circle border"
              style={{ width: "100px", height: "100px" }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
          )}
          <p className="mt-4 ms-4 text-white fs-5 fw-semibold">
            {data?.user?.firstName} {data?.user?.lastName}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-0 mx-2 text-secondary bg-white ps-4 rounded-bottom-2 snd-rel-div">
        <div className="container">
          <h2 className="mb-4">Change Information</h2>

          <ul className="nav nav-tabs" id="profileTabs">
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "basicDetails" ? "active" : ""
                }`}
                onClick={() => setActiveTab("basicDetails")}
                href="#basicDetails"
              >
                Basic Details
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "personalDetails" ? "active" : ""
                }`}
                onClick={() => setActiveTab("personalDetails")}
                href="#personalDetails"
              >
                Personal Details
              </a>
            </li>
          </ul>

          <div className="tab-content mt-3">
            {activeTab === "basicDetails" && (
              <Formik
                initialValues={{
                  firstName: data?.user?.firstName || "",
                  lastName: data?.user?.lastName || "",
                  email: data?.user?.email || "",
                  phoneNo: data?.user?.phoneNo || "",
                  socialSecurity: data?.user?.socialSecurity || "",
                }}
                validationSchema={basicDetailsSchema}
                onSubmit={handleBasicDetailsSubmit}
              >
                <Form>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-md-6 mb-3">
                      <div className="form-group">
                        <label>First Name</label>
                        <Field
                          type="text"
                          name="firstName"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6 mb-3">
                      <div className="form-group">
                        <label>Last Name</label>
                        <Field
                          type="text"
                          name="lastName"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Email */}
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Email</label>
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          disabled
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Phone Number</label>
                        <Field
                          type="text"
                          name="phoneNo"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="phoneNo"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Social Security */}
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Social Security Number</label>
                        <Field
                          type="text"
                          name="socialSecurity"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="socialSecurity"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4 mt-4">
                    <button
                      style={{
                        backgroundColor: "#3E5677",
                        width: "200px",
                        height: "50px",
                        marginBottom: "20px",
                        gap: "0px",
                        borderRadius: "10px",
                        opacity: "0.9",
                        color: "#fff",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>
                  </div>
                </Form>
              </Formik>
            )}

            {activeTab === "personalDetails" && (
              <Formik
                initialValues={{
                  addressOne: data?.user?.addressOne || "",
                  addressTwo: data?.user?.addressTwo || "",
                  city: data?.user?.city || "",
                  state: data?.user?.state || "",
                  zipCode: data?.user?.zipCode || "",
                  dob: data?.user?.dob || "",
                  gender: data?.user?.gender || "",
                  maritalStatus: data?.user?.maritalStatus || "",
                  kids: data?.user?.kids || 0,
                }}
                validationSchema={personalDetailsSchema}
                onSubmit={handlePersonalDetailsSubmit}
              >
                <Form>
                  {/* Row 1: Address Line 1 and Address Line 2 */}
                  <div className="row">
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Address Line 1</label>
                        <Field
                          type="text"
                          name="addressOne"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="addressOne"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Address Line 2</label>
                        <Field
                          type="text"
                          name="addressTwo"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="addressTwo"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: City and State */}
                  <div className="row">
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>City</label>
                        <Field
                          type="text"
                          name="city"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>State</label>
                        <Field
                          type="text"
                          name="state"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Zip Code and Date of Birth */}
                  <div className="row">
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Zip Code</label>
                        <Field
                          type="text"
                          name="zipCode"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="zipCode"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <Field
                          type="date"
                          name="dob"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="dob"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Gender and Marital Status */}
                  <div className="row">
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Gender</label>
                        <Field
                          as="select"
                          name="gender"
                          className="form-control"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Marital Status</label>
                        <Field
                          as="select"
                          name="maritalStatus"
                          className="form-control"
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                        </Field>
                        <ErrorMessage
                          name="maritalStatus"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6  mb-3">
                    <div className="form-group">
                      <label>Social</label>
                      <Field as="select" name="social" className="form-control">
                        <option value="">Select Social</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                      </Field>
                      <ErrorMessage
                        name="social"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  {/* Row 5: Number of Kids */}
                  <div className="row">
                    <div className="col-md-6  mb-3">
                      <div className="form-group">
                        <label>Number of Kids</label>
                        <Field
                          type="number"
                          name="kids"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="kids"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4 mt-4">
                    <button
                      style={{
                        backgroundColor: "#3E5677",
                        width: "200px",
                        height: "50px",
                        marginBottom: "20px",
                        gap: "0px",
                        borderRadius: "10px",
                        opacity: "0.9",
                        color: "#fff",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>
                  </div>
                </Form>
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
