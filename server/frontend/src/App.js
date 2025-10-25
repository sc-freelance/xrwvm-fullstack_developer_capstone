import LoginPanel from "./components/Login/Login"
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register/Register";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dealers" />} />
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
    </Routes>
  );
}

export default App;