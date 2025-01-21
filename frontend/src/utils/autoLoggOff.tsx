import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AutoLogOff = () => {
  const navigate = useNavigate();
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

  let inactivityTimer: NodeJS.Timeout;

  const resetTimer = () => {
    // Clear the existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // Start a new timer
    inactivityTimer = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    toast("You have been logged out due to inactivity.");
    navigate("/login"); // Redirect to login page
  };

  useEffect(() => {
    // Monitor user activity
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the timer when the component mounts
    resetTimer();

    return () => {
      // Cleanup: Remove event listeners and clear the timer
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(inactivityTimer);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AutoLogOff;
