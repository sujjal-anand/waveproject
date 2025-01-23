import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, Trash2 } from "lucide-react";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const getAllWaves = async () => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    const response = await api.get(`${Local.GET_ALL_WAVES}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    return response.data;
  }
};

const ManageWaves = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/adminLogin");
    }
  }, []);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllWaves"],
    queryFn: getAllWaves,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className=" py-3 px-4 mb-2 rounded " style={{ color: "#3E5677" }}>
        <h1 className="h4 mb-0">Manage Users List</h1>
      </div>

      {/* Search and Users Table Section */}
      <div className="bg-white p-4 rounded shadow ">
        {/* Search Bar */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-light">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search with name, email, accesscode"
          />
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          <table className="table ">
            <thead className="text-center">
              <tr>
                <th className="bg-secondary-subtle">Wave Message</th>
                <th className="bg-secondary-subtle">Created On</th>
                <th className="bg-secondary-subtle">Status</th>
                <th className="bg-secondary-subtle">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data?.waves?.map((user: any) => (
                <tr key={user.id}>
                  <td>{user.text}</td>
                  <td>{format(new Date(user.createdAt), "MM/dd/yyyy")}</td>{" "}
                  <td>
                    <div className="form-check form-switch text-center ">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={user.status}
                        onChange={() => {}}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2 text-center">
                      <button className="btn btn-sm btn-primary">
                        <Eye className=" " />
                      </button>
                      <button className="btn btn-sm btn-success">
                        <Edit className=" " />
                      </button>
                      <button className="btn btn-sm btn-danger">
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
  );
};

export default ManageWaves;
