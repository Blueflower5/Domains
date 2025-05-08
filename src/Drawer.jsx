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
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold text-gray-900">
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
                    tabIndex="0"
                    className="bg-amber-400 h-20 w-100"
                  />
                  <p
                    style={{
                      color: errorMessage.includes("Invalid") ? "red" : "green",
                    }}
                  >
                    {errorMessage}
                  </p>
                  <button
                    className="bg-lime-300 h-10 w-100"
                    onClick={handleAddDomain}
                  >
                    Click To Add Domain URL
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
