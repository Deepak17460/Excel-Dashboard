import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";

const URI = "http://localhost:8081/api/spreadsheet/1";

function BasicTable(props) {
  const initialRows = props.rows.map((row) => row.id);
  const initialCols = Object.keys(props.rows[0]).filter((key) => key !== "id");
  const initialData = props.rows.reduce((acc, row) => {
    acc[row.id] = { ...row };
    return acc;
  }, {});
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [data, setData] = useState(initialData);

  const addRow = () => {
    const newRow = rows.length + 1;
    setRows([...rows, newRow]);
    setData({
      ...data,
      [newRow]: cols.reduce((acc, col) => ({ ...acc, [col]: "" }), {}),
    });
  };

  const addCol = () => {
    const newCol = cols.length + 1;
    setCols([...cols, newCol]);
    setData(
      rows.reduce(
        (acc, row) => ({ ...acc, [row]: { ...data[row], [newCol]: "" } }),
        {}
      )
    );
  };

  const handleEdit = (row, col, value) => {
    setData({ ...data, [row]: { ...data[row], [col]: value } });
  };

  // const handleClick = (id) => {
  //   alert(id);
  // };
  
  // TODO: 
  const deleteRow = async (rowId) => {
    try {
      const updatedRows = rows.filter((row) => row !== rowId);
      setRows(updatedRows);

      const { [rowId]: deletedRow, ...remainingData } = data;
      console.log({ "Deleted Row ": deletedRow });
      // await axios.delete(URI, rowId);
      setData(remainingData);
    } catch (err) {
      console.log(err);
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
        URI,
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
              {cols.map((col) => (
                <TableCell key={col}>{col}</TableCell>
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
                      value={data[row][col]}
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
