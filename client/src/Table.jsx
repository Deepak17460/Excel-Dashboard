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
import { useEffect } from "react";

const URI = "http://localhost:8081/api/spreadsheet/";
let colCounter;

function BasicTable(props) {
  const { id } = useParams();

  const initialRows = props.rows.map((row) => row.id);
  const initialCols = Object.keys(props.rows[0]).filter((key) => key !== "id");
  const initialData = props.rows.reduce((acc, row) => {
    acc[row.id] = { ...row };
    return acc;
  }, {});

  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [data, setData] = useState(initialData);
  console.log(data);

  const inputRefs = useRef([]);
  const focusIndex = useRef(null);

  useEffect(() => {
    if (focusIndex.current !== null && inputRefs.current[focusIndex.current]) {
      inputRefs.current[focusIndex.current].focus();
      focusIndex.current = null; // Reset the focusIndex after focusing
    }
  });

  useEffect(() => {
    colCounter = cols.length + 1;
  }, []);

  const addRow = () => {
    const newRow = rows.length > 0 ? rows[rows.length - 1] + 1 : 0;
    if (cols.length === 0) addCol();
    setRows([...rows, newRow]);
    setData({
      ...data,
      [newRow]: cols.reduce((acc, col) => ({ ...acc, [col]: "" }), {}),
    });
  };

  const addCol = () => {
    let newCol = "Col ";
    if (cols.length === 0) colCounter = 1;
    
    colCounter = Number(cols[cols.length - 1].split(' ')[1]) + 1
    
    newCol += colCounter;
    colCounter += 1;
    setCols([...cols, newCol]);
    setData(
      rows.reduce(
        (acc, row) => ({ ...acc, [row]: { ...data[row], [newCol]: "" } }),
        {}
      )
    );
    // if (rows.length === 0) addRow();
  };

  const handleEdit = (row, col, value) => {
    setData({ ...data, [row]: { ...data[row], [col]: value } });
  };

  const handleColEdit = (index, newName) => {
    const oldName = cols[index];
    const updatedCols = [...cols];
    updatedCols[index] = newName;

    // Update the data keys with the new column name
    const updatedData = Object.keys(data).reduce((acc, rowId) => {
      const { [oldName]: value, ...rest } = data[rowId];
      acc[rowId] = { ...rest, [newName]: value };
      return acc;
    }, {});

    setCols(updatedCols);
    setData(updatedData);

    focusIndex.current = index;
  };

  const deleteRow = (rowId) => {
    const updatedRows = rows.filter((row) => row !== rowId);
    setRows(updatedRows);

    const { [rowId]: deletedRow, ...remainingData } = data;

    setData(remainingData);
  };

  const deleteCol = (colId) => {
    if (cols.length === 1) {
      setRows([]);
      setCols([]);
      setData({});
      return;
    }

    const colIndex = cols.indexOf(colId);

    if (colIndex > -1) {
      // Remove column from cols array
      const updatedCols = [...cols];
      updatedCols.splice(colIndex, 1);
      setCols(updatedCols);

      // Remove the column from each row in data
      const updatedData = Object.keys(data).reduce((acc, rowId) => {
        const { [colId]: _, ...remainingCols } = data[rowId];
        acc[rowId] = remainingCols;
        return acc;
      }, {});

      setData(updatedData);
    }
  };

  const handleSave = () => {
    localStorage.setItem("1", JSON.stringify(data));
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.values(data).map((item) => {
        const { id, ...rest } = item;
        return rest;
      });
      console.log({ data: payload });
      const res = await axios.put(
        URI + id,
        { data: payload },
        { withCredentials: true }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button onClick={addRow}>Add Row</button>
      <button onClick={addCol}>Add Column</button>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleSubmit}>Submit</button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {cols.map((col, index) => (
                <TableCell key={col}>
                  <input
                    type="text"
                    value={col}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleColEdit(index, e.target.value)}
                  />{" "}
                  <Button
                    onClick={() => deleteCol(col)}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row}>
                {cols.map((col) => (
                  <TableCell key={col}>
                    <input
                      type="text"
                      value={data[row][col] || ""}
                      onChange={(e) => handleEdit(row, col, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    onClick={() => deleteRow(row)}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default BasicTable;
