import { IndexPage } from "./IndexPage";
import { createBrowserRouter } from "react-router-dom";
import { UserPage } from "./UserPage";
import { LoginPage } from "./LoginPage";

export const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: <IndexPage />,
    },
    {
      path: "/users/:userId",
      element: <UserPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
