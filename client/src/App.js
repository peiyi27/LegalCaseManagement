import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import ProfileSetting from "./pages/ProfileSetting";
import Third from "./pages/Third";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
        <Route path="/Signup" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ForgetPassword" element={<ForgetPassword/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/ProfileSetting" element={<ProfileSetting/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;