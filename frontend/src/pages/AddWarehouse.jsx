import { Button, Label, TextInput, Spinner, Select } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import api from "../components/axiosBase";

const AddWarehouse = () => {
  const [formData, setFormData] = useState({
    name: "",
    stateId: "",
    cityId: "",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noCitiesMessage, setNoCitiesMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchStates();
  }, []);

  const handleStateChange = async (e) => {
    const selectedStateId = e.target.value;
    setFormData({ ...formData, stateId: selectedStateId, cityId: "" });
    setNoCitiesMessage("");

    try {
      const response = await api.get(`/city/getStateCities/${selectedStateId}`);

      if (response.status === 200) {
        setCities(response.data.cities);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.stateId || !formData.cityId) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/warehouse/create", formData);
      if (response.status === 201) {
        navigate("/dashboard?tab=warehouses");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Failed to create warehouse.");
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
            onClick={() => navigate("/dashboard?tab=warehouses")}
            className="hover:cursor-pointer"
          />
          <span>Add Warehouse</span>
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
              onChange={handleChange}
              required
              shadow
            />
          </div>

          <div className="flex gap-4 items-center">
            <Label htmlFor="stateId" value="State:" />
            <Select id="stateId" onChange={handleStateChange} required shadow>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.stateName}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex gap-4 items-center">
            <Label htmlFor="cityId" value="City:" />
            <Select
              id="cityId"
              onChange={handleChange}
              required
              shadow
              disabled={!formData.stateId}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.cityName}
                </option>
              ))}
            </Select>
          </div>

          {noCitiesMessage && (
            <div className="text-red-600 text-center mt-3">
              {noCitiesMessage}
            </div>
          )}

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

export default AddWarehouse;
