import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import formatDate from "../utils/dateFormat";

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
      console.log(error.response.data);
      setErrMsg(error.response.data.message);
    }
  };

  const handleClick = (id) => {
    navigate("/table/" + id);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {["Name", "File", "Last Modified", "Actions"].map((item) => (
              <TableCell>
                <h1>{item}</h1>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {files.length > 0 ? (
            files.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell onClick={() => handleClick(item.id)}>
                    <h2>{item.id}</h2>
                  </TableCell>
                  <TableCell onClick={() => handleClick(item.id)}>
                    <h2>{item.filename}</h2>
                  </TableCell>
                  <TableCell>
                    <h2>{formatDate(item.updatedAt)}</h2>
                  </TableCell>
                  <TableCell>
                    <DeleteForeverRoundedIcon color="error" fontSize="large" />
                  </TableCell>
                </TableRow>
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
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Home;
