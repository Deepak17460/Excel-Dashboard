import "./App.css";
import PivotTable from "./PivotTable";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table/:id" element={<PivotTable />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
