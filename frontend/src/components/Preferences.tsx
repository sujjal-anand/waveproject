import { FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import { createAuthHeaders } from "../utils/token";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Preferences = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);
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

  const { data: userDetail } = useQuery({
    queryKey: ["userDetail"],
    queryFn: fetchUserDetail,
  });

  console.log(userDetail);
  const initialValues = {
    language: userDetail?.preference?.language || "",
    breakfast: userDetail?.preference?.breakfast || "00:00",
    lunch: userDetail?.preference?.lunch || "00:00",
    dinner: userDetail?.preference?.dinner || "00:00",
    wakeTime: userDetail?.preference?.wakeTime || "00:00",
    bedTime: userDetail?.preference?.bedTime || "00:00",
    weightIn: userDetail?.preference?.weightIn || "kg", // Default to 'kg' or 'lb'
    weight: userDetail?.preference?.weight || "",
    heightIn: userDetail?.preference?.heightIn || "cm", // Default to 'cm' or 'ft/in'
    height: userDetail?.preference?.height || "",
    bloodGlucoseIn: userDetail?.preference?.bloodGlucoseIn || "mg/dL", // Default to 'mg/dL' or 'mmol/L'
    bloodGlucose: userDetail?.preference?.bloodGlucose || "",
    cholesterolIn: userDetail?.preference?.cholesterolIn || "mg/dL", // Default to 'mg/dL' or 'mmol/L'
    cholesterol: userDetail?.preference?.cholesterol || "",
    bloodPressureIn: userDetail?.preference?.bloodPressureIn || "mmHg", // Default to 'mmHg'
    bloodPressure: userDetail?.preference?.bloodPressure || "",
    distanceIn: userDetail?.preference?.distanceIn || "km", // Default to 'km' or 'miles'
    distance: userDetail?.preference?.distance || "",
    systemEmail: userDetail?.preference?.systemEmail || false,
    sms: userDetail?.preference?.sms || false,
    post: userDetail?.preference?.post || false,
    memberServicesEmail: userDetail?.preference?.memberServicesEmail || false,
    phoneCall: userDetail?.preference?.phoneCall || false,
  };

  const token = localStorage.getItem("token");

  const validationSchema = Yup.object({
    language: Yup.string().required("Language is required"),
    breakfast: Yup.string(),
    lunch: Yup.string(),
    dinner: Yup.string(),
    wakeTime: Yup.string()
      .required("Wake time is required")
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Wake time must be in HH:mm format"
      ),
    bedTime: Yup.string()
      .required("Bed time is required")
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Bed time must be in HH:mm format"
      ),
    weight: Yup.number()
      .required("Weight value should be in numbers")
      .positive("Weight must be positive"),
    height: Yup.number()
      .required("Height value should be in numbers")
      .positive("Height must be positive"),
    bloodGlucose: Yup.number()
      .required("Blood glucose value should be in numbers")
      .positive("Blood glucose value must be positive"),
    cholesterol: Yup.number().required(
      "Cholesterol value should be in numbers"
    ),
    bloodPressure: Yup.string()
      .required("Blood pressure is required")
      .matches(
        /^\d+\/\d+$/,
        "Blood pressure must be in the format 'systolic/diastolic'"
      ),
    distance: Yup.number()
      .required("Distance value should be in numbers")
      .positive("Distance must be positive"),
    communicationPreferences: Yup.object({
      systemEmail: Yup.boolean(),
      sms: Yup.boolean(),
      post: Yup.boolean(),
      memberServicesEmail: Yup.boolean(),
      phoneCall: Yup.boolean(),
    }),
  });

  const handleSubmit = async (values: any) => {
    try {
      if (token) {
        const response = await api.put(
          `${Local.ADD_USER_PREFERNCE}`,
          values,
          createAuthHeaders(token) // Ensure token is being sent in the headers
        );

        if (response.status === 200 || response.status === 201) {
          toast.success("Preference saved successfully:", response.data);
          // Handle success response (e.g., show a success message or redirect)
        } else {
          toast.error("Unexpected response status:");
          // Handle unexpected response
        }
      } else {
        toast.error("No token found. Please authenticate.");
        // Handle missing token (e.g., redirect to login)
      }
    } catch (error: any) {
      toast.error("Error saving preferences:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="container p-4">
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
        Preferences
      </p>

      <div className="bg-white p-4 rounded-lg">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            console.log(values);
          }}
        >
          {() => (
            <Form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Language</label>
                  <Field as="select" className="form-select" name="language">
                    <option value="" disabled>
                      Select language
                    </option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                  </Field>
                  <ErrorMessage name="language" component="div" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Breakfast</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type="time"
                      className="form-control"
                      defaultValue="00:00"
                      name="breakfast"
                      style={{ paddingRight: "30px" }} // Space for the icon
                    />
                    <ErrorMessage name="breakfast" component="div" />
                    <FaRegClock
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#aaa",
                        pointerEvents: "none", // Ensures the icon doesn't interfere with input
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Lunch</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type="time"
                      className="form-control"
                      style={{ paddingRight: "30px" }} // Space for the icon
                      name="lunch"
                    />
                    <ErrorMessage name="lunch" component="div" />
                    <FaRegClock
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#aaa",
                        pointerEvents: "none", // Ensures the icon doesn't interfere with input
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Dinner</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type="time"
                      name="dinner"
                      className="form-control"
                      style={{ paddingRight: "30px" }} // Space for the icon
                    />
                    <ErrorMessage name="dinner" component="div" />
                    <FaRegClock
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#aaa",
                        pointerEvents: "none", // Ensures the icon doesn't interfere with input
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Wake Time</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type="time"
                      name="wakeTime"
                      className="form-control"
                      style={{ paddingRight: "30px" }} // Space for the icon
                    />
                    <ErrorMessage name="wakeTime" component="div" />
                    <FaRegClock
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#aaa",
                        pointerEvents: "none", // Ensures the icon doesn't interfere with input
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Bed Time</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type="time"
                      name="bedTime"
                      className="form-control"
                      style={{ paddingRight: "30px" }} // Space for the icon
                    />
                    <ErrorMessage name="bedTime" component="div" />
                    <FaRegClock
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#aaa",
                        pointerEvents: "none", // Ensures the icon doesn't interfere with input
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Weight</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="weightIn"
                        value="kg"
                      />
                      <label className="form-check-label">Kg</label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="weightIn"
                        value="lbs"
                      />
                      <label className="form-check-label">lbs</label>
                    </div>
                  </div>
                  <Field type="number" placeholder="Weight" name="weight" />
                  <ErrorMessage name="weight" component="div" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Height</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="heightIn"
                        value="cm"
                      />
                      <label className="form-check-label">cm</label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="heightIn"
                        value="ft/inche"
                      />
                      <label className="form-check-label">ft/inches</label>
                    </div>
                  </div>
                  <Field type="number" placeholder="Height" name="height" />
                  <ErrorMessage name="height" component="div" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Blood Glucose</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="bloodGlucoseIn"
                        value="mmol/l"
                      />
                      <label className="form-check-label">mmol/l</label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="bloodGlucoseIn"
                        value="mg/dL"
                      />
                      <label className="form-check-label">mg/dL</label>
                    </div>
                  </div>
                  <Field
                    type="number"
                    placeholder="BloodGlucose"
                    name="bloodGlucose"
                  />
                  <ErrorMessage name="bloodGlucose" component="div" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cholesterol</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="cholesterolIn"
                        value="mmol/l"
                      />
                      <label className="form-check-label">mmol/l</label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="cholesterolIn"
                        value="mg/dL"
                      />
                      <label className="form-check-label">mg/dL</label>
                    </div>
                  </div>
                  <Field
                    type="number"
                    placeholder="Cholesterol"
                    name="cholesterol"
                  />
                  <ErrorMessage name="cholesterol" component="div" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Blood Pressure</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="bloodPressureIn"
                        value="kPa"
                      />
                      <label className="form-check-label">kPa</label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="bloodPressureIn"
                        value="mmHg"
                      />
                      <label className="form-check-label">mmHg</label>
                    </div>
                  </div>
                  <Field
                    type="text"
                    placeholder="BloodPressure"
                    name="bloodPressure"
                  />
                  <ErrorMessage name="bloodPressure" component="div" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Distance</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="distanceIn"
                        value="km"
                      />
                      <label className="form-check-label">km</label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        name="distanceIn"
                        value="miles"
                      />
                      <label className="form-check-label">miles</label>
                    </div>
                  </div>
                  <Field type="number" placeholder="Distance" name="distance" />
                  <ErrorMessage name="distance" component="div" />
                </div>
              </div>

              <div className="mb-3">
                <label className=" row form-label border-top border-bottom">
                  Communication Type
                </label>
                <div className="row">
                  <div className="col-6">
                    <div className="form-check form-switch">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        name="systemEmail" // Replace with the appropriate name
                      />
                      <ErrorMessage name="systemEmail" component="div" />
                      <label htmlFor="systemEmail" className="form-check-label">
                        System Emails
                      </label>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-check form-switch">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        name="sms"
                      />
                      <ErrorMessage name="sms" component="div" />
                      <label className="form-check-label">SMS</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check form-switch">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        name="post"
                      />
                      <ErrorMessage name="post" component="div" />
                      <label className="form-check-label">Post</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check form-switch">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        name="memberServicesEmail"
                      />
                      <ErrorMessage
                        name="memberServicesEmail"
                        component="div"
                      />
                      <label className="form-check-label">
                        Member Services Emails
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check form-switch">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        name="phoneCall"
                      />
                      <ErrorMessage name="phoneCall" component="div" />
                      <label className="form-check-label">Phone Call</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#3E5677",
                    width: "200px", // Increased width
                    height: "50px",
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
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Preferences;
