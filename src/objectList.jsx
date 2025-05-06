import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchObjects,
  addObject,
  updateObject,
  deleteObject,
} from "./objectSlice";

const ObjectList = () => {
  const dispatch = useDispatch();
  const objects = useSelector((state) => state.objects.data);

  // States
  const [userUrl, setUserUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [errorMessage, setErrorMessage] = useState("");

  // Regex to validate domain format
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

  useEffect(() => {
    dispatch(fetchObjects());
  }, [dispatch]);

  // Handle domain input validation
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUserUrl(inputValue);
    setErrorMessage(
      urlRegex.test(inputValue)
        ? "✅ Valid domain format!"
        : "❌ Invalid domain format!"
    );
  };

  // Handle domain creation (Starts as "Not Verified")
  const handleAddDomain = () => {
    if (userUrl.trim() === "" || !urlRegex.test(userUrl)) {
      alert("Please enter a valid domain URL.");
      return;
    }

    dispatch(
      addObject({
        domain: userUrl,
        status: "Not Verified", // Initial status when created
        isActive: false,
      })
    );
    setUserUrl(""); // Clear input after adding
    setErrorMessage(""); // Reset validation message
  };

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
      <div>Domains</div>
      <div>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort by Name ({sortOrder === "asc" ? "Descending" : "Ascending"})
        </button>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search domains..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Domain Input Validation */}
      <h1>Objects List</h1>
      <input
        type="text"
        placeholder="Enter domain URL"
        value={userUrl}
        onChange={handleInputChange}
      />
      <p style={{ color: errorMessage.includes("Invalid") ? "red" : "green" }}>
        {errorMessage}
      </p>
      <button onClick={handleAddDomain}>Add Object</button>

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
