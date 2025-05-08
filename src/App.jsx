import ObjectList from "./objectList";
import "./index.css";
import { useState } from "react";
import Drawer from "./Drawer";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Drawer open={open} setOpen={setOpen} />
      <ObjectList setOpen={setOpen} />
    </div>
  );
}

export default App;
