import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { useQuery } from "@tanstack/react-query";

// Register the necessary chart components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const getAllData = async () => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    const response = await api.get(
      `${Local.GET_ALL_DATA}`,
      createAuthHeaders(adminToken)
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    return response.data;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/adminLogin");
    }
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllData"],
    queryFn: getAllData,
  });

  const userData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "Users",
        data: [data?.activeUsers, data?.inactiveUsers],
        backgroundColor: ["#4BC0C0", "#FF6384"], // Colors for the pie chart segments
      },
    ],
  };

  // Data for Active/Inactive Waves Pie Chart
  const waveData = {
    labels: ["Active Waves", "Inactive Waves"],
    datasets: [
      {
        label: "Waves",
        data: [data?.activeWaves, data?.inactiveWaves],
        backgroundColor: ["#36A2EB", "#FF9F40"], // Colors for the pie chart segments
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminLogin");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 container-fluid">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="btn btn-dark rounded-3 position-fixed top-0 end-0 m-3 d-flex align-items-center justify-content-center"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px", // Adjust this value for more/less rounding
        }}
        aria-label="Logout"
      >
        <i className="bi bi-box-arrow-right"></i>
      </button>

      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Hello Admin</p>
      </header>

      <div className="row g-4">
        <div
          className="col-12 col-md-6 col-lg-3"
          onClick={() => {
            navigate("/manageUsers");
          }}
        >
          <div
            className="card shadow-sm h-100"
            style={{
              transition: "transform 0.3s ease",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6">{data?.totalUsers}</p>
            </div>
          </div>
        </div>
        <div
          className="col-12 col-md-6 col-lg-3"
          onClick={() => {
            navigate("/manageUsers");
          }}
        >
          <div
            className="card shadow-sm h-100"
            style={{
              transition: "transform 0.3s ease",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Active Users</h5>
              <p className="card-text display-6">{data?.activeUsers}</p>
            </div>
          </div>
        </div>
        <div
          className="col-12 col-md-6 col-lg-3"
          onClick={() => {
            navigate("/manageUsers");
          }}
        >
          <div
            className="card shadow-sm h-100"
            style={{
              transition: "transform 0.3s ease",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Inactive Users</h5>
              <p className="card-text display-6">{data?.inactiveUsers}</p>
            </div>
          </div>
        </div>
        <div
          className="col-12 col-md-6 col-lg-3"
          onClick={() => {
            navigate("/manageWaves");
          }}
        >
          <div
            className="card shadow-sm h-100"
            style={{
              transition: "transform 0.3s ease",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Total Waves</h5>
              <p className="card-text display-6">{data?.totalWaves}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="row g-4 mt-5">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm">
            <div className="card-header text-center">
              <h5>Active vs Inactive Users</h5>
            </div>
            <div className="card-body">
              <Pie data={userData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow-sm">
            <div className="card-header text-center">
              <h5>Active vs Inactive Waves</h5>
            </div>
            <div className="card-body">
              <Pie data={waveData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
