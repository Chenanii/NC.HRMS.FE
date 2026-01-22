import React from "react";
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-900">Access denied</h2>
        <p className="text-sm text-gray-600 mt-2">
          You don&apos;t have permission to view this page.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Back to dashboard
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

