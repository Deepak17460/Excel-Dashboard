import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import PivotTable from "./PivotTable";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

const URI = "http://localhost:8081/api/spreadsheet/1";

function App() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = (await axios.get(URI)).data;
      setFile(data);
    };
    getData();
    return () => {};
  }, []);

  return (
    <div>
      {/* <DynamicPivotTable /> */}
      <Routes>
        <Route path="/" element={file && <PivotTable file={file} />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
      
    </div>
  );
}

export default App;
