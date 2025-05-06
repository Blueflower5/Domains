import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://6797aa2bc2c861de0c6d964c.mockapi.io/domain"; // Mock API

// Redux Slice
const objectSlice = createSlice({
  name: "objects",
  initialState: {
    data: [],
    status: "Pending",
    isActive: "Not Active",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchObjects.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(addObject.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateObject.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (obj) => obj.id === action.payload.id
        );
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteObject.fulfilled, (state, action) => {
        state.data = state.data.filter((obj) => obj.id !== action.payload);
      });
  },
});

// Fetch all objects
export const fetchObjects = createAsyncThunk("objects/fetch", async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  console.log("API Response:", data); // Debugging
  return data;
});

// Add a new object
export const addObject = createAsyncThunk("objects/add", async (newObject) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      createdDate: new Date().getTime(), // Generate timestamp
      domain: newObject.domain,
      status: newObject.status,
      isActive: newObject.isActive,
    }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
});

// Update an object
export const updateObject = createAsyncThunk(
  "objects/update",
  async (object) => {
    const response = await fetch(`${API_URL}/${object.id}`, {
      method: "PUT",
      body: JSON.stringify({
        createdDate: object.createdDate,
        domain: object.domain,
        status: object.status,
        isActive: object.isActive,
      }),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  }
);

// Delete an object
export const deleteObject = createAsyncThunk("objects/delete", async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return id;
});

export default objectSlice.reducer;
