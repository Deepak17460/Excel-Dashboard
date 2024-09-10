import React, { useEffect, useState } from "react";
import BasicTable from "./Table";
import axios from "axios";
import { useParams } from "react-router-dom";

const URI = "http://localhost:8081/api/spreadsheet/";

const PivotTable = () => {
  const [file, setFile] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  let rows = [];
  const { id } = useParams();

  useEffect(() => {
    const getData = async (URI) => {
      try {
        const data = (await axios.get(URI, { withCredentials: true })).data;
        setFile(data);
      } catch (err) {
        setErrMsg(err.response.data.message);
      }
    };

    getData(URI + id);
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
      {file.length > 0 ? <BasicTable rows={rows} /> : <h1>{errMsg} ...</h1>}
    </div>
  );
};

export default PivotTable;
