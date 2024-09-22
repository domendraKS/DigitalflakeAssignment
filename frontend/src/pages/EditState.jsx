import { Button, Label, TextInput, Spinner, Select } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import api from "../components/axiosBase";

const EditState = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    stateName: "",
    stateCode: "",
    status: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await api.get(`/state/getOne/${id}`);
        if (response.status === 200) {
          setFormData(response.data.state);
        }
      } catch (error) {
        setError("Failed to fetch state details.");
      }
    };

    fetchState();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.stateCode || !formData.stateName) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put(`/state/update/${id}`, formData);

      if (response.status === 200) {
        navigate("/dashboard?tab=states");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Failed to update state.");
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex gap-3 items-center mt-5 ml-4 font-semibold text-lg">
          <GoArrowLeft
            onClick={() => navigate("/dashboard?tab=states")}
            className="hover:cursor-pointer"
          />
          <span>Edit State</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex max-w-md flex-col gap-4 mx-auto my-5"
        >
          <div className="flex gap-4 items-center">
            <Label htmlFor="stateName" value="State Name:" />
            <TextInput
              id="stateName"
              type="text"
              placeholder="Enter State Name"
              value={formData.stateName}
              onChange={handleChange}
              required
              shadow
            />
          </div>

          <div className="flex gap-4 items-center">
            <Label htmlFor="stateCode" value="State Code:" />
            <TextInput
              id="stateCode"
              type="text"
              placeholder="Enter State Code"
              value={formData.stateCode}
              onChange={handleChange}
              required
              shadow
            />
          </div>
          <div className="flex gap-4 items-center">
            <Label htmlFor="status" value="Status : " />
            <Select
              id="status"
              type="text"
              placeholder="Enter State Code"
              value={formData.status}
              onChange={handleChange}
              required
              shadow
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>

          {error && (
            <div className="text-red-600 text-center mt-3">{error}</div>
          )}

          <div className="flex justify-end gap-5 mt-5">
            <Button
              className="bg-gray-400"
              onClick={() => navigate("/dashboard?tab=warehouses")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-900">
              {loading ? <Spinner size="sm" className="mr-2" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditState;
