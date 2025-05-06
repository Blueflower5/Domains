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
  // const status = useSelector((state) => state.objects.status);

  // State to store user-entered URL
  const [userUrl, setUserUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const filteredObjects = objects.filter((domain) =>
    domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedObjects = [...filteredObjects].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.domain.localeCompare(b.domain); // Ascending order
    } else {
      return b.domain.localeCompare(a.domain); // Descending order
    }
  });

  useEffect(() => {
    {
      dispatch(fetchObjects());
    }
  }, [dispatch]);

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
      <div>
        <h1>Objects List</h1>

        {/* Input field for user to enter a URL */}
        <input
          type="text"
          placeholder="Enter domain URL"
          value={userUrl}
          onChange={(e) => setUserUrl(e.target.value)}
        />

        {/* Button to send the inputted URL to API */}
        <button
          onClick={() => {
            if (userUrl.trim() !== "") {
              dispatch(
                addObject({
                  domain: userUrl,
                  status: "Pending",
                  isActive: false, // Use the user-entered URL
                })
              );
              setUserUrl(""); // Clear input after adding
            } else {
              alert("Please enter a valid domain URL.");
            }
          }}
        >
          Add Object
        </button>

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
                  <strong>Status:</strong> {obj.status} |{" "}
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
      <div>Add Domain</div>
      <input type="text"></input>
      <div>
        <button>cancel</button>
        <button>Add</button>
      </div>
    </>
  );
};

export default ObjectList;
