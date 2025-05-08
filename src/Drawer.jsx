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
      urlRegex.test(inputValue)
        ? "✅ آدرس صحیح وارد شده است"
        : "❌ لطفا آدرس را به صورت صحیح وارد کنید"
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
      <DialogBackdrop className="fixed inset-0 bg-gray-400/75" />

      {/* Drawer Container */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* Drawer Panel */}
            <DialogPanel className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out bg-gray-800 text-white shadow-xl">
              {/* Close Button */}
              <TransitionChild>
                <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white"
                  >
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>

              {/* Drawer Content */}
              <div className="flex h-full flex-col overflow-y-scroll py-6">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-3xl font-semibold text-cyan-300 h-10 text-center">
                    Add Domain
                  </DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <input
                    type="text"
                    placeholder="Enter domain URL"
                    value={userUrl}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="bg-teal-400 h-10 w-full text-lg px-2"
                  />
                  <p
                    className={
                      errorMessage.includes("Invalid")
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {errorMessage}
                  </p>
                </div>

                {/* Buttons at the Bottom */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 py-4 bg-gray-700">
                  {/* Cancel Button (Left) */}
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded text-lg"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>

                  {/* Add Button (Right) */}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded text-lg"
                    onClick={handleAddDomain}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
