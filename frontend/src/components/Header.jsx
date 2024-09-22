import { Button, Modal, Navbar } from "flowbite-react";
import React, { useState } from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../redux/userSlice";
import api from "./axiosBase";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const { currUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      const response = await api.get("/user/signout");
      if (response.status === 200) {
        dispatch(signOut());
        setShowModal(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar className="border-b-2 bg-customPurple p-2">
        <Link to="/">
          <img src="/images/Logo.png" alt="Logo" />
        </Link>
        <div className="flex gap-2">
          {currUser ? (
            <Button onClick={() => setShowModal(true)} className="border-none">
              <HiOutlineUserCircle size={40} />
            </Button>
          ) : (
            <Link to="/">
              <Button gradientDuoTone="purpleToBlue">Sign In</Button>
            </Link>
          )}
        </div>
      </Navbar>

      {showModal && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50`}
        >
          <Modal
            show={showModal}
            size="md"
            onClose={() => setShowModal(false)}
            className="w-[400px] max-w-[95%] mx-auto mt-10"
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <div className="flex justify-center gap-2">
                  <FaExclamationTriangle className="mb-4 h-8 w-8 text-red-600" />
                  <span className="font-bold">Log out</span>
                </div>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to log out?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                  <Button color="failure" onClick={handleSignout}>
                    Yes, I'm sure
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

export default Header;
