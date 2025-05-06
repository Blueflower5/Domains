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

  // Validate domain input format
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

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

  // Handle domain input validation
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUserUrl(inputValue);

    if (!urlRegex.test(inputValue)) {
      setErrorMessage("❌ Invalid domain format! Please enter a valid URL.");
    } else {
      setErrorMessage("✅ Valid domain format!");
    }
  };

  return (
    <>
      <div>Domains</div>
      <div>
        <button>+ Add Domain</button>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort by Name ({sortOrder === "asc" ? "Descending" : "Ascending"})
        </button>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ul id="domainList">Rows will be added dynamically here</ul>

      {/* Domain Input Validation */}
      <div>
        <h1>Objects List</h1>

        <input
          type="text"
          placeholder="Enter domain URL"
          value={userUrl}
          onChange={handleInputChange}
        />
        <p
          style={{ color: errorMessage.includes("Invalid") ? "red" : "green" }}
        >
          {errorMessage}
        </p>

        <button
          onClick={() => {
            if (userUrl.trim() !== "" && urlRegex.test(userUrl)) {
              dispatch(
                addObject({
                  domain: userUrl,
                  status: "Pending",
                  isActive: false,
                })
              );
              setUserUrl(""); // Clear input after adding
              setErrorMessage(""); // Reset validation message
            } else {
              alert("Please enter a valid domain URL.");
            }
          }}
        >
          Add Object
        </button>

        {/* Filtered & Sorted Domains */}
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid gray",
          }}
        >
          <h3>Filtered & Sorted Domains:</h3>
          {sortedObjects.length > 0 ? (
            <ul>
              {sortedObjects.map((obj) => (
                <li key={obj.id}>
                  <strong>Domain:</strong> {obj.domain} |{" "}
                  <strong>Status:</strong> {obj.status} |
                  <strong>Active:</strong> {obj.isActive ? "Yes" : "No"}
                  <button
                    onClick={() =>
                      dispatch(
                        updateObject({ ...obj, status: "Updated Status" })
                      )
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
        </div>
      </div>

      {/* Add Domain Section */}
      <div>Add Domain</div>
      <input type="text" />
      <div>
        <button>Cancel</button>
        <button>Add</button>
      </div>
    </>
  );
};

export default ObjectList;
