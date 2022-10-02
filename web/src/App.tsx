import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./pages/routes";

export const App = () => {
  return <RouterProvider router={routes} />;
};
