import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import { createAuthHeaders } from "../utils/token";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../Styling/Createwave.css";
import { toast } from "react-toastify";
import { TfiReload } from "react-icons/tfi";

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

const Createwave = () => {
  const [search, setSearch] = useState<any>("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const token = localStorage.getItem("token");
  const fetchUserWaves = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await api.get(
        `${Local.GET_USER_WAVES}?search=${search}`,
        createAuthHeaders(token)
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch user details");
      }
      return response.data;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDetail"],
    queryFn: fetchUserDetail,
  });
  const { data: userWaves } = useQuery({
    queryKey: ["userWaves", search],
    queryFn: fetchUserWaves,
  });
  console.log(userWaves);
  const initialValues = {
    text: "",
    media: null,
  };

  const validationSchema = Yup.object({
    text: Yup.string()
      .required("Text is required.")
      .min(10, "Text must be at least 10 characters long."),
    media: Yup.mixed()
      .required("A media file is required.")
      .test(
        "fileFormat",
        "Invalid format. Only JPEG images and MP4 videos are supported.",
        (value: any) =>
          value && ["image/jpeg", "video/mp4"].includes(value.type)
      ),
  });

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("text", values.text);
    if (values.media) {
      formData.append("media", values.media);
    }

    if (token) {
      try {
        const response = await api.post(
          `${Local.CREATE_WAVE}`,
          formData,
          createAuthHeaders(token)
        );
        toast.success("Wave added successfully!");
        navigate("/app/dashboard");

        // Reset the form after success
        // resetForm();
      } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
        toast.error("Failed to add wave. Please try again.");
      }
    } else {
      toast.error("Authentication token is missing. Please log in.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  console.log(data);

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
        Create Waves
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
            Create Waves
          </h1>
        </div>
      </div>

      <div className="photo ms-5 mb-0 main-img-div ">
        <div className="d-flex photo  ">
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
            {" "}
            {data?.user?.firstName} {data?.user?.lastName}{" "}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-0 mx-2 text-secondary bg-white ps-4 rounded-bottom-2 snd-rel-div ">
        <p className="small">What do you want to share?</p>
        <Formik
          initialValues={{
            media: null,
            text: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form encType="multipart/form-data">
              <div className="me-4 mb-3">
                <input
                  type="file"
                  name="media"
                  onChange={(e: any) =>
                    setFieldValue("media", e.currentTarget.files[0])
                  }
                  className="form-control"
                />
                <ErrorMessage
                  component="div"
                  name="media"
                  className="text-danger"
                />
              </div>
              <div className="me-4 mb-3">
                <Field
                  name="text"
                  placeholder="Write Something..."
                  className="form-control"
                  rows={3}
                />
                <ErrorMessage
                  component="div"
                  name="text"
                  className="text-danger"
                />
              </div>

              <div>
                <button
                  style={{
                    backgroundColor: "#3E5677",
                    width: "205px",
                    height: "50px",
                    gap: "0px",
                    borderRadius: "10px", // Rounded from all corners
                    opacity: "0.9", // Set to 1 for full visibility
                    color: "#fff",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  type="submit"
                >
                  Create Wave
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="d-flex mt-4">
          <div className="d-flex" style={{ width: "95%" }}>
            <div className="form-control rounded-5 d-flex align-items-center position-relative">
              {/* <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pt-2"
              >
                <path
                  d="M8.94286 3C10.519 3 12.0306 3.62612 13.1451 4.74062C14.2596 5.85512 14.8857 7.36671 14.8857 8.94286C14.8857 10.4149 14.3463 11.768 13.4594 12.8103L13.7063 13.0571H14.4286L19 17.6286L17.6286 19L13.0571 14.4286V13.7063L12.8103 13.4594C11.768 14.3463 10.4149 14.8857 8.94286 14.8857C7.36671 14.8857 5.85512 14.2596 4.74062 13.1451C3.62612 12.0306 3 10.519 3 8.94286C3 7.36671 3.62612 5.85512 4.74062 4.74062C5.85512 3.62612 7.36671 3 8.94286 3ZM8.94286 4.82857C6.65714 4.82857 4.82857 6.65714 4.82857 8.94286C4.82857 11.2286 6.65714 13.0571 8.94286 13.0571C11.2286 13.0571 13.0571 11.2286 13.0571 8.94286C13.0571 6.65714 11.2286 4.82857 8.94286 4.82857Z"
                  fill="#3E5677"
                />
              </svg> */}
              <input
                type="text"
                name="searchFriend"
                placeholder="Search"
                className="w-100 form-control border-0 rounded-5 ps-2"
                id="searchInput"
                onKeyDown={(e: any) => {
                  if (e.key == "Enter") {
                    setSearch(e.target.value);
                  }
                }}
              />
              <TfiReload
                className="me-3"
                onClick={() => {
                  setSearch("");
                }}
              />
              <button
                type="button"
                className="btn btn-light position-absolute end-0 me-2 p-0 border-0"
                onClick={() => {
                  const input = document.getElementById(
                    "searchInput"
                  ) as HTMLInputElement;
                  if (input) input.value = "";
                }}
                style={{ cursor: "pointer" }}
              >
                ✖
              </button>
            </div>
          </div>
        </div>

        <div className="pb-2">
          <div className="col-12 my-3 ">
            {data?.waves?.userWaves?.length > 0 && (
              <>
                {userWaves?.data?.map((waveData: any) => (
                  <div
                    className="p-1 wave-card rounded me-4 mb-3"
                    key={waveData.id}
                  >
                    <div className="d-flex pb-0">
                      <div className="d-flex ">
                        <div className="">
                          <img
                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${data?.user?.firstName} ${data?.user?.lastName}`}
                            alt="User Profile"
                            className="rounded-circle border"
                            style={{ width: "50px", height: "50px" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          />
                        </div>

                        <div className="ms-3 small">
                          <p className="mb-0 mt-1 fw-bold cmn-clr ">
                            {data?.user.email}
                          </p>
                          <p className="mt-0 "> {waveData.text} </p>
                        </div>
                      </div>

                      <div className="ms-auto mt-3 me-4">
                        {waveData?.status === true ? (
                          <p className="badge bg-success fw-medium rounded-4 px-3">
                            Active
                          </p>
                        ) : (
                          <p className="badge bg-danger fw-medium rounded-4 px-3">
                            In Active
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {data?.waves?.userWaves?.length == 0 && (
              <div className="text-center mt-5">
                <h4>No wave found</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createwave;
