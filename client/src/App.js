import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import ProfileSetting from "./pages/ProfileSetting";
import CaseManagement from "./pages/CaseManagement";
import CreateCaseForm from "./pages/CreateCaseForm";
import UpdateEmail from "./pages/UpdateEmail";
import UpdateName from "./pages/UpdateName";
import ViewCase from "./pages/ViewCase";
import EditCase from "./pages/EditCase";
import DocumentManagement from "./pages/DocumentManagement";
import UploadDocument from "./pages/UploadDocument";
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
          <Route path="/CaseManagement" element={<CaseManagement/>} />
          <Route path="/CreateCaseForm" element={<CreateCaseForm/>} />
          <Route path="/UpdateEmail" element={<UpdateEmail/>} />
          <Route path="/UpdateName" element={<UpdateName/>} />
          <Route path="/ViewCase/:caseId" element={<ViewCase />} />
          <Route path="/EditCase/:caseId" element={<EditCase />} />
          <Route path="/DocumentManagement/:caseId" element={<DocumentManagement/>} />
          <Route path="/UploadDocument/:caseId" element={<UploadDocument/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;