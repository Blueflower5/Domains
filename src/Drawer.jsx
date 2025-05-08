import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { addObject } from "./objectSlice";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Drawer({ open, setOpen }) {
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
  const [errorMessage, setErrorMessage] = useState("");
  const [userUrl, setUserUrl] = useState("");
  const dispatch = useDispatch();

  // Handle domain input validation
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUserUrl(inputValue);
    setErrorMessage(
      urlRegex.test(inputValue) ? "✅ Valid URL" : "❌ Please enter a valid URL"
    );
  };

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddDomain(); // Trigger the add domain action on Enter key press
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

      {/* Drawer Container */}
      <div className="fixed inset-0 overflow-hidden flex justify-end">
        <div className="w-full max-w-md bg-white shadow-lg p-6 flex flex-col">
          {/* Close Button */}
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium text-gray-700">
              Add Domain
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Input Field */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter domain URL"
              value={userUrl}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <p
              className={
                errorMessage.includes("Invalid")
                  ? "text-red-500 mt-2"
                  : "text-green-500 mt-2"
              }
            >
              {errorMessage}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 border rounded-md bg-gray-700 text-white hover:bg-gray-600"
              onClick={handleAddDomain}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
