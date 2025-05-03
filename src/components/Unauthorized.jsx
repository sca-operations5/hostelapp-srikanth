import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-8">You do not have permission to access this page.</p>
      <Link 
        to="/login" 
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default Unauthorized; 