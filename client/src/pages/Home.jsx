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
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import formatDate from "../utils/dateFormat";
import toast from "react-hot-toast";
import SearchBar from "../components/Search/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../hooks/useDebounce";
import { updateSearchKey } from "../redux/searchSlice";

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet`;
const QUERY_URL = `${process.env.REACT_APP_SERVER_URL}/util`;

const Home = () => {
  const [files, setFiles] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const [editedFilename, setEditedFilename] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { key: searchKey } = useSelector((state) => state.searchData);
  const { user } = useSelector((state) => state.userData);
  const [reload, setReload] = useState(false);

  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) debouncedFetchData(searchKey);
    return () => {};
  }, [searchKey, reload]);

  useEffect(() => {
    if (!user) setFiles([]);
    return () => {};
  }, [user]);

  const debouncedFetchData = useCallback(
    useDebounce(fetchSuggestions, 300),
    []
  );

  const handleClick = (id) => {
    navigate("/view/" + id);
  };

  const deleteRow = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!isConfirmed) return;
    try {
      const res = await axios.delete(URL + "/" + id, { withCredentials: true });
      const newData = files.filter((item) => item.id !== id);
      setFiles(newData);
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (id, filename) => {
    setEditingId(id);
    setEditedFilename(filename);
  };

  const handleSave = async () => {
    try {
      const payload = editedFilename.split(".");

      const res = await axios.put(
        `${URL}/${editingId}/update-name`,
        { filename: payload[0], filetype: payload[1] },
        { withCredentials: true }
      );

      dispatch(updateSearchKey(searchKey));

      setReload((prev) => !prev);

      setEditingId(null);
      setEditedFilename("");
      toast.success("Filename edited successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  async function fetchSuggestions(query) {
    try {
      const res = await axios.get(QUERY_URL + "/search?key=" + query, {
        withCredentials: true,
      });
      setFiles(res.data);
    } catch (error) {
      setErrMsg(error.response.data.message);
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          background: "linear-gradient(135deg, #e3f2fd, #fce4ec)",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          padding: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#757575",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Nothing to show :(
        </h3>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="success"
            sx={{
              background: "linear-gradient(135deg, #66bb6a, #43a047)",
              color: "white",
              fontSize: "1rem",
              padding: "10px 20px",
              borderRadius: "25px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                background: "linear-gradient(135deg, #43a047, #2e7d32)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Login
          </Button>
        </Link>
        <h3
          style={{
            fontSize: "1rem",
            color: "#b71c1c",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          {errMsg}
        </h3>
      </div>
    );
  }

  return (
    <>
      <SearchBar fetchSuggestions={fetchSuggestions} />
      {files.length > 0 ? (
        <>
          <Paper
            sx={{
              backgroundColor: "#f4f6f8",
              padding: 0,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small" aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {["File", "Last Modified", "Actions"].map((item, i) => (
                      <TableCell key={i}>
                        <h2 className="text-2xl font-bold">{item}</h2>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, i) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={item.id}
                      >
                        <TableCell>
                          {editingId === item.id ? (
                            <div className="flex">
                              <input
                                className="px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={editedFilename}
                                onChange={(e) =>
                                  setEditedFilename(e.target.value)
                                }
                              />
                              <CheckIcon
                                onClick={handleSave}
                                fontSize="large"
                                color="success"
                                className="cursor-pointer"
                              />
                              <ClearIcon
                                onClick={() => setEditingId(null)}
                                fontSize="large"
                                color="error"
                                className="cursor-pointer"
                              />
                            </div>
                          ) : (
                            <h3
                              className="text-lg cursor-pointer"
                              onClick={() => handleClick(item.id)}
                            >
                              {item.filename}
                            </h3>
                          )}
                        </TableCell>
                        <TableCell>
                          <h3 className="text-lg">
                            {formatDate(item.updatedAt)}
                          </h3>
                        </TableCell>
                        <TableCell>
                          <DeleteForeverRoundedIcon
                            onClick={() => deleteRow(item.id)}
                            color="error"
                            fontSize="large"
                            className="cursor-pointer"
                          />
                          {editingId === item.id ? (
                            <ClearIcon
                              onClick={() => setEditingId(null)}
                              fontSize="large"
                              color="error"
                              className="cursor-pointer"
                            />
                          ) : (
                            <EditOutlinedIcon
                              onClick={() =>
                                handleEdit(item.id, item.filename)
                              }
                              color="primary"
                              fontSize="large"
                              className="cursor-pointer"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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
        </>
      ) : (
        <h3>Loading ...</h3>
      )}
    </>
  );
};

export default Home;
