import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useRef } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

const getUID = () => {
  return "###" + Date.now().toString();
};

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet/`;

const Test = (props) => {
  const { id } = useParams();
  const initCols = Object.keys(props.rows[0]).filter((k) => k !== "id");
  const initData = props.rows.reduce((acc, item) => {
    const { id, ...newItem } = item;
    return [...acc, newItem];
  }, []);

  const [cols, setCols] = useState(initCols);
  const [data, setData] = useState(initData);

  const [isEditMode, setIsEditMode] = useState(props.isEditMode);
  let shouldSubmit = true;

  const addRow = () => {
    const newRec = cols.reduce((acc, item) => ({ ...acc, [item]: "" }), {});
    const newData = [...data, newRec];
    setData(newData);
  };

  const addCol = () => {};

  const deleteRow = (e, id) => {};

  const deleteCol = (e, col) => {};

  const editRowCell = (row, col, value) => {
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
  };

  const editColCell = (e, i) => {
    let newCol = e.target.value;
    const oldCol = cols[i];
    // if (newCol.length == 1 && newCol >= "0" && newCol <= "9")
    //   newCol = "_" + newCol;
    // console.log(oldCol, newCol);
    const newCols = [...cols];
    newCols[i] = newCol;
    const newData = data.reduce((acc, record) => {
      const newRec = {};
      Object.entries(record).forEach(([key, value]) => {
        if (key === oldCol) {
          newRec[newCol] = record[oldCol];
        } else {
          newRec[key] = value;
        }
      });
      acc = [...acc, newRec];
      return acc;
    }, []);

    setCols(newCols);
    setData(newData);
  };

  const handleSubmit = async () => {
    if (!shouldSubmit) return; // add toast
    try {
      if (Object.keys(data).length === 0) return;

      const payload = [...data];

      const res = await axios.put(
        URL + "/" + id,
        { data: payload },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsEditMode(false);
    }
  };
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const renderTableHeader = (col, id, fn) => {
    if (isEditMode) {
      return (
        <>
          <input value={col} onChange={fn} />
          <DeleteRoundedIcon
            onClick={() => deleteCol(col)}
            fontSize="large"
            color="error"
          >
            Delete
          </DeleteRoundedIcon>
        </>
      );
    } else {
      return <h2>{col}</h2>;
    }
  };

  const renderTableCell = (row, col, fn) => {
    if (isEditMode) {
      return (
        <>
          <input value={row[col]} onChange={fn} />
        </>
      );
    } else {
      return <h2>{row[col]}</h2>;
    }
  };

  console.log(data);
  console.log(cols);

  return (
    <div>
      {isEditMode ? (
        <>
          <Button variant="contained" color="success" onClick={addRow}>
            Add Row
          </Button>
          <Button variant="contained" color="success" onClick={addCol}>
            Add Column
          </Button>
          {/* <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button> */}
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
        </>
      ) : (
        <>
          <Button onClick={handleEditClick} variant="contained" color="primary">
            Edit
          </Button>
        </>
      )}

      {data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {cols.map((col, id) => (
                  <TableCell key={id}>
                    {renderTableHeader(col, id, (e) => editColCell(e, id))}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => {
                return (
                  <TableRow key={i}>
                    {Object.keys(data[0]).map((col) => {
                      return (
                        <TableCell key={i + col}>
                          {renderTableCell(row, col, (e) =>
                            editRowCell(i, col, e.target.value)
                          )}
                        </TableCell>
                      );
                    })}
                    {isEditMode && (
                      <TableCell>
                        <DeleteRoundedIcon
                          onClick={() => deleteRow(row)}
                          fontSize="large"
                          color="error"
                        >
                          Delete
                        </DeleteRoundedIcon>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Test;
