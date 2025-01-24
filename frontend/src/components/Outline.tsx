import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

const Outline = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const signOut = () => {
    localStorage.clear();
    if (token) {
      localStorage.clear();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    else if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDetail"],
    queryFn: fetchUserDetail,
  });

  if (data?.user?.status == false) {
    localStorage.clear();
    navigate("/login");
    toast.error("User deactivated by admin");
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );

  return (
    <div className="d-flex vh-100 text-nowrap">
      {/* Sidebar */}
      <div
        className=" text-white d-flex flex-column p-3 text-nowrap"
        style={{ width: "250px", height: "100vh", backgroundColor: "#3e5677" }}
      >
        <div className="mb-4 ms-5 " style={{ backgroundColor: "#3e5677" }}>
          <svg
            width="81"
            height="73"
            viewBox="0 0 81 73"
            fill="none"
            className="mt-3 ms-3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1418_393)">
              <path
                d="M40.5022 48.1138C50.958 48.1138 59.4341 39.5998 59.4341 29.0972C59.4341 18.5946 50.958 10.0806 40.5022 10.0806C30.0464 10.0806 21.5703 18.5946 21.5703 29.0972C21.5703 39.5998 30.0464 48.1138 40.5022 48.1138Z"
                fill="#BEA16E"
              />
              <path
                d="M53.1961 26.2483V31.95C53.1961 33.3258 52.0851 34.4418 50.7115 34.4418H45.8149V39.3603C45.8149 40.74 44.6998 41.856 43.3302 41.856H37.6539C36.2843 41.856 35.1733 40.74 35.1733 39.3603V34.4418H30.2767C28.903 34.4418 27.792 33.3258 27.792 31.95V26.2483C27.792 24.8726 28.903 23.7566 30.2767 23.7566H35.1733V18.8381C35.1733 17.4583 36.2843 16.3423 37.6539 16.3423H43.3302C44.6998 16.3423 45.8149 17.4583 45.8149 18.8381V23.7566H50.7115C52.0851 23.7566 53.1961 24.8726 53.1961 26.2483Z"
                fill="#3E5677"
              />
              <path
                d="M71.2195 0H9.78171C2.26308 0 -2.43556 8.17723 1.32578 14.719L31.8689 67.8324C35.6182 74.3539 44.9791 74.3783 48.7647 67.873L79.6512 14.7636C83.453 8.22187 78.7584 0 71.2155 0H71.2195ZM40.5026 49.5869C29.2388 49.5869 20.1042 40.4154 20.1042 29.0971C20.1042 17.7789 29.2348 8.60739 40.5026 8.60739C51.7705 8.60739 60.9011 17.7789 60.9011 29.0971C60.9011 40.4154 51.7705 49.5869 40.5026 49.5869Z"
                fill="white"
              />
              <path
                d="M40.3285 71.1765C37.359 71.1765 34.7007 69.6343 33.2179 67.0533L2.67073 13.9399C1.18397 11.3549 1.18397 8.27067 2.67073 5.68967C4.15345 3.10461 6.81184 1.5625 9.78131 1.5625H71.2151C74.1926 1.5625 76.8551 3.11272 78.3378 5.7059C79.8205 8.29907 79.8084 11.3914 78.3055 13.9765L47.4149 67.0858C45.9241 69.6465 43.2738 71.1765 40.3245 71.1765H40.3285ZM40.3285 70.3973C42.999 70.3973 45.3988 69.0135 46.7482 66.6962L77.6389 13.5788C79.0004 11.2413 79.0085 8.44111 77.6671 6.09142C76.3258 3.74174 73.9139 2.34167 71.2191 2.34167H9.78131C7.09464 2.34167 4.68674 3.73768 3.34139 6.07519C1.99604 8.4127 1.99604 11.2088 3.34139 13.5463L33.8846 66.6597C35.2299 68.9972 37.6378 70.3932 40.3245 70.3932L40.3285 70.3973ZM40.5022 51.9326C27.9699 51.9326 17.7726 41.6897 17.7726 29.1013C17.7726 16.5128 27.9658 6.26593 40.4982 6.26593C53.0306 6.26593 63.2278 16.5088 63.2278 29.0972C63.2278 41.6857 53.0306 51.9285 40.4982 51.9285L40.5022 51.9326ZM40.5022 7.04915C28.3981 7.04915 18.5483 16.943 18.5483 29.1013C18.5483 41.2596 28.3981 51.1534 40.5022 51.1534C52.6064 51.1534 62.4562 41.2636 62.4562 29.1013C62.4562 16.9389 52.6104 7.04915 40.5022 7.04915Z"
                fill="#516E96"
              />
              <path
                d="M22.3618 1.9519H60.359C60.359 1.9519 53.8867 2.61745 48.4488 2.66614H55.3654C55.3654 2.66614 49.9153 3.39662 43.7461 3.42096L51.8748 3.81461C51.8748 3.81461 39.8716 4.69117 29.2098 3.93635L36.9829 3.71721C36.9829 3.71721 30.1067 3.35198 26.5352 3.03544L35.8638 2.96239C35.8638 2.96239 26.8423 2.60527 22.3659 1.95596L22.3618 1.9519Z"
                fill="#516E96"
              />
              <path
                d="M30.7329 49.2785C30.7329 49.2785 34.668 51.7012 40.5019 51.5389C46.3317 51.3766 51.0829 48.8564 51.0829 48.8564C51.0829 48.8564 46.7196 52.9349 40.5019 52.9349C34.2842 52.9349 30.7329 49.2785 30.7329 49.2785Z"
                fill="#516E96"
              />
              <path
                d="M31.9531 50.8694C31.9531 50.8694 35.4155 52.7078 40.5505 52.7605C45.7016 52.8133 49.8629 50.5164 49.8629 50.5164C49.8629 50.5164 46.0248 53.9293 40.5505 53.9293C35.0761 53.9293 31.9531 50.8694 31.9531 50.8694Z"
                fill="#516E96"
              />
              <path
                d="M33.4438 52.2897C33.4438 52.2897 36.3285 53.913 40.611 53.9211C44.9137 53.9292 48.372 51.9854 48.372 51.9854C48.372 51.9854 45.1723 54.9275 40.611 54.9275C36.0497 54.9275 33.4438 52.2897 33.4438 52.2897Z"
                fill="#516E96"
              />
            </g>
            <defs>
              <clipPath id="clip0_1418_393">
                <rect width="81" height="72.7347" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <nav className="nav flex-column mt-2 ms-3 ">
          <NavLink
            to="/app/dashboard"
            className="nav-link text-white py-2 d-flex mb-2"
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "#bea16e", borderRadius: "5px" }
                : {}
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
            >
              <path
                opacity="0.4"
                d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z"
                fill="white"
              />
            </svg>
            Dashboard
          </NavLink>

          <NavLink
            to="/app/myProfile"
            className="nav-link text-white py-2 d-flex mb-2"
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "#bea16e", borderRadius: "5px" }
                : {}
            }
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
            >
              <path
                d="M2.875 2.875V19.1667C2.875 19.4208 2.97597 19.6646 3.15569 19.8443C3.33541 20.024 3.57917 20.125 3.83333 20.125H20.125V18.2083H4.79167V2.875H2.875Z"
                fill="white"
              />
              <path
                d="M14.6559 14.0942C14.7448 14.1833 14.8505 14.254 14.9667 14.3022C15.083 14.3504 15.2076 14.3752 15.3335 14.3752C15.4593 14.3752 15.584 14.3504 15.7002 14.3022C15.8165 14.254 15.9221 14.1833 16.011 14.0942L20.8027 9.30255L19.4476 7.94746L15.3335 12.0616L13.136 9.86413C13.0471 9.77506 12.9415 9.70439 12.8252 9.65618C12.709 9.60796 12.5843 9.58315 12.4585 9.58315C12.3326 9.58315 12.208 9.60796 12.0917 9.65618C11.9755 9.70439 11.8698 9.77506 11.7809 9.86413L6.98926 14.6558L8.34434 16.0109L12.4585 11.8968L14.6559 14.0942Z"
                fill="white"
              />
            </svg>
            My Profile
          </NavLink>

          <NavLink
            to="/app/preferences"
            className="nav-link text-white py-2 d-flex mb-2"
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "#bea16e", borderRadius: "5px" }
                : {}
            }
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2 "
            >
              <path
                d="M2.875 2.875V19.1667C2.875 19.4208 2.97597 19.6646 3.15569 19.8443C3.33541 20.024 3.57917 20.125 3.83333 20.125H20.125V18.2083H4.79167V2.875H2.875Z"
                fill="white"
              />
              <path
                d="M14.6559 14.0942C14.7448 14.1833 14.8505 14.254 14.9667 14.3022C15.083 14.3504 15.2076 14.3752 15.3335 14.3752C15.4593 14.3752 15.584 14.3504 15.7002 14.3022C15.8165 14.254 15.9221 14.1833 16.011 14.0942L20.8027 9.30255L19.4476 7.94746L15.3335 12.0616L13.136 9.86413C13.0471 9.77506 12.9415 9.70439 12.8252 9.65618C12.709 9.60796 12.5843 9.58315 12.4585 9.58315C12.3326 9.58315 12.208 9.60796 12.0917 9.65618C11.9755 9.70439 11.8698 9.77506 11.7809 9.86413L6.98926 14.6558L8.34434 16.0109L12.4585 11.8968L14.6559 14.0942Z"
                fill="white"
              />
            </svg>
            Preferences
          </NavLink>

          <NavLink
            to="/app/friends"
            className="nav-link text-white py-2 d-flex mb-2"
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "#bea16e", borderRadius: "5px" }
                : {}
            }
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2 "
            >
              <path
                d="M2.875 2.875V19.1667C2.875 19.4208 2.97597 19.6646 3.15569 19.8443C3.33541 20.024 3.57917 20.125 3.83333 20.125H20.125V18.2083H4.79167V2.875H2.875Z"
                fill="white"
              />
              <path
                d="M14.6559 14.0942C14.7448 14.1833 14.8505 14.254 14.9667 14.3022C15.083 14.3504 15.2076 14.3752 15.3335 14.3752C15.4593 14.3752 15.584 14.3504 15.7002 14.3022C15.8165 14.254 15.9221 14.1833 16.011 14.0942L20.8027 9.30255L19.4476 7.94746L15.3335 12.0616L13.136 9.86413C13.0471 9.77506 12.9415 9.70439 12.8252 9.65618C12.709 9.60796 12.5843 9.58315 12.4585 9.58315C12.3326 9.58315 12.208 9.60796 12.0917 9.65618C11.9755 9.70439 11.8698 9.77506 11.7809 9.86413L6.98926 14.6558L8.34434 16.0109L12.4585 11.8968L14.6559 14.0942Z"
                fill="white"
              />
            </svg>
            Friends
          </NavLink>

          <NavLink
            to="/app/createWave"
            className="nav-link text-white py-2 d-flex mb-2"
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "#bea16e", borderRadius: "5px" }
                : {}
            }
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
            >
              <path
                d="M2.875 2.875V19.1667C2.875 19.4208 2.97597 19.6646 3.15569 19.8443C3.33541 20.024 3.57917 20.125 3.83333 20.125H20.125V18.2083H4.79167V2.875H2.875Z"
                fill="white"
              />
              <path
                d="M14.6559 14.0942C14.7448 14.1833 14.8505 14.254 14.9667 14.3022C15.083 14.3504 15.2076 14.3752 15.3335 14.3752C15.4593 14.3752 15.584 14.3504 15.7002 14.3022C15.8165 14.254 15.9221 14.1833 16.011 14.0942L20.8027 9.30255L19.4476 7.94746L15.3335 12.0616L13.136 9.86413C13.0471 9.77506 12.9415 9.70439 12.8252 9.65618C12.709 9.60796 12.5843 9.58315 12.4585 9.58315C12.3326 9.58315 12.208 9.60796 12.0917 9.65618C11.9755 9.70439 11.8698 9.77506 11.7809 9.86413L6.98926 14.6558L8.34434 16.0109L12.4585 11.8968L14.6559 14.0942Z"
                fill="white"
              />
            </svg>
            Create Waves
          </NavLink>

          <NavLink
            to="/app/changePassword"
            className="nav-link text-white py-2 d-flex mb-2"
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "#bea16e", borderRadius: "5px" }
                : {}
            }
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
            >
              <path
                d="M2.875 2.875V19.1667C2.875 19.4208 2.97597 19.6646 3.15569 19.8443C3.33541 20.024 3.57917 20.125 3.83333 20.125H20.125V18.2083H4.79167V2.875H2.875Z"
                fill="white"
              />
              <path
                d="M14.6559 14.0942C14.7448 14.1833 14.8505 14.254 14.9667 14.3022C15.083 14.3504 15.2076 14.3752 15.3335 14.3752C15.4593 14.3752 15.584 14.3504 15.7002 14.3022C15.8165 14.254 15.9221 14.1833 16.011 14.0942L20.8027 9.30255L19.4476 7.94746L15.3335 12.0616L13.136 9.86413C13.0471 9.77506 12.9415 9.70439 12.8252 9.65618C12.709 9.60796 12.5843 9.58315 12.4585 9.58315C12.3326 9.58315 12.208 9.60796 12.0917 9.65618C11.9755 9.70439 11.8698 9.77506 11.7809 9.86413L6.98926 14.6558L8.34434 16.0109L12.4585 11.8968L14.6559 14.0942Z"
                fill="white"
              />
            </svg>
            Change Password
          </NavLink>
        </nav>

        <div
          className="mt-auto mb-auto text-center"
          style={{ backgroundColor: "#3e5677" }}
        >
          <button
            className="btn text-light d-flex ms-4 "
            onClick={() => {
              signOut();
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-3"
            >
              <path
                d="M1.00034 18.1761C1.01115 18.5609 1.09919 18.9396 1.25923 19.2898C1.41926 19.6399 1.64803 19.9543 1.93195 20.2143C2.21586 20.4743 2.54913 20.6746 2.91195 20.8033C3.27478 20.9319 3.65977 20.9864 4.04405 20.9634C6.44446 20.9768 8.84487 20.9634 11.2453 20.9634C11.3931 20.9634 11.5349 20.9047 11.6395 20.8001C11.744 20.6956 11.8027 20.5538 11.8027 20.4059C11.8027 20.2581 11.744 20.1163 11.6395 20.0118C11.5349 19.9072 11.3931 19.8485 11.2453 19.8485C8.79247 19.8485 6.33966 19.8842 3.88685 19.8485C2.65264 19.8306 2.11525 18.903 2.11525 17.7993V3.9041C2.10664 3.5532 2.20537 3.20803 2.39823 2.91476C2.59109 2.62148 2.86889 2.39407 3.19449 2.26295C3.57942 2.1579 3.97994 2.12204 4.37741 2.15703H11.2453C11.3931 2.15703 11.5349 2.0983 11.6395 1.99376C11.744 1.88921 11.8027 1.74742 11.8027 1.59958C11.8027 1.45173 11.744 1.30994 11.6395 1.20539C11.5349 1.10085 11.3931 1.04212 11.2453 1.04212C8.76571 1.04212 6.26719 0.947351 3.78985 1.04212C3.41048 1.05171 3.0368 1.13666 2.69057 1.29202C2.34433 1.44738 2.03245 1.67004 1.77307 1.94706C1.51369 2.22408 1.31199 2.54991 1.17971 2.90561C1.04744 3.2613 0.987221 3.63975 1.00257 4.01894L1.00034 18.1761Z"
                fill="white"
                stroke="white"
                stroke-width="0.5"
              />
              <path
                d="M20.8367 10.6114C20.9309 10.7027 20.986 10.827 20.9905 10.9581C20.9905 10.9748 20.9905 10.9893 20.9972 11.0061C21.0039 11.0228 20.9972 11.0362 20.9905 11.0518C20.9861 11.1832 20.9309 11.3079 20.8367 11.3996L16.7461 15.4902C16.6409 15.5918 16.5001 15.648 16.3539 15.6467C16.2078 15.6454 16.068 15.5868 15.9646 15.4834C15.8613 15.3801 15.8026 15.2403 15.8014 15.0941C15.8001 14.9479 15.8563 14.8071 15.9578 14.702L19.0963 11.5624H7.1199C6.97206 11.5624 6.83026 11.5037 6.72572 11.3991C6.62118 11.2946 6.56244 11.1528 6.56244 11.0049C6.56244 10.8571 6.62118 10.7153 6.72572 10.6108C6.83026 10.5062 6.97206 10.4475 7.1199 10.4475H19.0963L15.9578 7.30789C15.8563 7.20275 15.8001 7.06193 15.8014 6.91577C15.8026 6.76961 15.8613 6.62979 15.9646 6.52643C16.068 6.42308 16.2078 6.36445 16.3539 6.36318C16.5001 6.36191 16.6409 6.4181 16.7461 6.51964L20.8367 10.6114Z"
                fill="white"
                stroke="white"
                stroke-width="0.5"
              />
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light  " style={{ height: "88%" }}>
        {/* NavBar */}
        <div className="d-flex justify-content-end align-items-center p-3 bg-white shadow-lg">
          <img
            src={
              data?.user?.profilePhoto
                ? `${Local.BASE_URL}${data?.user?.profilePhoto}`
                : `https://api.dicebear.com/5.x/initials/svg?seed=${data?.user?.firstName} ${data?.user?.lastName}`
            }
            alt="User Profile"
            className="rounded-circle border"
            style={{ width: "40px", height: "40px" }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />
          <div className="mx-2 me-4">
            <p className="mb-0 " style={{ color: "#3e5677" }}>
              {" "}
              {getGreeting()}{" "}
            </p>
            <p className="mb-0 small text-secondary">
              {data?.user?.firstName} {data?.user?.lastName}
            </p>
          </div>

          <ul className="dropdown-menu my-2">
            <li>
              <Link
                className="dropdown-item  "
                style={{ color: "#3e5677" }}
                to="/app/myProfile"
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-secondary "
                to="/app/preferences"
              >
                Preferences
              </Link>
            </li>
            <li>
              <Link className="dropdown-item text-secondary" to="/app/friends">
                Friends
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-secondary"
                to="/app/createWave"
              >
                Create Waves
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-secondary"
                to="/app/changePassword"
              >
                Change Password
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-secondary"
                to="#"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Log Out
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-2 h-100 bg-secondary-subtle rounded ">
          {" "}
          {/* Add padding-top to account for fixed navbar */}
          <div className="overflow-auto h-100 pb-5">
            {" "}
            {/* Add padding-bottom to account for footer */}
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </div>

        <div
          className="position-fixed bottom-0 start-0 end-0 foot bg-secondary-subtle border-top"
          style={{
            width: "83%",
            marginLeft: "250px",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <p className="text-center text-secondary py-0 mb-0 small">
            &copy; 2023 DR. Palig. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Outline;
