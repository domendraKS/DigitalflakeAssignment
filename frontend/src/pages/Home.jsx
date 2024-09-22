import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { IoHomeOutline } from "react-icons/io5";
import { GiTreasureMap } from "react-icons/gi";
import { RiHotelFill } from "react-icons/ri";
import { MdWarehouse } from "react-icons/md";
import DashState from "../pages/DashState";
import DashCity from "./DashCity";
import DashWarehouse from "./DashWarehouse";
import { Link } from "react-router-dom";
import AddState from "./AddState";
import EditState from "./EditState";
import AddCity from "./AddCity";
import AddWarehouse from "./AddWarehouse";

const Home = () => {
  const { currUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const navigate = useNavigate();

  if (!currUser) {
    navigate("/");
  }

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-56">
          <Sidebar
            className="md:w-56 h-screen"
            style={{ width: "220px" }}
            aria-label="Default sidebar example"
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item icon={IoHomeOutline} as={"div"}>
                  <Link to="/dashboard?tab=home">Home</Link>
                </Sidebar.Item>
                <Sidebar.Item icon={GiTreasureMap} as={"div"}>
                  <Link to="/dashboard?tab=states">State</Link>
                </Sidebar.Item>
                <Sidebar.Item icon={RiHotelFill} as={"div"}>
                  <Link to="/dashboard?tab=cities">City</Link>
                </Sidebar.Item>
                <Sidebar.Item icon={MdWarehouse} as={"div"}>
                  <Link to="/dashboard?tab=warehouses">Warehouse</Link>
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
        {tab === "home" && (
          <div className="w-full shadow-md p-4 flex flex-col justify-center items-center mx-auto">
            <img src="/images/login-head.png" alt="Welcome" />
            <p>Welcome to Digitalflake admin</p>
          </div>
        )}
        {tab === "states" && <DashState />}
        {tab === "cities" && <DashCity />}
        {tab === "warehouses" && <DashWarehouse />}
        {tab === "add-state" && <AddState />}
        {tab === "add-city" && <AddCity />}
        {tab === "add-warehouse" && <AddWarehouse />}
      </div>
    </>
  );
};

export default Home;
