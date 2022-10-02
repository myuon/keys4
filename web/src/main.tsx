import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
      }}
    ></SWRConfig>
    <App />
  </React.StrictMode>
);
