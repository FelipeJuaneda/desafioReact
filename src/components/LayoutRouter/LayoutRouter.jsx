import React from "react";
import { Outlet } from "react-router-dom";
import Home from "../Home/Home";

const LayoutRouter = () => {
  return (
    <div>
      <Home />
      <Outlet />
    </div>
  );
};

export default LayoutRouter;
