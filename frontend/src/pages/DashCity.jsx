import React, { useEffect, useState } from "react";
import api from "../components/axiosBase";
import { MdDelete } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

const DashCity = () => {
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchCities = async () => {
    try {
      const response = await api.get("/city/getAll");
      if (response.status === 200) {
        setCities(response.data.cities);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCities();
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
      const response = await api.delete(`/city/delete/${deleteId}`);
      if (response.status === 200) {
        cancelDelete();
        fetchCities();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mx-4">
          <div className="">Cities</div>
          <Button className="bg-teal-600 ">
            <Link to="/dashboard?tab=add-city">Add City</Link>
          </Button>
        </div>
        <table className="table table-fixed w-full p-2">
          <thead className="bg-gray-300 rounded-tl-md rounded-tr-md">
            <tr>
              <th>Id</th>
              <th>City Name</th>
              <th>City Code</th>
              <th>State Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cities &&
              cities.map((data, index) => {
                return (
                  <tr key={data._id} className="text-center p-2 text-lg">
                    <td>{index + 1}</td>
                    <td>{data.cityName}</td>
                    <td>{data.cityCode}</td>
                    <td>{data.stateId.stateName || "N/A"}</td>
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
                      <button
                        className="hover:text-green-500"
                        onClick={() => navigate(`/edit-city/${data._id}`)}
                      >
                        <RiEditFill />
                      </button>
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
                  Are you sure you want to delete this city?
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

export default DashCity;
