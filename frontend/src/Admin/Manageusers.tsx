import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, Trash2, Download } from "lucide-react"; // Added Download icon
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { TfiReload } from "react-icons/tfi";
import Papa from "papaparse"; // Import papaparse for CSV conversion
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import { queryClient } from "../main";

const ManageUsers = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/adminLogin");
    }
  }, []);

  const [search, setSearch] = useState<any>("");

  const getAllUsers = async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const response = await api.get(`${Local.GET_ALL_USERS}?search=${search}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch user details");
      }
      return response.data;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllUsers", search],
    queryFn: getAllUsers,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>({});

  const handleOpenModal = async (id: any) => {
    const response = await api.get(`${Local.GET_USER}/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    setIsModalOpen(true);
    setUserData(response?.data);
  };

  // Function to download CSV
  const handleDownloadCSV = () => {
    if (data?.users) {
      const csv = Papa.unparse(data.users, {
        header: true, // Include headers in the CSV
      });

      // Create a Blob and trigger download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "users.csv"; // File name
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      toast.error("No user data available to download.");
    }
  };

  // Function to download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add user data to PDF
    doc.setFontSize(16);
    doc.text("User Details", 10, 10);
    doc.setFontSize(12);
    doc.text(`Full Name: ${userData.firstName} ${userData.lastName}`, 10, 20);
    doc.text(`Email: ${userData.email}`, 10, 30);
    doc.text(`Phone No: ${userData.phoneNo}`, 10, 40);
    doc.text(`Address: ${userData.addressOne}`, 10, 50);
    doc.text(`City: ${userData.city}`, 10, 60);
    doc.text(`Zip Code: ${userData.zipCode}`, 10, 70);
    doc.text(`Date of Birth: ${userData.dob}`, 10, 80);
    doc.text(`Gender: ${userData.gender}`, 10, 90);
    doc.text(`Social Security: ${userData.socialSecurity}`, 10, 100);
    doc.text(`Kids: ${userData.kids}`, 10, 110);

    // Save the PDF
    doc.save("user_data.pdf");
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
        <div className="py-3 px-4 mb-2 rounded" style={{ color: "#3E5677" }}>
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
            Manage Users List
          </h1>
        </div>

        {/* Search and Users Table Section */}
        <div className="bg-white p-4 rounded shadow">
          {/* Search Bar */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-light">
              <Search
                className="h-5 w-5"
                onClick={(e: any) => {
                  setSearch(search);
                }}
              />
              <TfiReload
                className="ms-3"
                onClick={() => {
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

          {/* Download CSV Button */}
          <div className="mb-3">
            <button className="btn btn-primary" onClick={handleDownloadCSV}>
              <Download className="me-2" /> Download CSV
            </button>
          </div>

          {/* Users Table */}
          <div className="table-responsive">
            <table className="table">
              <thead className="text-center">
                <tr>
                  <th className="bg-secondary-subtle">Name</th>
                  <th className="bg-secondary-subtle">Email</th>
                  <th className="bg-secondary-subtle">Mobile</th>
                  <th className="bg-secondary-subtle">Status</th>
                  <th className="bg-secondary-subtle">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data?.users.map((user: any) => (
                  <tr key={user.id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phoneNo ? user.phoneNo : "------"}</td>
                    <td>
                      <div className="form-check form-switch text-center  ps-5">
                        <Formik
                          initialValues={{ status: user?.status || false }}
                          onSubmit={() => {}}
                        >
                          {({ values, setFieldValue }) => (
                            <Form>
                              <div className="form-check form-switch text-center  ps-5">
                                <Field
                                  name="status"
                                  type="checkbox"
                                  className="form-check-input"
                                  onChange={async (
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    const isChecked = e.target.checked;
                                    setFieldValue("status", isChecked);

                                    const adminToken =
                                      localStorage.getItem("adminToken");
                                    if (adminToken) {
                                      try {
                                        const response = await api.put(
                                          `${Local.EDIT_USER}/${user.id}`,
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
                      <div className="d-flex ms-5 ps-5 gap-2 text-center">
                        <button
                          className="btn " // Added blue color
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                          onClick={() => {
                            handleOpenModal(user.id);
                          }}
                        >
                          <i className="bi bi-eye-fill"></i>{" "}
                          {/* Replaced Eye with Bootstrap icon */}
                        </button>

                        <button
                          className="btn"
                          onClick={() => navigate(`/editUser/${user.id}`)}
                        >
                          <i className="bi bi-pen"></i>
                        </button>

                        <button
                          className="btn "
                          onClick={async () => {
                            const response = await api.delete(
                              `${Local.DELETE_USER}/${user.id}`
                            );

                            if (response.status == 200) {
                              queryClient.invalidateQueries({
                                queryKey: ["getAllUsers"],
                              });
                              toast.success("User deleted");
                            }

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

      {/* Modal */}
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
                  User Detail
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="container">
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Full Name:</div>
                    <div className="col-8 text-start">
                      {userData.firstName || "-----"}{" "}
                      {userData.lastName || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Email:</div>
                    <div className="col-8 text-start">
                      {userData.email || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Phone No:</div>
                    <div className="col-8 text-start">
                      {userData.phoneNo || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Address:</div>
                    <div className="col-8 text-start">
                      {userData.addressOne || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">City:</div>
                    <div className="col-8 text-start">
                      {userData.city || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Zip Code:</div>
                    <div className="col-8 text-start">
                      {userData.zipCode || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Date of Birth:</div>
                    <div className="col-8 text-start">
                      {userData.dob || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Gender:</div>
                    <div className="col-8 text-start">
                      {userData.gender || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">
                      Social Security:
                    </div>
                    <div className="col-8 text-start">
                      {userData.socialSecurity || "-----"}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4 fw-bold text-end">Kids:</div>
                    <div className="col-8 text-start">
                      {userData.kids || "-----"}
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
                {/* PDF Download Button */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownloadPDF}
                >
                  <Download className="me-2" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUsers;
