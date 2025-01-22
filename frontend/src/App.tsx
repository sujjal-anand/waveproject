import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import react from "react";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
// import Apps from './components/App';
import Sidebar2 from "./components/Outline";
import Dashboard from "./components/Dashboard";
import Myprofile from "./components/Myprofile";
import Friends from "./components/Friends";
import Createwave from "./components/Createwave";
import Invitefriends from "./components/Invitefriends";
import Changepassword from "./components/Changepassword";
import Preferences from "./components/Preferences";
import AutoLogOff from "./utils/autoLoggOff";
import Adminsignup from "./Admin/Adminsignup";
import Adminlogin from "./Admin/Adminlogin";
import Admindashboard from "./Admin/Admindashboard";
import ManageUsers from "./Admin/Manageusers";
import ManageWaves from "./Admin/Managewaves";
import Edituser from "./Admin/Edituser";

const App: react.FC = () => {
  return (
    <>
      <BrowserRouter>
        <AutoLogOff />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Sidebar2 />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="myProfile" element={<Myprofile />} />
            <Route path="friends" element={<Friends />} />
            <Route path="inviteFriends" element={<Invitefriends />} />
            <Route path="createWave" element={<Createwave />} />
            <Route path="changePassword" element={<Changepassword />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="myProfile" element={<Myprofile />} />
          </Route>
          {/* ADMIN ROUTES */}
          <Route path="/adminLogin" element={<Adminlogin />} />
          <Route path="/adminSignup" element={<Adminsignup />} />
          <Route path="/adminDashboard" element={<Admindashboard />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/manageWaves" element={<ManageWaves />} />
          <Route path="/editUser/:id" element={<Edituser />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
