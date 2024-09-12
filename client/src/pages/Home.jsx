import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import formatDate from "../utils/dateFormat";

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet`;

const Home = () => {
  const [files, setFiles] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();

    return () => {};
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(URL, { withCredentials: true });
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
      const res = await axios.delete(URL + "/" + id, { withCredentials: true });
      console.log(res.data);
      const newData = files.filter((item) => item.id !== id);
      setFiles(newData);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 415 }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {["S. No. ", "File", "Last Modified", "Actions"].map(
                (item, i) => (
                  <TableCell
                    key={i}
                    // align={column.align}
                    // style={{ minWidth: column.minWidth }}
                  >
                    <h2>{item}</h2>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {files.length > 0 ? (
              files
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                      <TableCell onClick={() => handleClick(item.id)}>
                        <h3>{item.id}</h3>
                      </TableCell>
                      <TableCell onClick={() => handleClick(item.id)}>
                        <h3>{item.filename}</h3>
                      </TableCell>
                      <TableCell>
                        <h3>{formatDate(item.updatedAt)}</h3>
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
                  <h3>Nothing to show :(</h3>
                  <Link to="/login">
                    <Button variant="contained" color="success">
                      Login
                    </Button>
                  </Link>
                  <h3>{errMsg}</h3>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={files.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Home;
