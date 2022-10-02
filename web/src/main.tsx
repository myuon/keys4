import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./pages/routes";
import { App } from "./App";

const config = {
  revalidateOnFocus: false,
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig value={config}>
      <App>
        <RouterProvider router={routes}></RouterProvider>
      </App>
    </SWRConfig>
  </React.StrictMode>
);
