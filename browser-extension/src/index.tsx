import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <div
      style={{
        height: 500,
        width: 500,
        border: "1px solid black",
        background: "azure",
      }}
    >
      <App />
    </div>
  </React.StrictMode>
);
