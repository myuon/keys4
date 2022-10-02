import { IndexPage } from "./IndexPage";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/users/:userId",
    element: <div>user</div>,
  },
]);
