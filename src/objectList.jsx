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

  // Handle domain creation (Starts as "Not Verified")

  // Handle updating object status (Pending → Verified based on domain availability)
  const handleUpdate = async (obj) => {
    dispatch(updateObject({ ...obj, status: "Pending" }));

    try {
      // Try fetching the domain directly
      const response = await fetch(obj.domain, {
        method: "GET",
        mode: "no-cors",
      });

      // If the request succeeds, mark domain as active
      dispatch(
        updateObject({ ...obj, status: "Verified", isActive: response.ok })
      );
    } catch (error) {
      dispatch(updateObject({ ...obj, status: "Verified", isActive: false }));
    }
  };

  return (
    <>
      <div className="text-center text-orange-500 font-semibold uppercase text-3xl">
        هدف پلاس
      </div>
      <div className="mt-10 flex items-center justify-between ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 text-xs md:text-base bg-slate-500 text-white"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className=" px-4 py-2 border border-gray-800 text-xs md:text-base bg-gray-600 text-white"
        >
          Sort by Name ({sortOrder === "asc" ? "Descending" : "Ascending"})
        </button>
        <button
          onClick={() => setOpen(true)}
          className=" text-white px-4 py-2 ml-auto bg-cyan-300 text-xs md:text-base"
        >
          ADD DOMAIN
        </button>
      </div>
      <div className=" mt-10">
        <h1 className=" text-center  font-semibold text-3xl uppercase tracking-[5px]">
          Domains List
        </h1>
      </div>

      {/* <input
        type="text"
        placeholder="Enter domain URL"
        value={userUrl}
        onChange={handleInputChange}
      />
      <p style={{ color: errorMessage.includes("Invalid") ? "red" : "green" }}>
        {errorMessage}
      </p>
      <button onClick={handleAddDomain}>Add Object</button> */}
      {/* Filtered & Sorted Domains */}
      <div className="overflow-y-auto max-h-[600px] flex justify-between">
        <table
          className="table-fixed border-collapse border border-gray-300 w-full table-layout: auto 
        text-gray-300"
        >
          <thead className="sticky top-0 z-10 ">
            <tr className="bg-teal-500 ">
              <th className="text-left p-2 text-sm md:text-base w-1/2  ">
                Domain URL
              </th>
              <th className="p-2 text-right text-sm md:text-base w-1/6 ">
                Verification
              </th>
              <th className="p-2 text-right text-sm md:text-base w-1/6 ">
                Activation
              </th>
              <th className="text-right p-2 text-sm md:text-base w-1/6 ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedObjects.length > 0 ? (
              sortedObjects.map((obj) => (
                <tr
                  key={obj.id}
                  className="border border-gray-300 bg-slate-700"
                >
                  <td
                    className={`p-2 text-sm md:text-base break-words ${
                      obj.status === "Verified" && obj.isActive
                        ? "text-green-700 font-bold"
                        : "text-white"
                    }`}
                  >
                    {obj.domain}
                  </td>
                  <td
                    className={`text-center p-2 text-sm md:text-base text-right ${
                      obj.status === "Verified"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {obj.status}
                  </td>
                  <td
                    className={`text-center p-2 text-sm md:text-base text-right ${
                      obj.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {obj.isActive ? "Yes" : "No"}
                  </td>
                  <td className="text-right p-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 text-xs md:text-base"
                      onClick={() => handleUpdate(obj)}
                    >
                      Verify
                    </button>

                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs md:text-base"
                      onClick={() => dispatch(deleteObject(obj.id))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-2 text-red-600 bg-cyan-950"
                >
                  No matching domains found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <div
        style={{
          marginTop: "20px",
          padding: "10px",
          // border: "1px solid gray",
        }}
      >
        <h3></h3>
        {sortedObjects.length > 0 ? (
          <ul>
            {sortedObjects.map((obj) => (
              <li key={obj.id}>
                <strong>Domain:</strong> {obj.domain} | <strong>Status:</strong>{" "}
                {obj.status} |<strong>Active:</strong>{" "}
                {obj.isActive ? "Yes" : "No"}
                <button
                  onClick={() =>
                    dispatch(updateObject({ ...obj, status: "Updated Status" }))
                  }
                >
                  Update
                </button>
                <button onClick={() => dispatch(deleteObject(obj.id))}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching domains found.</p>
        )}
      </div> */}
    </>
  );
};

export default ObjectList;
