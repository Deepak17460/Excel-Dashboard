import React, { useEffect, useState } from "react";
import BasicTable from "../Table";
import axios from "axios";
import { useParams } from "react-router-dom";
import SortableTable from "../components/SortableTable";
import GroupTable from "../components/Group/GroupTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Button } from "@mui/material";

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet`;

const PivotTable = (props) => {
  const [file, setFile] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [toggleMode, setToggleMode] = useState(false);

  let rows = [];
  const { id } = useParams();

  useEffect(() => {
    const getData = async (URL) => {
      try {
        const data = (await axios.get(URL, { withCredentials: true })).data;
        setFile(data);
        // console.log(data);
      } catch (err) {
        setErrMsg(err.response.data.message);
      }
    };

    getData(URL + "/" + id);
    return () => {};
  }, [id]);

  file.map((item, id) => {
    let newItem = { id };
    Object.keys(item).map(
      (key) => (newItem = { ...newItem, [key]: item[key] })
    );
    rows = [...rows, newItem];
    return null;
  });

  return (
    <div>
      {toggleMode ? (
        <Button
          variant="contained"
          className="bg-emerald-400"
          onClick={() => setToggleMode(!toggleMode)}
        >
          <SwapVertIcon /> Sort Mode
        </Button>
      ) : (
        <Button
          variant="contained"
          className="bg-emerald-400"
          onClick={() => setToggleMode(!toggleMode)}
        >
          <VisibilityIcon /> View Mode
        </Button>
      )}

      {toggleMode ? (
        file.length > 0 ? (
          <GroupTable rows={rows} />
        ) : (
          <h1>{errMsg} ...</h1>
        )
      ) : file.length > 0 ? (
        <SortableTable rows={rows} />
      ) : (
        <h1>{errMsg} ...</h1>
      )}
    </div>
  );
};

export default PivotTable;
