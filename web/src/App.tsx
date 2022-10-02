import "./App.css";
import React from "react";

export const App = ({ children }: React.PropsWithChildren) => {
  return <main>{children}</main>;
};
