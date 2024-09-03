import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const URI = "http://localhost:8081/api/spreadsheet";

const Home = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  const fetchData = async () => {
    const res = await axios.get(URI, { withCredentials: true });
    setFiles(res.data);
  };

  const handleClick = (id) => {
    navigate("/table/" + id);
  };

  return (
    <div>
      {files.length > 0 &&
        files.map((item) => {
          return (
            <div key={item.id} onClick={() => handleClick(item.id)}>
              <h2>{item.id}</h2>
              <h2>{item.filename}</h2>
            </div>
          );
        })}
    </div>
  );
};

export default Home;
