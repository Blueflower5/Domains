import ObjectList from "./objectList";
import "./index.css";
import { useState } from "react";
import Drawer from "./Drawer";
import { addObject } from "./objectSlice";
import { useDispatch } from "react-redux";

function App() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userUrl, setUserUrl] = useState("");
  const dispatch = useDispatch();

  // Regex to validate domain format
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
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

  return (
    <div>
      <Drawer
        open={open}
        setOpen={setOpen}
        errorMessage={errorMessage}
        // setErrorMessage={setErrorMessage}
        handleInputChange={handleInputChange}
        handleAddDomain={handleAddDomain}
        userUrl={userUrl}
      />
      <ObjectList setOpen={setOpen} handleAddDomain={handleAddDomain} />;
    </div>
  );
}

export default App;
