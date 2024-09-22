import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";

const PrivateRoute = () => {
  const { currUser } = useSelector((state) => state.user);
  return currUser && currUser.role === "admin" ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
