import React, { useEffect, useState } from "react";
import BasicTable from "../Table";
import axios from "axios";
import { useParams } from "react-router-dom";
import RenderTable from "../components/RenderTable";
import SortableTable from "../components/SortableTable";

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet`;

const PivotTable = (props) => {
  const [file, setFile] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  let rows = [];
  const { id } = useParams();

  useEffect(() => {
    const getData = async (URL) => {
      try {
        const data = (await axios.get(URL, { withCredentials: true })).data;
        setFile(data);
        console.log(data);
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
      {/* {file.length > 0 ? <BasicTable rows={rows} isEditMode={props.isEditMode} /> : <h1>{errMsg} ...</h1>} */}
      {/* {file.length > 0 ? <RenderTable rows={rows} isEditMode={props.isEditMode} /> : <h1>{errMsg} ...</h1>} */}
      {file.length > 0 ? <SortableTable rows={rows} /> : <h1>{errMsg} ...</h1>}
    </div>
  );
};

export default PivotTable;
