import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Spinner, Select } from "flowbite-react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import api from "../components/axiosBase";

const AddCity = () => {
  const [formData, setFormData] = useState({
    cityName: "",
    cityCode: "",
    stateId: "",
  });
  const [states, setStates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("/state/getAll");
        setStates(response.data.states);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.cityName || !formData.cityCode || !formData.stateId) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/city/create", formData); // Adjust API endpoint as needed
      if (response.status === 201) {
        navigate("/dashboard?tab=cities");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Failed to create city.");
      } else {
        setError("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 items-center mt-5 ml-4 font-semibold text-lg">
        <GoArrowLeft
          onClick={() => navigate("/dashboard?tab=cities")}
          className="hover:cursor-pointer"
        />
        <span>Add City</span>
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
            onChange={handleChange}
            required
            shadow
          />
        </div>

        <div className="flex gap-4 items-center">
          <Label htmlFor="stateId" value="Select State:" />
          <Select id="stateId" onChange={handleChange} required>
            <option value="">Choose a state</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.stateName}
              </option>
            ))}
          </Select>
        </div>

        {error && <div className="text-red-600 text-center">{error}</div>}

        <div className="flex justify-end gap-5 mt-5">
          <Button onClick={() => navigate("/dashboard?tab=cities")}>
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

export default AddCity;
