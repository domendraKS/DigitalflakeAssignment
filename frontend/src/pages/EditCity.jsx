import { Button, Label, TextInput, Spinner, Select } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import api from "../components/axiosBase";

const EditCity = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    cityName: "",
    cityCode: "",
    stateId: "",
    status: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await api.get(`/city/getOne/${id}`);
        if (response.status === 200) {
          setFormData(response.data.city);
        }
      } catch (error) {
        setError("Failed to fetch city details.");
      }
    };

    const fetchStates = async () => {
      try {
        const response = await api.get("/state/getAll");
        if (response.status === 200) {
          setStates(response.data.states);
        }
      } catch (error) {
        setError("Failed to fetch states.");
      }
    };

    fetchCity();
    fetchStates();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.cityCode || !formData.cityName || !formData.stateId) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put(`/city/update/${id}`, formData);
      if (response.status === 200) {
        navigate("/dashboard?tab=cities");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Failed to update city.");
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
            onClick={() => navigate("/dashboard?tab=cities")}
            className="hover:cursor-pointer"
          />
          <span>Edit City</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex max-w-md flex-col gap-4 mx-auto my-5"
        >
          <div className="flex gap-4 items-center">
            <Label htmlFor="cityName" value="City Name:" />
            <TextInput
              id="cityName"
              type="text"
              placeholder="Enter City Name"
              value={formData.cityName}
              onChange={handleChange}
              required
              shadow
            />
          </div>

          <div className="flex gap-4 items-center">
            <Label htmlFor="cityCode" value="City Code:" />
            <TextInput
              id="cityCode"
              type="text"
              placeholder="Enter City Code"
              value={formData.cityCode}
              onChange={handleChange}
              required
              shadow
            />
          </div>
          <div className="flex gap-4 items-center">
            <Label htmlFor="stateId" value="State:" />
            <Select
              id="stateId"
              value={formData.stateId._id}
              onChange={handleChange}
              required
              shadow
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.stateName}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex gap-4 items-center">
            <Label htmlFor="status" value="Status:" />
            <Select
              id="status"
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
              color="gray"
              onClick={() => navigate("/dashboard?tab=cities")}
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

export default EditCity;
