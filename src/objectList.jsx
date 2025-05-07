import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchObjects, updateObject, deleteObject } from "./objectSlice";

const ObjectList = ({ setOpen }) => {
  const dispatch = useDispatch();
  const objects = useSelector((state) => state.objects.data);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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
      <div className="text-center text-yellow-500 font-semibold uppercase text-2xl">
        Domains
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-gray-300 px-4 py-2"
        >
          Sort by Name ({sortOrder === "asc" ? "Descending" : "Ascending"})
        </button>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search domains..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-300 px-4 py-2"
        />
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 ml-auto"
        >
          ADD DOMAIN
        </button>
      </div>

      {/* Domain Input Validation */}
      <h1 className="text-center text-blue-100 font-semibold text-xl bg-yellow-100 uppercase tracking-[5px]">
        Objects List
      </h1>

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
      <div
        style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}
      >
        <h3>Filtered & Sorted Domains:</h3>
        {objects.length > 0 ? (
          <ul>
            {objects.map((obj) => (
              <li key={obj.id}>
                <strong>Domain:</strong> {obj.domain} | <strong>Status:</strong>{" "}
                {obj.status} |<strong>Active:</strong>{" "}
                {obj.isActive ? "Yes" : "No"}
                <button onClick={() => handleUpdate(obj)}>Update</button>
                <button onClick={() => dispatch(deleteObject(obj.id))}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching domains found.</p>
        )}
      </div>
    </>
  );
};

export default ObjectList;
