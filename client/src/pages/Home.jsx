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

  const deleteRow = async (id) => {
    try {
      const res = await axios.delete(URI + "/" + id, { withCredentials: true });
      console.log(res.data);
      const newData = files.filter((item) => item.id !== id);
      setFiles(newData);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {["S. No. ", "File", "Last Modified", "Actions"].map((item, i) => (
              <TableCell key={i}>
                <h1>{item}</h1>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {files.length > 0 ? (
            files.map((item, i) => {
              return (
                <TableRow key={item.id}>
                  <TableCell onClick={() => handleClick(item.id)}>
                    <h2>{i+1}</h2>
                  </TableCell>
                  <TableCell onClick={() => handleClick(item.id)}>
                    <h2>{item.filename}</h2>
                  </TableCell>
                  <TableCell>
                    <h2>{formatDate(item.updatedAt)}</h2>
                  </TableCell>
                  <TableCell>
                    <DeleteForeverRoundedIcon
                      onClick={() => deleteRow(item.id)}
                      color="error"
                      fontSize="large"
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell>
                <h2>Nothing to show :(</h2>
                <Link to="/login">
                  <Button variant="contained" color="success">
                    Login
                  </Button>
                </Link>
                <h2>{errMsg}</h2>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Home;
