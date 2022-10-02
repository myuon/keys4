import { IndexPage } from "./IndexPage";
import { createBrowserRouter } from "react-router-dom";
import { UserPage } from "./UserPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/users/:userId",
    element: <UserPage />,
  },
]);
