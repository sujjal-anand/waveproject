import React, { useState } from "react";

// Reusable Modal Function
export const Modal = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <h2 className="text-lg font-bold mb-4">User Data</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]: any) => (
            <div key={key} className="flex">
              <div className="w-20 font-medium text-gray-700">{key}:</div>
              <div>{value}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
