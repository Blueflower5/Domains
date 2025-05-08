import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchObjects, updateObject, deleteObject } from "./objectSlice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const ObjectList = ({ setOpen }) => {
  const dispatch = useDispatch();
  const objects = useSelector((state) => state.objects.data);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter objects based on searchQuery
  const filteredObjects = objects.filter((domain) =>
    domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort objects based on sortOrder
  const sortedObjects = [...filteredObjects].sort((a, b) =>
    sortOrder === "asc"
      ? a.domain.localeCompare(b.domain)
      : b.domain.localeCompare(a.domain)
  );

  useEffect(() => {
    dispatch(fetchObjects());
  }, [dispatch]);

  // Handle updating object status
  const handleUpdate = async (obj) => {
    dispatch(updateObject({ ...obj, status: "Pending" }));

    try {
      const response = await fetch(obj.domain, {
        method: "GET",
        mode: "no-cors",
      });

      dispatch(
        updateObject({ ...obj, status: "Verified", isActive: response.ok })
      );
    } catch (error) {
      dispatch(updateObject({ ...obj, status: "Verified", isActive: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      {/* Title */}
      <h1 className="text-center text-gray-700 font-medium text-2xl">
        Domain Manager
      </h1>

      {/* Search & Actions */}
      <div className="mt-6 flex items-center justify-between gap-4 w-full max-w-4xl">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
        >
          Sort ({sortOrder === "asc" ? "Descending" : "Ascending"})
        </button>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 border rounded-md bg-gray-700 text-white hover:bg-gray-600"
        >
          Add Domain
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto w-full max-w-4xl">
        <table className="w-full border-collapse border border-gray-300 text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 text-sm w-1/2">Domain URL</th>
              <th className="p-2 text-sm w-1/6 text-center">Verification</th>
              <th className="p-2 text-sm w-1/6 text-center">Activation</th>
              <th className="p-2 text-sm w-1/6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedObjects.length > 0 ? (
              sortedObjects.map((obj) => (
                <tr key={obj.id} className="border-t border-gray-300">
                  <td
                    className={`p-2 text-sm break-words ${
                      obj.status === "Verified" && obj.isActive
                        ? "text-green-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {obj.domain}
                  </td>
                  <td
                    className={`p-2 text-sm text-center ${
                      obj.status === "Verified"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {obj.status}
                  </td>
                  <td
                    className={`p-2 text-sm text-center ${
                      obj.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {obj.isActive ? "Yes" : "No"}
                  </td>
                  <td className="p-2 text-sm text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100"
                        onClick={() => handleUpdate(obj)}
                      >
                        Verify
                      </button>
                      <button
                        className="px-3 py-1 border rounded-md text-red-500 hover:bg-red-100"
                        onClick={() => dispatch(deleteObject(obj.id))}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-2 text-gray-500">
                  No matching domains found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ObjectList;
