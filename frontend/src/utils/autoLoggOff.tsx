import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AutoLogOff: React.FC = () => {
  const navigate = useNavigate();
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    // Clear the existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start a new timer
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    toast("You have been logged out due to inactivity.");
    navigate("/login"); // Redirect to login page
  };

  useEffect(() => {
    // Define user activity events
    const events = ["mousemove", "keydown", "click"];

    // Add event listeners to reset the timer
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initialize the timer on component mount
    resetTimer();

    return () => {
      // Cleanup: Remove event listeners and clear the timer
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AutoLogOff;
