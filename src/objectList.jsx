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
  const status = useSelector((state) => state.objects.status);

  // State to store user-entered URL
  const [userUrl, setUserUrl] = useState("");

  useEffect(() => {
    {
      dispatch(fetchObjects());
    }
  }, [status, dispatch]);

  return (
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

      <ul>
        {objects.map((obj) => (
          <li key={obj.id}>
            <strong>Domain:</strong> {obj.domain} | <strong>Status:</strong>{" "}
            {obj.status} |<strong>Active:</strong> {obj.isActive ? "Yes" : "No"}
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
    </div>
  );
};

export default ObjectList;
