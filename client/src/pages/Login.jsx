import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { storeUserDetails } from "../redux/userSlice";

const URL = `${process.env.REACT_APP_SERVER_URL}`;

const Login = ({ login }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: loggedInUser } = useSelector((state) => state.userData);

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }
    return () => {};
  }, []);

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

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await axios.post(URL + "/register", user, {
        withCredentials: true,
      });
      const loggedInUserDetail = await res.data;
      console.log("user register - ", loggedInUserDetail);
      dispatch(storeUserDetails(loggedInUserDetail));

      navigate("/");
      toast.success("Logged in!");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {login ? (
        <form onSubmit={handleClick}>
          <input type="email" name="email" onChange={handleChange} />
          <input type="password" name="password" onChange={handleChange} />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <input type="textF" name="name" onChange={handleChange} />
          <input type="email" name="email" onChange={handleChange} />
          <input type="password" name="password" onChange={handleChange} />
          <button type="submit">Login</button>
        </form>
      )}
    </>
  );
};

export default Login;
