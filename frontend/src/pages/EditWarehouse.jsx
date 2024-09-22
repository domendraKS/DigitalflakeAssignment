import { Button, Label, TextInput, Spinner, Select } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import api from "../components/axiosBase";

const EditWarehouse = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    stateId: "",
    cityId: "",
    status: "Active", // Set a default status
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [noCitiesMessage, setNoCitiesMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await api.get(`/warehouse/getOne/${id}`);
        if (response.status === 200) {
          setFormData({
            ...response.data.warehouse,
            stateId: response.data.warehouse.stateId._id, // Ensure stateId is a string
          });
          fetchStates();
          fetchCities(response.data.warehouse.stateId._id); // Fetch cities based on stateId
        }
      } catch (error) {
        setError("Failed to fetch warehouse details.");
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

    fetchWarehouse();
  }, [id]);

  const fetchCities = async (stateId) => {
    try {
      const response = await api.get(`/city/getStateCities/${stateId}`);
      if (response.status === 200) {
        setCities(response.data.cities || []);
        setNoCitiesMessage(
          response.data.cities.length === 0
            ? "No cities available for the selected state."
            : ""
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNoCitiesMessage("No cities available for the selected state.");
        setCities([]);
      } else {
        setError("Failed to fetch cities.");
      }
    }
  };

  const handleStateChange = (e) => {
    const selectedStateId = e.target.value;
    setFormData({ ...formData, stateId: selectedStateId, cityId: "" });
    setNoCitiesMessage("");
    fetchCities(selectedStateId);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/warehouse/update/${id}`, formData);
      if (response.status === 200) {
        navigate("/dashboard?tab=warehouses");
      }
    } catch (error) {
      setError("Failed to update warehouse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 items-center mt-5 ml-4 font-semibold text-lg">
        <GoArrowLeft
          onClick={() => navigate("/dashboard?tab=warehouses")}
          className="hover:cursor-pointer"
        />
        <span>Edit Warehouse</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-md flex-col gap-4 mx-auto my-5"
      >
        <div className="flex gap-4 items-center">
          <Label htmlFor="name" value="Warehouse Name:" />
          <TextInput
            id="name"
            type="text"
            placeholder="Enter Warehouse Name"
            value={formData.name}
            onChange={handleChange}
            required
            shadow
          />
        </div>

        <div className="flex gap-4 items-center">
          <Label htmlFor="stateId" value="Select State:" />
          <Select
            id="stateId"
            value={formData.stateId}
            onChange={handleStateChange}
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
          <Label htmlFor="cityId" value="Select City:" />
          <Select
            id="cityId"
            value={formData.cityId._id}
            onChange={handleChange}
            required
            shadow
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.cityName}
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

        {noCitiesMessage && (
          <div className="text-red-600 text-center mt-3">{noCitiesMessage}</div>
        )}

        {error && <div className="text-red-600 text-center mt-3">{error}</div>}

        <div className="flex justify-end gap-5 mt-5">
          <Button
            color="gray"
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
  );
};

export default EditWarehouse;
