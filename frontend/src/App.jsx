import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import EditState from "./pages/EditState";
import EditCity from "./pages/EditCity";
import EditWarehouse from "./pages/EditWarehouse";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/edit-state/:id" element={<EditState />} />
            <Route path="/edit-city/:id" element={<EditCity />} />
            <Route path="/edit-warehouse/:id" element={<EditWarehouse />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
