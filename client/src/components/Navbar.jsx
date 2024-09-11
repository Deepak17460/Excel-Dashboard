import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const URL = "http://localhost:8081/api/logout/";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(URL, null, { withCredentials: true });
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div>
      <Link to="/upload">
        <Button variant="contained" color="secondary">
          Upload
        </Button>
      </Link>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
