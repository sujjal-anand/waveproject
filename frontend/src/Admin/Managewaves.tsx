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
          <h1 className="h4 mb-0">Manage Waves List</h1>
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
                              <div className="form-check form-switch text-center ms-5 ps-5">
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
                      <div className="d-flex gap-2 text-center">
                        <button
                          className="btn btn-sm btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                          onClick={() => {
                            handleOpenModal(user.id);
                          }}
                        >
                          <Eye className=" " />
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
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
