import React, { useEffect, useState } from "react";
import api from "../components/axiosBase";
import { MdDelete } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";
import { Link } from "react-router-dom";

const DashState = () => {
  const [states, setStates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchState = async () => {
    try {
      const response = await api.get("/state/getAll");

      if (response.status === 200) {
        setStates(response.data.states);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const clickDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/state/delete/${deleteId}`);

      if (response.status === 200) {
        cancelDelete();
        fetchState();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mx-4">
          <div className="">States</div>
          <Button className="bg-teal-600 ">
            <Link to="/dashboard?tab=add-state">Add State</Link>
          </Button>
        </div>
        <table className="table table-fixed w-full p-2">
          <thead className="bg-gray-300 rounded-tl-md rounded-tr-md">
            <tr>
              <th>Id</th>
              <th>State Name</th>
              <th>State Code</th>
              <th>State Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {states &&
              states.map((data, index) => {
                return (
                  <tr key={data._id} className="text-center p-2 text-lg">
                    <td>{index + 1}</td>
                    <td>{data.stateName}</td>
                    <td>{data.stateCode}</td>
                    <td
                      className={
                        data.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {data.status}
                    </td>
                    <td className="flex gap-3 justify-center">
                      <button
                        className="hover:text-red-600"
                        onClick={() => clickDelete(data._id)}
                      >
                        <MdDelete />
                      </button>
                      <Link to={`/edit-state/${data._id}`}>
                        <button className="hover:text-green-500">
                          <RiEditFill />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50`}
        >
          <Modal
            show={showModal}
            size="md"
            onClose={cancelDelete}
            className="w-[400px] max-w-[95%] mx-auto mt-10"
            popup
          >
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="gray" onClick={cancelDelete}>
                    No, cancel
                  </Button>
                  <Button color="failure" onClick={handleDelete}>
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

export default DashState;
