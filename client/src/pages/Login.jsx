import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { storeUserDetails } from "../redux/userSlice";

const URL = `${process.env.REACT_APP_SERVER_URL}`;

const Login = () => {
  const [user, setUser] = useState({
    name: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(URL + "/login", user, {
        withCredentials: true,
      });
      const loggedInUserDetail = await res.data;
      dispatch(storeUserDetails(loggedInUserDetail));

      navigate("/");
      toast.success("Logged in!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleClick}>
      <input type="email" name="email" onChange={handleChange} />
      <input type="password" name="password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
