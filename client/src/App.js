import "./App.css";
import PivotTable from "./PivotTable";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UploadFileForm from "./pages/UploadFileForm";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadFileForm />} />
        <Route path="/table/:id" element={<PivotTable />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
