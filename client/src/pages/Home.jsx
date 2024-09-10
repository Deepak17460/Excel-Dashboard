import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const URI = "http://localhost:8081/api/spreadsheet";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();

    return () => {};
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(URI, { withCredentials: true });
      setFiles(res.data);
    } catch (error) {
      console.log(error.response.data)
      setErrMsg(error.response.data.message);
    }
  };

  const handleClick = (id) => {
    navigate("/table/" + id);
  };

  return (
    <div>
      {files.length > 0 ? (
        files.map((item) => {
          return (
            <div key={item.id} onClick={() => handleClick(item.id)}>
              <h2>{item.id}</h2>
              <h2>{item.filename}</h2>
            </div>
          );
        })
      ) : (
        <div>
          <h2>Nothing to show :(</h2>
          <Link to="/login">
            <Button variant="contained" color="success">
              Login
            </Button>
          </Link>
          <h2>{errMsg}</h2>
        </div>
      )}
    </div>
  );
};

export default Home;
