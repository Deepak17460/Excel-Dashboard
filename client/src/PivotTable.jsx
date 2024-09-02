import React from "react";
import BasicTable from "./Table";

const PivotTable = ({ file }) => {
  let cols = [];
  let rows = [];
  
  Object.keys(file[0]).map((item) => cols.push(item));

  file.map((item, id) => {
    let newItem = { id };
    Object.keys(item).map(
      (key) => (newItem = { ...newItem, [key]: item[key] })
    );
    rows = [...rows, newItem];
  });
  return <div>{file && <BasicTable rows={rows} cols={cols} />}</div>;
};

export default PivotTable;
