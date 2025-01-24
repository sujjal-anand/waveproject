import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, Trash2 } from "lucide-react";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { TfiReload } from "react-icons/tfi";
import { MdEdit } from "react-icons/md";
const ManageWaves = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/adminLogin");
    }
  }, []);

  const [search, setSearch] = useState<any>("");
  const getAllWaves = async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const response = await api.get(`${Local.GET_ALL_WAVES}?search=${search}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch user details");
      }
      return response.data;
    }
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllWaves", search],
    queryFn: getAllWaves,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setWaveData] = useState<any>({});

  const handleOpenModal = async (id: any) => {
    const response = await api.get(`${Local.GET_WAVE}/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    setIsModalOpen(true);
    setWaveData(response?.data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="container mt-4">
        {/* Page Header */}
        <div className=" py-3 px-4 mb-2 rounded " style={{ color: "#3E5677" }}>
          <h1
            className="h4 mb-0"
            onClick={() => {
              navigate("/adminDashboard");
            }}
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
            Manage Waves List
          </h1>
        </div>

        {/* Search and Users Table Section */}
        <div className="bg-white p-4 rounded shadow ">
          {/* Search Bar */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-light">
              <Search
                className="h-5 w-5"
                onClick={(e: any) => {
                  // setSearch(search);
                }}
              />
              <TfiReload
                className="ms-3"
                onClick={(e: any) => {
                  setSearch("");
                }}
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search with name, email, accesscode"
              onKeyDown={(e: any) => {
                if (e.key == "Enter") {
                  setSearch(e.target.value);
                }
              }}
            />
          </div>

          {/* Users Table */}
          <div className="table-responsive">
            <table className="table ">
              <thead className="text-center">
                <tr>
                  <th className="bg-secondary-subtle">User Name</th>
                  <th className="bg-secondary-subtle">Wave Message</th>
                  <th className="bg-secondary-subtle">Created On</th>
                  <th className="bg-secondary-subtle">Status</th>
                  <th className="bg-secondary-subtle">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data?.waves?.map((user: any) => (
                  <tr key={user.id}>
                    <td>
                      {user?.userWave?.firstName} {user?.userWave?.lastName}
                    </td>
                    <td>{user.text}</td>
                    <td>
                      {format(new Date(user.createdAt), "MM/dd/yyyy")}
                    </td>{" "}
                    <td>
                      <div className="form-check form-switch text-center ms-5 ps-5">
                        <Formik
                          initialValues={{ status: user?.status || false }} // Ensure a default boolean value
                          onSubmit={() => {}}
                        >
                          {({ values, setFieldValue }) => (
                            <Form>
                              <div className="form-check form-switch text-center ms-1 ps-5">
                                <Field
                                  name="status"
                                  type="checkbox"
                                  className="form-check-input"
                                  onChange={async (
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    const isChecked = e.target.checked; // Get the checkbox state
                                    setFieldValue("status", isChecked); // Update Formik's state

                                    const adminToken =
                                      localStorage.getItem("adminToken");
                                    if (adminToken) {
                                      try {
                                        const response = await api.put(
                                          `${Local.EDIT_WAVE}/${user.id}`,
                                          { status: isChecked },
                                          createAuthHeaders(adminToken)
                                        );
                                        console.log("Response:", response.data);
                                        toast.success(
                                          "Profile Updated Successfully"
                                        );
                                      } catch (error: any) {
                                        console.error(
                                          "Error:",
                                          error.response?.data || error.message
                                        );
                                      }
                                    } else {
                                      console.error(
                                        "adminToken is missing. Please log in."
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center ps-2">
                        <button
                          className="btn"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                          onClick={() => {
                            handleOpenModal(user.id);
                          }}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>

                        <button
                          className="btn"
                          onClick={() => {
                            navigate(`/editWave/${user.id}`);
                          }}
                        >
                          <i className="bi bi-pen"></i>
                        </button>

                        <button
                          className="btn"
                          onClick={async () => {
                            const response = await api.delete(
                              `${Local.DELETE_WAVE}/${user.id}`
                            );

                            if (response.status !== 200) {
                              throw new Error("Failed to fetch user details");
                            }
                          }}
                        >
                          <Trash2 className="" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <!-- Modal --> */}
      {isModalOpen && (
        <div
          className="modal fade show"
          id="staticBackdrop"
          style={{ display: "block" }}
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5 ms-2" id="staticBackdropLabel">
                  Wave Detail
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Container for the modal content */}
                <div className="container">
                  <div className="row mb-4">
                    <div className="col-4 fw-bold text-end">Name:</div>
                    <div className="col-8 text-start">
                      <span className="text-secondary">
                        {userData.userWave?.firstName || "-----"}{" "}
                        {userData.userWave?.lastName || "-----"}
                      </span>
                    </div>
                  </div>

                  {/* Row for the wave text */}
                  <div className="row mb-4">
                    <div className="col-4 fw-bold text-end">Wave Text:</div>
                    <div className="col-8 text-start">
                      <span className="text-secondary">
                        {userData.text || "-----"}
                      </span>
                    </div>
                  </div>

                  {/* Row for the media content */}
                  <div className="row">
                    <div className="col-12">
                      <div className="media-container d-flex justify-content-center align-items-center border border-2 border-secondary-subtle rounded p-3">
                        {/* Image */}
                        {userData?.image ? (
                          <img
                            src={`${Local.BASE_URL}${userData.image}`}
                            alt="User Profile"
                            className="rounded"
                            style={{
                              width: "100%",
                              maxWidth: "500px", // Increase max width for larger images
                              height: "auto", // Maintain aspect ratio
                              objectFit: "contain", // Ensure the image fits within the container
                            }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          />
                        ) : userData?.video ? (
                          /* Video */
                          <video
                            controls
                            className="rounded"
                            style={{
                              width: "100%",
                              maxWidth: "500px", // Same width as image for consistency
                              height: "auto", // Auto height to fit the video
                              objectFit: "contain",
                            }}
                          >
                            <source
                              src={`${Local.BASE_URL}${userData.video}`}
                              type="video/mp4"
                            />
                            <source
                              src={`${Local.BASE_URL}${userData.video}`}
                              type="video/webm"
                            />
                            <source
                              src={`${Local.BASE_URL}${userData.video}`}
                              type="video/ogg"
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          /* Placeholder if no media is available */
                          <div className="text-muted text-center">
                            <i className="bi bi-file-earmark-slash fs-3"></i>
                            <p className="mt-2">No media available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageWaves;
